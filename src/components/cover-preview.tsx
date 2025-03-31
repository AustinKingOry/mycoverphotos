import { forwardRef } from "react"
import type { UserData, Template, ColorPalette, Platform } from "@/lib/types"
import Template1 from "@/components/templates/template-1"
import Template2 from "@/components/templates/template-2"
import Template3 from "@/components/templates/template-3"
import Template4 from "@/components/templates/template-4"
import Template5 from "@/components/templates/template-5"
import Template6 from "@/components/templates/template-6"
import Template7 from "@/components/templates/template-7"
import Template8 from "@/components/templates/template-8"
import Template9 from "@/components/templates/template-9"
import Template10 from "@/components/templates/template-10"

interface CoverPreviewProps {
  userData: UserData
  template: Template
  palette: ColorPalette
  platform: Platform
}

const CoverPreview = forwardRef<HTMLDivElement, CoverPreviewProps>(({ userData, template, palette, platform }, ref) => {
  // Map template ID to component
  const templateComponents = {
    "template-1": Template1,
    "template-2": Template2,
    "template-3": Template3,
    "template-4": Template4,
    "template-5": Template5,
    "template-6": Template6,
    "template-7": Template7,
    "template-8": Template8,
    "template-9": Template9,
    "template-10": Template10,
  }

  const TemplateComponent = templateComponents[template.id as keyof typeof templateComponents]
  const aspectRatio = `${platform.width}/${platform.height}`

  return (
    <div className="w-full" style={{ aspectRatio: aspectRatio }}>
      <div id="cover-preview" ref={ref} className="w-full h-full">
        <TemplateComponent userData={userData} palette={palette} />
      </div>
    </div>
  )
})

CoverPreview.displayName = "CoverPreview"

export default CoverPreview

