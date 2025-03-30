import { favicon } from "@/assets"

export default function Footer() {
  const navItems = [
    { name: "Resume Builder", href: "https://open-resume-builder.vercel.app/" },
    { name: "Meta Data Tester", href: "https://metatester.vercel.app/" },
  ]

  return (
    <footer className="py-12 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-green-500 flex items-center justify-center text-white overflow-hidden">
              <img src={favicon} alt="MyCoverPhotos' logo" className="h-10 w-10" />
            </div>
            <span className="font-bold text-xl">MyCoverPhotos</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-slate-300 hover:text-blue-400 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} MyCoverPhotos. All rights reserved.</p>
          <p className="mt-2">Designed and built with ❤️</p>
        </div>
      </div>
    </footer>
  )
}

