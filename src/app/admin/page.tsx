import AdminDashboardPage from "./AdminDashboardPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage your website content and view submissions.",
};

export default function DashboardPage() {
  return <AdminDashboardPage />;
}
