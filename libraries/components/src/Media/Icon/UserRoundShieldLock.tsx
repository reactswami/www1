import { getIconSize, getIconStrokeWidth, type IconProps } from './util';

export function UserRoundShieldLock({ size, ...props }: IconProps) {
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
         className="lucide lucide-user-round-check-icon lucide-user-round-check"
         style={props.style}
      >
         <defs id="defs1" />
         <g id="g1">
            <circle cx="12" cy="8" r="5" id="circle1" /><path d="M 20,21 A 8,8 0 0 0 4,21" id="path1" />
         </g>
         <g id="g2" transform="matrix(0.4090305,0,0,0.4090305,7.091634,14.131534)">
            <path d="m 20,13 c 0,5 -3.5,7.5 -7.66,8.95 A 1,1 0 0 1 11.67,21.94 C 7.5,20.5 4,18 4,13 V 6 A 1,1 0 0 1 5,5 C 7,5 9.5,3.8 11.24,2.28 a 1.17,1.17 0 0 1 1.52,0 C 14.51,3.81 17,5 19,5 a 1,1 0 0 1 1,1 z" id="path1-8" />
         </g>
         <g id="g3" transform="matrix(0.17808211,0,0,0.17808211,9.8630147,16.605231)">
            <circle cx="12" cy="16" r="1" id="circle1-0" />
            <rect x="3" y="10" width="18" height="12" rx="2" id="rect1" />
            <path d="M 7,10 V 7 a 5,5 0 0 1 10,0 v 3" id="path1-9" />
         </g>
      </svg>
   );
}
