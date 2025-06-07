import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

    const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' data: blob:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

    const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, " ").trim();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce); // Para usar en layout o scripts si se necesita

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);
    response.headers.set("x-nonce", nonce);

    return response;
}
export const config = {
    matcher: [
        {
            source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },
    ],
};
