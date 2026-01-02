'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { login, loginWithGoogle } from '@/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/');
      toast({ title: 'Login Successful!' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push('/');
      toast({ title: 'Login Successful!' });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Could not log in with Google. Please try again.',
      });
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
       <div className="flex items-center justify-center py-12 animate-in fade-in-0 slide-in-from-bottom-12 duration-500">
         <Card className="mx-auto w-full max-w-sm border-0 shadow-none sm:border sm:shadow-sm">
           <CardHeader className="text-center">
             <Link href="/" className="group flex items-center justify-center gap-2 mb-4">
               <Leaf className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
               <h1 className="text-3xl font-bold text-primary font-headline">Versify</h1>
             </Link>
             <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
             <CardDescription>Sign in to access your poem library.</CardDescription>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleLogin} className="grid gap-4">
               <div className="grid gap-2">
                 <Label htmlFor="email">Email</Label>
                 <Input
                   id="email"
                   type="email"
                   placeholder="m@example.com"
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
               </div>
               <div className="grid gap-2">
                 <Label htmlFor="password">Password</Label>
                 <Input
                   id="password"
                   type="password"
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                 />
               </div>
               <Button type="submit" className="w-full group">
                 <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                 Sign In
               </Button>
               <div className="relative my-2">
                 <div className="absolute inset-0 flex items-center">
                   <span className="w-full border-t" />
                 </div>
                 <div className="relative flex justify-center text-xs uppercase">
                   <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                 </div>
               </div>
               <Button variant="outline" className="w-full group" onClick={handleGoogleLogin}>
                 <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4 transition-transform group-hover:scale-110">
                   <path
                     fill="currentColor"
                     d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.58 2.22-4.82 2.22-4.14 0-7.5-3.44-7.5-7.6s3.36-7.6 7.5-7.6c2.34 0 3.87.94 4.78 1.84l2.6-2.58C18.14 2.14 15.48 1 12.48 1 7.02 1 3 5.02 3 10.5s4.02 9.5 9.48 9.5c2.82 0 5.26-1.04 7.02-2.72 1.84-1.56 2.68-4.14 2.68-6.62 0-.6-.05-1.16-.14-1.72H12.48z"
                   ></path>
                 </svg>
                 Google
               </Button>
             </form>
           </CardContent>
           <CardFooter className="justify-center">
             <p className="text-sm text-muted-foreground">
               Don't have an account?{' '}
               <Link href="/signup" className="font-semibold text-primary hover:underline">
                 Sign Up
               </Link>
             </p>
           </CardFooter>
         </Card>
       </div>
       <div className="hidden bg-muted lg:block">
         <Image
           src="https://images.unsplash.com/photo-1533371452382-d45a9da51ad9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHN1bnNldHxlbnwwfHx8fDE3NjczMzM1MDh8MA&ixlib=rb-4.1.0&q=80&w=1080"
           alt="A vibrant sunset over a calm ocean"
           width="1920"
           height="1080"
           className="h-full w-full object-cover animate-in fade-in-0 duration-1000"
         />
       </div>
     </div>
  );
}
