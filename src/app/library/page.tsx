import Header from '@/components/versify/Header';
import PoemCard from '@/components/versify/PoemCard';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const mockLibrary: {
    title: string;
    poem: string;
    image: ImagePlaceholder;
}[] = [
    {
        title: "Whispers of the Woods",
        poem: "Sunlight filters through the leaves,\nA gentle breeze, a soft reprieve.\nThe ancient trees stand tall and grand,\nA silent story, close at hand.",
        image: PlaceHolderImages[0],
    },
    {
        title: "Mountain's Mirror",
        poem: "The lake, a glass for sky's soft face,\nReflects the peaks, in time and space.\nStillness holds the world in thrall,\nAnswering nature's silent call.",
        image: PlaceHolderImages[1],
    },
    {
        title: "Ocean's Last Embrace",
        poem: "The sun descends in fiery kiss,\nUpon the water's gentle bliss.\nA final glow, a painted sigh,\nBeneath the vast and endless sky.",
        image: PlaceHolderImages[2],
    },
    {
        title: "Celestial Tapestry",
        poem: "A velvet dark, with diamond dust,\nA universe of cosmic trust.\nThe silent stars, a distant fire,\nFueling dreams and high desire.",
        image: PlaceHolderImages[3],
    }
];

export default function LibraryPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <div className="container max-w-screen-2xl">
                    <h1 className="text-3xl font-bold font-headline text-primary mb-6">My Library</h1>
                    {mockLibrary.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                           {mockLibrary.map((item, index) => (
                               <PoemCard key={index} poem={item} />
                           ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed">
                             <h2 className="text-2xl font-headline font-semibold text-foreground">Your Library is Empty</h2>
                            <p className="mt-2 max-w-sm">You haven't saved any poems yet. Start creating to build your personal collection!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
