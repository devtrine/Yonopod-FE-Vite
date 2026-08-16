import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/use-auth";

/**
 * Wraps protected pages. Shows a loading screen while checking the session,
 * then redirects to /login if the session is invalid (401).
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { data: user, isPending, isError } = useCurrentUser();

  const isUnauthenticated = isError || (!isPending && !user);

  useEffect(() => {
    if (isUnauthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isUnauthenticated, navigate]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 rounded-full border-2 border-[#1c3fc4] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isUnauthenticated) return null;

  return <>{children}</>;
}
