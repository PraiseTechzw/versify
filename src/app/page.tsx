import Header from '@/components/versify/Header';
import VersifyClient from '@/components/versify/VersifyClient';
import { AuthProvider } from '@/context/AuthContext';
import { LibraryProvider } from '@/context/LibraryContext';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AuthProvider>
        <LibraryProvider>
          <Header />
          <VersifyClient />
        </LibraryProvider>
      </AuthProvider>
    </div>
  );
}
