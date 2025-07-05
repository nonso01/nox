export default function GreenwhiteLine() {
  return (
    <>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_50_6)">
          <g filter="url(#filter0_g_50_6)">
            <path
              d="M936 1080V872C936 869.791 937.791 868 940 868L1734 868C1736.21 868 1738 866.209 1738 864L1738 99.589C1738 97.3454 1736.15 95.5406 1733.91 95.59L1398.88 102.97C1397.99 102.989 1397.12 103.308 1396.43 103.874L937.105 480.041C936.391 480.626 935.495 480.946 934.571 480.946L49 480.946C46.7909 480.946 45 479.155 45 476.946L45 -1"
              stroke="#34DB69"
              stroke-width="4"
            />
          </g>
          <g filter="url(#filter1_g_50_6)">
            <path
              d="M1828 1080V770.288C1828 768.079 1826.21 766.288 1824 766.288H358C355.791 766.288 354 764.498 354 762.288L354 21C354 18.7908 355.791 17 358 17H1270.5C1272.71 17 1274.5 18.7909 1274.5 21V879C1274.5 881.209 1276.29 883 1278.5 883H1920.5"
              stroke="white"
              stroke-width="4"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_g_50_6"
            x="38"
            y="-6"
            width="1707"
            height="1091"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.25 0.25"
              numOctaves="3"
              seed="3990"
            />
            <feDisplacementMap
              in="shape"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacedImage"
              width="100%"
              height="100%"
            />
            <feMerge result="effect1_texture_50_6">
              <feMergeNode in="displacedImage" />
            </feMerge>
          </filter>
          <filter
            id="filter1_g_50_6"
            x="347"
            y="10"
            width="1578.5"
            height="1075"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.25 0.25"
              numOctaves="3"
              seed="8626"
            />
            <feDisplacementMap
              in="shape"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacedImage"
              width="100%"
              height="100%"
            />
            <feMerge result="effect1_texture_50_6">
              <feMergeNode in="displacedImage" />
            </feMerge>
          </filter>
          <clipPath id="clip0_50_6">
            <rect width="1920" height="1080" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
}
