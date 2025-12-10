
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

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'developer@example.com', password: 'password' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    startTransition(() => {
      // Mock Login: Set a dummy cookie and redirect to the admin dashboard.
      // This bypasses all real authentication for development purposes.
      document.cookie = "__session=dev-mock-session; path=/";
      toast({
        title: 'Mock Login Successful',
        description: 'Redirecting to the admin dashboard...',
      });
      router.replace('/admin');
    });
  };

  return (
    <Card className="w-full max-w-sm bg-black/10 backdrop-blur-lg border border-white/20 text-white">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-center">Admin Login (Dev Mode)</CardTitle>
        <CardDescription className="text-white/80">Click Sign In to access the dashboard. No real credentials needed.</CardDescription>
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
              {isPending ? 'Redirecting...' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
