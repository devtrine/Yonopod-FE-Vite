import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/auth/field";
import { ArrowRightIcon, LockIcon } from "@/components/auth/icons";

export function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <AuthShell
      footer={
        <p className="mt-[-1px] whitespace-nowrap text-sm leading-5">
          <span className="text-slate-500">Remembered it? </span>
          <Link
            to="/login"
            className="font-medium text-[#004ac6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Back to Sign In
          </Link>
        </p>
      }
    >
      <div className="flex w-full flex-col items-start gap-1">
        <h2 className="text-lg font-semibold leading-7 text-slate-900">
          Set a new password
        </h2>
        <p className="text-sm leading-5 text-slate-500">
          Your new password must be different from your previously used
          passwords.
        </p>
      </div>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-start gap-6 pt-2"
      >
        <Field
          id="password"
          label="New Password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          icon={<LockIcon className="h-[21px] w-4" />}
        />
        <Field
          id="confirm-password"
          label="Confirm Password"
          type="password"
          name="confirm-password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          icon={<LockIcon className="h-[21px] w-4" />}
        />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="mt-[-1px] whitespace-nowrap text-sm font-medium leading-5 tracking-[0.28px] text-[#eeefff]">
            Reset Password
          </span>
          <ArrowRightIcon className="h-4 w-4 text-[#eeefff]" />
        </button>
      </form>
    </AuthShell>
  );
}
export default ResetPasswordPage;
