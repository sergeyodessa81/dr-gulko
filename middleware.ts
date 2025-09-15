import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'dg_quota_v1';
const LIMIT = 10; // per 24h
const WINDOW_MS = 24 * 60 * 60 * 1000;

function isProtectedPath(pathname: string) {
// Protect grading and agent endpoints
return pathname.startsWith('/api/mock-tests/grade') || pathname.startsWith('/api/mock-tests/agent');
}

export function middleware(req: NextRequest) {
const { pathname } = req.nextUrl;
if (!isProtectedPath(pathname) || req.method !== 'POST') {
return NextResponse.next();
}

const now = Date.now();
const cookie = req.cookies.get(COOKIE)?.value;
let remaining = LIMIT;
let resetAt = now + WINDOW_MS;

if (cookie) {
try {
const obj = JSON.parse(cookie) as { remaining: number; resetAt: number };
if (typeof obj.resetAt === 'number' && obj.resetAt > now) {
remaining = typeof obj.remaining === 'number' ? obj.remaining : LIMIT;
resetAt = obj.resetAt;
}
} catch {}
}

if (remaining <= 0) {
return NextResponse.json(
{ error: 'Free quota exceeded. Please try again after 24h.' },
{ status: 429 },
);
}

const res = NextResponse.next();
const nextState = { remaining: remaining - 1, resetAt };
res.cookies.set(COOKIE, JSON.stringify(nextState), {
httpOnly: true,
sameSite: 'lax',
secure: true,
path: '/',
expires: new Date(resetAt),
});
return res;
}

export const config = {
matcher: ['/api/:path*'],
};
