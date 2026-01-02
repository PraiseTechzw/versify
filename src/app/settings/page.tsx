'use client';

import Header from '@/components/versify/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <div className="container max-w-4xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className='font-headline'>Settings</CardTitle>
                            <CardDescription>Manage your preferences and personalize your experience.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center h-[30vh] text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
                                <h2 className="text-xl font-headline font-semibold text-foreground">Coming Soon</h2>
                                <p className="mt-2 max-w-sm">Personalization features are under construction. Check back later!</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
