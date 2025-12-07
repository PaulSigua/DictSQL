interface TopBarProps {
  onSave: () => void;
  onOpen: () => void;
  onNew: () => void;
  // Cambiamos onExport simple por 3 funciones específicas
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
  
  const btnClass = "bg-surface border border-border hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors cursor-pointer";
  // botones de exportacion
  const exportBtnClass = "bg-surface border border-green-800 text-green-400 hover:bg-green-900 px-2 py-1 rounded text-xs transition-colors cursor-pointer ml-1";

  return (
    <div className="h-10 bg-background border-b border-border flex items-center px-4 gap-2 select-none">
      
      <div className="font-bold text-blue-500 mr-2 flex items-center gap-2">
        <span>🗄️</span> DictSQL
      </div>
      
      <div className="relative">
        <input 
          type="text" 
          placeholder="🔍 Buscar..." 
          onChange={(e) => onSearch(e.target.value)}
          className="bg-surface border border-border text-gray-200 text-sm rounded px-2 py-1 w-40 focus:outline-none focus:border-blue-500 transition-all"
        />
      </div>

      <div className="flex-1"></div>

      <button className={btnClass} onClick={onNew}>Nuevo</button>
      <button className={btnClass} onClick={onOpen}>Abrir</button>
      <button className={btnClass} onClick={onSave}>Guardar</button>

      <div className="w-px h-5 bg-border mx-2"></div>
      
      <div className="flex items-center">
        <span className="text-xs text-gray-500 mr-2">Exportar:</span>
        <button className={exportBtnClass} onClick={onExportMarkdown} title="Markdown">MD</button>
        <button className={exportBtnClass} onClick={onExportHtml} title="HTML Web">HTML</button>
        <button className={exportBtnClass} onClick={onExportPdf} title="PDF Document">PDF</button>
      </div>

      {projectName && (
        <span className="ml-4 text-xs text-gray-500 truncate max-w-[150px]" title={projectName}>
          {projectName}
        </span>
      )}
    </div>
  );
}