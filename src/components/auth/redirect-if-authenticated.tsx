import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/use-auth";

/**
 * Wraps guest pages (login/register). If the user is already authenticated,
 * redirect straight to the dashboard instead of showing the auth form.
 */
export function RedirectIfAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { data: user, isPending, isSuccess, isError } = useCurrentUser();

  useEffect(() => {
    if (!isPending && !isError && isSuccess && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [isPending, isError, isSuccess, user, navigate]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9fb]">
        <div className="h-8 w-8 rounded-full border-2 border-[#1c3fc4] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isPending && !isError && isSuccess && user) {
    return null;
  }

  return <>{children}</>;
}
