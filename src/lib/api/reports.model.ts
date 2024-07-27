import { z } from "zod";

const contactMethodSchema = z.enum(["phone", "email", "facebook"], {
	message: "Ве молиме одберете валиден начин на контакт",
	required_error: "Ве молиме одберете начин на контакт",
});

export const newReportSchema = z.object({
	fullName: z.string({
		required_error: "Ве молиме внесете име",
		message: "Ве молиме внесете валидно име",
	}),
	contactMethod: contactMethodSchema,
	contactInfo: z.string({
		required_error: "Ве молиме внесете контакт",
		message: "Ве молиме внесете валиден контакт",
	}),
	address: z.string({
		required_error: "Ве молиме внесете адреса",
		message: "Ве молиме внесете валидна адреса",
	}),
	description: z.string({
		required_error: "Ве молиме внесете опис",
		message: "Ве молиме внесете валиден опис",
	}),
	locationLat: z.number(),
	locationLng: z.number(),
});