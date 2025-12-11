import SettingsPageClient from "./SettingsPageClient";
import type { Metadata } from "next";
import { getSiteIdentitySettings, getBrandingSettings, getMaintenanceModeSettings } from "@/actions/settings";
import { getAdmins } from "@/actions/admins";


export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your site settings and preferences.",
};

export default async function SettingsPage() {
  const [identity, branding, maintenance, admins] = await Promise.all([
    getSiteIdentitySettings(),
    getBrandingSettings(),
    getMaintenanceModeSettings(),
    getAdmins(),
  ]);

  return <SettingsPageClient 
    identitySettings={identity}
    brandingSettings={branding}
    maintenanceSettings={maintenance}
    admins={admins}
  />;
}
