import { type IconProps, getIconSize, getIconStrokeWidth } from './util';

export function SearchIcon({ size, ...props }: IconProps) {
   return (
      <svg
         style={props.style}
         xmlns="http://www.w3.org/2000/svg"
         width={getIconSize(size)}
         height={getIconSize(size)}
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth={getIconStrokeWidth(size)}
         strokeLinecap="round"
         strokeLinejoin="round"
         className="lucide lucide-search"
      >
         <circle cx="11" cy="11" r="8" />
         <path d="m21 21-4.3-4.3" />
      </svg>
   );
}

