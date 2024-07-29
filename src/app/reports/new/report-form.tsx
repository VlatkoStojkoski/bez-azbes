'use client';

import { useActionState, useEffect, useRef, useTransition } from "react";
import { useFormStatus } from "react-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { AsYouType } from 'libphonenumber-js';
import { LoaderCircle } from "lucide-react";
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
import { ApiCreateReportResponse, createReport } from "@/lib/actions/reports";
import { NewReport, newReportSchema } from "@/lib/api/reports.model";
import { contactMethodBasedHelpText, contactMethodBasedPlaceholder, defaultLocation } from "@/lib/utils";

export function ReportForm() {
	const [actionState, formAction] = useActionState(createReport, { success: null, data: null, error: null });
	const [isTransitionPending, startTransition] = useTransition();

	const form = useForm<NewReport>({
		resolver: zodResolver(newReportSchema),
		defaultValues: {
			address: '',
			contactInfo: '',
			contactMethod: 'phone',
			description: '',
			fullName: '',
			locationLat: defaultLocation.lat,
			locationLng: defaultLocation.lng,
		},
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

	const formValues = form.watch();

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
								<SelectItem value="phone">Телефонски број</SelectItem>
								<SelectItem value="email">E-пошта</SelectItem>
								<SelectItem value="facebook">Messenger</SelectItem>
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
								formValues.contactMethod === 'phone' ? (
									<Input
										placeholder="071 234 567"
										value={value}
										onChange={(ev) => {
											onChange(new AsYouType('MK').input(ev.target.value));
										}} {...fieldRest} />
								) : (
									<Input placeholder={contactMethodBasedPlaceholder[formValues.contactMethod]} value={value} onChange={onChange} {...fieldRest} />
								)
							}
						</FormControl>
						<FormDescription>
							{contactMethodBasedHelpText[formValues.contactMethod]}
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

			<Button type="submit" disabled={form.formState.isSubmitting}>
				{
					form.formState.isSubmitting ?
						<LoaderCircle className="w-6 h-6 mr-2 animate-spin" /> :
						null
				}
				Испрати
			</Button>
		</>
	);
}