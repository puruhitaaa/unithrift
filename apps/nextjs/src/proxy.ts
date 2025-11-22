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
  matcher: ["/dashboard", "/universities", "/listings", "/transactions"], // Specify the routes the middleware applies to
};
