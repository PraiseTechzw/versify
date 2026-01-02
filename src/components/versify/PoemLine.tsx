"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Wand2 } from "lucide-react";
import { rewritePoemLineWithAISuggestions } from '@/ai/flows/rewrite-poem-line-with-ai-suggestions';
import { useToast } from '@/hooks/use-toast';

interface PoemLineProps {
    lineNumber: number;
    lineText: string;
    fullPoem: string;
    onRewrite: (lineNumber: number, newText: string) => void;
}

export default function PoemLine({ lineNumber, lineText, fullPoem, onRewrite }: PoemLineProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const fetchSuggestions = async () => {
        if (suggestions.length > 0) return;
        setIsLoading(true);
        try {
            const result = await rewritePoemLineWithAISuggestions({
                poem: fullPoem,
                lineNumber: lineNumber + 1,
            });
            setSuggestions(result.suggestions);
        } catch (error) {
            toast({ title: "Failed to get suggestions", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    if (!lineText.trim()) {
        return <div className="h-6" />;
    }

    return (
        <div className="group flex items-center gap-2">
            <p className="flex-grow">{lineText}</p>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={fetchSuggestions}
                        aria-label="Rewrite line"
                    >
                        <Wand2 className="h-4 w-4 text-accent" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='font-headline'>Rewrite Suggestions</DialogTitle>
                    </DialogHeader>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-24">
                            <Loader2 className="h-8 w-8 animate-spin text-accent" />
                        </div>
                    ) : (
                        <ul className="space-y-3 pt-2">
                            {suggestions.map((suggestion, i) => (
                                <li key={i}>
                                    <DialogTrigger asChild>
                                        <button
                                            className="w-full text-left p-3 rounded-md hover:bg-accent/10 transition-colors border"
                                            onClick={() => onRewrite(lineNumber, suggestion)}
                                        >
                                            {suggestion}
                                        </button>
                                    </DialogTrigger>
                                </li>
                            ))}
                        </ul>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
