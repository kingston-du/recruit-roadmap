import { NextResponse, type NextRequest } from "next/server";

import { getSafeRedirectPath } from "@/lib/auth";
import { appendSignupCompletedMarker } from "@/lib/analytics";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function redirectNoStore(requestUrl: URL, path: string) {
  const response = NextResponse.redirect(new URL(path, requestUrl.origin));
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Pragma", "no-cache");

  return response;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const callbackError = requestUrl.searchParams.get("error");
  let next = getSafeRedirectPath(requestUrl.searchParams.get("next"));

  if (!getSupabaseConfig()) {
    return redirectNoStore(requestUrl, "/login?message=setup");
  }

  const supabase = await createClient();

  if (callbackError || !code) {
    await supabase.auth.signOut();

    return redirectNoStore(requestUrl, "/login?message=verification-failed");
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    await supabase.auth.signOut();

    return redirectNoStore(requestUrl, "/login?message=verification-failed");
  }

  next = appendSignupCompletedMarker(next);

  return redirectNoStore(requestUrl, next);
}
