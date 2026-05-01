import { type IconProps, getIconSize, getIconStrokeWidth } from './util';

export function CopyIcon({ size, ...props }: IconProps) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width={getIconSize(size)}
         height={getIconSize(size)}
         viewBox="0 0 24 24"
         fill="none"
         stroke='currentColor'
         strokeWidth={getIconStrokeWidth(size)}
         strokeLinecap="round"
         strokeLinejoin="round"
         className="lucide lucide-copy-icon lucide-copy"
         style={props.style}
      >
         <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
         <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
   );
}
