import { type IconProps, getIconSize, getIconStrokeWidth } from './util';

export function CheckIcon({ size, ...props }: IconProps) {
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
         className="lucide lucide-check-icon lucide-check"
         style={props.style}
      >
         <path d="M20 6 9 17l-5-5" />
      </svg>
   );
}
