'use client';

import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { AsYouType } from 'libphonenumber-js';
import { FileImageIcon, LoaderCircle } from "lucide-react";
import { UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";

import { MapLocationInput } from "@/components/map-location-input";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createReport } from "@/lib/actions/reports";
import { NewReport, newReportSchema } from "@/lib/api/reports.model";
import { contactMethodBasedHelpText, contactMethodBasedPlaceholder, defaultLocation } from "@/lib/utils";

export function ReportForm() {
	const [actionState, formAction] = useActionState(createReport, { success: null, data: null, error: null });
	const [isTransitionPending, startTransition] = useTransition();

	const form = useForm<NewReport>({
		resolver: zodResolver(newReportSchema),
		defaultValues: {
			address: '4 Јули 33/4',
			contactInfo: '078494992',
			contactMethod: 'PHONE',
			description: 'Азбестен кров',
			fullName: 'Влатко Стојкоски',
			locationLat: defaultLocation.lat,
			locationLng: defaultLocation.lng,
		},
		// defaultValues: {
		// 	address: '',
		// 	contactInfo: '',
		// 	contactMethod: 'phone',
		// 	description: '',
		// 	fullName: '',
		// 	locationLat: defaultLocation.lat,
		// 	locationLng: defaultLocation.lng,
		// },
	});

	useEffect(() => {
		console.log(actionState);

		const { success, data, error } = actionState;

		if (success === null) {
			return;
		}

		if (success === false) {
			toast.error(error?.message ?? 'Испраќањето на пријавата не успеа. Ве молиме обидете се повторно.');
			return;
		}

		if (success === true) {
			toast.success('Пријавата е успешно испратена.');
			form.reset();
			return;
		}
	}, [actionState]);

	const onSubmit = form.handleSubmit(data => {
		startTransition(() => {
			formAction(data);
		});
	});

	return (
		<Form {...form}>
			<form className="flex flex-col gap-y-4" onSubmit={onSubmit}>
				<ReportFormFields form={form} />
			</form>
		</Form>
	);
}

function ReportFormFields({ form }: { form: UseFormReturn<NewReport> }) {
	const { pending: isPending } = useFormStatus();

	const pictureValue = form.watch('picture');
	const contactMethodValue = form.watch('contactMethod');

	const [pictureString, setPictureString] = useState<string | null>(null);

	useEffect(() => {
		if (pictureValue?.length !== 1) {
			setPictureString(null);
			return;
		}

		let _pictureString = pictureValue ? URL.createObjectURL(pictureValue[0]) : null;
		setPictureString(_pictureString);
		return () => {
			if (_pictureString) {
				URL.revokeObjectURL(_pictureString);
			}
			_pictureString = null;
		};
	}, [pictureValue]);

	const pictureRef = form.register("picture");

	return (
		<>
			<h2 className="text-lg font-semibold">1. Податоци за Вас</h2>

			<FormField
				control={form.control}
				name="fullName"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Име и Презиме</FormLabel>
						<FormControl>
							<Input placeholder="Марко Марковски" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="contactMethod"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Како да ве контактираме?</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Одберете начин на контакт..." />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="PHONE">Телефонски број</SelectItem>
								<SelectItem value="EMAIL">E-пошта</SelectItem>
								<SelectItem value="FACEBOOK">Messenger</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="contactInfo"
				render={({ field: { value, onChange, ...fieldRest } }) => (
					<FormItem>
						<FormLabel>Контакт податоци</FormLabel>
						<FormControl>
							{
								contactMethodValue === 'PHONE' ? (
									<Input
										placeholder="071 234 567"
										value={value}
										onChange={(ev) => {
											onChange(new AsYouType('MK').input(ev.target.value));
										}} {...fieldRest} />
								) : (
									<Input placeholder={contactMethodBasedPlaceholder[contactMethodValue]} value={value} onChange={onChange} {...fieldRest} />
								)
							}
						</FormControl>
						<FormDescription>
							{contactMethodBasedHelpText[contactMethodValue]}
						</FormDescription>
						<FormMessage />
					</FormItem>
				)}
			/>

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
					Одберете ја точната локација на каде што се наоѓа азбестот.
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
				name="picture"
				render={() => (
					<FormItem>
						<FormLabel className="flex flex-col gap-2 gap w-full">
							Прикачете слика
							<div className="w-full p-6 bg-background rounded-lg border flex items-center justify-center cursor-pointer">
								{
									pictureString !== null ? (
										<img src={pictureString} />
									) : (
										<FileImageIcon className="size-12" />
									)
								}
							</div>
						</FormLabel>
						<FormControl>
							<Input type="file" placeholder="shadcn" accept="image/*" {...pictureRef} className="hidden" />
						</FormControl>
						<FormMessage />
					</FormItem >
				)
				}
			/>

			<Button type="submit" disabled={form.formState.isSubmitting}>
				{
					form.formState.isSubmitting ?
						<LoaderCircle className="w-6 h-6 mr-2 animate-spin" /> :
						null
				}
				Испрати
			</Button >
		</>
	);
}