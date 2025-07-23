'use client'
import { useContext, useMemo } from 'react'
import { TotalContext, TotalContextProps } from '../globalContext'

export const useGravityThemeClass = (): string => {
  const { selectedTheme } = useContext(TotalContext) as TotalContextProps;

  return useMemo(() => {
    switch (selectedTheme) {
      case 'dark':
        return 'g-root_theme_dark'
      case 'dark-hc':
        return 'g-root_theme_dark-hc'
      case 'light-hc':
        return 'g-root_theme_light-hc'
      default:
        return 'g-root_theme_light'
    }
  }, [selectedTheme])
}
