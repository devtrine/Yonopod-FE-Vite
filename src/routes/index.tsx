import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import { AuthLayout } from "@/pages/auth/auth-layout";
import { DashboardLayout } from "@/pages/dashboard/dashboard-layout";
import { SettingsLayout } from "@/pages/dashboard/settings/settings-layout";
import { AdminLayout } from "@/pages/admin/admin-layout";

// Auth Pages
import { LoginPage } from "@/pages/auth/login-page";
import { RegisterPage } from "@/pages/auth/register-page";
import { ForgotPasswordPage } from "@/pages/auth/forgot-password-page";
import { ResetPasswordPage } from "@/pages/auth/reset-password-page";

// Dashboard Pages
import { DashboardPage } from "@/pages/dashboard/dashboard-page";
import { FilesPage } from "@/pages/dashboard/files-page";
import { FolderDetailPage } from "@/pages/dashboard/folder-detail-page";
import { FavoritesPage } from "@/pages/dashboard/favorites-page";
import { RecentPage } from "@/pages/dashboard/recent-page";
import { SharedPage } from "@/pages/dashboard/shared-page";
import { TagsPage } from "@/pages/dashboard/tags-page";
import { TrashPage } from "@/pages/dashboard/trash-page";
import { VaultPage } from "@/pages/dashboard/vault-page";
import { ActivityPage } from "@/pages/dashboard/activity-page";
import { SearchPage } from "@/pages/dashboard/search-page";

// Settings Pages
import { ProfileSettingsPage } from "@/pages/dashboard/settings/profile-settings-page";
import { SecuritySettingsPage } from "@/pages/dashboard/settings/security-settings-page";
import { StorageSettingsPage } from "@/pages/dashboard/settings/storage-settings-page";
import { BillingSettingsPage } from "@/pages/dashboard/settings/billing-settings-page";
import { DevicesSettingsPage } from "@/pages/dashboard/settings/devices-settings-page";
import { SessionsSettingsPage } from "@/pages/dashboard/settings/sessions-settings-page";

// Admin Pages
import { AdminOverviewPage } from "@/pages/admin/admin-overview-page";
import { AdminUsersPage } from "@/pages/admin/admin-users-page";
import { AdminStoragePage } from "@/pages/admin/admin-storage-page";
import { AdminServersPage } from "@/pages/admin/admin-servers-page";

// Public Share
import { PublicSharePage } from "@/pages/share/public-share-page";

// 404
import { NotFoundPage } from "@/pages/not-found-page";

export const router = createBrowserRouter([
  // Root Redirect
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  // Auth Routes
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },

  // Dashboard Routes
  {
    element: <DashboardLayout />,
    children: [
      { path: "dashboard", element: <DashboardPage /> },
      { path: "files", element: <FilesPage /> },
      { path: "folders", element: <Navigate to="/files" replace /> },
      { path: "folders/:folderId", element: <FolderDetailPage /> },
      { path: "favorites", element: <FavoritesPage /> },
      { path: "recent", element: <RecentPage /> },
      { path: "shared", element: <SharedPage /> },
      { path: "tags", element: <TagsPage /> },
      { path: "trash", element: <TrashPage /> },
      { path: "vault", element: <VaultPage /> },
      { path: "activity", element: <ActivityPage /> },
      { path: "search", element: <SearchPage /> },

      // Settings sub-routes
      {
        path: "settings",
        element: <SettingsLayout />,
        children: [
          { index: true, element: <Navigate to="/settings/profile" replace /> },
          { path: "profile", element: <ProfileSettingsPage /> },
          { path: "security", element: <SecuritySettingsPage /> },
          { path: "storage", element: <StorageSettingsPage /> },
          { path: "billing", element: <BillingSettingsPage /> },
          { path: "devices", element: <DevicesSettingsPage /> },
          { path: "sessions", element: <SessionsSettingsPage /> },
        ],
      },
    ],
  },

  // Admin Routes
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminOverviewPage /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "storage", element: <AdminStoragePage /> },
      { path: "servers", element: <AdminServersPage /> },
      { path: "settings", element: <Navigate to="/settings/profile" replace /> },
    ],
  },

  // Public Share Route
  {
    path: "share/:token",
    element: <PublicSharePage />,
  },

  // Catch-all Not Found
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
