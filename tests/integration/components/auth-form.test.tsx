import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { AuthFormState } from "@/app/auth/actions";
import { AuthForm } from "@/components/recruit/auth-form";

vi.mock("@marsidev/react-turnstile", () => ({
  Turnstile: ({
    onSuccess,
    options,
  }: {
    onSuccess: (token: string) => void;
    options: { action: string };
  }) => (
    <button
      data-action={options.action}
      onClick={() => onSuccess("turnstile-token")}
      type="button"
    >
      Solve security check
    </button>
  ),
}));

describe("AuthForm", () => {
  // Validates login renders Turnstile when auth CAPTCHA is configured.
  it("requires and submits a CAPTCHA token for login", async () => {
    const user = userEvent.setup();
    const action = vi.fn<
      (previousState: AuthFormState, formData: FormData) => Promise<AuthFormState>
    >(async () => ({ message: "" }));

    render(
      <AuthForm
        mode="login"
        action={action}
        nextPath="/today"
        turnstileSiteKey="site-key"
      />,
    );

    const submit = screen.getByRole("button", { name: "Log in" });
    expect(submit).toBeDisabled();
    expect(screen.getByRole("button", { name: "Solve security check" })).toHaveAttribute(
      "data-action",
      "login",
    );

    await user.click(screen.getByRole("button", { name: "Solve security check" }));
    await user.type(screen.getByLabelText("Email"), "family@example.com");
    await user.type(screen.getByLabelText("Password"), "correct-horse");
    expect(submit).toBeEnabled();
    await user.click(submit);

    await waitFor(() => expect(action).toHaveBeenCalled());
    const formData = action.mock.calls[0][1] as FormData;
    expect(formData.get("captchaToken")).toBe("turnstile-token");
  });
});
