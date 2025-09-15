/** @type {import('next').NextConfig} */
const nextConfig = {
reactStrictMode: true,
poweredByHeader: false,
images: { remotePatterns: [] },
async headers() {
const csp = [
// Keep CSP minimal and focused to avoid breaking hydration
"default-src 'self'",
"base-uri 'self'",
"object-src 'none'",
"frame-ancestors 'none'",
// Allow connections to your AI + backend providers
"connect-src 'self' https://api.openai.com https://*.supabase.co https://*.vercel.app https://vitals.vercel-insights.com https://vercel.live wss://vercel.live",
// Allow inline styles from Tailwind (generated style tags)
"style-src 'self' 'unsafe-inline'",
// Images and media
"img-src 'self' data:",
// Disallow everything else by default
].join('; ');

const common = [
{ key: 'X-Content-Type-Options', value: 'nosniff' },
{ key: 'X-Frame-Options', value: 'DENY' },
{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
{ key: 'Strict-Transport-Security', value: 'max-age=15552000; includeSubDomains' },
{ key: 'Content-Security-Policy', value: csp },
];

return [
{ source: '/(.*)', headers: common },
];
},
};

export default nextConfig;
