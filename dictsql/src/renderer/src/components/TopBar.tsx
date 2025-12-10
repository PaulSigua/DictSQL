import { Logo } from "./dicsql-info/Logo";
import { Search } from "lucide-react";

interface TopBarProps {
  onSave: () => void;
  onOpen: () => void;
  onNew: () => void;
  onExportMarkdown: () => void;
  onExportHtml: () => void;
  onExportPdf: () => void;
  onSearch: (term: string) => void;
  projectName?: string;
}

export function TopBar({ 
  onSave, onOpen, onNew, 
  onExportMarkdown, onExportHtml, onExportPdf, 
  onSearch, projectName 
}: TopBarProps) {
  
  const btnBase = "bg-red px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2";
  const btnSecondary = `${btnBase} bg-surface hover:bg-slate-700 text-gray-300 border border-border hover:border-slate-500`;
  const btnIcon = "p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 transition-colors";

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
        <button className={btnSecondary} onClick={onNew}>Nuevo</button>
        <button className={btnSecondary} onClick={onOpen}>Abrir</button>
        <button className={btnSecondary} onClick={onSave}>Guardar</button>
      </div>

      <div className="w-px h-6 bg-border mx-2"></div>
      
      <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border">
        <span className="text-xs text-gray-500 px-2 font-semibold uppercase tracking-wider">Exportar</span>
        <button className={btnIcon} onClick={onExportMarkdown} title="Exportar a Markdown">MD</button>
        <button className={btnIcon} onClick={onExportHtml} title="Exportar a HTML">WEB</button>
        <button className={btnIcon} onClick={onExportPdf} title="Exportar a PDF">PDF</button>
      </div>

      {projectName && (
        <div className="ml-4 flex flex-col items-end">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Proyecto</span>
          <span className="text-xs text-blue-400 font-mono truncate max-w-[150px]" title={projectName}>
            {projectName.split(/[\\/]/).pop()}
          </span>
        </div>
      )}
    </div>
  );
}