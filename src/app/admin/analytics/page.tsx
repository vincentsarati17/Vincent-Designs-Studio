import AnalyticsPageClient from "./AnalyticsPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics & Reports",
  description: "View analytics and reports for your website.",
};

export default function AnalyticsPage() {
  return <AnalyticsPageClient />;
}
