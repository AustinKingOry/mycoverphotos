"use client"

import type React from "react"

import { useEffect } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function Layout({ children }: { children: React.ReactNode }) {
    // const [mounted, setMounted] = useState(false)


    // Handle initial dark mode setup
    useEffect(() => {
        // Check if we should use dark mode by default
        const isDarkMode =
        localStorage.getItem("vite-ui-theme") === "dark" ||
        (!localStorage.getItem("vite-ui-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)

        if (isDarkMode) {
        document.documentElement.classList.add("dark")
        } else {
        document.documentElement.classList.remove("dark")
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Navbar />
        <main>{children}</main>
        <Footer />
        </div>
    )
}

