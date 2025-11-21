
import AllLogsPageClient from "./AllLogsPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Full Activity Log",
  description: "View all administrator activity logs for the site.",
};

export default function AllLogsPage() {
  return <AllLogsPageClient />;
}
