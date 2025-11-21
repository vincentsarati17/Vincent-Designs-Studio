
"use client";

import ClientManagementPage from "./ClientManagementPage";
import type { Metadata } from "next";

// Even though this is a client component, we can still export metadata
// export const metadata: Metadata = {
//   title: "Client Management",
//   description: "Manage your clients.",
// };

export default function ClientsPage() {
  return <ClientManagementPage />;
}
