/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, ReactNode, JSX } from 'react'
type Theme = 'light' | 'dark' | 'system'
interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  effectiveTheme: 'light' | 'dark' // El tema real aplicado
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  // Leer tema guardado del localStorage, por defecto 'system'
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('dictsql-theme')
    return (saved as Theme) || 'system'
  })
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('dark')
  // Función para actualizar el tema
  const setTheme = (newTheme: Theme): void => {
    setThemeState(newTheme)
    localStorage.setItem('dictsql-theme', newTheme)
  }
  // Efecto para aplicar el tema
  useEffect(() => {
    const applyTheme = (): void => {
      let themeToApply: 'light' | 'dark' = 'dark'
      if (theme === 'system') {
        // Detectar preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        themeToApply = prefersDark ? 'dark' : 'light'
      } else {
        themeToApply = theme
      }
      // Aplicar clase al documento
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(themeToApply)

      // Actualizar atributo data-theme para CSS
      document.documentElement.setAttribute('data-theme', themeToApply)

      setEffectiveTheme(themeToApply)
    }
    applyTheme()
    // Escuchar cambios en la preferencia del sistema
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = (): void => applyTheme()

      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }
  }, [theme])
  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider')
  }
  return context
}
