import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getSupabaseConfig } from "@/lib/supabase/config";

const protectedRoutes = [
  "/today",
  "/my-plan",
  "/targets",
  "/my-player",
  "/settings",
  "/setup-assist",
  "/admin",
];

const authRoutes = ["/login", "/signup"];

function isRoute(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
}

export async function proxy(request: NextRequest) {
  const config = getSupabaseConfig();

  if (!config) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headersToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        Object.entries(headersToSet).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (!user && isRoute(pathname, protectedRoutes)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    const redirectResponse = NextResponse.redirect(loginUrl);
    copyCookies(response, redirectResponse);
    return redirectResponse;
  }

  if (user && isRoute(pathname, authRoutes)) {
    const next = request.nextUrl.searchParams.get("next");
    const redirectUrl = new URL(next?.startsWith("/") && !next.startsWith("//") ? next : "/today", request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    copyCookies(response, redirectResponse);
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
