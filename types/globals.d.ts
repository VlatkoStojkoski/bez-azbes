export { };

declare global {
	interface CustomJwtSessionClaims {
		metadata: {
			role?: "admin" | "user";
		};
	}
	interface UserPrivateMetadata {
		preffered: {
			contactMethod: ContactMethod;
			contactInfo: string;
		}
	}
	interface UserPublicMetadata {
		role?: "admin" | "user";
	}
}
