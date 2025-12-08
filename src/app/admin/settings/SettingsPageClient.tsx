'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { Slider } from "@/components/ui/slider";
import React, { useTransition, useState, useEffect } from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, PlusCircle, Upload } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { getSiteIdentitySettings, SiteIdentitySettings, getBrandingSettings, BrandingSettings, getMaintenanceModeSettings } from "@/services/settings";
import { updateSiteIdentitySettings, updateBrandingSettings, updateMaintenanceMode } from "@/actions/settings";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminUser } from "@/lib/types";
import { initializeFirebase } from "@/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { handleAddAdmin, handleDeleteAdmin } from "@/actions/admins";

const { db } = initializeFirebase();

const initialBrandingState = {
  success: false,
  message: "",
}

function AddAdminDialog() {
    const { toast } = useToast();
    const [email, setEmail] = React.useState('');
    const [role, setRole] = React.useState<AdminUser['role']>('Content');
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = React.useState(false);

    const onAddAdmin = () => {
        startTransition(async () => {
            const result = await handleAddAdmin({ email, role });
            if (result.success) {
                toast({
                    title: "Admin Added",
                    description: result.message,
                });
                setIsOpen(false);
                setEmail('');
            } else {
                toast({
                    title: "Error",
                    description: result.message,
                    variant: "destructive",
                });
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Admin
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="text-center">
                    <DialogTitle>Add New Admin</DialogTitle>
                    <DialogDescription>
                        Enter the email and role for the new administrator. An account will be created for them in Firebase Authentication.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" type="email" placeholder="admin@example.com" className="col-span-3" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Role</Label>
                        <Select value={role} onValueChange={(value: any) => setRole(value)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Super Admin">Super Admin</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Support">Support</SelectItem>
                                <SelectItem value="Content">Content</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={onAddAdmin} disabled={isPending}>{isPending ? 'Adding...' : 'Add Admin'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function SettingsPageClient() {
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const [logoWidth, setLogoWidth] = React.useState(180);
  const [admins, setAdmins] = React.useState<AdminUser[] | null>(null);
  const [isMaintenanceMode, setIsMaintenanceMode] = React.useState(false);
  const { toast } = useToast();
  
  const [isIdentityLoading, setIsIdentityLoading] = React.useState(true);
  const [siteName, setSiteName] = React.useState('');
  const [publicEmail, setPublicEmail] = React.useState('');
  const [isIdentityPending, startIdentityTransition] = useTransition();

  const [isBrandingLoading, setIsBrandingLoading] = React.useState(true);
  const [brandingFormState, setBrandingFormState] = useState(initialBrandingState);
  
  const [isAdminsPending, startAdminsTransition] = useTransition();
  const [isMaintenancePending, startMaintenanceTransition] = useTransition();
  const [isSettingsLoading, setIsSettingsLoading] = React.useState(true);
  
  const brandingFormRef = useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    async function fetchAllSettings() {
      setIsIdentityLoading(true);
      setIsBrandingLoading(true);
      setIsSettingsLoading(true);

      const identityPromise = getSiteIdentitySettings();
      const brandingPromise = getBrandingSettings();
      const maintenancePromise = getMaintenanceModeSettings();

      const [identity, branding, maintenance] = await Promise.all([identityPromise, brandingPromise, maintenancePromise]);
      
      setSiteName(identity.siteName);
      setPublicEmail(identity.publicEmail);
      setIsIdentityLoading(false);

      setLogoPreview(branding.logoUrl);
      setLogoWidth(branding.logoWidth);
      setIsBrandingLoading(false);

      setIsMaintenanceMode(maintenance.isEnabled);
      setIsSettingsLoading(false);
    }
    
    fetchAllSettings();

    const q = query(collection(db, 'admins'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const adminList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUser));
        setAdmins(adminList);
    }, (error) => {
        console.error("Failed to fetch admins:", error);
        toast({
            variant: "destructive",
            title: "Error fetching admins",
            description: "Could not load admin users. Please try again later.",
        });
        setAdmins([]);
    });

    return () => unsubscribe();
  }, [toast]);
  
  useEffect(() => {
    if (brandingFormState.success) {
      toast({
        title: "Logo Settings Saved",
        description: brandingFormState.message,
      });
    } else if (brandingFormState.message && !brandingFormState.success && brandingFormState.message !== "") {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: brandingFormState.message,
      });
    }
  }, [brandingFormState, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    startIdentityTransition(async () => {
      const result = await updateSiteIdentitySettings({ siteName, publicEmail });
      if (result.success) {
        toast({
          title: "Settings Saved",
          description: "Your site identity has been updated.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: result.message,
        });
      }
    });
  };

  const handleDeleteAdmin = (adminId: string) => {
    startAdminsTransition(async () => {
        const result = await handleDeleteAdmin(adminId);
        if (result.success) {
            toast({
                title: "Admin Removed",
                description: result.message,
            });
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive",
            });
        }
    });
  };

  const handleMaintenanceModeChange = (enabled: boolean) => {
    setIsMaintenanceMode(enabled); // Optimistic update
    startMaintenanceTransition(async () => {
        const result = await updateMaintenanceMode({ isEnabled: enabled });
        if (result.success) {
            toast({
                title: "Settings Updated",
                description: `Maintenance mode has been ${enabled ? 'enabled' : 'disabled'}.`
            });
        } else {
            setIsMaintenanceMode(!enabled); // Revert on failure
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: result.message,
            });
        }
    });
  };
  
  const handleBrandingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const result = await updateBrandingSettings(initialBrandingState, formData);
      setBrandingFormState(result);
  }

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <div className="grid gap-8 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Site Identity</CardTitle>
            <CardDescription>
              Manage your website's name and public contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isIdentityLoading ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            ) : (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="site-name">Site Name</Label>
                        <Input 
                            id="site-name" 
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            disabled={isIdentityPending}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact-email">Public Email</Label>
                        <Input 
                            id="contact-email" 
                            type="email" 
                            value={publicEmail}
                            onChange={(e) => setPublicEmail(e.target.value)}
                            disabled={isIdentityPending}
                        />
                    </div>
                </>
            )}
             <div className="flex justify-end">
                <Button onClick={handleSaveChanges} disabled={isIdentityLoading || isIdentityPending}>
                  {isIdentityPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
          </CardContent>
        </Card>
        
        <form ref={brandingFormRef} onSubmit={handleBrandingSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Logo & Branding</CardTitle>
            <CardDescription>
              Upload a new logo and adjust its size in the website header.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isBrandingLoading ? <Skeleton className="h-48 w-full" /> : (
            <>
                <div>
                    <Label htmlFor="logo-upload">Upload New Logo</Label>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="w-48 h-20 rounded-md border border-dashed flex items-center justify-center bg-muted/50">
                            {logoPreview ? (
                                <Image src={logoPreview} alt="Image preview" width={180} height={45} className="object-contain h-full w-full" unoptimized/>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Upload className="mx-auto h-8 w-8"/>
                                    <p className="text-xs mt-1">Logo Preview</p>
                                </div>
                            )}
                        </div>
                        <Input 
                            id="logo-upload"
                            name="logo"
                            type="file" 
                            accept="image/*" 
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={false}
                        />
                        <Button type="button" variant="outline" asChild>
                            <label htmlFor="logo-upload" className="cursor-pointer">
                                <Upload className="mr-2 h-4 w-4" />
                                Choose File
                            </label>
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Recommended size: 400x100px. PNG format with transparent background is best.</p>
                </div>
                
                <div>
                    <Label htmlFor="logo-width">Logo Width: {logoWidth}px</Label>
                    <Slider
                        id="logo-width"
                        name="logoWidth"
                        min={80}
                        max={300}
                        step={10}
                        value={[logoWidth]}
                        onValueChange={(value) => setLogoWidth(value[0])}
                        className="mt-2"
                        disabled={false}
                    />
                </div>
                
                <div>
                    <Label>Header Preview</Label>
                    <div className="mt-2 p-4 rounded-lg border flex items-center justify-between bg-muted/40">
                        {logoPreview ? (
                        <Image
                            src={logoPreview}
                            alt="Logo preview"
                            width={logoWidth}
                            height={(logoWidth / 180) * 40} // Maintain aspect ratio
                            style={{ width: `${logoWidth}px`, height: 'auto' }}
                            className="transition-all"
                            unoptimized
                        />
                        ) : <div className="h-10"></div>}
                        <div className="flex items-center gap-2">
                            <div className="w-20 h-4 bg-muted-foreground/20 rounded-sm"></div>
                            <div className="w-20 h-4 bg-muted-foreground/20 rounded-sm"></div>
                            <div className="w-24 h-8 bg-muted-foreground/30 rounded-md"></div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={false}>Save Logo Settings</Button>
                </div>
            </>
            )}
          </CardContent>
        </Card>
        </form>

        <Card>
          <CardHeader>
            <CardTitle>Admin Account Management</CardTitle>
            <CardDescription>
              Add or remove administrators for your site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-medium">Admin Users</h4>
                <AddAdminDialog />
              </div>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins === null ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <TableRow key={`skeleton-admin-${i}`}>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                      </TableRow>
                    ))
                  ) : admins.length > 0 ? (
                    admins.map(admin => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">{admin.email}</TableCell>
                        <TableCell>{admin.role}</TableCell>
                        <TableCell className="text-right">
                          {admin.role !== 'Super Admin' && (
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" disabled={isAdminsPending}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently remove the admin user and revoke their access.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteAdmin(admin.id)}>
                                      Yes, delete admin
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center h-24">No admin users found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle>Maintenance Mode</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Enable maintenance mode to show a temporary holding page to visitors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border border-primary-foreground/20 bg-black/10 p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
                    <p className="text-sm text-primary-foreground/80">
                        When enabled, your public-facing website will be unavailable.
                    </p>
                </div>
                {isSettingsLoading ? (
                    <Skeleton className="h-6 w-11 rounded-full" />
                ) : (
                    <Switch id="maintenance-mode" checked={isMaintenanceMode} onCheckedChange={handleMaintenanceModeChange} disabled={isMaintenancePending} />
                )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of your site by switching between light and dark themes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">Select a theme:</p>
            <ThemeToggleButton />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
