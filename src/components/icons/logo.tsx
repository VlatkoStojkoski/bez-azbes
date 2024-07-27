import React from "react";

export type LogoIconProps = React.SVGProps<SVGSVGElement> & {
	withBackground?: boolean;
};

export default function LogoIcon({ withBackground, ...props }: LogoIconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 1024 1024"
			{...props}
		>
			{
				withBackground === true && (
					<circle cx="512" cy="512" r="475" fill="url(#paint0_linear_4_2)"></circle>
				)
			}
			<path
				fill="#F20000"
				stroke="#fff"
				strokeWidth="30"
				d="M324 658h-15v149c0 41.421 33.579 75 75 75h255c41.421 0 75-33.579 75-75V658H324z"
			></path>
			<rect
				width="105"
				height="389"
				x="684"
				y="261"
				fill="#F20000"
				stroke="#fff"
				strokeWidth="30"
				rx="35"
			></rect>
			<g filter="url(#filter0_d_4_2)">
				<path
					fill="#F20000"
					d="M447.034 194.207c28.641-49.609 100.291-49.61 128.932 0L809.93 599.46C838.555 649.043 802.746 711 745.463 711H277.537c-57.283 0-93.092-61.957-64.467-111.54l233.964-405.253z"
				></path>
				<path
					stroke="#fff"
					strokeWidth="30"
					d="M822.92 591.96L588.957 186.708c-34.415-59.611-120.499-59.61-154.914 0L200.08 591.961C165.672 651.559 208.726 726 277.537 726h467.927c68.81 0 111.864-74.441 77.456-134.04z"
				></path>
			</g>
			<circle cx="511.603" cy="589.497" r="29.016" fill="#fff"></circle>
			<rect
				width="58.033"
				height="206.741"
				x="482.586"
				y="317.469"
				fill="#fff"
				rx="29.016"
			></rect>
			<defs>
				<filter
					id="filter0_d_4_2"
					width="697.095"
					height="634"
					x="162.953"
					y="121"
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					></feColorMatrix>
					<feOffset dy="4"></feOffset>
					<feGaussianBlur stdDeviation="5"></feGaussianBlur>
					<feComposite in2="hardAlpha" operator="out"></feComposite>
					<feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"></feColorMatrix>
					<feBlend
						in2="BackgroundImageFix"
						result="effect1_dropShadow_4_2"
					></feBlend>
					<feBlend
						in="SourceGraphic"
						in2="effect1_dropShadow_4_2"
						result="shape"
					></feBlend>
				</filter>
				<linearGradient
					id="paint0_linear_4_2"
					x1="512"
					x2="512"
					y1="37"
					y2="987"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#4D71DB"></stop>
					<stop offset="1" stopColor="#293C75"></stop>
				</linearGradient>
			</defs>
		</svg>
	);
}
