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
              d="M936 1080L936 738.809V484.946C936 482.737 934.209 480.946 932 480.946L49 480.946C46.7909 480.946 45 479.155 45 476.946L45 -0.999985"
              stroke="#34DB69"
              stroke-width="4"
              className="green-line"
            />
          </g>
          <g filter="url(#filter1_g_50_6)">
            <path
              d="M1828 1080V770.288C1828 768.079 1826.21 766.288 1824 766.288H358C355.791 766.288 354 764.498 354 762.288L354 0"
              stroke="white"
              stroke-width="4"
              className="white-line"
            />
          </g>
        </g>
        <defs>
          <filter
            id="filter0_g_50_6"
            x="38"
            y="-5.99998"
            width="905"
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
            y="-5"
            width="1488"
            height="1090"
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
