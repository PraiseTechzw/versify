'use client';

import Header from '@/components/versify/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useUser, logout, updateProfile, type User, useAuth, useFirestore } from '@/firebase';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const poetryStyles = ["Free Verse", "Haiku", "Sonnet", "Limerick", "Ballad"];

export default function SettingsPage() {
    const { user, loading } = useUser();
    const { toast } = useToast();
    const router = useRouter();
    const auth = useAuth();
    const firestore = useFirestore();

    const [displayName, setDisplayName] = useState('');
    const [defaultStyle, setDefaultStyle] = useState('Free Verse');
    const [dailyInspiration, setDailyInspiration] = useState(false);
    const [holidayEvents, setHolidayEvents] = useState(false);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
            const prefs = user.notificationPreferences;
            if (prefs) {
                setDailyInspiration(prefs.dailyInspiration || false);
                setHolidayEvents(prefs.holidayEvents || false);
            }
        }
    }, [user]);

    const handleSaveChanges = async () => {
        if (!user) return;
        try {
            await updateProfile(firestore, user, { displayName });
            // In a real app, you would also save other preferences like defaultStyle to Firestore.
            toast({
                title: "Settings Saved",
                description: "Your preferences have been updated.",
            });
        } catch(e) {
             toast({
                title: "Error",
                description: "Could not save settings.",
                variant: 'destructive'
            });
        }
    }

    const handleNotificationChange = async (type: 'daily' | 'holiday', value: boolean) => {
        if (!user) return;
        
        const newPreferences = {
            dailyInspiration: type === 'daily' ? value : dailyInspiration,
            holidayEvents: type === 'holiday' ? value : holidayEvents,
        };

        if(type === 'daily') setDailyInspiration(value);
        if(type === 'holiday') setHolidayEvents(value);

        try {
            await updateProfile(firestore, user, { notificationPreferences: newPreferences });
            toast({
                title: "Notification settings updated!",
                description: `You will ${value ? 'now' : 'no longer'} receive ${type === 'daily' ? 'daily inspiration' : 'holiday'} alerts.`
            });
        } catch (e) {
            toast({
                title: "Error",
                description: "Could not update notification settings.",
                variant: 'destructive'
            });
            // Revert optimistic update
            if(type === 'daily') setDailyInspiration(!value);
            if(type === 'holiday') setHolidayEvents(!value);
        }
    }
    
    const handleLogout = async () => {
        await logout(auth);
        router.push('/');
    }
    
    const handleDeleteAccount = async () => {
        // In a real app this would also delete user data from Firestore
        await logout(auth);
        toast({
            title: "Account Deleted",
            description: "We're sorry to see you go.",
        });
        router.push('/');
    }

    if (loading) {
        return (
             <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header />
                 <div className="container max-w-2xl text-center py-20">
                    <h1 className="text-2xl font-bold">Loading...</h1>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header />
                <main className="flex-1 p-4 sm:p-6 md:p-8">
                     <div className="container max-w-2xl text-center py-20">
                        <h1 className="text-2xl font-bold">Please sign in</h1>
                        <p className="text-muted-foreground">You need to be logged in to view this page.</p>
                        <Button asChild className="mt-4"><Link href="/login">Sign In</Link></Button>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <div className="container max-w-2xl">
                    <h1 className="text-3xl font-bold font-headline text-primary mb-6">Settings</h1>
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className='font-headline'>Profile</CardTitle>
                                <CardDescription>Manage your public profile and preferences.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={user?.email || ''} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="default-style">Favorite Style</Label>
                                    <Select value={defaultStyle} onValueChange={setDefaultStyle}>
                                        <SelectTrigger id="default-style">
                                            <SelectValue placeholder="Select a style" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {poetryStyles.map(style => <SelectItem key={style} value={style}>{style}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSaveChanges}>Save Changes</Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className='font-headline'>Notifications</CardTitle>
                                <CardDescription>Manage how you receive updates and inspiration.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div>
                                        <Label htmlFor="daily-notifications">Daily Inspiration</Label>
                                        <p className="text-sm text-muted-foreground">Get a daily poem delivered to you.</p>
                                    </div>
                                    <Switch
                                        id="daily-notifications"
                                        checked={dailyInspiration}
                                        onCheckedChange={(checked) => handleNotificationChange('daily', checked)}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div>
                                        <Label htmlFor="holiday-notifications">Holiday & Special Events</Label>
                                        <p className="text-sm text-muted-foreground">Receive themed poems for holidays.</p>
                                    </div>
                                    <Switch
                                        id="holiday-notifications"
                                        checked={holidayEvents}
                                        onCheckedChange={(checked) => handleNotificationChange('holiday', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                         <Card className="border-destructive">
                            <CardHeader>
                                <CardTitle className="text-destructive font-headline">Danger Zone</CardTitle>
                                <CardDescription>Manage your account settings.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive">Delete Account</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-destructive hover:bg-destructive/90"
                                                onClick={handleDeleteAccount}
                                            >
                                                Yes, delete my account
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
