import { NextResponse, type NextRequest } from "next/server";

import { getSafeRedirectPath } from "@/lib/auth";
import { appendSignupCompletedMarker } from "@/lib/analytics";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  let next = getSafeRedirectPath(requestUrl.searchParams.get("next"));

  if (code && getSupabaseConfig()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      next = appendSignupCompletedMarker(next);
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
