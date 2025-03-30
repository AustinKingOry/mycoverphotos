export interface UserData {
  headline: string
  subheadline: string
  company: string
  profileImage: string
  name?: string
}

export interface Template {
  id: string
  name: string
  previewBg?: string
}

export interface ColorPalette {
  id: string
  name: string
  colors: string[] // [primary, secondary, accent, background, text]
}

export interface Platform {
  id: string
  name: string
  width: number
  height: number
  description: string
}

