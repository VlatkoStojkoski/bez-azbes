'use client';

import { ContactMethod } from "@prisma/client";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Form,
} from "@/components/ui/form";

import { ReportFormPersonalInfo } from "./report-form-personal-info";
import { ReportFormReportInfo } from "./report-form-report-info";
import { useReportForm } from "./use-report-form";

export type ReportFormProps = {
	defaults?: {
		name?: string;
		contactInfo?: string;
		contactMethod?: ContactMethod;
	};
};

export function ReportForm({ defaults }: ReportFormProps) {
	const {
		form,
		onSubmit,
		isPending
	} = useReportForm({ defaults });

	return (
		<Form {...form}>
			<form className="flex flex-col gap-y-4" onSubmit={onSubmit}>
				<ReportFormPersonalInfo />

				<ReportFormReportInfo />

				<Button type="submit" disabled={isPending} className="mt-6">
					{
						(isPending ?? false) ?
							<LoaderCircle className="w-6 h-6 mr-2 animate-spin" /> :
							null
					}
					Испрати
				</Button >
			</form>
		</Form>
	);
}
