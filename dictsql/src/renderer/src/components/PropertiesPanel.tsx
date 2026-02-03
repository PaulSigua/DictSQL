import { TableDefinition } from '../../../shared/dto/database.dto'
import { JSX } from 'react'
import { X, Table2, Key } from 'lucide-react'
interface PropertiesPanelProps {
  table: TableDefinition | null
  onClose: () => void
  onUpdateTableComment: (tableName: string, comment: string) => void
  onUpdateColumnComment: (tableName: string, columnName: string, comment: string) => void
}
export function PropertiesPanel({
  table,
  onClose,
  onUpdateTableComment,
  onUpdateColumnComment
}: PropertiesPanelProps): JSX.Element | null {
  if (!table) return null
  return (
    <div className="w-[350px] h-full bg-surface border-l border-border p-5 overflow-y-auto text-textPrimary flex flex-col gap-5 animate-slide-in-right">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-textPrimary flex items-center gap-2">
          <Table2 size={20} className="text-primary" />
          Propiedades
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-textMuted hover:text-textPrimary hover:bg-surfaceHighlight transition-colors"
          title="Cerrar panel"
        >
          <X size={18} />
        </button>
      </div>
      {/* Table Info */}
      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-1.5">
            Tabla
          </label>
          <div className="text-lg font-bold text-primary mb-3 font-mono">{table.name}</div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-textMuted uppercase tracking-wider mb-1.5">
            Descripción
          </label>
          <textarea
            rows={4}
            className="w-full bg-surfaceHighlight border border-border text-textPrimary p-3 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none placeholder-textMuted"
            placeholder="Describe para qué sirve esta tabla..."
            value={table.comment || ''}
            onChange={(e) => onUpdateTableComment(table.name, e.target.value)}
          />
        </div>
      </div>
      {/* Divider */}
      <hr className="border-border" />
      {/* Columns Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-textPrimary uppercase tracking-wide flex items-center gap-2">
          <span>Columnas</span>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
            {table.columns.length}
          </span>
        </h3>
        <div className="flex flex-col gap-3">
          {table.columns.map((col) => (
            <div
              key={col.name}
              className="bg-surfaceHighlight border border-border p-3 rounded-lg hover:border-primary/50 transition-all"
            >
              {/* Column Header */}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-textPrimary">{col.name}</span>
                <span className="text-xs text-textMuted font-mono bg-background px-2 py-0.5 rounded">
                  {col.type}
                </span>
                {col.isPrimaryKey && <Key size={14} className="text-warning" title="Primary Key" />}
              </div>
              {/* Column Comment Input */}
              <input
                type="text"
                className="w-full bg-background border border-border text-textPrimary px-2.5 py-1.5 rounded text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-textMuted"
                placeholder="Documentar columna..."
                value={col.comment || ''}
                onChange={(e) => onUpdateColumnComment(table.name, col.name, e.target.value)}
              />
              {/* Column Metadata */}
              <div className="flex gap-2 mt-2 text-xs">
                {col.isNullable ? (
                  <span className="text-textMuted">Nullable</span>
                ) : (
                  <span className="text-error font-semibold">NOT NULL</span>
                )}
                {col.defaultValue && (
                  <span className="text-textMuted">
                    Default: <code className="bg-background px-1 rounded">{col.defaultValue}</code>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
