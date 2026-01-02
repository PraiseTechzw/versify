"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CreativeControlsState } from "./VersifyClient"
import { Wand2, Sparkles } from "lucide-react"

/**
 * @interface CreativeControlsProps
 * Props for the CreativeControls component.
 * @property {CreativeControlsState} controls - The current state of the creative controls.
 * @property {React.Dispatch<React.SetStateAction<CreativeControlsState>>} setControls - Function to update the controls' state.
 * @property {() => void} onGenerate - Callback function to trigger poem generation.
 * @property {boolean} isLoading - Flag indicating if poem generation is in progress.
 */
interface CreativeControlsProps {
  controls: CreativeControlsState
  setControls: React.Dispatch<React.SetStateAction<CreativeControlsState>>
  onGenerate: () => void
  isLoading: boolean
}

const poetryStyles = ["Free Verse", "Haiku", "Sonnet", "Limerick", "Ballad"]
const tones = ["Neutral", "Joyful", "Melancholy", "Reflective", "Dramatic", "Humorous", "Romantic", "Festive"]
const lengths = { Short: 0, Medium: 1, Long: 2 }
const narratives = ["Descriptive", "Abstract", "Storytelling", "First-person"]

/**
 * A component that provides UI controls for adjusting the creative direction of the AI poem generation.
 *
 * @param {CreativeControlsProps} props - The props for the component.
 * @returns {JSX.Element} The rendered CreativeControls component.
 */
export default function CreativeControls({ controls, setControls, onGenerate, isLoading }: CreativeControlsProps) {
  const handleValueChange = (key: keyof CreativeControlsState) => (value: string | number | string[]) => {
    let processedValue = value
    if (key === "length") {
      const lengthMap = ["Short", "Medium", "Long"]
      processedValue = lengthMap[value as number]
    }
    setControls((prev) => ({ ...prev, [key]: processedValue }))
  }

  return (
    <Card className="shadow-xl border-primary/10 transition-all duration-300 hover:shadow-2xl">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-headline font-semibold text-primary">Creative Controls</h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="poetry-style" className="text-sm font-medium">
            Poetry Style
          </Label>
          <Select value={controls.poetryStyle} onValueChange={handleValueChange("poetryStyle")}>
            <SelectTrigger id="poetry-style" className="transition-all hover:border-primary/50">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {poetryStyles.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone" className="text-sm font-medium">
            Tone
          </Label>
          <Select value={controls.tone} onValueChange={handleValueChange("tone")}>
            <SelectTrigger id="tone" className="transition-all hover:border-primary/50">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              {tones.map((tone) => (
                <SelectItem key={tone} value={tone}>
                  {tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Length</Label>
            <span className="text-sm font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full">
              {controls.length}
            </span>
          </div>
          <Slider
            value={[lengths[controls.length as keyof typeof lengths]]}
            onValueChange={(value) => handleValueChange("length")(value[0])}
            max={2}
            step={1}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>Short</span>
            <span>Medium</span>
            <span>Long</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Interpretation</Label>
          <RadioGroup
            value={controls.literalVsSymbolic}
            onValueChange={handleValueChange("literalVsSymbolic")}
            className="flex gap-3"
          >
            <div className="flex items-center space-x-2 flex-1">
              <RadioGroupItem value="Literal" id="literal" />
              <Label htmlFor="literal" className="cursor-pointer text-sm">
                Literal
              </Label>
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <RadioGroupItem value="Balanced" id="balanced" />
              <Label htmlFor="balanced" className="cursor-pointer text-sm">
                Balanced
              </Label>
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <RadioGroupItem value="Symbolic" id="symbolic" />
              <Label htmlFor="symbolic" className="cursor-pointer text-sm">
                Symbolic
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="narrative" className="text-sm font-medium">
            Narrative
          </Label>
          <Select value={controls.narrative} onValueChange={handleValueChange("narrative")}>
            <SelectTrigger id="narrative" className="transition-all hover:border-primary/50">
              <SelectValue placeholder="Select narrative" />
            </SelectTrigger>
            <SelectContent>
              {narratives.map((narrative) => (
                <SelectItem key={narrative} value={narrative}>
                  {narrative}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-sm font-medium">
            Keyword Emphasis
          </Label>
          <Input
            id="keywords"
            placeholder="e.g., solitude, light, wind"
            value={controls.keywordEmphasis}
            onChange={(e) => handleValueChange("keywordEmphasis")(e.target.value)}
            className="transition-all hover:border-primary/50 focus:border-primary"
          />
          <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
        </div>

        <Button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] h-12"
        >
          {isLoading ? (
            <>
              <Wand2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Generate Poem
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
