"use client"
import { useEffect, useState, useRef } from "react"
import type React from "react"

import { Download, RefreshCw, Palette, LayoutTemplate, Upload, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import CoverPreview from "@/components/cover-preview"
import TemplateGallery from "@/components/template-gallery"
import ColorPaletteGallery from "@/components/color-palette-gallery"
import PlatformSelector from "@/components/platform-selector"
import { defaultUserData, templates, colorPalettes, platforms } from "@/lib/cover-data"
import type { UserData, Template, ColorPalette, Platform } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function CoverGenerator() {
  const [userData, setUserData] = useState<UserData>(defaultUserData)
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0])
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(colorPalettes[0])
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(platforms[0])
  const [html2canvas, setHtml2canvas] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Load user data from localStorage on initial render
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("coverGeneratorUserData")
      const savedTemplate = localStorage.getItem("coverGeneratorTemplate")
      const savedPalette = localStorage.getItem("coverGeneratorPalette")
      const savedPlatform = localStorage.getItem("coverGeneratorPlatform")

      if (savedData) {
        setUserData(JSON.parse(savedData))
      }

      if (savedTemplate) {
        const templateId = JSON.parse(savedTemplate)
        const template = templates.find((t) => t.id === templateId)
        if (template) setSelectedTemplate(template)
      }

      if (savedPalette) {
        const paletteId = JSON.parse(savedPalette)
        const palette = colorPalettes.find((p) => p.id === paletteId)
        if (palette) setSelectedPalette(palette)
      }

      if (savedPlatform) {
        const platformId = JSON.parse(savedPlatform)
        const platform = platforms.find((p) => p.id === platformId)
        if (platform) setSelectedPlatform(platform)
      }
    } catch (error) {
      console.error("Error loading saved data:", error)
    }
  }, [])

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("coverGeneratorUserData", JSON.stringify(userData))
      localStorage.setItem("coverGeneratorTemplate", JSON.stringify(selectedTemplate.id))
      localStorage.setItem("coverGeneratorPalette", JSON.stringify(selectedPalette.id))
      localStorage.setItem("coverGeneratorPlatform", JSON.stringify(selectedPlatform.id))
    } catch (error) {
      console.error("Error saving data:", error)
    }
  }, [userData, selectedTemplate, selectedPalette, selectedPlatform])

  // Load html2canvas dynamically
  useEffect(() => {
    import("html2canvas").then((module) => {
      setHtml2canvas(() => module.default)
    })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setUserData((prev) => ({ ...prev, profileImage: event.target.result as string }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleReset = () => {
    setUserData(defaultUserData)
    setSelectedTemplate(templates[0])
    setSelectedPalette(colorPalettes[0])

    toast({
      title: "Reset Complete",
      description: "All settings have been reset to default values.",
    })
  }

  const handleDownload = async () => {
    if (!html2canvas || !previewRef.current) return

    setIsGenerating(true)

    try {
      // Create a temporary container with exact dimensions
      const tempContainer = document.createElement("div")
      tempContainer.style.width = `${selectedPlatform.width}px`
      tempContainer.style.height = `${selectedPlatform.height}px`
      tempContainer.style.position = "absolute"
      tempContainer.style.left = "-9999px"
      tempContainer.style.top = "-9999px"
      tempContainer.style.overflow = "hidden"

      // Clone the preview content
      const clone = previewRef.current.cloneNode(true) as HTMLElement
      clone.style.width = "100%"
      clone.style.height = "100%"

      // Add to DOM temporarily
      tempContainer.appendChild(clone)
      document.body.appendChild(tempContainer)

      // Capture with html2canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      })

      // Remove temporary elements
      document.body.removeChild(tempContainer)

      // Convert canvas to a data URL
      const dataUrl = canvas.toDataURL("image/png")

      // Create download link
      const link = document.createElement("a")
      link.download = `${selectedPlatform.id}-cover-${selectedTemplate.id}.png`
      link.href = dataUrl
      link.click()

      toast({
        title: "Success!",
        description: "Your cover image has been downloaded.",
      })
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "There was an error generating the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Platform Selector */}
      <Card className="border-primary/10 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1 text-primary">Platform</h2>
              <p className="text-sm text-muted-foreground">Select the platform for your cover image</p>
            </div>
            <PlatformSelector
              platforms={platforms}
              selectedPlatform={selectedPlatform}
              onSelect={setSelectedPlatform}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary">Preview</h2>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-primary/20 text-primary hover:text-primary hover:bg-primary/5"
                >
                  <LayoutTemplate className="h-4 w-4" />
                  <span className="hidden sm:inline">Change Template</span>
                  <span className="inline sm:hidden">Template</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="sm:max-w-md w-full">
                <SheetHeader>
                  <SheetTitle className="text-primary">Choose a Template</SheetTitle>
                  <SheetDescription>Select from our collection of professional templates</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <TemplateGallery
                    templates={templates}
                    selectedTemplate={selectedTemplate}
                    onSelect={(template) => {
                      setSelectedTemplate(template)
                    }}
                    defaultData={defaultUserData}
                    defaultPalette={selectedPalette}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-secondary/20 text-secondary hover:text-secondary hover:bg-secondary/5"
                >
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Change Colors</span>
                  <span className="inline sm:hidden">Colors</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="sm:max-w-md w-full">
                <SheetHeader>
                  <SheetTitle className="text-secondary">Choose a Color Palette</SheetTitle>
                  <SheetDescription>Select a color scheme that matches your brand</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <ColorPaletteGallery
                    palettes={colorPalettes}
                    selectedPalette={selectedPalette}
                    onSelect={(palette) => {
                      setSelectedPalette(palette)
                    }}
                    defaultData={defaultUserData}
                    defaultTemplate={selectedTemplate}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden border border-primary/10 shadow-md">
          <CoverPreview
            userData={userData}
            template={selectedTemplate}
            palette={selectedPalette}
            platform={selectedPlatform}
            ref={previewRef}
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Image size: {selectedPlatform.width}×{selectedPlatform.height}px ({selectedPlatform.name} recommended
            dimensions)
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              className="gap-2 bg-primary hover:bg-primary/90"
              disabled={isGenerating || !html2canvas}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Cover
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset} className="gap-2 border-muted-foreground/20">
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <Card className="border-primary/10 shadow-sm">
        <CardContent className="pt-6">
          <form className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-primary">Your Information</h2>

              <div className="space-y-2">
                <Label htmlFor="headline" className="text-foreground">
                  Headline
                </Label>
                <Input
                  id="headline"
                  name="headline"
                  value={userData.headline}
                  onChange={handleInputChange}
                  placeholder="Building Technology to Bridge Gaps"
                  className="border-input/60 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Your Name (Optional)
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={userData.name || ""}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="border-input/60 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subheadline" className="text-foreground">
                  Subheadline
                </Label>
                <Input
                  id="subheadline"
                  name="subheadline"
                  value={userData.subheadline}
                  onChange={handleInputChange}
                  placeholder="Innovating at the intersection of education and technology"
                  className="border-input/60 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-foreground">
                  Company/Position
                </Label>
                <Input
                  id="company"
                  name="company"
                  value={userData.company}
                  onChange={handleInputChange}
                  placeholder="Founder & CTO | Campoprime Labs"
                  className="border-input/60 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileImage" className="text-foreground">
                  Profile Image
                </Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center border border-primary/10">
                    {userData.profileImage ? (
                      <img
                        src={userData.profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                          fill="currentColor"
                          opacity="0.7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <Input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="border-input/60 focus-visible:ring-primary opacity-0 absolute inset-0 cursor-pointer"
                    />
                    <Button variant="outline" className="w-full gap-2 border-dashed border-input/60">
                      <Upload className="h-4 w-4" />
                      {userData.profileImage ? "Change Image" : "Upload Image"}
                    </Button>
                  </div>
                  {userData.profileImage && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setUserData((prev) => ({ ...prev, profileImage: "" }))}
                      className="border-destructive/20 text-destructive hover:bg-destructive/5"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Upload a square image for best results</p>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

