import { Logo } from '../components/Logo/Logo'
import { Search } from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle'
import { JSX } from 'react'

interface TopBarProps {
  onSave: () => void
  onOpen: () => void
  onNew: () => void
  onExportMarkdown: () => void
  onExportHtml: () => void
  onExportPdf: () => void
  onSearch: (term: string) => void
  projectName?: string
}

export function TopBar({
  onSave,
  onOpen,
  onNew,
  onExportMarkdown,
  onExportHtml,
  onExportPdf,
  onSearch,
  projectName
}: TopBarProps): JSX.Element {
  return (
    <div className="h-14 bg-background/95 backdrop-blur border-b border-border flex items-center px-4 gap-4 select-none shadow-sm">
      <div className="flex items-center gap-2 text-primary font-bold text-lg tracking-tight mr-2">
        <Logo size="sm" />
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-500 pr-1" />
        </div>
        <input
          type="text"
          placeholder="Buscar tablas..."
          onChange={(e) => onSearch(e.target.value)}
          className="bg-surface text-sm text-gray-200 rounded-full pl-9 pr-4 py-1.5 w-64 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-500"
        />
      </div>

      <div className="flex-1"></div>

      <div className="flex items-center gap-2">
        <button className="btn-secondary" onClick={onNew}>
          Nuevo
        </button>
        <button className="btn-secondary" onClick={onOpen}>
          Abrir
        </button>
        <button className="btn-secondary" onClick={onSave}>
          Guardar
        </button>
      </div>

      <div className="w-px h-6 bg-border mx-2"></div>

      <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border">
        <span className="text-xs text-gray-500 px-2 font-semibold uppercase tracking-wider">
          Exportar
        </span>
        <button className="btn-icon" onClick={onExportMarkdown} title="Exportar a Markdown">
          MD
        </button>
        <button className="btn-icon" onClick={onExportHtml} title="Exportar a HTML">
          WEB
        </button>
        <button className="btn-icon" onClick={onExportPdf} title="Exportar a PDF">
          PDF
        </button>
      </div>

      {projectName && (
        <div className="ml-4 flex flex-col items-end">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Proyecto</span>
          <span
            className="text-xs text-blue-400 font-mono truncate max-w-[150px]"
            title={projectName}
          >
            {projectName.split(/[\\/]/).pop()}
          </span>
        </div>
      )}
      <ThemeToggle />
    </div>
  )
}
