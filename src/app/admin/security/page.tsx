import SecurityPageClient from "./SecurityPageClient";
import type { Metadata } from "next";
import { getSecuritySettings } from "@/actions/settings";

export const metadata: Metadata = {
  title: "Security & Logs",
  description: "View security logs and manage site security settings.",
};

export default async function SecurityPage() {
  const settings = await getSecuritySettings();
  return <SecurityPageClient settings={settings} />;
}
