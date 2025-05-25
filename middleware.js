import { NextResponse } from 'next/server';

const rateLimit = 50; // requests per minute
const ipRequests = new Map();

// Clean up old requests every minute
setInterval(() => {
    const now = Date.now();
    for (const [ip, requests] of ipRequests.entries()) {
        const validRequests = requests.filter(time => now - time < 60000);
        if (validRequests.length === 0) {
            ipRequests.delete(ip);
        } else {
            ipRequests.set(ip, validRequests);
        }
    }
}, 60000);

export async function middleware(request) {
    // Only apply rate limiting to API routes
    if (!request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for');
    if (!ip) {
        return new NextResponse('IP address not found', { status: 400 });
    }

    const now = Date.now();
    const requestTimes = ipRequests.get(ip) || [];
    const recentRequests = requestTimes.filter(time => now - time < 60000);

    if (recentRequests.length >= rateLimit) {
        return new NextResponse('Too many requests', {
            status: 429,
            headers: {
                'Retry-After': '60',
                'X-RateLimit-Limit': rateLimit.toString(),
                'X-RateLimit-Remaining': '0'
            }
        });
    }

    recentRequests.push(now);
    ipRequests.set(ip, recentRequests);

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', rateLimit.toString());
    response.headers.set('X-RateLimit-Remaining', (rateLimit - recentRequests.length).toString());

    return response;
}

export const config = {
    matcher: '/api/:path*',
} 