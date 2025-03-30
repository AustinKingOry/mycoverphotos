import { useState } from "react"
import { Menu, X} from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "./ThemeToggle"
import { favicon } from "@/assets"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // const navItems = []

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center text-white overflow-hidden">
            <img src={favicon} alt="MyCoverPhotos' logo" className="h-10 w-10" />
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-white">MyCoverPhotos</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {/* {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 py-2 flex flex-col">
          </div>
        </div>
      )} */}
    </header>
  )
}

