'use server';

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Prisma } from "@prisma/client";
import AmazonS3Uri from 'amazon-s3-uri';
import { v4 as uuidv4 } from 'uuid';

import { env } from "@/env";
import { s3Client } from "@/lib/api/s3";
import { DatabaseError, S3Error } from "@/lib/errors";
import { logger } from "@/lib/logger";

import config from "./config";
import prisma from "./db";
import { ClientPicture, ClientPictureData, ImageSizeName } from "./pictures.model";
import { saveImageSizes } from "../images";

/**
 * Creates a picture record with multiple size variants
 * @param inputImageBuffer The input image buffer
 * @param reportId The associated report ID
 * @param pictureData Additional picture data
 * @returns A ClientPicture object
 */
export async function createPicture(
	inputImageBuffer: Buffer | ArrayBuffer,
	reportId: string,
	pictureData?: Partial<Prisma.PictureCreateInput>
): Promise<ClientPicture> {
	const pictureId = uuidv4();

	try {
		const sizedImagesData = await saveImageSizes(inputImageBuffer, pictureId);
		return await insertPicture({ ...sizedImagesData, ...pictureData }, reportId);
	} catch (error) {
		logger.error('Error creating picture', { error, reportId });
		throw new DatabaseError('Failed to create picture');
	}
}

/**
 * Inserts a picture into the database
 * @param pictureData The picture data to insert
 * @param reportId The associated report ID
 * @returns A ClientPicture object
 */
export async function insertPicture(pictureData: ClientPictureData, reportId: string): Promise<ClientPicture> {
	const newPictureData: Prisma.PictureCreateInput = {
		originalImageUrl: pictureData.original,
		thumbnailImageUrl: pictureData.sizes.thumbnail,
		mediumImageUrl: pictureData.sizes.medium,
		largeImageUrl: pictureData.sizes.large,
		imageFormat: pictureData.metadata.format,
		imageWidth: pictureData.metadata.width,
		imageHeight: pictureData.metadata.height,
		report: {
			connect: {
				id: reportId,
			}
		},
	};

	try {
		const pictureRes = await prisma.picture.create({ data: newPictureData });
		return await getClientPicture(pictureRes);
	} catch (error) {
		logger.error('Error inserting picture', { error, reportId });
		throw new DatabaseError('Failed to insert picture');
	}
}

/**
 * Fetches a picture record from the database
 * @param pictureId The ID of the picture to fetch
 * @returns A ClientPicture object
 */
export async function getPicture(pictureId: string): Promise<ClientPicture> {
	try {
		const picture = await prisma.picture.findUnique({
			where: { id: pictureId },
		});

		if (!picture) {
			throw new DatabaseError('Picture not found');
		}

		return await getClientPicture(picture);
	} catch (error) {
		logger.error('Error fetching picture', { error, pictureId });
		throw new DatabaseError('Failed to fetch picture');
	}
}

/**
 * Fetches a picture record from the database by report ID
 * @param reportId The ID of the report associated with the picture
 * @returns A ClientPicture object or null if not found
 */
export async function getReportPicture(reportId: string): Promise<ClientPicture | null> {
	try {
		const picture = await prisma.picture.findFirst({
			where: { reportId },
		});

		if (!picture) {
			return null;
		}

		return await getClientPicture(picture);
	} catch (error) {
		logger.error('Error fetching report picture', { error, reportId });
		throw new DatabaseError('Failed to fetch report picture');
	}
}

/**
 * Generates a ClientPicture object with presigned URLs
 * @param picture The raw picture data from the database
 * @returns A ClientPicture object
 */
export async function getClientPicture(picture: Prisma.PictureGetPayload<{}>): Promise<ClientPicture> {
	const pictureClientData = await getPictureClientData(picture);

	if (!pictureClientData) {
		throw new DatabaseError('Failed to generate client picture data');
	}

	return {
		...picture,
		...pictureClientData,
	};
}

/**
 * Generates presigned URLs for a picture's image files
 * @param pictureData The picture data containing image URLs
 * @returns A ClientPictureData object or null if generation fails
 */
export async function getPictureClientData(pictureData: {
	originalImageUrl: string;
	largeImageUrl?: string | null;
	mediumImageUrl?: string | null;
	thumbnailImageUrl?: string | null;
	imageFormat: string;
	imageWidth: number;
	imageHeight: number;
} | null): Promise<ClientPictureData | null> {
	if (!pictureData) {
		return null;
	}

	const { originalImageUrl, imageFormat, imageWidth, imageHeight, largeImageUrl, mediumImageUrl, thumbnailImageUrl } = pictureData;

	const getBestAvailableUrl = (primaryUrl?: string | null, fallbackUrl?: string | null) => primaryUrl || fallbackUrl || originalImageUrl;

	const stringUrls = {
		original: originalImageUrl,
		large: getBestAvailableUrl(largeImageUrl, originalImageUrl),
		medium: getBestAvailableUrl(mediumImageUrl, largeImageUrl),
		thumbnail: getBestAvailableUrl(thumbnailImageUrl, mediumImageUrl)
	};

	const getSignedUrls = async (urls: Record<string, string>) => {
		const urlPromises = Object.entries(urls).map(async ([size, url]) => {
			return [size, await getPresignedUrl(url)];
		});
		const urlEntries = await Promise.all(urlPromises);
		return Object.fromEntries(urlEntries);
	};

	const signedUrls = await getSignedUrls(stringUrls);

	return {
		original: signedUrls.original,
		sizes: {
			large: signedUrls.large,
			medium: signedUrls.medium || signedUrls.large,
			thumbnail: signedUrls.thumbnail || signedUrls.medium || signedUrls.large,
		},
		metadata: {
			format: imageFormat,
			width: imageWidth,
			height: imageHeight,
		},
	};
}

/**
 * Generates a presigned URL for an S3 object
 * @param url The S3 object URL
 * @returns A presigned URL string or null if generation fails
 */
export async function getPresignedUrl(url: string): Promise<string> {
	try {
		const { bucket, key } = AmazonS3Uri(url);

		if (!bucket || !key) {
			throw new S3Error('Invalid S3 object URL');
		}

		const getCommand = new GetObjectCommand({
			Bucket: bucket,
			Key: key,
		});

		const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: config.signedLinkExpiresIn });
		return signedUrl;
	} catch (error) {
		logger.error('Error generating presigned URL', { error, url });
		throw new S3Error('Failed to generate presigned URL');
	}
}