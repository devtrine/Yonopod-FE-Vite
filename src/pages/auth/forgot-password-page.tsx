import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/auth/field";
import { ArrowRightIcon, EmailIcon } from "@/components/auth/icons";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <AuthShell
      footer={
        <p className="whitespace-nowrap text-xs sm:text-sm">
          <span className="text-slate-500">Remembered it? </span>
          <Link
            to="/login"
            className="font-medium text-[#004ac6] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Back to Sign In
          </Link>
        </p>
      }
    >
      {sent ? (
        <div className="flex w-full flex-col items-center gap-2.5 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-blue-600"
            >
              <path
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-slate-900">
            Check your email
          </h2>
          <p className="text-center text-xs text-slate-500">
            We sent a password reset link to{" "}
            <span className="font-medium text-slate-900">{email}</span>.
          </p>
        </div>
      ) : (
        <>
          <div className="flex w-full flex-col items-start gap-1">
            <h2 className="text-base font-semibold text-slate-900">
              Forgot your password?
            </h2>
            <p className="text-xs text-slate-500">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>
          <form
            noValidate
            onSubmit={handleSubmit}
            className="flex w-full flex-col items-start gap-4 pt-1"
          >
            <Field
              id="email"
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              icon={<EmailIcon className="h-4 w-4" />}
            />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 hover:bg-blue-700 active:bg-blue-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 shadow-sm"
            >
              <span className="whitespace-nowrap text-sm font-medium text-white">
                Send Reset Link
              </span>
              <ArrowRightIcon className="h-4 w-4 text-white" />
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
export default ForgotPasswordPage;
