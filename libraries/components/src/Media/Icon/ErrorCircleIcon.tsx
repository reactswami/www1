import { type IconProps, getIconSize, getIconStrokeWidth } from './util';

export function ErrorCircleIcon({ size, ...props }: IconProps) {
   return (
      <svg xmlns="http://www.w3.org/2000/svg"
         width={getIconSize(size)}
         height={getIconSize(size)}
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth={getIconStrokeWidth(size)}
         strokeLinecap="round"
         strokeLinejoin="round"
         className="lucide lucide-ban-icon lucide-ban"
         style={props.style}
      >
         <path d="M4.929 4.929 19.07 19.071" />
         <circle cx="12" cy="12" r="10" />
      </svg>
   );
}
