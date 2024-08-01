'use client';

import { useActionState, useEffect, useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ContactMethod } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createReport } from "@/lib/actions/reports";
import { ApiCreateReportResponse } from "@/lib/api/reports";
import { NewReport, newReportSchema } from "@/lib/api/reports.model";
import { defaultLocation } from "@/lib/utils";

export type UseReportFormProps = {
	defaults?: {
		name?: string;
		contactInfo?: string;
		contactMethod?: ContactMethod;
	};
};

export function useReportForm({ defaults }: UseReportFormProps) {
	const [actionState, setActionState] = useState<ApiCreateReportResponse>({ success: null, data: null, error: null });
	const [isTransitionPending, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm<NewReport>({
		resolver: zodResolver(newReportSchema),
		defaultValues: {
			address: '',
			contactInfo: defaults?.contactInfo ?? '',
			contactMethod: defaults?.contactMethod ?? 'PHONE',
			description: '',
			fullName: defaults?.name ?? '',
			locationLat: defaultLocation.lat,
			locationLng: defaultLocation.lng,
		},
	});

	useEffect(() => {
		const { success, data, error } = actionState;

		if (success === null) {
			return;
		}

		if (success === false) {
			toast.error(error?.message ?? 'Испраќањето на пријавата не успеа. Ве молиме обидете се повторно.');
			return;
		}

		if (success === true) {
			form.reset();
			toast.success('Пријавата е успешно испратена.');
			router.push(`/reports?id=${data.id}`);
			return;
		}
	}, [actionState]);

	const onSubmit = form.handleSubmit(data => {
		startTransition(() => {
			createReport(actionState, data).then(setActionState);
		});
	});

	return {
		form,
		onSubmit,
		isPending: isTransitionPending,
	};
}
