"use client";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="relative z-10 bg-white pt-16 dark:bg-gray-dark md:pt-20 lg:pt-24">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
          <div className="mb-12 lg:mb-8">
            <Link href="/" className="inline-block mb-6">
              {/* Responsive logo with better sizing control */}
              <div className="relative h-10 w-40 dark:hidden">
                <Image
                  src="/images/logo/fulllogo_light.png"
                  alt="AI Call Center"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative hidden h-10 w-40 dark:block">
                <Image
                  src="/images/logo/fulllogo_dark.png"
                  alt="AI Call Center"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            <p className="mb-6 text-base leading-relaxed text-gray-600 dark:text-gray-300">
              Empowering next-gen customer support through AI-driven voice bots,
              multilingual transcription, real-time sentiment analysis, and intelligent automation —
              built for scalability and efficiency.
            </p>

            {/* Social icons */}
            <div className="flex space-x-4">
              <Link
                href="https://linkedin.com"
                className="text-gray-500 hover:text-primary transition"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.38-1.12 2.5-2.5 2.5S0 4.88 0 3.5 1.12 1 2.5 1s2.5 1.12 2.5 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.1c.67-1.3 2.3-2.2 4.4-2.2 4.7 0 5.6 3.1 5.6 7.1V24H17v-7.6c0-1.8 0-4-2.4-4s-2.8 1.9-2.8 3.9V24H7.5V8z" />
                </svg>
              </Link>
              <Link
                href="https://twitter.com"
                className="text-gray-500 hover:text-primary transition"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.56a9.93 9.93 0 01-2.82.775A4.932 4.932 0 0023.34 3.1a9.864 9.864 0 01-3.13 1.2A4.917 4.917 0 0016.616 2c-2.72 0-4.924 2.21-4.924 4.93 0 .385.043.76.127 1.12A13.978 13.978 0 013.1 3.16a4.93 4.93 0 00-.666 2.48 4.922 4.922 0 002.19 4.1 4.897 4.897 0 01-2.23-.617v.06c0 2.36 1.67 4.33 3.89 4.77a4.937 4.937 0 01-2.22.084 4.936 4.936 0 004.6 3.42 9.867 9.867 0 01-6.1 2.1c-.4 0-.79-.02-1.17-.07A13.945 13.945 0 007.55 21c9.05 0 14-7.5 14-14 0-.22 0-.43-.02-.65A10.16 10.16 0 0024 4.56z" />
                </svg>
              </Link>
              <Link
                href="https://github.com"
                className="text-gray-500 hover:text-primary transition"
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.1 3.3 9.43 7.86 10.96.58.1.79-.25.79-.55v-1.93c-3.2.7-3.88-1.55-3.88-1.55-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.18.08 1.8 1.21 1.8 1.21 1.04 1.78 2.72 1.27 3.38.97.1-.76.4-1.27.72-1.56-2.56-.3-5.26-1.3-5.26-5.75 0-1.27.45-2.3 1.18-3.1-.12-.3-.52-1.5.1-3.1 0 0 .98-.3 3.2 1.2a11.1 11.1 0 015.82 0c2.2-1.5 3.18-1.2 3.18-1.2.62 1.6.23 2.8.12 3.1.74.8 1.18 1.83 1.18 3.1 0 4.47-2.7 5.43-5.28 5.7.4.34.76 1.02.76 2.06v3.06c0 .3.2.66.8.55C20.7 21.42 24 17.1 24 12 24 5.73 18.27.5 12 .5z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>


            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                  Features
                </h2>
                <ul>
                  <li>
                    <Link href="/features/voice-bot" className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary dark:text-body-color-dark dark:hover:text-primary">
                      AI Voice Assistant
                    </Link>
                  </li>
                  <li>
                    <Link href="/features/routing" className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary dark:text-body-color-dark dark:hover:text-primary">
                      Smart Routing
                    </Link>
                  </li>
                  <li>
                    <Link href="/features/transcription" className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary dark:text-body-color-dark dark:hover:text-primary">
                      Real-time Transcription
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                  Resources
                </h2>
                <ul>
                  <li>
                    <Link href="/docs" className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary dark:text-body-color-dark dark:hover:text-primary">
                      API Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/support" className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary dark:text-body-color-dark dark:hover:text-primary">
                      Support Portal
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary dark:text-body-color-dark dark:hover:text-primary">
                      Pricing Plans
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-black dark:text-white">
                  Company
                </h2>
                <ul>
                  <li>
                    <Link href="/about" className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary dark:text-body-color-dark dark:hover:text-primary">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary dark:text-body-color-dark dark:hover:text-primary">
                      Contact Sales
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="mb-4 inline-block text-base text-body-color duration-300 hover:text-primary dark:text-body-color-dark dark:hover:text-primary">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-[#D2D8E183] to-transparent dark:via-[#959CB183]"></div>
          <div className="py-8">
            <p className="text-center text-base text-body-color dark:text-white">
              © {new Date().getFullYear()} AI Call Center — Empowering support with intelligence.
            </p>
          </div>
        </div>

      <div className="h-px w-full bg-linear-to-r from-transparent via-[#D2D8E183] to-transparent dark:via-[#959CB183]"></div>
          
        <div className="absolute right-0 top-14 z-[-1]">
          <svg
            width="55"
            height="99"
            viewBox="0 0 55 99"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle opacity="0.8" cx="49.5" cy="49.5" r="49.5" fill="#959CB1" />
            <mask
              id="mask0_94:899"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="99"
              height="99"
            >
              <circle
                opacity="0.8"
                cx="49.5"
                cy="49.5"
                r="49.5"
                fill="#4A6CF7"
              />
            </mask>
            <g mask="url(#mask0_94:899)">
              <circle
                opacity="0.8"
                cx="49.5"
                cy="49.5"
                r="49.5"
                fill="url(#paint0_radial_94:899)"
              />
              <g opacity="0.8" filter="url(#filter0_f_94:899)">
                <circle cx="53.8676" cy="26.2061" r="20.3824" fill="white" />
              </g>
            </g>
            <defs>
              <filter
                id="filter0_f_94:899"
                x="12.4852"
                y="-15.1763"
                width="82.7646"
                height="82.7646"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="10.5"
                  result="effect1_foregroundBlur_94:899"
                />
              </filter>
              <radialGradient
                id="paint0_radial_94:899"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(49.5 49.5) rotate(90) scale(53.1397)"
              >
                <stop stopOpacity="0.47" />
                <stop offset="1" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute bottom-24 left-0 z-[-1]">
          <svg
            width="79"
            height="94"
            viewBox="0 0 79 94"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              opacity="0.3"
              x="-41"
              y="26.9426"
              width="66.6675"
              height="66.6675"
              transform="rotate(-22.9007 -41 26.9426)"
              fill="url(#paint0_linear_94:889)"
            />
            <rect
              x="-41"
              y="26.9426"
              width="66.6675"
              height="66.6675"
              transform="rotate(-22.9007 -41 26.9426)"
              stroke="url(#paint1_linear_94:889)"
              strokeWidth="0.7"
            />
            <path
              opacity="0.3"
              d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L77.1885 68.2073L50.5215 7.42229Z"
              fill="url(#paint2_linear_94:889)"
            />
            <path
              d="M50.5215 7.42229L20.325 1.14771L46.2077 62.3249L76.7963 68.2073L50.5215 7.42229Z"
              stroke="url(#paint3_linear_94:889)"
              strokeWidth="0.7"
            />
            <path
              opacity="0.3"
              d="M17.9721 93.3057L-14.9695 88.2076L46.2077 62.325L77.1885 68.2074L17.9721 93.3057Z"
              fill="url(#paint4_linear_94:889)"
            />
            <path
              d="M17.972 93.3057L-14.1852 88.2076L46.2077 62.325L77.1884 68.2074L17.972 93.3057Z"
              stroke="url(#paint5_linear_94:889)"
              strokeWidth="0.7"
            />
            <defs>
              <linearGradient
                id="paint0_linear_94:889"
                x1="-41"
                y1="21.8445"
                x2="36.9671"
                y2="59.8878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_94:889"
                x1="25.6675"
                y1="95.9631"
                x2="-42.9608"
                y2="20.668"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_94:889"
                x1="20.325"
                y1="-3.98039"
                x2="90.6248"
                y2="25.1062"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_94:889"
                x1="18.3642"
                y1="-1.59742"
                x2="113.9"
                y2="80.6826"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_94:889"
                x1="61.1098"
                y1="62.3249"
                x2="-8.82468"
                y2="58.2156"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0.62" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_94:889"
                x1="65.4236"
                y1="65.0701"
                x2="24.0178"
                y2="41.6598"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.51" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </footer>
    </>
  );
};

export default Footer;
