"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Wand2, Loader2, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { CreativeControlsState } from "./VersifyClient"
import { memo, useCallback } from "react"

interface CreativeControlsProps {
  controls: CreativeControlsState
  setControls: (controls: CreativeControlsState) => void
  onGenerate: () => Promise<void>
  isLoading: boolean
}

// Control configurations for better maintainability
const CONTROL_CONFIG = {
  poetryStyle: {
    label: "Poetry Style",
    tooltip: "Choose the structural form of your poem",
    options: [
      { value: "Free Verse", label: "Free Verse", description: "No fixed structure" },
      { value: "Haiku", label: "Haiku", description: "5-7-5 syllable pattern" },
      { value: "Sonnet", label: "Sonnet", description: "14-line structured poem" },
      { value: "Limerick", label: "Limerick", description: "5-line humorous poem" },
      { value: "Acrostic", label: "Acrostic", description: "First letters spell a word" },
      { value: "Ballad", label: "Ballad", description: "Narrative song-like poem" },
    ],
  },
  tone: {
    label: "Tone",
    tooltip: "Set the emotional atmosphere of your poem",
    options: [
      { value: "Neutral", label: "Neutral" },
      { value: "Joyful", label: "Joyful" },
      { value: "Melancholic", label: "Melancholic" },
      { value: "Mysterious", label: "Mysterious" },
      { value: "Romantic", label: "Romantic" },
      { value: "Nostalgic", label: "Nostalgic" },
      { value: "Peaceful", label: "Peaceful" },
      { value: "Dramatic", label: "Dramatic" },
    ],
  },
  length: {
    label: "Length",
    tooltip: "Determine how long your poem should be",
    options: [
      { value: "Short", label: "Short", description: "4-8 lines" },
      { value: "Medium", label: "Medium", description: "8-16 lines" },
      { value: "Long", label: "Long", description: "16+ lines" },
    ],
  },
  literalVsSymbolic: {
    label: "Interpretation",
    tooltip: "Balance between direct description and metaphorical language",
    options: [
      { value: "Literal", label: "Literal", description: "Direct description" },
      { value: "Balanced", label: "Balanced", description: "Mix of both" },
      { value: "Symbolic", label: "Symbolic", description: "Metaphorical" },
    ],
  },
  narrative: {
    label: "Narrative Style",
    tooltip: "Choose how the poem tells its story",
    options: [
      { value: "Descriptive", label: "Descriptive" },
      { value: "Storytelling", label: "Storytelling" },
      { value: "Reflective", label: "Reflective" },
      { value: "Conversational", label: "Conversational" },
    ],
  },
} as const

const CreativeControls = memo(function CreativeControls({ 
  controls, 
  setControls, 
  onGenerate, 
  isLoading 
}: CreativeControlsProps) {
  // Memoized update function to prevent unnecessary re-renders
  const updateControl = useCallback(
    (key: keyof CreativeControlsState, value: string) => {
      setControls({ ...controls, [key]: value })
    },
    [controls, setControls]
  )

  // Memoized keyword change handler
  const handleKeywordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateControl("keywordEmphasis", e.target.value)
    },
    [updateControl]
  )

  // Memoized generate handler
  const handleGenerate = useCallback(async () => {
    if (!isLoading) {
      await onGenerate()
    }
  }, [isLoading, onGenerate])

  return (
    <TooltipProvider>
      <div className="space-y-4 pb-4">
        {/* Poetry Style */}
        <ControlField
          id="poetry-style-select"
          label={CONTROL_CONFIG.poetryStyle.label}
          tooltip={CONTROL_CONFIG.poetryStyle.tooltip}
        >
          <Select 
            value={controls.poetryStyle} 
            onValueChange={(value) => updateControl("poetryStyle", value)}
            disabled={isLoading}
            name="poetry-style"
          >
            <SelectTrigger id="poetry-style-select" className="h-9 text-sm hover:bg-accent/50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTROL_CONFIG.poetryStyle.options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlField>

        {/* Tone */}
        <ControlField
          id="tone-select"
          label={CONTROL_CONFIG.tone.label}
          tooltip={CONTROL_CONFIG.tone.tooltip}
        >
          <Select 
            value={controls.tone} 
            onValueChange={(value) => updateControl("tone", value)}
            disabled={isLoading}
            name="tone"
          >
            <SelectTrigger id="tone-select" className="h-9 text-sm hover:bg-accent/50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTROL_CONFIG.tone.options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlField>

        {/* Length */}
        <ControlField
          id="length-select"
          label={CONTROL_CONFIG.length.label}
          tooltip={CONTROL_CONFIG.length.tooltip}
        >
          <Select 
            value={controls.length} 
            onValueChange={(value) => updateControl("length", value)}
            disabled={isLoading}
            name="length"
          >
            <SelectTrigger id="length-select" className="h-9 text-sm hover:bg-accent/50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTROL_CONFIG.length.options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlField>

        {/* Literal vs Symbolic */}
        <ControlField
          id="interpretation-select"
          label={CONTROL_CONFIG.literalVsSymbolic.label}
          tooltip={CONTROL_CONFIG.literalVsSymbolic.tooltip}
        >
          <Select 
            value={controls.literalVsSymbolic} 
            onValueChange={(value) => updateControl("literalVsSymbolic", value)}
            disabled={isLoading}
            name="interpretation"
          >
            <SelectTrigger id="interpretation-select" className="h-9 text-sm hover:bg-accent/50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTROL_CONFIG.literalVsSymbolic.options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlField>

        {/* Narrative Style */}
        <ControlField
          id="narrative-select"
          label={CONTROL_CONFIG.narrative.label}
          tooltip={CONTROL_CONFIG.narrative.tooltip}
        >
          <Select 
            value={controls.narrative} 
            onValueChange={(value) => updateControl("narrative", value)}
            disabled={isLoading}
            name="narrative"
          >
            <SelectTrigger id="narrative-select" className="h-9 text-sm hover:bg-accent/50 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTROL_CONFIG.narrative.options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ControlField>

        {/* Keyword Emphasis */}
        <ControlField
          id="keyword-emphasis-input"
          label="Keyword Emphasis"
          tooltip="Add specific themes or subjects to emphasize in your poem"
        >
          <Input
            id="keyword-emphasis-input"
            name="keyword-emphasis"
            placeholder="e.g., nature, love, journey..."
            value={controls.keywordEmphasis}
            onChange={handleKeywordChange}
            disabled={isLoading}
            className="h-9 text-sm transition-all focus:ring-2 focus:ring-primary/20"
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            Optional: Add comma-separated keywords to guide the poem's themes
          </p>
        </ControlField>

        {/* Generate Button */}
        <div className="pt-2">
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading}
            className="w-full shadow-md hover:shadow-lg transition-all duration-200"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Poetry...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Poem
              </>
            )}
          </Button>
          {!isLoading && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Click to create your unique AI-generated poem
            </p>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
})

// Reusable ControlField component for consistent styling and structure
interface ControlFieldProps {
  id: string
  label: string
  tooltip?: string
  children: React.ReactNode
}

const ControlField = memo(function ControlField({ id, label, tooltip, children }: ControlFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Label 
          htmlFor={id} 
          className="text-xs font-semibold text-foreground uppercase tracking-wider"
        >
          {label}
        </Label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`More information about ${label}`}
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p className="text-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  )
})

export default CreativeControls