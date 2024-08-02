import { Prisma } from "@prisma/client";

export type ImageMetadata = {
	width: number;
	height: number;
	format: string;
};

export type ImageDownsizedSizeName = typeof imageSizes[number]['name'];
export type ImageSizeName = ImageDownsizedSizeName | 'original';

export interface ClientPictureData {
	sizes: Record<ImageDownsizedSizeName, string>;
	original: string;
	metadata: ImageMetadata;
}

export type ClientPicture = Prisma.PictureGetPayload<{}> & ClientPictureData;

export const imageSizes = [
	{ name: 'thumbnail', width: 150, height: 150 },
	{ name: 'medium', width: 600, height: 400 },
	{ name: 'large', width: 1200, height: 800 },
] as const;

export const acceptedImageFormats = ['avif', 'gif', 'heif', 'jpeg', 'jpg', 'jp2', 'png', 'svg', 'tiff', 'tif', 'webp'];

export const SIGNED_EXPIRES_IN = 2 * 60 * 60;
