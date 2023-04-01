import { NextRequest, NextFetchEvent, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest, ev: NextFetchEvent, res: NextResponse) {
  const previousPage = req.nextUrl.pathname;

  if (previousPage.startsWith("/checkout")) {

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET});

    if (!session) {
      const requestedPage = req.nextUrl.pathname;
      const url = req.nextUrl.clone()
      url.pathname = `/auth/login`
      url.search = `?p=${requestedPage}`

      return NextResponse.redirect(url)
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/checkout/:path*"],
};
