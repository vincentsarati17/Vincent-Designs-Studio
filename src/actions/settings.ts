
'use server';

import { z } from 'zod';
import { saveSecuritySettings, saveSiteIdentitySettings, saveBrandingSettings, saveMaintenanceModeSettings, getSiteIdentitySettings as getSiteIdentitySettingsFromDb, getBrandingSettings as getBrandingSettingsFromDb, getMaintenanceModeSettings as getMaintenanceModeSettingsFromDb, getSecuritySettings as getSecuritySettingsFromDb, type SiteIdentitySettings, type BrandingSettings, type MaintenanceSettings, type SecuritySettings } from '@/services/settings';
import { logAdminAction } from '@/services/logs';
import { revalidatePath } from 'next/cache';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getCurrentUser } from '@/lib/auth-utils';
import { initializeFirebase } from '@/firebase';

// Helper to get client-side storage instance
function getClientStorage() {
    const { storage } = initializeFirebase();
    return storage;
}

const securitySettingsSchema = z.object({
  is2faEnabled: z.boolean(),
});

type SecuritySettingsForm = z.infer<typeof securitySettingsSchema>;

const siteIdentitySchema = z.object({
    siteName: z.string().min(1, 'Site name cannot be empty.'),
    publicEmail: z.string().email('Please enter a valid email address.'),
});

type SiteIdentityForm = z.infer<typeof siteIdentitySchema>;

const brandingSettingsSchema = z.object({
  logoWidth: z.coerce.number().min(80).max(300),
  logo: z.any().optional(),
});

const maintenanceModeSchema = z.object({
  isEnabled: z.boolean(),
});

type MaintenanceModeForm = z.infer<typeof maintenanceModeSchema>;

// --- SERVER-SIDE GETTERS ---
export async function getSiteIdentitySettings(): Promise<SiteIdentitySettings> {
    return getSiteIdentitySettingsFromDb();
}

export async function getBrandingSettings(): Promise<BrandingSettings> {
    return getBrandingSettingsFromDb();
}

export async function getMaintenanceModeSettings(): Promise<MaintenanceSettings> {
    return getMaintenanceModeSettingsFromDb();
}

export async function getSecuritySettings(): Promise<SecuritySettings> {
    return getSecuritySettingsFromDb();
}
// --- END SERVER-SIDE GETTERS ---


export async function updateSecuritySettings(values: SecuritySettingsForm) {
  const user = await getCurrentUser();
  if (!user || !user.email) {
    return { success: false, message: 'Authentication required.' };
  }

  const parsed = securitySettingsSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, message: 'Invalid data format.' };
  }

  try {
    await saveSecuritySettings(parsed.data);

    await logAdminAction('Security Settings Updated', {
      change: `2FA ${parsed.data.is2faEnabled ? 'Enabled' : 'Disabled'}`,
      user: user.email,
      status: 'Success',
    });
    
    revalidatePath('/admin/security');

    return { success: true };
  } catch (error: any) {
    console.error('Error updating security settings:', error);
    await logAdminAction('Security Settings Update Failed', {
        change: `2FA ${parsed.data.is2faEnabled ? 'Enabled' : 'Disabled'}`,
        user: user.email,
        status: 'Failed',
        error: error.message
    });
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}

export async function updateSiteIdentitySettings(values: SiteIdentityForm) {
  const user = await getCurrentUser();
  if (!user || !user.email) {
    return { success: false, message: 'Authentication required.' };
  }

  const parsed = siteIdentitySchema.safeParse(values);

  if (!parsed.success) {
    const errorMessages = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return { success: false, message: `Invalid data: ${errorMessages}` };
  }

  try {
    await saveSiteIdentitySettings(parsed.data);

    await logAdminAction('Site Identity Updated', {
        change: `Name: ${parsed.data.siteName}, Email: ${parsed.data.publicEmail}`,
        user: user.email,
        status: 'Success',
    });
    
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (error: any) {
    console.error('Error updating site identity:', error);
    await logAdminAction('Site Identity Update Failed', {
        user: user.email,
        status: 'Failed',
        error: error.message
    });
    return { success: false, message: error.message || 'An unexpected error occurred.' };
  }
}

export async function updateBrandingSettings(prevState: any, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !user.email) {
    return { success: false, message: 'Authentication required.' };
  }

  const values = Object.fromEntries(formData.entries());
  const parsed = brandingSettingsSchema.safeParse(values);

  if (!parsed.success) {
    const errorMessages = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return { success: false, message: `Invalid data: ${errorMessages}` };
  }
  
  const { logoWidth, logo } = parsed.data;
  let logoUrl: string | undefined = undefined;

  try {
    const storage = getClientStorage();

    if (logo && logo.size > 0) {
      const storageRef = ref(storage, `branding/logo-${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, logo);
      logoUrl = await getDownloadURL(snapshot.ref);
    }
    
    await saveBrandingSettings({ logoWidth, logoUrl });

    await logAdminAction('Branding Settings Updated', {
        user: user.email,
        status: 'Success',
    });

    revalidatePath('/', 'layout');

    return { success: true, message: "Branding settings updated successfully." };
  } catch (error: any) {
     console.error('Error updating branding settings:', error);
     await logAdminAction('Branding Settings Update Failed', {
        user: user.email,
        status: 'Failed',
        error: error.message,
     });
     return { success: false, message: error.message || "An unexpected error occurred." };
  }
}

export async function updateMaintenanceMode(values: MaintenanceModeForm) {
    const user = await getCurrentUser();
    if (!user || !user.email) {
      return { success: false, message: 'Authentication required.' };
    }
    
    const parsed = maintenanceModeSchema.safeParse(values);

    if (!parsed.success) {
        return { success: false, message: 'Invalid data format.' };
    }

    try {
        await saveMaintenanceModeSettings(parsed.data);
        await logAdminAction('Maintenance Mode Updated', {
            status: 'Success',
            user: user.email,
            change: `Maintenance mode ${parsed.data.isEnabled ? 'enabled' : 'disabled'}.`,
        });
        
        revalidatePath('/', 'layout');

        return { success: true };
    } catch (error: any) {
        await logAdminAction('Maintenance Mode Update Failed', {
            status: 'Failed',
            user: user.email,
            error: error.message,
        });
        return { success: false, message: 'Failed to update maintenance mode.' };
    }
}
