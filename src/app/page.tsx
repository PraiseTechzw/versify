import Header from '@/components/versify/Header';
import VersifyClient from '@/components/versify/VersifyClient';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <VersifyClient />
    </div>
  );
}
