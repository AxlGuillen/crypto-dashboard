"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return (
      <div className="h-9 w-16 rounded-full bg-muted" />
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex h-9 w-16 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isDark ? "bg-slate-700" : "bg-amber-100"
      )}
      aria-label={`Cambiar a modo ${isDark ? "claro" : "oscuro"}`}
    >
      {/* Background icons */}
      <Sun
        className={cn(
          "absolute left-1.5 h-4 w-4 text-amber-500 transition-opacity duration-300",
          isDark ? "opacity-50" : "opacity-100"
        )}
      />
      <Moon
        className={cn(
          "absolute right-1.5 h-4 w-4 text-slate-300 transition-opacity duration-300",
          isDark ? "opacity-100" : "opacity-50"
        )}
      />

      {/* Toggle circle */}
      <span
        className={cn(
          "absolute flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-all duration-300",
          isDark
            ? "translate-x-8 bg-slate-900"
            : "translate-x-1 bg-white"
        )}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-slate-300" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" />
        )}
      </span>
    </button>
  )
}
