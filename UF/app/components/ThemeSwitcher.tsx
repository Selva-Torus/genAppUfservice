'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@gravity-ui/uikit'

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <Button size='l'  onClick={() => setTheme('light')}>
        Light
      </Button>
      <Button size='l'  onClick={() => setTheme('dark')}>
        Dark
      </Button>
      <Button size='l'  onClick={() => setTheme('modern')}>
        Modern
      </Button>
    </>
  )
}
