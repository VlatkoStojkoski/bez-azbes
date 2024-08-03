'use client';

import { useState } from "react";

import { CameraIcon, ChevronDown, ChevronUp, FileImageIcon } from "lucide-react";
import { type UseFormReturn, useFormContext } from "react-hook-form";

import { MapLocationInput } from "@/components/map-location-input";
import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePictureUpload } from "@/hooks/use-picture-upload";
import type { NewReport } from "@/lib/api/reports.model";

export function ReportFormReportInfo() {
	const form = useFormContext<NewReport>();

	return (
		<>
			<h2 className="text-lg font-semibold">2. Податоци за пријавата</h2>

			<FormField
				control={form.control}
				name="address"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Адреса</FormLabel>
						<FormControl>
							<Input placeholder="ул. Ѓорче Петров бр 1234/5-6" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormItem>
				<FormLabel>Локација на мапа</FormLabel>
				<FormControl>
					<MapLocationInput onChange={(location) => {
						form.setValue('locationLat', location.lat);
						form.setValue('locationLng', location.lng);
					}} />
				</FormControl>
				<FormDescription>
					Одберете ја точната локација каде што се наоѓа азбестот.
				</FormDescription>
				<FormMessage />
			</FormItem>

			<FormField
				control={form.control}
				name="description"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Опис</FormLabel>
						<FormControl>
							<Input placeholder="Азбестен кров" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="surfaceArea"
				render={({ field: { onChange, ...fieldRest } }) => (
					<FormItem>
						<FormLabel>Азбестна Површина (м2)</FormLabel>
						<FormControl>
							<Input placeholder="20" className="max-w-[15ch]" type="number" onChange={(ev) => {
								onChange(ev.target.value === '' ? 0 : parseInt(ev.target.value));
							}} {...fieldRest} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<ReportInfoPictureField form={form} />
		</>
	);
}

function ReportInfoPictureField({ form }: { form: UseFormReturn<NewReport> }) {
	const [prefferedUploadMethod, setPrefferedUploadMethod] = useState<'camera' | 'file'>('file');

	const {
		pictureString,
		isPictureExpanded,
		togglePictureExpand,
		handlePictureUpload,
	} = usePictureUpload({
		onPictureValueChange: (newVal) => {
			form.setValue('picture', newVal);
		}
	});

	return (
		<FormField
			control={form.control}
			name="picture"
			render={() => (
				<FormItem className="space-y-2">
					<FormLabel>
						Прикачете слика
					</FormLabel>

					<div className={`relative w-full grid grid-cols-[1fr_auto_1fr] bg-background rounded-lg border place-content-center cursor-pointer ${isPictureExpanded ? 'p-2' : 'p-6'}`}>
						<div className={`grid grid-cols-subgrid col-span-full ${pictureString !== null ? 'hidden' : ''}`}>
							<label htmlFor="pictureUpload-camera"
								className="flex items-center justify-center cursor-pointer"
								onClick={() => setPrefferedUploadMethod('camera')}>
								<CameraIcon className="size-12" />
								<Input name="pictureUpload-camera"
									id="pictureUpload-camera"
									type="file"
									capture='environment' placeholder="shadcn"
									accept="image/*"
									onChange={handlePictureUpload} className="hidden"
								/>
							</label>
							<div className="w-[1px] h-full bg-border"></div>
							<label
								htmlFor="pictureUpload-file"
								className="flex items-center justify-center cursor-pointer"
								onClick={() => setPrefferedUploadMethod('file')}>
								<FileImageIcon className="size-12" />
								<Input
									name="pictureUpload-file"
									id="pictureUpload-file"
									type="file"
									placeholder="shadcn"
									accept="image/*"
									onChange={handlePictureUpload} className="hidden"
								/>
							</label>
						</div>

						<div className={`grid grid-cols-subgrid col-span-full ${pictureString === null ? 'hidden' : ''}`}>
							<label
								htmlFor={`pictureUpload-${prefferedUploadMethod}`}
								className={`block w-full col-span-full cursor-pointer transition-[height] rounded-lg overflow-hidden ${isPictureExpanded ? 'h-auto' : 'h-full max-h-60'}`}>
								{
									pictureString === null ?
										<></> :
										<img src={pictureString} className="w-full h-full object-contain" />
								}
							</label>
							<Button
								variant='outline'
								type="button"
								className="absolute bottom-2 right-2 size-10 p-1.5"
								onClick={() => { togglePictureExpand(); }}>
								{
									isPictureExpanded ?
										<ChevronUp className="size-full" /> :
										<ChevronDown className="size-full" />
								}
							</Button>
						</div>
					</div>
					<FormMessage />
				</FormItem >
			)}
		/>
	);
}