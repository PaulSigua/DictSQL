import { Handle, Position, NodeProps } from '@xyflow/react'
import { TableDefinition } from '../../../../shared/dto/database.dto'
import { Table2, Key } from 'lucide-react'
import { memo } from 'react'

// Definimos qué datos recibe este nodo
interface TableNodeData {
  tableData: TableDefinition
}

export const TableNode = memo(({ data }: NodeProps<TableNodeData>) => {
  const { tableData } = data

  return (
    <div className="table-node min-w-[220px] rounded-lg shadow-lg border-2 border-border bg-surface overflow-hidden transition-all hover:shadow-xl hover:border-primary/50">
      {/* Header de la Tabla */}
      <div className="px-3 py-2 bg-primary/10 border-b-2 border-primary/30 flex items-center gap-2">
        <Table2 size={16} className="text-primary" />
        <span className="font-bold text-sm text-textPrimary font-mono">{tableData.name}</span>
      </div>

      {/* Lista de Columnas */}
      <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
        {tableData.columns.map((col) => (
          <div
            key={col.name}
            className="flex items-center justify-between px-2 py-1 rounded hover:bg-surfaceHighlight transition-colors text-xs"
          >
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {col.isPrimaryKey && <Key size={12} className="text-warning flex-shrink-0" />}
              <span
                className={`font-mono truncate ${
                  col.isPrimaryKey ? 'font-bold text-primary' : 'text-textPrimary'
                }`}
                title={col.name}
              >
                {col.name}
              </span>
            </div>
            <span className="text-textMuted font-mono text-[10px] ml-2 flex-shrink-0">
              {col.type}
            </span>
          </div>
        ))}
      </div>

      {/* Puntos de conexión (Handles) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-primary bg-surface"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-primary bg-surface"
      />
    </div>
  )
})

TableNode.displayName = 'TableNode'
