import { getIconSize, getIconStrokeWidth, type IconProps } from './util';

export function MapPinRadarIcon({ size, ...props }: IconProps) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width={getIconSize(size)}
         height={getIconSize(size)}
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth={getIconStrokeWidth(size)}
         strokeLinecap="round"
         strokeLinejoin="round"
         className="lucide lucide-map-pin-radar"
         style={props.style}
      >
         <path d="m14.95 12.078c0 2.2859-2.9828 4.5719-2.9828 4.5719s-2.9828-2.2859-2.9828-4.5719a2.9828 3.0479 0 0 1 5.9656 0z" />
         <ellipse cx="11.967" cy="12.078" rx="1.1185" ry="1.143" />
         <g transform="translate(-.0019004 -.0014962)">
            <path d="m19.07 4.93a10 10 0 0 0-12.08-1.59" />
            <path d="m2.29 9.62a10 10 0 1 0 19.02-1.27" />
            <path d="m16.24 7.76a6 6 0 1 0-8.01 8.91" />
            <path d="m17.99 11.66a6 6 0 0 1-2.22 5.01" />
            <path d="m14.109 9.9577 4.961-5.0277" />
         </g>
         <path d="M 4,6 H 4.01" />
      </svg>
   );
}
