import { getIconSize, getIconStrokeWidth, type IconProps } from './util';

export function RotateCwIcon({ size, ...props }: IconProps) {
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
         className="lucide lucide-rotate-cw"
         style={props.style}
      >
         <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
         <path d="M21 3v5h-5" />
      </svg>
   );
}
