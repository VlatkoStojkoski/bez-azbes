export { };

declare global {
	interface CustomJwtSessionClaims {
		metadata: {
			role?: "admin" | "user";
		};
	}
}

declare global {
	interface UserPrivateMetadata {
		preffered: {
			contactMethod: ContactMethod;
			contactInfo: string;
		}
	}
}
