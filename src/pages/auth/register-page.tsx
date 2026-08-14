import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthShell } from "@/components/auth/auth-shell";
import { Field } from "@/components/auth/field";
import {
  EmailIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  UserIcon,
} from "@/components/auth/icons";
import { useRegister } from "@/hooks/use-auth";
import { getErrorMessage } from "@/lib/api/client";
import { toast } from "@/components/ui/toaster";

export function RegisterPage() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const register = useRegister();

  const passwordLength = password.length;
  const strengthPercentage = Math.min(100, (passwordLength / 8) * 100);
  const strengthColor =
    passwordLength === 0
      ? "bg-slate-200"
      : passwordLength < 8
      ? "bg-amber-500"
      : "bg-emerald-500";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username || !email || !password) return;

    register.mutate(
      { username, email, password, full_name: name || undefined },
      {
        onSuccess: () => {
          toast("success", "Account created! Please sign in.");
          navigate("/login");
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
          <span className="text-slate-500">Already have an account? </span>
          <Link
            to="/login"
            className="font-semibold text-[#004ac6] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Sign In
          </Link>
        </p>
      }
    >
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-start gap-3.5 pt-1"
      >
        <Field
          id="username"
          label="Username"
          type="text"
          name="username"
          autoComplete="username"
          placeholder="johndoe"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          icon={<UserIcon className="h-4 w-4" />}
        />
        <Field
          id="name"
          label="Full Name (optional)"
          type="text"
          name="name"
          autoComplete="name"
          placeholder="John Doe"
          value={name}
          onChange={(event) => setName(event.target.value)}
          icon={<UserIcon className="h-4 w-4" />}
        />
        <Field
          id="email"
          label="Email Address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="name@company.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          icon={<EmailIcon className="h-4 w-4" />}
        />
        <div className="flex w-full flex-col items-start gap-1.5">
          <Field
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="new-password"
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
          <div className="w-full space-y-1">
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full transition-all duration-300 ${strengthColor}`}
                style={{ width: `${strengthPercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Must be at least 8 characters
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={register.isPending}
          className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 hover:bg-blue-700 active:bg-blue-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 shadow-sm mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="whitespace-nowrap text-sm font-semibold text-white">
            {register.isPending ? "Creating account…" : "Create Account"}
          </span>
        </button>
      </form>
    </AuthShell>
  );
}
export default RegisterPage;
