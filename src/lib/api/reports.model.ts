import { Prisma } from "@prisma/client";
import { z } from "zod";

const contactMethodSchema = z.enum(["phone", "email", "facebook"], {
	message: "Ве молиме одберете валиден начин на контакт",
	required_error: "Ве молиме одберете начин на контакт",
});

export const newReportSchema = z.object({
	fullName: z.string({
		required_error: "Ве молиме внесете име",
		message: "Ве молиме внесете валидно име",
	}).min(1, "Ве молиме внесете име"),
	contactMethod: contactMethodSchema,
	contactInfo: z.union([
		z.string().url({
			message: "Ве молиме внесете валиден контакт",
		}),
		z.string().email({
			message: "Ве молиме внесете валиден контакт",
		}),
		z.string().regex(/^((\+389\D*7)|07)\D*\d\D*\d\D*\d\D*\d\D*\d\D*\d\D*\d$/, {
			message: "Ве молиме внесете валиден контакт",
		}),
	], {
		required_error: "Ве молиме внесете контакт",
		message: "Ве молиме внесете валиден контакт",
	}),
	address: z.string({
		required_error: "Ве молиме внесете адреса",
		message: "Ве молиме внесете валидна адреса",
	}).min(1, "Ве молиме внесете адреса"),
	description: z.string({
		required_error: "Ве молиме внесете опис",
		message: "Ве молиме внесете валиден опис",
	}).min(1, "Ве молиме внесете опис"),
	locationLat: z.number(),
	locationLng: z.number(),
});

export type NewReport = z.infer<typeof newReportSchema>;

export type DBReport = Prisma.ReportGetPayload<{}>;
