
'use server';

import { initializeFirebase } from '@/firebase';
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


/**
 * Fetches the security settings from Firestore.
 * If no settings document exists, it returns default values.
 */
export async function getSecuritySettings(): Promise<SecuritySettings> {
  const firebase = initializeFirebase();
  if (!firebase) return { is2faEnabled: false };
  const { db } = firebase;
  const securitySettingsDocRef = doc(db, 'settings', 'security');
  try {
    const docSnap = await getDoc(securitySettingsDocRef);

    if (docSnap.exists()) {
      return docSnap.data() as SecuritySettings;
    } else {
      // Return default settings if document doesn't exist
      return { is2faEnabled: false };
    }
  } catch (error) {
    console.error('Error fetching security settings:', error);
    // Return default settings on error
    return { is2faEnabled: false };
  }
}

/**
 * Updates the security settings in Firestore.
 * @param settings - The new security settings to save.
 */
export async function saveSecuritySettings(settings: SecuritySettings) {
  const firebase = initializeFirebase();
  if (!firebase) throw new Error("Firebase is not initialized. Cannot save settings.");
  const { db } = firebase;
  const securitySettingsDocRef = doc(db, 'settings', 'security');
  try {
    await setDoc(securitySettingsDocRef, settings, { merge: true });
  } catch (error) {
    console.error('Error saving security settings:', error);
    throw new Error('Could not save security settings.');
  }
}

/**
 * Fetches the site identity settings from Firestore.
 * If no settings document exists, it returns default values.
 */
export async function getSiteIdentitySettings(): Promise<SiteIdentitySettings> {
    const firebase = initializeFirebase();
    if (!firebase) {
      console.warn("Firebase not initialized. Returning default site identity settings.");
      return {
          siteName: 'Vincent Designs Studio',
          publicEmail: 'vincentdesigns137@gmail.com',
      };
    }
    const { db } = firebase;
    const siteIdentityDocRef = doc(db, 'settings', 'identity');
    try {
        const docSnap = await getDoc(siteIdentityDocRef);
        if (docSnap.exists()) {
            return docSnap.data() as SiteIdentitySettings;
        } else {
            return {
                siteName: 'Vincent Designs Studio',
                publicEmail: 'vincentdesigns137@gmail.com',
            };
        }
    } catch (error) {
        console.error('Error fetching site identity settings:', error);
        return {
            siteName: 'Vincent Designs Studio',
            publicEmail: 'vincentdesigns137@gmail.com',
        };
    }
}

/**
 * Saves the site identity settings to Firestore.
 * @param settings - The new site identity settings.
 */
export async function saveSiteIdentitySettings(settings: SiteIdentitySettings) {
    const firebase = initializeFirebase();
    if (!firebase) throw new Error("Firebase is not initialized. Cannot save settings.");
    const { db } = firebase;
    const siteIdentityDocRef = doc(db, 'settings', 'identity');
    try {
        await setDoc(siteIdentityDocRef, settings);
    } catch (error) {
        console.error('Error saving site identity settings:', error);
        throw new Error('Could not save site identity settings.');
    }
}

/**
 * Fetches the branding settings from Firestore.
 * If no settings document exists, it returns default values.
 */
export async function getBrandingSettings(): Promise<BrandingSettings> {
    const firebase = initializeFirebase();
    if (!firebase) {
      console.warn("Firebase not initialized. Returning default branding settings.");
      return {
          logoUrl: '/image/VINCEDSTUDIO.icon.png',
          logoWidth: 280,
      };
    }
    const { db } = firebase;
    const brandingDocRef = doc(db, 'settings', 'branding');
    try {
        const docSnap = await getDoc(brandingDocRef);
        if (docSnap.exists()) {
            return docSnap.data() as BrandingSettings;
        } else {
            return {
                logoUrl: '/image/VINCEDSTUDIO.icon.png',
                logoWidth: 280,
            };
        }
    } catch (error) {
        console.error('Error fetching branding settings:', error);
        return {
            logoUrl: '/image/VINCEDSTUDIO.icon.png',
            logoWidth: 280,
        };
    }
}

/**
 * Saves the branding settings to Firestore.
 * @param settings - The new branding settings. Can be a partial object.
 */
export async function saveBrandingSettings(settings: Partial<BrandingSettings>) {
    const firebase = initializeFirebase();
    if (!firebase) throw new Error("Firebase is not initialized. Cannot save settings.");
    const { db } = firebase;
    const brandingDocRef = doc(db, 'settings', 'branding');
    try {
        await setDoc(brandingDocRef, settings, { merge: true });
    } catch (error) {
        console.error('Error saving branding settings:', error);
        throw new Error('Could not save branding settings.');
    }
}

/**
 * Fetches the maintenance mode settings from Firestore.
 */
export async function getMaintenanceModeSettings(): Promise<MaintenanceSettings> {
  const firebase = initializeFirebase();
  if (!firebase) return { isEnabled: false };
  const { db } = firebase;
  const maintenanceSettingsDocRef = doc(db, 'settings', 'maintenance');
  try {
    const docSnap = await getDoc(maintenanceSettingsDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as MaintenanceSettings;
    } else {
      return { isEnabled: false };
    }
  } catch (error) {
    console.error('Error fetching maintenance settings:', error);
    return { isEnabled: false };
  }
}

/**
 * Saves the maintenance mode settings to Firestore.
 */
export async function saveMaintenanceModeSettings(settings: MaintenanceSettings) {
  const firebase = initializeFirebase();
  if (!firebase) throw new Error("Firebase is not initialized. Cannot save settings.");
  const { db } = firebase;
  const maintenanceSettingsDocRef = doc(db, 'settings', 'maintenance');
  try {
    await setDoc(maintenanceSettingsDocRef, settings);
  } catch (error) {
    console.error('Error saving maintenance settings:', error);
    throw new Error('Could not save maintenance settings.');
  }
}
