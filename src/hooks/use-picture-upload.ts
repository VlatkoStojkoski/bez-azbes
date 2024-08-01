import { useCallback, useEffect, useState } from 'react';

import ImgReduce from 'image-blob-reduce';

interface UsePictureUploadArgs {
	onPictureValueChange?: (newVal: FileList) => void;
}

interface UsePictureUploadResult {
	pictureString: string | null;
	isPictureExpanded: boolean;
	handlePictureUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
	togglePictureExpand: () => void;
	clearPicture: () => void;
}

export function usePictureUpload({ onPictureValueChange }: UsePictureUploadArgs): UsePictureUploadResult {
	const [pictureString, setPictureString] = useState<string | null>(null);
	const [isPictureExpanded, setIsPictureExpanded] = useState(false);

	useEffect(() => {
		return () => {
			if (pictureString) {
				URL.revokeObjectURL(pictureString);
			}
		};
	}, [pictureString]);

	const handlePictureUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			setPictureString(null);
			return;
		}

		try {
			const imgReduce = new ImgReduce();
			const blob = await imgReduce.toBlob(file, { max: 1024 });
			const reducedFile = new File([blob], file.name, { type: file.type });

			const dataTransfer = new DataTransfer();
			dataTransfer.items.add(reducedFile);
			const newFileList = dataTransfer.files;

			onPictureValueChange?.(newFileList);

			const newPictureString = URL.createObjectURL(reducedFile);
			setPictureString(newPictureString);
		} catch (error) {
			console.error('Error reducing image:', error);
			setPictureString(null);
		}
	}, []);

	const togglePictureExpand = useCallback(() => {
		setIsPictureExpanded((prev) => !prev);
	}, []);

	const clearPicture = useCallback(() => {
		if (pictureString) {
			URL.revokeObjectURL(pictureString);
		}
		setPictureString(null);
		setIsPictureExpanded(false);
	}, [pictureString]);

	return {
		pictureString,
		isPictureExpanded,
		handlePictureUpload,
		togglePictureExpand,
		clearPicture,
	};
}