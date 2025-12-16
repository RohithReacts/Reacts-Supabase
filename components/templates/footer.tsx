'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'

import { AnimatedBackground } from '../../components/motion-primitives/animated-background'
import { TextLoop } from '../../components/motion-primitives/text-loop'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type ThemeId = 'light' | 'dark' | 'system'

interface ThemeOption {
  label: string
  id: ThemeId
  icon: React.ReactNode
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const THEMES_OPTIONS: ThemeOption[] = [
  { label: 'Light', id: 'light', icon: <SunIcon className="h-4 w-4" /> },
  { label: 'Dark', id: 'dark', icon: <MoonIcon className="h-4 w-4" /> },
  { label: 'System', id: 'system', icon: <MonitorIcon className="h-4 w-4" /> },
]

/* -------------------------------------------------------------------------- */
/* Theme Switch                                                               */
/* -------------------------------------------------------------------------- */

function ThemeSwitch(): React.JSX.Element | null {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <AnimatedBackground
      className="pointer-events-none rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800"
      defaultValue={theme}
      transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
      enableHover={false}
      onValueChange={(id) => setTheme(id as ThemeId)}
    >
      {THEMES_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-label={`Switch to ${option.label} theme`}
          data-id={option.id}
          className="
            inline-flex h-8 w-8 items-center justify-center
            rounded-md text-zinc-500 transition
            data-[checked=true]:text-zinc-950
            dark:text-zinc-400 dark:data-[checked=true]:text-zinc-50
          "
        >
          {option.icon}
        </button>
      ))}
    </AnimatedBackground>
  )
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export function Footer(): React.JSX.Element {
  return (
    <footer className="mt-8 border-t border-zinc-200 py-4 dark:border-zinc-900">
      <div
        className="
          container mx-auto
          flex flex-col gap-4
          px-4
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        {/* Text */}
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="text-center sm:text-left"
        >
          <TextLoop className="text-xs sm:text-sm font-sans text-zinc-500">
            <span>Built with Next.js and Motion-Primitives.</span>
            <span>© 2025 Rohithreacts.dev · All rights reserved.</span>
          </TextLoop>
        </Link>

        {/* Theme Switch */}
        <div className="flex justify-center sm:justify-end">
          <ThemeSwitch />
        </div>
      </div>
    </footer>
  )
}
