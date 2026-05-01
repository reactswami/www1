import { type IconProps, getIconSize, getIconStrokeWidth } from './util';

export function CrossIcon({ size, ...props }: IconProps) {
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
         className="lucide lucide-x-icon lucide-x"
         style={props.style}
      >
         <path d="M18 6 6 18" />
         <path d="m6 6 12 12" />
      </svg>
   );
}
