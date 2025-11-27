import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSession } from "./auth/server";

export async function proxy(request: NextRequest) {
  const session = await getSession();

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Protect all routes except:
  // - /api/* (API routes including auth callbacks)
  // - /login (login page)
  // - /_next/* (Next.js internals)
  // - /favicon.ico, /robots.txt, etc. (static files)
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
