'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AsYouType } from 'libphonenumber-js';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { newReportSchema } from "@/lib/api/reports.model";
import { contactMethodBasedHelpText, contactMethodBasedPlaceholder, defaultLocation } from "@/lib/utils";
import { MapLocationInput } from "@/components/map-location-input";

export function ReportForm() {
	const form = useForm<z.infer<typeof newReportSchema>>({
		resolver: zodResolver(newReportSchema),
		defaultValues: {
			address: '',
			contactInfo: '',
			contactMethod: 'phone',
			description: '',
			fullName: '',
			locationLat: defaultLocation.lat,
			locationLng: defaultLocation.lng,
		}
	});

	const formValues = form.watch();

	function onSubmit(values: z.infer<typeof newReportSchema>) {
		console.log(values);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
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

				<Button type="submit">Испрати</Button>
			</form>
		</Form>
	);
}