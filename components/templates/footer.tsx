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
  {
    label: 'Light',
    id: 'light',
    icon: <SunIcon className="h-4 w-4" />,
  },
  {
    label: 'Dark',
    id: 'dark',
    icon: <MoonIcon className="h-4 w-4" />,
  },
  {
    label: 'System',
    id: 'system',
    icon: <MonitorIcon className="h-4 w-4" />,
  },
]

/* -------------------------------------------------------------------------- */
/* Theme Switch                                                               */
/* -------------------------------------------------------------------------- */

function ThemeSwitch(): React.JSX.Element | null {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleThemeChange = (id: string | null) => {
    if (!id) return
    if (id === 'light' || id === 'dark' || id === 'system') {
      setTheme(id)
    }
  }

  return (
    <AnimatedBackground
      className="pointer-events-none rounded-lg bg-zinc-100 dark:bg-zinc-800"
      defaultValue={theme}
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.2,
      }}
      enableHover={false}
      onValueChange={handleThemeChange}
    >
      {THEMES_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-label={`Switch to ${option.label} theme`}
          data-id={option.id}
          className="inline-flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-zinc-950 dark:text-zinc-400 dark:data-[checked=true]:text-zinc-50"
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
    <footer className="mt-7 px-0 py-4 ">
      <div className="flex items-center justify-between">
        <Link href="/" target="_blank" rel="noreferrer">
          <TextLoop className="text-sm ml-25 font-sans text-zinc-500">
            <span>Built with Nextjs and Motion-Primitives.</span>
            <span>© 2025 Rohithreacts.dev All rights reserved.</span>
          </TextLoop>
        </Link>

        <div className="text-xs text-zinc-400 mr-25">
          <ThemeSwitch />
        </div>
      </div>
    </footer>
  )
}
