import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { loginAction } from "@/app/auth/actions";
import { AuthForm } from "@/components/recruit/auth-form";
import { LogoMark } from "@/components/recruit/logo";
import { getCurrentUser, getSafeRedirectPath } from "@/lib/auth";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Log In",
  description: "Log in to a private Hockey Pathway family recruiting workspace.",
  path: "/login",
  follow: true,
});

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeRedirectPath(params.next);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const user = await getCurrentUser();
  const shouldShowVerificationFailure = params.message === "verification-failed";

  if (user && !shouldShowVerificationFailure) {
    redirect(nextPath);
  }

  return (
    <main className="min-h-screen bg-[#f7fafc] px-5 py-10 text-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="max-w-xl">
          <Link href="/" className="inline-flex items-center gap-3">
            <LogoMark size={40} />
            <span>
              <span className="block text-sm font-semibold">Hockey Pathway</span>
              <span className="block text-xs text-slate-500">Hockey family plan</span>
            </span>
          </Link>

          <h1 className="mt-10 text-4xl font-semibold tracking-tight md:text-5xl">
            Log in to your family recruiting plan.
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Your account keeps Today, My Plan, Targets, and My Player in one private
            family workspace.
          </p>
        </section>

        <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold text-cyan-800">Welcome back</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Log in with email and password
          </h2>
          {params.message === "setup" ? (
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
              Login is not ready because the Supabase settings are missing.
            </p>
          ) : null}
          {params.message === "account-deleted" ? (
            <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
              Account deleted. You can create a new account any time.
            </p>
          ) : null}
          {shouldShowVerificationFailure ? (
            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
              We could not finish that email verification link. Open the newest
              email in the same browser you used to sign up, then log in with that
              account.
            </p>
          ) : null}
          <AuthForm
            mode="login"
            action={loginAction}
            nextPath={nextPath}
            turnstileSiteKey={turnstileSiteKey}
          />
        </section>
      </div>
    </main>
  );
}
