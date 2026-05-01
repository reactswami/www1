import { getIconSize, getIconStrokeWidth, type IconProps } from './util';

export function ChevronDownIcon({ size, ...props }: IconProps) {
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
         className="lucide lucide-chevron-down-icon lucide-chevron-down"
         style={props.style}
      >
         <path d="m6 9 6 6 6-6" />
      </svg>
   );
}
