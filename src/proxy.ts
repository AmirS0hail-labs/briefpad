import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

function isFlightRequest(request: NextRequest) {
  return request.nextUrl.searchParams.has("_rsc");
}

export async function proxy(request: NextRequest) {
  // Do not redirect Flight requests. Next strips RSC headers inside Proxy, so
  // a 307 to another path arrives as HTML and the client shows "Not Found".
  // Pages still enforce auth via requireCurrentUser / the login page redirect.
  if (isFlightRequest(request)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const session = await verifySession(
    request.cookies.get(SESSION_COOKIE)?.value,
  );
  const isLogin = pathname === "/login";

  if (!session && !isLogin) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
