import { TableDefinition, ColumnDefinition } from '../../../shared/types';

interface PropertiesPanelProps {
  table: TableDefinition | null;
  onClose: () => void;
  onUpdateTableComment: (tableName: string, comment: string) => void;
  onUpdateColumnComment: (tableName: string, columnName: string, comment: string) => void;
}

export function PropertiesPanel({ table, onClose, onUpdateTableComment, onUpdateColumnComment }: PropertiesPanelProps) {
  if (!table) return null;

  return (
    <div style={{
      width: '350px',
      height: '100%',
      background: '#252526', // Color estilo VS Code
      borderLeft: '1px solid #333',
      padding: '20px',
      overflowY: 'auto',
      color: '#eee',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Propiedades</h2>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer' }}>✖</button>
      </div>

      {/* Info de la Tabla */}
      <div>
        <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.8rem' }}>TABLA</label>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>{table.name}</div>
        
        <label style={{ display: 'block', color: '#888', marginBottom: '5px', fontSize: '0.8rem' }}>DESCRIPCIÓN</label>
        <textarea
          rows={4}
          style={{ width: '100%', background: '#333', border: '1px solid #444', color: 'white', padding: '8px', borderRadius: '4px' }}
          placeholder="Describe para qué sirve esta tabla..."
          value={table.comment || ''}
          onChange={(e) => onUpdateTableComment(table.name, e.target.value)}
        />
      </div>

      <hr style={{ borderColor: '#333', width: '100%' }} />

      {/* Lista de Columnas */}
      <div>
        <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Columnas ({table.columns.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {table.columns.map((col) => (
            <div key={col.name} style={{ background: '#2d2d2d', padding: '10px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>{col.name}</span>
                <span style={{ fontSize: '0.8rem', color: '#aaa', fontFamily: 'monospace' }}>{col.type}</span>
                {col.isPrimaryKey && <span title="Primary Key">🔑</span>}
              </div>
              
              <input
                type="text"
                style={{ width: '100%', background: '#3c3c3c', border: 'none', color: '#ccc', padding: '5px', borderRadius: '3px', fontSize: '0.9rem' }}
                placeholder="Documentar columna..."
                value={col.comment || ''}
                onChange={(e) => onUpdateColumnComment(table.name, col.name, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}