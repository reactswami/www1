import { getIconSize, getIconStrokeWidth, type IconProps } from './util';

export function UserDirectory({ size, ...props }: IconProps) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width={getIconSize(size)}
         height={getIconSize(size)}
         viewBox="0 0 24 24"
         fill="none" stroke="currentColor"
         strokeWidth={getIconStrokeWidth(size)}
         strokeLinecap="round"
         strokeLinejoin="round"
         className="lucide lucide-book-user-icon lucide-book-user"
         style={props.style}
      >
         <defs id="defs1"/>
         <g id="g1">
            <circle cx="12" cy="8" r="5" id="circle1" />
            <path d="M 20,21 A 8,8 0 0 0 4,21" id="path1" />
         </g>
         <g id="g3" transform="matrix(0.39156772,0,0,0.39156772,7.3011874,14.548784)">
            <circle cx="16" cy="20" r="2" id="circle1-5" />
            <path d="M 10,20 H 4 A 2,2 0 0 1 2,18 V 5 A 2,2 0 0 1 4,3 H 7.9 A 2,2 0 0 1 9.59,3.9 L 10.4,5.1 A 2,2 0 0 0 12.07,6 H 20 a 2,2 0 0 1 2,2 v 2" id="path1-4" />
            <path d="m 22,14 -4.5,4.5" id="path2" />
            <path d="m 21,15 1,1" id="path3" />
         </g>
      </svg>
   );
}
