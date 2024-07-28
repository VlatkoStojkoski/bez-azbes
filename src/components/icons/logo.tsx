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
				fill="#3E5174"
				stroke="#fff"
				strokeWidth="30"
				d="M336.156 647.548h-15v140.313c0 39.273 31.837 71.11 71.11 71.11h238.468c39.273 0 71.11-31.837 71.11-71.11V647.548H336.156z"
			></path>
			<rect
				width="123"
				height="431"
				x="672"
				y="246.985"
				fill="#3E5174"
				stroke="#fff"
				strokeWidth="30"
				rx="35"
			></rect>
			<g filter="url(#filter0_d_4_2)">
				<path
					fill="#3E5174"
					d="M451.213 214.795c26.784-46.393 93.79-46.393 120.574 0l218.796 378.981c26.769 46.368-6.719 104.308-60.287 104.308H292.704c-53.568 0-87.056-57.94-60.287-104.308l218.796-378.981z"
				></path>
				<path
					stroke="#fff"
					strokeWidth="30"
					d="M803.573 586.276L584.778 207.295c-32.558-56.394-113.998-56.393-146.556.001l-218.795 378.98c-32.552 56.384 8.18 126.808 73.277 126.808h437.592c65.097 0 105.829-70.424 73.277-126.808z"
				></path>
			</g>
			<circle cx="511.596" cy="584.458" r="27.135" fill="#fff"></circle>
			<rect
				width="54.27"
				height="193.338"
				x="484.461"
				y="330.066"
				fill="#fff"
				rx="27.135"
			></rect>
			<defs>
				<filter
					id="filter0_d_4_2"
					width="657.095"
					height="598.084"
					x="182.953"
					y="144"
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
