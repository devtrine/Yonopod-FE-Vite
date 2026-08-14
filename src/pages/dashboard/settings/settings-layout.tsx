import { Outlet, Navigate, useLocation } from "react-router-dom";

export function SettingsLayout() {
  const location = useLocation();
  if (location.pathname === "/settings" || location.pathname === "/settings/") {
    return <Navigate to="/settings/profile" replace />;
  }

  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
}
export default SettingsLayout;
