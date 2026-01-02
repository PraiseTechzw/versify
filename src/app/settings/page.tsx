'use client';

import Header from '@/components/versify/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth, AuthProvider } from '@/context/AuthContext';
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

const poetryStyles = ["Free Verse", "Haiku", "Sonnet", "Limerick", "Ballad"];

function SettingsPageClient() {
    const { user, logout } = useAuth();
    const { toast } = useToast();

    const [displayName, setDisplayName] = useState('');
    const [defaultStyle, setDefaultStyle] = useState('Free Verse');
    const [dailyNotifications, setDailyNotifications] = useState(false);
    const [holidayNotifications, setHolidayNotifications] = useState(false);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || '');
        }
    }, [user]);

    const handleSaveChanges = () => {
        // In a real app, you would save these to the user's profile in the database.
        toast({
            title: "Settings Saved",
            description: "Your preferences have been updated.",
        });
    }

    if (!user) {
        return (
            <div className="container max-w-2xl text-center py-20">
                <h1 className="text-2xl font-bold">Please sign in</h1>
                <p className="text-muted-foreground">You need to be logged in to view this page.</p>
            </div>
        )
    }

    return (
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
                                    checked={dailyNotifications}
                                    onCheckedChange={setDailyNotifications}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-md">
                                <div>
                                    <Label htmlFor="holiday-notifications">Holiday & Special Events</Label>
                                    <p className="text-sm text-muted-foreground">Receive themed poems for holidays.</p>
                                </div>
                                <Switch
                                    id="holiday-notifications"
                                    checked={holidayNotifications}
                                    onCheckedChange={setHolidayNotifications}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                           <Button onClick={() => toast({title: "Notification settings saved!"})}>Update Notifications</Button>
                        </CardFooter>
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
                                            onClick={() => {
                                                logout();
                                                toast({
                                                    title: "Account Deleted",
                                                    description: "We're sorry to see you go.",
                                                });
                                            }}
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
    );
}


export default function SettingsPage() {
    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header />
                <SettingsPageClient />
            </div>
        </AuthProvider>
    )
}
