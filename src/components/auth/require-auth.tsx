import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../hooks/use-auth";

/**
 * Wraps protected pages. Shows a loading screen while checking the session,
 * then redirects to /login if the session is invalid (401 / unauthenticated).
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user, isPending, isError } = useCurrentUser();

  const isUnauthenticated = !isPending && (isError || !user);

  useEffect(() => {
    if (isUnauthenticated) {
      navigate("/login", { replace: true, state: { from: location } });
    }
  }, [isUnauthenticated, navigate, location]);

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
