/** @type {import('next').NextConfig} */
const nextConfig = {
//   output: "export", // Static export for Next.js
  i18n: {
    locales: ["en", "pt"], // List of languages supported
    defaultLocale: "en", // Default language
    localeDetection: false, // Disable automatic locale detection from URL
  },
};

export default nextConfig;
