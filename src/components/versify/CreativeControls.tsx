"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Wand2, Loader2 } from "lucide-react"
import type { CreativeControlsState } from "./VersifyClient"

interface CreativeControlsProps {
  controls: CreativeControlsState
  setControls: (controls: CreativeControlsState) => void
  onGenerate: () => Promise<void>
  isLoading: boolean
}

export default function CreativeControls({ controls, setControls, onGenerate, isLoading }: CreativeControlsProps) {
  const updateControl = (key: keyof CreativeControlsState, value: string) => {
    setControls({ ...controls, [key]: value })
  }

  return (
    <div className="space-y-4">
      {/* Poetry Style */}
      <div className="space-y-2">
        <Label htmlFor="poetry-style" className="text-xs font-medium text-foreground uppercase tracking-wide">
          Poetry Style
        </Label>
        <Select value={controls.poetryStyle} onValueChange={(value) => updateControl("poetryStyle", value)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Free Verse">Free Verse</SelectItem>
            <SelectItem value="Haiku">Haiku</SelectItem>
            <SelectItem value="Sonnet">Sonnet</SelectItem>
            <SelectItem value="Limerick">Limerick</SelectItem>
            <SelectItem value="Acrostic">Acrostic</SelectItem>
            <SelectItem value="Ballad">Ballad</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tone */}
      <div className="space-y-2">
        <Label htmlFor="tone" className="text-xs font-medium text-foreground uppercase tracking-wide">
          Tone
        </Label>
        <Select value={controls.tone} onValueChange={(value) => updateControl("tone", value)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Neutral">Neutral</SelectItem>
            <SelectItem value="Joyful">Joyful</SelectItem>
            <SelectItem value="Melancholic">Melancholic</SelectItem>
            <SelectItem value="Mysterious">Mysterious</SelectItem>
            <SelectItem value="Romantic">Romantic</SelectItem>
            <SelectItem value="Nostalgic">Nostalgic</SelectItem>
            <SelectItem value="Peaceful">Peaceful</SelectItem>
            <SelectItem value="Dramatic">Dramatic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Length */}
      <div className="space-y-2">
        <Label htmlFor="length" className="text-xs font-medium text-foreground uppercase tracking-wide">
          Length
        </Label>
        <Select value={controls.length} onValueChange={(value) => updateControl("length", value)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Short">Short (4-8 lines)</SelectItem>
            <SelectItem value="Medium">Medium (8-16 lines)</SelectItem>
            <SelectItem value="Long">Long (16+ lines)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Literal vs Symbolic */}
      <div className="space-y-2">
        <Label htmlFor="literal-symbolic" className="text-xs font-medium text-foreground uppercase tracking-wide">
          Interpretation
        </Label>
        <Select value={controls.literalVsSymbolic} onValueChange={(value) => updateControl("literalVsSymbolic", value)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Literal">Literal (Direct description)</SelectItem>
            <SelectItem value="Balanced">Balanced</SelectItem>
            <SelectItem value="Symbolic">Symbolic (Metaphorical)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Narrative Style */}
      <div className="space-y-2">
        <Label htmlFor="narrative" className="text-xs font-medium text-foreground uppercase tracking-wide">
          Narrative Style
        </Label>
        <Select value={controls.narrative} onValueChange={(value) => updateControl("narrative", value)}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Descriptive">Descriptive</SelectItem>
            <SelectItem value="Storytelling">Storytelling</SelectItem>
            <SelectItem value="Reflective">Reflective</SelectItem>
            <SelectItem value="Conversational">Conversational</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Keyword Emphasis */}
      <div className="space-y-2">
        <Label htmlFor="keyword-emphasis" className="text-xs font-medium text-foreground uppercase tracking-wide">
          Keyword Emphasis
        </Label>
        <Input
          id="keyword-emphasis"
          placeholder="e.g., nature, love, journey..."
          value={controls.keywordEmphasis}
          onChange={(e) => updateControl("keywordEmphasis", e.target.value)}
          className="h-8 text-xs"
        />
        <p className="text-xs text-muted-foreground">Optional keywords to emphasize in the poem</p>
      </div>

      {/* Generate Button */}
      <Button 
        onClick={onGenerate} 
        disabled={isLoading}
        className="w-full mt-6"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Poem
          </>
        )}
      </Button>
    </div>
  )
}