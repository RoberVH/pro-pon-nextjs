/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const MS_PER_SECOND = 1000;
const SECONDS_PER_DAY = 86400;

const nextConfig = {
  reactStrictMode: true,
  i18n,
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: SECONDS_PER_DAY * MS_PER_SECOND,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 100,
  },  
  react: { useSuspense: false },
  // localeDetection: true,
}
module.exports = nextConfig
