"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CreativeControlsState } from "./VersifyClient"
import { Wand2 } from "lucide-react"

interface CreativeControlsProps {
    controls: CreativeControlsState
    setControls: React.Dispatch<React.SetStateAction<CreativeControlsState>>
    onGenerate: () => void;
    isLoading: boolean;
}

const poetryStyles = ["Free Verse", "Haiku", "Sonnet", "Limerick", "Ballad"];
const tones = ["Neutral", "Joyful", "Melancholy", "Reflective", "Dramatic", "Humorous"];
const lengths = { "Short": 0, "Medium": 1, "Long": 2 };
const narratives = ["Descriptive", "Abstract", "Storytelling", "First-person"];

export default function CreativeControls({ controls, setControls, onGenerate, isLoading }: CreativeControlsProps) {

    const handleValueChange = (key: keyof CreativeControlsState) => (value: string | number | string[]) => {
        let processedValue = value;
        if (key === 'length') {
            const lengthMap = ["Short", "Medium", "Long"];
            processedValue = lengthMap[value as number];
        }
        setControls(prev => ({ ...prev, [key]: processedValue }));
    }

    return (
        <Card className="shadow-lg animate-in fade-in duration-500">
            <CardContent className="p-4 space-y-6">
                <h2 className="text-lg font-headline font-semibold text-primary">Creative Controls</h2>

                <div className="space-y-2">
                    <Label htmlFor="poetry-style">Poetry Style</Label>
                    <Select value={controls.poetryStyle} onValueChange={handleValueChange('poetryStyle')}>
                        <SelectTrigger id="poetry-style">
                            <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                            {poetryStyles.map(style => <SelectItem key={style} value={style}>{style}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={controls.tone} onValueChange={handleValueChange('tone')}>
                        <SelectTrigger id="tone">
                            <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                            {tones.map(tone => <SelectItem key={tone} value={tone}>{tone}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4">
                    <Label>Length: <span className="font-semibold text-accent">{controls.length}</span></Label>
                    <Slider
                      value={[lengths[controls.length as keyof typeof lengths]]}
                      onValueChange={(value) => handleValueChange('length')(value[0])}
                      max={2}
                      step={1}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Interpretation</Label>
                    <RadioGroup value={controls.literalVsSymbolic} onValueChange={handleValueChange('literalVsSymbolic')} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Literal" id="literal" />
                            <Label htmlFor="literal">Literal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Balanced" id="balanced" />
                            <Label htmlFor="balanced">Balanced</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Symbolic" id="symbolic" />
                            <Label htmlFor="symbolic">Symbolic</Label>
                        </div>
                    </RadioGroup>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="narrative">Narrative</Label>
                    <Select value={controls.narrative} onValueChange={handleValueChange('narrative')}>
                        <SelectTrigger id="narrative">
                            <SelectValue placeholder="Select narrative" />
                        </SelectTrigger>
                        <SelectContent>
                            {narratives.map(narrative => <SelectItem key={narrative} value={narrative}>{narrative}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="keywords">Keyword Emphasis</Label>
                    <Input id="keywords" placeholder="e.g., solitude, light, wind" value={controls.keywordEmphasis} onChange={e => handleValueChange('keywordEmphasis')(e.target.value)} />
                </div>
                
                <Button onClick={onGenerate} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    {isLoading ? 'Generating...' : 'Generate Poem'}
                    <Wand2 className="ml-2 h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    )
}
