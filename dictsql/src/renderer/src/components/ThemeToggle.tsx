import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { JSX } from 'react'
export function ThemeToggle(): JSX.Element {
  const { theme, setTheme } = useTheme()
  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Claro' },
    { value: 'dark' as const, icon: Moon, label: 'Oscuro' },
    { value: 'system' as const, icon: Monitor, label: 'Sistema' }
  ]
  return (
    <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200
            ${
              theme === value
                ? 'bg-primary text-white shadow-sm'
                : 'text-textMuted hover:text-textPrimary hover:bg-surfaceHighlight'
            }
          `}
          title={label}
        >
          <Icon size={16} />
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  )
}
