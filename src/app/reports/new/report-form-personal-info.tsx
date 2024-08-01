import { useMemo } from 'react';

import { AsYouType } from 'libphonenumber-js';
import { useFormContext } from 'react-hook-form';

import {
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
import type { NewReport } from '@/lib/api/reports.model';
import { contactMethods } from '@/lib/utils';

export function ReportFormPersonalInfo() {
	const form = useFormContext<NewReport>();
	const formContactMethodValue = form.watch('contactMethod');

	const contactMethod = useMemo(() => contactMethods[formContactMethodValue], [formContactMethodValue]);

	return (<>
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
							formContactMethodValue === 'PHONE' ? (
								<Input
									placeholder="071 234 567"
									value={value}
									onChange={(ev) => {
										onChange(new AsYouType('MK').input(ev.target.value));
									}} {...fieldRest} />
							) : (
								<Input placeholder={contactMethod.inputPlaceholder} value={value} onChange={onChange} {...fieldRest} />
							)
						}
					</FormControl>
					<FormDescription>
						{contactMethod.inputHelpText}
					</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	</>);
}