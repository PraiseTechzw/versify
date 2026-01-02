import { Loader2 } from "lucide-react";
import type { PoemInspirationInsightsOutput } from "@/ai/flows/provide-poem-inspiration-insights";
import { Badge } from "../ui/badge";

interface AiInsightsProps {
    insights: PoemInspirationInsightsOutput | null;
    isLoading: boolean;
}

export default function AiInsights({ insights, isLoading }: AiInsightsProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <p className="ml-2">Analyzing the poem...</p>
            </div>
        );
    }
    if (!insights) {
        return <div className="text-center text-muted-foreground">No insights available.</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h3 className="font-headline text-xl text-primary mb-2">Mood</h3>
                <p className="text-sm">{insights.moodVisualization}</p>
            </div>
            <div>
                <h3 className="font-headline text-xl text-primary mb-2">Line by Line Inspiration</h3>
                <div className="space-y-4">
                    {insights.insights.map((insight, index) => (
                        <div key={index} className="p-3 border rounded-md bg-background/50">
                            <p className="font-serif italic mb-2">"{insight.line}"</p>
                            <div className="space-y-2">
                                {insight.visualElements.length > 0 && <div>
                                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Visuals</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {insight.visualElements.map((el, i) => <Badge key={i} variant="secondary">{el}</Badge>)}
                                    </div>
                                </div>}
                                {insight.emotions.length > 0 && <div>
                                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Emotions</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {insight.emotions.map((emotion, i) => <Badge key={i} variant="outline">{emotion}</Badge>)}
                                    </div>
                                </div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
