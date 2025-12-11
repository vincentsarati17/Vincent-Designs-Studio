'use server';
import { getAdminDb } from '@/firebase/admin';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type SecuritySettings = {
  is2faEnabled: boolean;
};

export type SiteIdentitySettings = {
    siteName: string;
    publicEmail: string;
}

export type BrandingSettings = {
    logoUrl: string;
    logoWidth: number;
}

export type MaintenanceSettings = {
  isEnabled: boolean;
};

const defaultSecuritySettings = { is2faEnabled: false };
const defaultIdentitySettings = {
    siteName: 'Vincent Designs Studio',
    publicEmail: 'vincentdesigns137@gmail.com',
};
const defaultBrandingSettings = {
    logoUrl: '/image/VINCEDSTUDIO.icon.png',
    logoWidth: 220,
};
const defaultMaintenanceSettings = { isEnabled: false };


async function getSettings<T>(collectionId: string, defaultSettings: T): Promise<T> {
    const db = getAdminDb();
    if (!db) {
        console.warn(`Firebase Admin is not available. Returning default settings for '${collectionId}'.`);
        return defaultSettings;
    }
    
    try {
        const settingsDocRef = doc(db, 'settings', collectionId);
        const docSnap = await getDoc(settingsDocRef);
        if (docSnap.exists()) {
            return { ...defaultSettings, ...docSnap.data() };
        }
        return defaultSettings;
    } catch (error) {
        console.warn(`Could not fetch '${collectionId}' settings, possibly due to permissions or configuration. Returning default settings.`, error);
        return defaultSettings;
    }
}

async function saveSettings<T>(collectionId: string, settings: T, merge = false) {
    const db = getAdminDb();
    if (!db) {
        throw new Error("Firebase Admin is not configured. Cannot save settings.");
    }
    const settingsDocRef = doc(db, 'settings', collectionId);
    try {
        await setDoc(settingsDocRef, settings, { merge });
    } catch (error) {
        console.error(`Error saving '${collectionId}' settings:`, error);
        throw new Error(`Could not save '${collectionId}' settings.`);
    }
}


export async function getSecuritySettings(): Promise<SecuritySettings> {
  return getSettings('security', defaultSecuritySettings);
}

export async function saveSecuritySettings(settings: SecuritySettings) {
  await saveSettings('security', settings, true);
}


export async function getSiteIdentitySettings(): Promise<SiteIdentitySettings> {
    return getSettings('identity', defaultIdentitySettings);
}


export async function saveSiteIdentitySettings(settings: SiteIdentitySettings) {
    await saveSettings('identity', settings);
}


export async function getBrandingSettings(): Promise<BrandingSettings> {
    return getSettings('branding', defaultBrandingSettings);
}


export async function saveBrandingSettings(settings: Partial<BrandingSettings>) {
    await saveSettings('branding', settings, true);
}


export async function getMaintenanceModeSettings(): Promise<MaintenanceSettings> {
  return getSettings('maintenance', defaultMaintenanceSettings);
}


export async function saveMaintenanceModeSettings(settings: MaintenanceSettings) {
  await saveSettings('maintenance', settings);
}
