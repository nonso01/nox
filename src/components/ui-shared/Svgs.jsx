import { useRef, useEffect } from "react";

const strokeColor = "#34db69";
const strokeColorDark = "#222222";

export function LineFollowCircle() {
  return (
    <svg
      width="50"
      height="494"
      viewBox="0 0 50 494"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_119_39)">
        <path d="M25 48L25 224" stroke={strokeColor} strokeWidth="4" />
        <path d="M25 270L25 446" stroke={strokeColor} strokeWidth="4" />
        <circle cx="25" cy="25" r="23" stroke={strokeColor} strokeWidth="4" />
        <circle
          cx="25"
          cy="247"
          r="23"
          stroke={strokeColor}
          // fill={strokeColor}
          strokeWidth="4"
        />
        <circle cx="25" cy="469" r="23" stroke={strokeColor} strokeWidth="4" />
      </g>
      <defs>
        <clipPath id="clip0_119_39">
          <rect width="50" height="494" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function ConnectSVG() {
  return (
    <>
      <svg
        width="800"
        height="300"
        viewBox="0 0 800 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* <rect width="800" height="300" fill="transparent" /> */}
        <g className="tris-1">
          <circle cx="86" cy="146" r="14" stroke="white" strokeWidth="2" />
          <rect x="71" y="166" width="30" height="10" rx="1" fill="white" />
          <line
            x1="72.5"
            y1="124.5"
            x2="99.5"
            y2="124.5"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M26.5674 132.75C26.7599 132.417 27.2401 132.417 27.4326 132.75L38.6914 152.25C38.8838 152.583 38.6434 153 38.2588 153H15.7412C15.3566 153 15.1162 152.583 15.3086 152.25L26.5674 132.75Z"
            stroke={strokeColor}
          />
        </g>
        <g className="tris-2">
          <circle cx="719" cy="146" r="14" stroke="white" strokeWidth="2" />
          <rect x="704" y="166" width="30" height="10" rx="1" fill="white" />
          <line
            x1="705.5"
            y1="124.5"
            x2="732.5"
            y2="124.5"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M771.567 137.75C771.76 137.417 772.24 137.417 772.433 137.75L783.691 157.25C783.884 157.583 783.643 158 783.259 158H760.741C760.357 158 760.116 157.583 760.309 157.25L771.567 137.75Z"
            stroke={strokeColor}
          />
        </g>
        <g className="loading-bars">
          <path
            d="M141.234 126H151.234L140 176H130L141.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M155.234 126H165.234L154 176H144L155.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M169.234 126H179.234L168 176H158L169.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M183.234 126H193.234L182 176H172L183.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M197.234 126H207.234L196 176H186L197.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M211.234 126H221.234L210 176H200L211.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M225.234 126H235.234L224 176H214L225.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M239.234 126H249.234L238 176H228L239.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M253.234 126H263.234L252 176H242L253.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M267.234 126H277.234L266 176H256L267.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M281.234 126H291.234L280 176H270L281.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M295.234 126H305.234L294 176H284L295.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M309.234 126H319.234L308 176H298L309.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M323.234 126H333.234L322 176H312L323.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M337.234 126H347.234L336 176H326L337.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M351.234 126H361.234L350 176H340L351.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M365.234 126H375.234L364 176H354L365.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M379.234 126H389.234L378 176H368L379.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M393.234 126H403.234L392 176H382L393.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M407.234 126H417.234L406 176H396L407.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M421.234 126H431.234L420 176H410L421.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M435.234 126H445.234L434 176H424L435.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M449.234 126H459.234L448 176H438L449.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M463.234 126H473.234L462 176H452L463.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M477.234 126H487.234L476 176H466L477.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M491.234 126H501.234L490 176H480L491.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M505.234 126H515.234L504 176H494L505.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M519.234 126H529.234L518 176H508L519.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M533.234 126H543.234L532 176H522L533.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M547.234 126H557.234L546 176H536L547.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M561.234 126H571.234L560 176H550L561.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M575.234 126H585.234L574 176H564L575.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M589.234 126H599.234L588 176H578L589.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M603.234 126H613.234L602 176H592L603.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M617.234 126H627.234L616 176H606L617.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M631.234 126H641.234L630 176H620L631.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M645.234 126H655.234L644 176H634L645.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M659.234 126H669.234L658 176H648L659.234 126Z"
            fill={strokeColor}
            fillOpacity="0.1"
          />
        </g>

        <g clipPath="url(#clip0_182_2)" className="cube-plus">
          <path
            d="M111.096 42.1464C111.291 41.9513 111.607 41.9514 111.803 42.1464C111.998 42.3417 111.998 42.6582 111.803 42.8535L110.035 44.6201L112.511 47.0957C112.706 47.2908 112.705 47.6074 112.511 47.8027C112.315 47.9979 111.998 47.9979 111.803 47.8027L109.328 45.3281L106.853 47.8027C106.658 47.998 106.342 47.998 106.146 47.8027C105.951 47.6074 105.951 47.2909 106.146 47.0957L108.621 44.6211L106.853 42.8535C106.658 42.6582 106.658 42.3417 106.853 42.1464C107.049 41.9512 107.365 41.9512 107.56 42.1464L109.328 43.913L111.096 42.1464Z"
            fill="white"
          />
          <path
            d="M142.096 42.1464C142.291 41.9513 142.607 41.9514 142.803 42.1464C142.998 42.3417 142.998 42.6582 142.803 42.8535L141.035 44.6201L143.511 47.0957C143.706 47.2908 143.705 47.6074 143.511 47.8027C143.315 47.9979 142.998 47.9979 142.803 47.8027L140.328 45.3281L137.853 47.8027C137.658 47.998 137.342 47.998 137.146 47.8027C136.951 47.6074 136.951 47.2909 137.146 47.0957L139.621 44.6211L137.853 42.8535C137.658 42.6582 137.658 42.3417 137.853 42.1464C138.049 41.9512 138.365 41.9512 138.56 42.1464L140.328 43.913L142.096 42.1464Z"
            fill="white"
          />
          <path
            d="M111.096 74.1464C111.291 73.9513 111.607 73.9514 111.803 74.1464C111.998 74.3417 111.998 74.6582 111.803 74.8535L110.035 76.6201L112.511 79.0957C112.706 79.2908 112.705 79.6074 112.511 79.8027C112.315 79.9979 111.998 79.9979 111.803 79.8027L109.328 77.3281L106.853 79.8027C106.658 79.998 106.342 79.998 106.146 79.8027C105.951 79.6074 105.951 79.2909 106.146 79.0957L108.621 76.6211L106.853 74.8535C106.658 74.6582 106.658 74.3417 106.853 74.1464C107.049 73.9512 107.365 73.9512 107.56 74.1464L109.328 75.913L111.096 74.1464Z"
            fill="white"
          />
          <path
            d="M143.096 74.1464C143.291 73.9513 143.607 73.9514 143.803 74.1464C143.998 74.3417 143.998 74.6582 143.803 74.8535L142.035 76.6201L144.511 79.0957C144.706 79.2908 144.705 79.6074 144.511 79.8027C144.315 79.9979 143.998 79.9979 143.803 79.8027L141.328 77.3281L138.853 79.8027C138.658 79.998 138.342 79.998 138.146 79.8027C137.951 79.6074 137.951 79.2909 138.146 79.0957L140.621 76.6211L138.853 74.8535C138.658 74.6582 138.658 74.3417 138.853 74.1464C139.049 73.9512 139.365 73.9512 139.56 74.1464L141.328 75.913L143.096 74.1464Z"
            fill="white"
          />
          <rect
            x="115"
            y="51"
            width="20"
            height="20"
            rx="2"
            stroke={strokeColor}
            strokeWidth="2"
          />
        </g>
        <g clipPath="url(#clip1_182_2)" className="cube-plus">
          <path
            d="M661.096 42.1464C661.291 41.9513 661.607 41.9514 661.803 42.1464C661.998 42.3417 661.998 42.6582 661.803 42.8535L660.035 44.6201L662.511 47.0957C662.706 47.2908 662.705 47.6074 662.511 47.8027C662.315 47.9979 661.998 47.9979 661.803 47.8027L659.328 45.3281L656.853 47.8027C656.658 47.998 656.342 47.998 656.146 47.8027C655.951 47.6074 655.951 47.2909 656.146 47.0957L658.621 44.6211L656.853 42.8535C656.658 42.6582 656.658 42.3417 656.853 42.1464C657.049 41.9512 657.365 41.9512 657.56 42.1464L659.328 43.913L661.096 42.1464Z"
            fill="white"
          />
          <path
            d="M692.096 42.1464C692.291 41.9513 692.607 41.9514 692.803 42.1464C692.998 42.3417 692.998 42.6582 692.803 42.8535L691.035 44.6201L693.511 47.0957C693.706 47.2908 693.705 47.6074 693.511 47.8027C693.315 47.9979 692.998 47.9979 692.803 47.8027L690.328 45.3281L687.853 47.8027C687.658 47.998 687.342 47.998 687.146 47.8027C686.951 47.6074 686.951 47.2909 687.146 47.0957L689.621 44.6211L687.853 42.8535C687.658 42.6582 687.658 42.3417 687.853 42.1464C688.049 41.9512 688.365 41.9512 688.56 42.1464L690.328 43.913L692.096 42.1464Z"
            fill="white"
          />
          <path
            d="M661.096 74.1464C661.291 73.9513 661.607 73.9514 661.803 74.1464C661.998 74.3417 661.998 74.6582 661.803 74.8535L660.035 76.6201L662.511 79.0957C662.706 79.2908 662.705 79.6074 662.511 79.8027C662.315 79.9979 661.998 79.9979 661.803 79.8027L659.328 77.3281L656.853 79.8027C656.658 79.998 656.342 79.998 656.146 79.8027C655.951 79.6074 655.951 79.2909 656.146 79.0957L658.621 76.6211L656.853 74.8535C656.658 74.6582 656.658 74.3417 656.853 74.1464C657.049 73.9512 657.365 73.9512 657.56 74.1464L659.328 75.913L661.096 74.1464Z"
            fill="white"
          />
          <path
            d="M693.096 74.1464C693.291 73.9513 693.607 73.9514 693.803 74.1464C693.998 74.3417 693.998 74.6582 693.803 74.8535L692.035 76.6201L694.511 79.0957C694.706 79.2908 694.705 79.6074 694.511 79.8027C694.315 79.9979 693.998 79.9979 693.803 79.8027L691.328 77.3281L688.853 79.8027C688.658 79.998 688.342 79.998 688.146 79.8027C687.951 79.6074 687.951 79.2909 688.146 79.0957L690.621 76.6211L688.853 74.8535C688.658 74.6582 688.658 74.3417 688.853 74.1464C689.049 73.9512 689.365 73.9512 689.56 74.1464L691.328 75.913L693.096 74.1464Z"
            fill="white"
          />
          <rect
            x="665"
            y="51"
            width="20"
            height="20"
            rx="2"
            stroke={strokeColor}
            strokeWidth="2"
          />
        </g>
        <g className="percent">
          <path
            d="M453.608 73.558C453.884 73.5501 454.109 73.7673 454.11 74.0431C454.112 74.3192 453.889 74.5499 453.613 74.558L451.161 74.6298L451.181 78.0833C451.182 78.3594 450.959 78.59 450.683 78.5982C450.407 78.6063 450.182 78.3887 450.18 78.1125L450.162 74.6597L446.71 74.7613C446.434 74.7694 446.209 74.5518 446.207 74.2756C446.206 73.9995 446.428 73.7688 446.705 73.7607L450.156 73.659L450.143 71.2068C450.141 70.9306 450.364 70.7 450.64 70.6919C450.916 70.6841 451.141 70.9011 451.142 71.1769L451.156 73.6298L453.608 73.558Z"
            fill={strokeColor}
          />
          <path
            d="M453.607 21.5587C453.883 21.5506 454.107 21.7677 454.109 22.0438C454.11 22.3199 453.888 22.5499 453.612 22.558L451.16 22.6298L451.179 26.084C451.181 26.3599 450.959 26.59 450.683 26.5983C450.407 26.6064 450.181 26.3887 450.18 26.1125L450.161 22.6597L446.71 22.7614C446.434 22.7695 446.208 22.5518 446.207 22.2756C446.205 21.9998 446.427 21.7697 446.703 21.7614L450.155 21.659L450.142 19.2068C450.141 18.9307 450.363 18.7007 450.639 18.6926C450.915 18.6845 451.139 18.9015 451.141 19.1776L451.155 21.6305L453.607 21.5587Z"
            fill={strokeColor}
          />
          <rect
            width="100"
            height="50"
            transform="translate(350 23)"
            fill={strokeColor}
            fillOpacity="0.3"
          />
          <text
            x="365"
            y="60"
            fill={strokeColor}
            fontSize={32}
            fontWeight={500}
            className="font-orbitron"
          >
            000
          </text>
          <path
            d="M351.697 21.6451C351.973 21.6403 352.2 21.8602 352.205 22.1362C352.21 22.4123 351.99 22.6399 351.714 22.6448L349.215 22.6877L349.276 26.1882C349.281 26.464 349.061 26.6916 348.785 26.6968C348.509 26.7016 348.281 26.481 348.276 26.205L348.215 22.7059L344.716 22.7669C344.44 22.7718 344.212 22.5519 344.207 22.2758C344.202 21.9998 344.422 21.772 344.698 21.7672L348.197 21.7061L348.154 19.2068C348.149 18.9307 348.369 18.703 348.645 18.6982C348.921 18.6934 349.149 18.9132 349.154 19.1893L349.198 21.688L351.697 21.6451Z"
            fill={strokeColor}
          />
          <path
            d="M351.697 73.6451C351.973 73.6403 352.2 73.8602 352.205 74.1362C352.21 74.4123 351.99 74.6399 351.714 74.6448L349.215 74.6877L349.276 78.1882C349.281 78.464 349.061 78.6916 348.785 78.6968C348.509 78.7016 348.281 78.481 348.276 78.205L348.215 74.7059L344.716 74.7669C344.44 74.7718 344.212 74.5519 344.207 74.2758C344.202 73.9998 344.422 73.772 344.698 73.7672L348.197 73.7061L348.154 71.2068C348.149 70.9307 348.369 70.703 348.645 70.6982C348.921 70.6934 349.149 70.9132 349.154 71.1893L349.198 73.688L351.697 73.6451Z"
            fill={strokeColor}
          />
        </g>

        <g clipPath="url(#clip2_182_2)" className="cube-plus">
          <path
            d="M111.096 245.146C111.291 244.951 111.607 244.951 111.803 245.146C111.998 245.342 111.998 245.658 111.803 245.853L110.035 247.62L112.511 250.096C112.706 250.291 112.705 250.607 112.511 250.803C112.315 250.998 111.998 250.998 111.803 250.803L109.328 248.328L106.853 250.803C106.658 250.998 106.342 250.998 106.146 250.803C105.951 250.607 105.951 250.291 106.146 250.096L108.621 247.621L106.853 245.853C106.658 245.658 106.658 245.342 106.853 245.146C107.049 244.951 107.365 244.951 107.56 245.146L109.328 246.913L111.096 245.146Z"
            fill="white"
          />
          <path
            d="M142.096 245.146C142.291 244.951 142.607 244.951 142.803 245.146C142.998 245.342 142.998 245.658 142.803 245.853L141.035 247.62L143.511 250.096C143.706 250.291 143.705 250.607 143.511 250.803C143.315 250.998 142.998 250.998 142.803 250.803L140.328 248.328L137.853 250.803C137.658 250.998 137.342 250.998 137.146 250.803C136.951 250.607 136.951 250.291 137.146 250.096L139.621 247.621L137.853 245.853C137.658 245.658 137.658 245.342 137.853 245.146C138.049 244.951 138.365 244.951 138.56 245.146L140.328 246.913L142.096 245.146Z"
            fill="white"
          />
          <path
            d="M111.096 277.146C111.291 276.951 111.607 276.951 111.803 277.146C111.998 277.342 111.998 277.658 111.803 277.853L110.035 279.62L112.511 282.096C112.706 282.291 112.705 282.607 112.511 282.803C112.315 282.998 111.998 282.998 111.803 282.803L109.328 280.328L106.853 282.803C106.658 282.998 106.342 282.998 106.146 282.803C105.951 282.607 105.951 282.291 106.146 282.096L108.621 279.621L106.853 277.853C106.658 277.658 106.658 277.342 106.853 277.146C107.049 276.951 107.365 276.951 107.56 277.146L109.328 278.913L111.096 277.146Z"
            fill="white"
          />
          <path
            d="M143.096 277.146C143.291 276.951 143.607 276.951 143.803 277.146C143.998 277.342 143.998 277.658 143.803 277.853L142.035 279.62L144.511 282.096C144.706 282.291 144.705 282.607 144.511 282.803C144.315 282.998 143.998 282.998 143.803 282.803L141.328 280.328L138.853 282.803C138.658 282.998 138.342 282.998 138.146 282.803C137.951 282.607 137.951 282.291 138.146 282.096L140.621 279.621L138.853 277.853C138.658 277.658 138.658 277.342 138.853 277.146C139.049 276.951 139.365 276.951 139.56 277.146L141.328 278.913L143.096 277.146Z"
            fill="white"
          />
          <rect
            x="115"
            y="254"
            width="20"
            height="20"
            rx="2"
            stroke={strokeColor}
            strokeWidth="2"
          />
        </g>
        <g clipPath="url(#clip3_182_2)" className="cube-plus">
          <path
            d="M661.096 244.146C661.291 243.951 661.607 243.951 661.803 244.146C661.998 244.342 661.998 244.658 661.803 244.853L660.035 246.62L662.511 249.096C662.706 249.291 662.705 249.607 662.511 249.803C662.315 249.998 661.998 249.998 661.803 249.803L659.328 247.328L656.853 249.803C656.658 249.998 656.342 249.998 656.146 249.803C655.951 249.607 655.951 249.291 656.146 249.096L658.621 246.621L656.853 244.853C656.658 244.658 656.658 244.342 656.853 244.146C657.049 243.951 657.365 243.951 657.56 244.146L659.328 245.913L661.096 244.146Z"
            fill="white"
          />
          <path
            d="M692.096 244.146C692.291 243.951 692.607 243.951 692.803 244.146C692.998 244.342 692.998 244.658 692.803 244.853L691.035 246.62L693.511 249.096C693.706 249.291 693.705 249.607 693.511 249.803C693.315 249.998 692.998 249.998 692.803 249.803L690.328 247.328L687.853 249.803C687.658 249.998 687.342 249.998 687.146 249.803C686.951 249.607 686.951 249.291 687.146 249.096L689.621 246.621L687.853 244.853C687.658 244.658 687.658 244.342 687.853 244.146C688.049 243.951 688.365 243.951 688.56 244.146L690.328 245.913L692.096 244.146Z"
            fill="white"
          />
          <path
            d="M661.096 276.146C661.291 275.951 661.607 275.951 661.803 276.146C661.998 276.342 661.998 276.658 661.803 276.853L660.035 278.62L662.511 281.096C662.706 281.291 662.705 281.607 662.511 281.803C662.315 281.998 661.998 281.998 661.803 281.803L659.328 279.328L656.853 281.803C656.658 281.998 656.342 281.998 656.146 281.803C655.951 281.607 655.951 281.291 656.146 281.096L658.621 278.621L656.853 276.853C656.658 276.658 656.658 276.342 656.853 276.146C657.049 275.951 657.365 275.951 657.56 276.146L659.328 277.913L661.096 276.146Z"
            fill="white"
          />
          <path
            d="M693.096 276.146C693.291 275.951 693.607 275.951 693.803 276.146C693.998 276.342 693.998 276.658 693.803 276.853L692.035 278.62L694.511 281.096C694.706 281.291 694.705 281.607 694.511 281.803C694.315 281.998 693.998 281.998 693.803 281.803L691.328 279.328L688.853 281.803C688.658 281.998 688.342 281.998 688.146 281.803C687.951 281.607 687.951 281.291 688.146 281.096L690.621 278.621L688.853 276.853C688.658 276.658 688.658 276.342 688.853 276.146C689.049 275.951 689.365 275.951 689.56 276.146L691.328 277.913L693.096 276.146Z"
            fill="white"
          />
          <rect
            x="665"
            y="253"
            width="20"
            height="20"
            rx="2"
            stroke={strokeColor}
            strokeWidth="2"
          />
        </g>
        <g className="down">
          {/* <rect
            width="400"
            height="40"
            transform="translate(203 235)"
            fill="#A5A5A5"
          /> */}
          <text x="313" y="262" fill="white" fontSize="15" fontWeight={500}>
            DOWNLOADING ASSETS....
          </text>
        </g>

        <g clipPath="url(#clip4_182_2)" className="con">
          {/* <rect
            width="200"
            height="30"
            transform="translate(125 88)"
            fill="#F6F6F6"
            fillOpacity="0.67"
          /> */}
          <text x="125" y="114" fill="white" fontSize="14" fontWeight={500}>
            CONNECTING...
          </text>
        </g>
        <defs>
          <clipPath id="clip0_182_2">
            <rect
              width="40"
              height="40"
              fill="white"
              transform="translate(105 41)"
            />
          </clipPath>
          <clipPath id="clip1_182_2">
            <rect
              width="40"
              height="40"
              fill="white"
              transform="translate(655 41)"
            />
          </clipPath>
          <clipPath id="clip2_182_2">
            <rect
              width="40"
              height="40"
              fill="white"
              transform="translate(105 244)"
            />
          </clipPath>
          <clipPath id="clip3_182_2">
            <rect
              width="40"
              height="40"
              fill="white"
              transform="translate(655 243)"
            />
          </clipPath>
          <clipPath id="clip4_182_2">
            <rect
              width="200"
              height="30"
              fill="white"
              transform="translate(125 88)"
            />
          </clipPath>

          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            {" "}
            <feDropShadow
              dx="2"
              dy="0"
              stdDeviation="5"
              floodColor={strokeColor}
              floodOpacity="0.5"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
}

export function Spinner() {
  return <div className="spinner"></div>;
}

export function FlyingMessage({ fill = strokeColor }) {
  return (
    <>
      <svg
        width="235"
        height="237"
        viewBox="0 0 235 237"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flying-message"
      >
        <g filter="url(#filter0_d_226_16)">
          <path
            d="M56.7437 11.4512C55.5238 2.07131 66.8028 -3.6029 73.6069 2.96777L227.491 151.572C233.028 156.92 230.7 166.256 223.3 168.378L17.6704 227.342C8.57742 229.949 1.28243 219.643 6.76416 211.934L62.1239 134.088C64.5819 130.631 68.9531 129.101 73.0301 130.271L92.6831 135.907C95.8683 136.82 99.1907 134.978 100.104 131.793C101.017 128.608 99.1758 125.286 95.9907 124.372L76.7898 118.865C72.9575 117.766 70.1443 114.496 69.6301 110.542L56.7437 11.4512Z"
            fill={fill}
          />
        </g>
        <defs>
          <filter
            id="filter0_d_226_16"
            x="0.873535"
            y="0.129883"
            width="233.676"
            height="236.625"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="5" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_226_16"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_226_16"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
}

export function FlyingMessagePath() {
  return (
    <>
      <svg
        width="1315"
        height="6482"
        viewBox="0 0 1315 6482"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flying-message-path"
      >
        <path
          d="M136.419 100.515C1069.42 -155.985 1162.92 153.015 1005.42 345.515C847.919 538.015 19.4192 532.015 369.419 882.015C719.419 1232.02 1279.92 1215.02 1232.92 958.015C1185.92 701.015 911.919 439.015 760.419 590.515C608.919 742.015 713.419 1238.02 678.419 1564.52C643.419 1891.02 264.419 2118.02 176.919 1955.02C13.9192 1739.52 -96.5808 1401.52 136.419 1337.02C369.419 1272.52 952.779 1317.28 1115.92 1506.02C1246 1656.5 1453.92 1943.02 1168.42 2211.52C882.919 2480.02 288.419 2398.02 328.919 2888.02C369.419 3378.02 165.419 3302.52 421.919 3454.02C678.419 3605.52 1173.92 3716.52 1203.42 3454.02C1232.92 3191.52 1430.92 2928.52 1168.42 2888.02C905.919 2847.52 608.419 3517.52 643.419 3652.02C678.419 3786.52 1103.92 3769.02 1168.42 4014.02C1232.92 4259.02 474.419 4667.52 421.919 4830.52C369.419 4993.52 95.9192 5180.02 328.919 5326.02C561.919 5472.02 748.419 5845.52 876.919 5472.02C1005.42 5098.52 748.919 4714.02 585.419 5209.52C421.919 5705.02 130.919 5862.52 276.419 6125.02C421.919 6387.52 281.419 6528.02 643.419 6463.52C1005.42 6399.02 1168.42 6323.52 1238.42 6411.02"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeOpacity={0.01}
        />
      </svg>
    </>
  );
}

export function Xlogo({ fill = strokeColorDark, size = 30 }) {
  return (
    <svg
      fill={fill}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <title>X</title>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

export function YTlgo({ fill = strokeColorDark, size = 30 }) {
  return (
    <svg
      fill={fill}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <title>YouTube</title>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function UpworkLogo({ fill = strokeColorDark, size = 30 }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      width={size}
      height={size}
    >
      <title>Upwork</title>
      <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
    </svg>
  );
}

export function TGlogo({ fill = strokeColorDark, size = 30 }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      width={size}
      height={size}
    >
      <title>Telegram</title>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

export function LinkedInLogo({ fill = strokeColorDark, size = 35 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
    >
      <title>linkedin</title>
      <path
        // fill="#0A66C2"
        d="M12.225 12.225h-1.778V9.44c0-.664-.012-1.519-.925-1.519-.926 0-1.068.724-1.068 1.47v2.834H6.676V6.498h1.707v.783h.024c.348-.594.996-.95 1.684-.925 1.802 0 2.135 1.185 2.135 2.728l-.001 3.14zM4.67 5.715a1.037 1.037 0 01-1.032-1.031c0-.566.466-1.032 1.032-1.032.566 0 1.031.466 1.032 1.032 0 .566-.466 1.032-1.032 1.032zm.889 6.51h-1.78V6.498h1.78v5.727zM13.11 2H2.885A.88.88 0 002 2.866v10.268a.88.88 0 00.885.866h10.226a.882.882 0 00.889-.866V2.865a.88.88 0 00-.889-.864z"
      />
    </svg>
  );
}

export function MobileMenu({ fill = "#fff", setState }) {
  let position = 0;
  const positionsNumber = 4;
  const menuRef = useRef(null);

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;

    const handleClick = () => {
      position = (position + 1) % positionsNumber;
      el.dataset.position = position;
      // console.log("position", position);

      if (typeof setState === "function") {
        setState((p) => !p);
        // console.log("clicked");
      }
    };

    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [menuRef, setState]);

  return (
    <div
      className="menu"
      title="menu"
      ref={menuRef}
      // onClick={() => {
      //   position = (position + 1) % positionsNumber;
      //   menuRef.current.dataset.position = position;
      //   console.log(position);
      // }}
    >
      <div className="menu__face menu__face--square menu__face--d1 menu__face--hamburger">
        <svg
          width="2rem"
          height="2rem"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill={fill} fillRule="evenodd">
            <rect x="0" y="0" width="40" height="5" />
            <rect x="0" y="35" width="40" height="5" />
          </g>
        </svg>
      </div>
      <div className="menu__face menu__face--square menu__face--d2 menu__face--cross">
        <svg
          width="2rem"
          height="2rem"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill={fill} fillRule="evenodd">
            <rect x="0" y="0" width="5" height="5" />
            <rect x="35" y="0" width="5" height="5" />
            <rect x="0" y="35" width="5" height="5" />
            <rect x="35" y="35" width="5" height="5" />
            <rect
              x="-5"
              y="16.5"
              width="50"
              height="7"
              style={{ transform: "rotate(45deg)", transformOrigin: "center" }}
            />
            <rect
              x="-5"
              y="16.5"
              width="50"
              height="7"
              style={{ transform: "rotate(-45deg)", transformOrigin: "center" }}
            />
          </g>
        </svg>
      </div>
      <div className="menu__face menu__face--square menu__face--d3 menu__face--hamburger">
        <svg
          width="2rem"
          height="2rem"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill={fill} fillRule="evenodd">
            <rect x="0" y="0" width="40" height="5" />
            <rect x="0" y="35" width="40" height="5" />
          </g>
        </svg>
      </div>
      <div className="menu__face menu__face--square menu__face--d4 menu__face--cross">
        <svg
          width="2rem"
          height="2rem"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill={fill} fillRule="evenodd">
            <rect x="0" y="0" width="5" height="5" />
            <rect x="35" y="0" width="5" height="5" />
            <rect x="0" y="35" width="5" height="5" />
            <rect x="35" y="35" width="5" height="5" />
            <rect
              x="-5"
              y="16.5"
              width="50"
              height="7"
              style={{ transform: "rotate(45deg)", transformOrigin: "center" }}
            />
            <rect
              x="-5"
              y="16.5"
              width="50"
              height="7"
              style={{ transform: "rotate(-45deg)", transformOrigin: "center" }}
            />
          </g>
        </svg>
      </div>
      <div className="menu__face menu__face--square menu__face--d5 menu__face--hamburger menu__face--hamburger-rotated">
        <svg
          width="2rem"
          height="2rem"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill={fill} fillRule="evenodd">
            <rect x="0" y="0" width="40" height="5" />
            <rect x="0" y="35" width="40" height="5" />
          </g>
        </svg>
      </div>
      <div className="menu__face menu__face--square menu__face--d6 menu__face--hamburger menu__face--hamburger-rotated">
        <svg
          className="menu__hamburger"
          width="2rem"
          height="2rem"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill={fill} fillRule="evenodd">
            <rect x="0" y="0" width="40" height="5" />
            <rect x="0" y="35" width="40" height="5" />
          </g>
        </svg>
      </div>
      <div className="menu__face menu__face--axis menu__face--axis-vertical">
        <svg
          width="2rem"
          height="2rem"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill={fill} fillRule="evenodd">
            <rect x="0" y="17.5" width="40" height="5" />
          </g>
        </svg>
      </div>
      <div className="menu__face menu__face--axis menu__face--axis-horizontal">
        <svg
          width="2rem"
          height="2rem"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill={fill} fillRule="evenodd">
            <rect x="0" y="17.5" width="40" height="5" />
          </g>
        </svg>
      </div>
      {/* Credit Pedro Ondiviela
      https://codepen.io/Pedro-Ondiviela */}
    </div>
  );
}
