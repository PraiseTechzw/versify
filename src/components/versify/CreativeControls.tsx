"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CreativeControlsState } from "./VersifyClient"
import { Wand2, Settings } from "lucide-react"

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
 * Discord-style compact creative controls component.
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Creative Controls</h3>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Poetry Style</Label>
          <Select value={controls.poetryStyle} onValueChange={handleValueChange("poetryStyle")}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {poetryStyles.map((style) => (
                <SelectItem key={style} value={style} className="text-xs">
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Tone</Label>
          <Select value={controls.tone} onValueChange={handleValueChange("tone")}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tones.map((tone) => (
                <SelectItem key={tone} value={tone} className="text-xs">
                  {tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Length</Label>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
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
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Short</span>
            <span>Medium</span>
            <span>Long</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Interpretation</Label>
          <RadioGroup
            value={controls.literalVsSymbolic}
            onValueChange={handleValueChange("literalVsSymbolic")}
            className="flex gap-2"
          >
            <div className="flex items-center space-x-1 flex-1">
              <RadioGroupItem value="Literal" id="literal" className="h-3 w-3" />
              <Label htmlFor="literal" className="cursor-pointer text-xs">
                Literal
              </Label>
            </div>
            <div className="flex items-center space-x-1 flex-1">
              <RadioGroupItem value="Balanced" id="balanced" className="h-3 w-3" />
              <Label htmlFor="balanced" className="cursor-pointer text-xs">
                Balanced
              </Label>
            </div>
            <div className="flex items-center space-x-1 flex-1">
              <RadioGroupItem value="Symbolic" id="symbolic" className="h-3 w-3" />
              <Label htmlFor="symbolic" className="cursor-pointer text-xs">
                Symbolic
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Narrative</Label>
          <Select value={controls.narrative} onValueChange={handleValueChange("narrative")}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {narratives.map((narrative) => (
                <SelectItem key={narrative} value={narrative} className="text-xs">
                  {narrative}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-medium text-muted-foreground">Keywords</Label>
          <Input
            placeholder="e.g., solitude, light, wind"
            value={controls.keywordEmphasis}
            onChange={(e) => handleValueChange("keywordEmphasis")(e.target.value)}
            className="h-8 text-xs"
          />
        </div>

        <Button
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full h-9 text-xs font-medium"
        >
          {isLoading ? (
            <>
              <Wand2 className="mr-1 h-3 w-3 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-1 h-3 w-3" />
              Generate Poem
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
