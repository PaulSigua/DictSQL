import { Handle, Position, NodeProps } from '@xyflow/react';
import { TableDefinition } from '../../../../shared/types';

// Definimos qué datos recibe este nodo
type TableNodeData = {
  tableData: TableDefinition;
};

export function TableNode({ data }: NodeProps<TableNodeData>) {
  const { tableData } = data;

  return (
    <div className="table-node" style={{ 
      border: '1px solid #777', 
      borderRadius: '5px', 
      background: '#1e1e1e', // Fondo oscuro
      color: '#fff',
      minWidth: '200px',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      {/* Header de la Tabla */}
      <div style={{ 
        padding: '8px', 
        background: '#333', 
        borderBottom: '1px solid #777',
        fontWeight: 'bold',
        textAlign: 'center' 
      }}>
        {tableData.name}
      </div>

      {/* Lista de Columnas */}
      <div style={{ padding: '8px' }}>
        {tableData.columns.map((col) => (
          <div key={col.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontWeight: col.isPrimaryKey ? 'bold' : 'normal', color: col.isPrimaryKey ? '#ffcc00' : '#eee' }}>
              {col.name} {col.isPrimaryKey && '🔑'}
            </span>
            <span style={{ color: '#aaa' }}>{col.type}</span>
          </div>
        ))}
      </div>

      {/* Puntos de conexión (Handles) */}
      {/* Target: Donde entran las líneas */}
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      {/* Source: De donde salen las líneas */}
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
    </div>
  );
}