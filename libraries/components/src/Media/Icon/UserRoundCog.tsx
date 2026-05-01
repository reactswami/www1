import { getIconSize, getIconStrokeWidth, type IconProps } from './util';

export function UserRoundCog({ size, ...props }: IconProps) {
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
         className="lucide lucide-user-round-cog-icon lucide-user-round-cog"
         style={props.style}
      >
         <defs id="defs1" />
         <circle cx="12" cy="8" r="5" id="circle1" />
         <path d="M20 21a8 8 0 0 0-16 0" id="path1" />
         <g id="g1" transform="matrix(0.39938073,0,0,0.39938073,7.2074312,14.288999)">
            <path d="m 9.671,4.136 a 2.34,2.34 0 0 1 4.659,0 2.34,2.34 0 0 0 3.319,1.915 2.34,2.34 0 0 1 2.33,4.033 2.34,2.34 0 0 0 0,3.831 2.34,2.34 0 0 1 -2.33,4.033 2.34,2.34 0 0 0 -3.319,1.915 2.34,2.34 0 0 1 -4.659,0 2.34,2.34 0 0 0 -3.32,-1.915 2.34,2.34 0 0 1 -2.33,-4.033 2.34,2.34 0 0 0 0,-3.831 A 2.34,2.34 0 0 1 6.35,6.051 2.34,2.34 0 0 0 9.669,4.136" id="path1-6" />
            <circle cx="12" cy="12" r="3" id="circle1-0" />
         </g>
      </svg>
   );
}
