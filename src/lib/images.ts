import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { env } from "@/env";

import { ClientPictureData, ImageMetadata, acceptedImageFormats, imageSizes } from "./api/pictures.model";
import { s3Client } from "./api/s3";

type SizedImagesBuffers = [typeof imageSizes[number]['name'] | 'original', Buffer][];

export async function getSizedImageBuffers(image: sharp.Sharp): Promise<SizedImagesBuffers> {
	const { format } = await image.metadata();

	if (!format || !acceptedImageFormats.includes(format)) {
		throw new Error('Невалиден формат на сликата.');
	}

	const originalImage = image.toFormat('jpg');
	const lessQualityImage = originalImage.jpeg({ quality: 90 });
	const lessQualityImagesBuffers: [typeof imageSizes[number]['name'], Buffer][] = await Promise.all(
		imageSizes.map(
			async ({ name, width, height }) => {
				return [
					name,
					await lessQualityImage.resize(width, height).toBuffer()
				];
			}
		)
	);

	const originalImageBuffer = await originalImage.toBuffer();

	return [
		...lessQualityImagesBuffers,
		['original', originalImageBuffer]
	];
}

function getSizedPictureFileName(pictureId: string, size: typeof imageSizes[number]['name'] | 'original'): string {
	return `${pictureId}-${size}`;
}

type SizedImagesUrls = Record<typeof imageSizes[number]['name'] | 'original', string>;

export async function uploadSizedImagesToS3(sizedImages: SizedImagesBuffers, pictureId: string): Promise<SizedImagesUrls> {
	const picturePutCommands = sizedImages.map(([size, buffer]) => {
		return new PutObjectCommand({
			Bucket: env.AWS_S3_PICS_BUCKET,
			Key: getSizedPictureFileName(pictureId, size),
			Body: buffer,
			ContentType: 'image/jpeg',
		});
	});

	const pictureUploadResults = await Promise.all(picturePutCommands.map(command => s3Client.send(command)));

	const isUploadFailed = pictureUploadResults.some(result => result.$metadata.httpStatusCode !== 200);

	if (isUploadFailed === true) {
		throw new Error('Грешка при прикачување на сликите.');
	}

	return sizedImages.reduce((acc, [size, _]) => {
		acc[size] = `https://${env.AWS_S3_PICS_BUCKET}.s3.${env.AWS_S3_PICS_REGION}.amazonaws.com/${getSizedPictureFileName(pictureId, size)}`;
		return acc;
	}, {} as SizedImagesUrls);
}

export async function getOriginalImageMetadata(image: sharp.Sharp): Promise<ImageMetadata> {
	const { width, height, format } = await image.metadata();
	if (!width || !height || !format) {
		throw new Error('Грешка при читање на метаподатоците на сликата.');
	}
	return { width, height, format };
}

export async function saveImageSizes(
	inputImageBuffer: Buffer | ArrayBuffer,
	pictureId: string
): Promise<ClientPictureData> {
	const image = sharp(inputImageBuffer);

	const sizedImages = await getSizedImageBuffers(image);
	const sizedImagesUrls = await uploadSizedImagesToS3(sizedImages, pictureId);
	const metadata = await getOriginalImageMetadata(image);

	return {
		sizes: sizedImagesUrls,
		original: sizedImagesUrls.original,
		metadata,
	};
}
