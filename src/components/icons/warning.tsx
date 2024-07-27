import React from "react";

export default function WarningIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			{...props}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M12 15h.01M12 12V9M4.982 19h14.036c1.543 0 2.505-1.674 1.727-3.008l-7.017-12.03c-.772-1.323-2.684-1.323-3.456 0l-7.017 12.03C2.477 17.326 3.438 19 4.982 19z"
			></path>
		</svg>
	);
}
