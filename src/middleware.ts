import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intl = createIntlMiddleware(routing);

/** Paths that are not localized: API routes and the English-only admin area. */
function isUnlocalized(pathname: string) {
  return /^\/(api|admin)(\/|$)/.test(pathname);
}

export default async function middleware(request: NextRequest) {
  // Locale routing (redirects / rewrites) for storefront pages, passthrough elsewhere.
  const response = isUnlocalized(request.nextUrl.pathname) ? NextResponse.next({ request }) : intl(request);

  // Refresh the Supabase session on every page and API request, writing cookies onto the same response.
  await updateSession(request, response);
  return response;
}

export const config = {
  // Skip Next internals and files with an extension (images, fonts, favicon...).
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
