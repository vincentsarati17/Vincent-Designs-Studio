
import ClientManagementPage from "./ClientManagementPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Management",
  description: "Manage your clients.",
};

export default function ClientsPage() {
  return <ClientManagementPage />;
}

    