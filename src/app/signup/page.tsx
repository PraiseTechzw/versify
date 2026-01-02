
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signup, useAuth, useFirestore } from '@/firebase';
import { FirebaseError } from 'firebase/app';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(auth, firestore, email, password, displayName);
      router.push('/');
      toast({ title: 'Signup Successful!', description: 'Welcome to Versify.' });
    } catch (error) {
      console.error(error);
      let description = 'Could not create an account. Please try again.';
      if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
        description = 'An account with this email already exists. Please sign in instead.';
      }
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description,
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
             <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
             <CardDescription>Start your poetic journey with Versify.</CardDescription>
           </CardHeader>
           <CardContent>
             <form onSubmit={handleSignup} className="grid gap-4">
               <div className="grid gap-2">
                 <Label htmlFor="displayName">Display Name</Label>
                 <Input
                   id="displayName"
                   type="text"
                   placeholder="Your Name"
                   required
                   value={displayName}
                   onChange={(e) => setDisplayName(e.target.value)}
                 />
               </div>
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
                   minLength={6}
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                 />
               </div>
               <Button type="submit" className="w-full group">
                 <UserPlus className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                 Sign Up
               </Button>
             </form>
           </CardContent>
           <CardFooter className="justify-center">
             <p className="text-sm text-muted-foreground">
               Already have an account?{' '}
               <Link href="/login" className="font-semibold text-primary hover:underline">
                 Sign In
               </Link>
             </p>
           </CardFooter>
         </Card>
       </div>
       <div className="hidden bg-muted lg:block relative">
         <Image
           src="https://images.unsplash.com/photo-1592859600972-1b0834d83747?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBwYXRofGVufDB8fHx8MTc2NzMxMzAwMXww&ixlib=rb-4.1.0&q=80&w=1080"
           alt="A winding path through a sunlit forest."
           fill
           sizes="50vw"
           className="h-full w-full object-cover animate-in fade-in-0 duration-1000"
         />
       </div>
     </div>
  );
}
