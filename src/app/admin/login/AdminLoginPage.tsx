'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    startTransition(async () => {
      try {
        const { auth } = initializeFirebase();
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        
        const idToken = await userCredential.user.getIdToken();

        const response = await fetch('/api/auth/session-login', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          toast({
            title: 'Login Successful',
            description: 'Redirecting to dashboard...',
          });
          router.replace('/admin');
        } else {
          throw new Error(result.message || 'Login failed. Please check your credentials.');
        }

      } catch (error: any) {
        console.error("Login failed:", error);
        toast({
          variant: 'destructive',
          title: 'Login Error',
          description: error.message || 'An unexpected error occurred.',
        });
      }
    });
  };

  return (
    <Card className="w-full max-w-sm bg-black/10 backdrop-blur-lg border border-white/20 text-white">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-center">Admin Login</CardTitle>
        <CardDescription className="text-white/80">Enter your credentials to access the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="admin@example.com" 
                      {...field} 
                      disabled={isPending} 
                      className="bg-white/5 border-white/30 placeholder:text-white/60"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      disabled={isPending} 
                      className="bg-white/5 border-white/30 placeholder:text-white/60"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary/80 hover:bg-primary" disabled={isPending}>
              {isPending ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
