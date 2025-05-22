"use client";

import { useTheme } from "next-themes";

const NewsLatterBox = () => {
  const { theme } = useTheme();

  return (
    <div className="shadow-three dark:bg-gray-dark relative z-10 rounded-md bg-white p-8 sm:p-11 lg:p-8 xl:p-11">
      <h3 className="mb-4 text-2xl font-bold leading-tight text-black dark:text-white">
        Stay Ahead with AI Insights
      </h3>
      <p className="mb-10 border-b border-body-color/25 pb-10 text-base leading-relaxed text-body-color dark:border-white/25 dark:text-body-color-dark">
        Join our newsletter to receive exclusive insights, product updates, and real-world use cases of AI-powered call center automation — straight to your inbox.
      </p>
      <form>
        <label htmlFor="name" className="sr-only">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Your name"
          className="mb-4 w-full rounded-md border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark"
        />

        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Your email address"
          className="mb-4 w-full rounded-md border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark"
        />

        <input
          type="submit"
          value="Subscribe Now"
          className="mb-5 w-full cursor-pointer rounded-md bg-primary px-9 py-4 text-base font-medium text-white transition duration-300 hover:bg-primary/90"
        />

        <p className="text-center text-sm text-body-color dark:text-body-color-dark">
          No spam. Only helpful updates and AI trends. Unsubscribe anytime.
        </p>
      </form>

      {/* SVG Decorations */}
      <span className="absolute top-7 left-2">
        <svg width="57" height="65" viewBox="0 0 57 65" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.5"
            d="M0.407629 15.9573L39.1541 64.0714L56.4489 0.160793L0.407629 15.9573Z"
            fill="url(#paint0_linear)"
          />
          <defs>
            <linearGradient id="paint0_linear" x1="-18.3187" y1="55.1044" x2="37.161" y2="15.3509" gradientUnits="userSpaceOnUse">
              <stop stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0.62" />
              <stop offset="1" stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </span>

      <span className="absolute bottom-24 left-1.5">
        <svg width="39" height="32" viewBox="0 0 39 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.5"
            d="M14.7137 31.4215L38.6431 4.24115L6.96581e-07 0.624124L14.7137 31.4215Z"
            fill="url(#paint1_linear)"
          />
          <defs>
            <linearGradient id="paint1_linear" x1="39.1948" y1="38.335" x2="10.6982" y2="10.2511" gradientUnits="userSpaceOnUse">
              <stop stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0.62" />
              <stop offset="1" stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </span>

      <span className="absolute top-[140px] right-2">
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.5"
            d="M10.6763 35.3091C23.3976 41.6367 38.1681 31.7045 37.107 17.536C36.1205 4.3628 21.9407 -3.46901 10.2651 2.71063C-2.92254 9.69061 -2.68321 28.664 10.6763 35.3091Z"
            fill="url(#paint2_linear)"
          />
          <defs>
            <linearGradient id="paint2_linear" x1="-0.571054" y1="-37.1717" x2="28.7937" y2="26.7564" gradientUnits="userSpaceOnUse">
              <stop stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0.62" />
              <stop offset="1" stopColor={theme === "light" ? "#4A6CF7" : "#fff"} stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </span>
    </div>
  );
};

export default NewsLatterBox;
