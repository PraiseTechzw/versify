
import { Skeleton } from "@/components/ui/skeleton";

/**
 * A skeleton loader component that mimics the layout of the PoemDisplay.
 * It's shown while the first poem is being generated to provide a good user experience.
 *
 * @returns {JSX.Element} The rendered PoemSkeleton component.
 */
export default function PoemSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full animate-pulse">
        <div className="lg:w-1/3">
            <Skeleton className="aspect-square lg:aspect-auto h-full w-full rounded-xl" />
        </div>
        <div className="lg:w-2/3 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
            </div>
             <div className="space-y-3 pt-8">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex gap-2 pt-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </div>
        </div>
    </div>
  );
}
