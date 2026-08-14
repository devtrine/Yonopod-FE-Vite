import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/auth/field";
import {
  ArrowRightIcon,
  EmailIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
} from "@/components/auth/icons";
import { useLogin } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/client";
import { toast } from "@/components/ui/toaster";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useLogin();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) return;

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
        onError: (error) => {
          toast("error", getErrorMessage(error));
        },
      }
    );
  };

  return (
    <AuthShell
      footer={
        <p className="whitespace-nowrap text-xs sm:text-sm">
          <span className="text-slate-500">Don&apos;t have an account? </span>
          <Link
            to="/register"
            className="font-medium text-[#004ac6] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Create one now
          </Link>
        </p>
      }
    >
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-start gap-4 pt-1"
      >
        <Field
          id="input-1"
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
        <Field
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          icon={<LockIcon className="h-4 w-4" />}
          endIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeIcon className="h-4 w-4" />
              ) : (
                <EyeOffIcon className="h-4 w-4" />
              )}
            </button>
          }
        />
        <div className="flex w-full justify-end -mt-2">
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-[#004ac6] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={login.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 hover:bg-blue-700 active:bg-blue-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="whitespace-nowrap text-sm font-medium text-white">
            {login.isPending ? "Signing in…" : "Sign In"}
          </span>
          {!login.isPending && <ArrowRightIcon className="h-4 w-4 text-white" />}
        </button>
      </form>
    </AuthShell>
  );
}
export default LoginPage;
