interface TopBarProps {
  onSave: () => void;
  onOpen: () => void;
  onNew: () => void; // Para resetear y volver al inicio
  projectName?: string;
}

export function TopBar({ onSave, onOpen, onNew, projectName }: TopBarProps) {
  const btnStyle = {
    background: '#333',
    border: '1px solid #555',
    color: 'white',
    padding: '5px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem'
  };

  return (
    <div style={{
      height: '40px',
      background: '#1a1a1a',
      borderBottom: '1px solid #333',
      display: 'flex',
      alignItems: 'center',
      padding: '0 15px',
      gap: '10px'
    }}>
      <div style={{ fontWeight: 'bold', color: '#007bff', marginRight: '10px' }}>
        DictSQL
      </div>
      
      <button style={btnStyle} onClick={onNew}>Nuevo / Conectar</button>
      <button style={btnStyle} onClick={onOpen}>Abrir Archivo</button>
      <button style={btnStyle} onClick={onSave}>Guardar Proyecto</button>

      {projectName && (
        <span style={{ marginLeft: 'auto', color: '#666', fontSize: '0.8rem' }}>
          {projectName}
        </span>
      )}
    </div>
  );
}