import { Skeleton } from "@/components/ui/skeleton";

/**
 * A skeleton loader component that mimics the layout of the PoemDisplay.
 * It's shown while the first poem is being generated to provide a good user experience.
 *
 * @returns {JSX.Element} The rendered PoemSkeleton component.
 */
export default function PoemSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
        <div className="lg:w-2/5">
            {/* <CHANGE> Enhanced skeleton with rounded corners and better aspect ratio */}
            <Skeleton className="aspect-[4/5] lg:aspect-auto h-full w-full rounded-2xl" />
        </div>
        <div className="lg:w-3/5 space-y-6">
            <Skeleton className="h-10 w-3/4 rounded-xl" />
            <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-5/6 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-4/6 rounded-lg" />
                <Skeleton className="h-4 w-5/6 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
            </div>
             <div className="space-y-3 pt-8">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-4/6 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
            </div>
            <div className="flex gap-2 pt-4">
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
        </div>
    </div>
  );
}
