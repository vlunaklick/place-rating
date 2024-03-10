'use client'

import { useTheme } from "next-themes"
import { Button, buttonVariants } from "./ui/button"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export const ThemeToggler = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
      className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:white hover:bg-neutral-100 hover:dark:bg-neutral-800 hover:text-neutral-100 neutral:hover:text-neutral-100 transition-all ease-out')}
    >
      <div className="w-5 h-5 rounded-full bg-black dark:bg-white" />
    </button>
  )
}