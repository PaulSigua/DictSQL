interface TopBarProps {
  onSave: () => void;
  onOpen: () => void;
  onNew: () => void;
  onExport: () => void;
  onSearch: (term: string) => void;
  projectName?: string;
}

export function TopBar({ onSave, onOpen, onNew, onExport, onSearch, projectName }: TopBarProps) {
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
      
      <input 
        type="text" 
        placeholder="🔍 Buscar tabla..." 
        onChange={(e) => onSearch(e.target.value)}
        style={{
          background: '#252526',
          border: '1px solid #555',
          color: '#eee',
          padding: '4px 8px',
          borderRadius: '4px',
          marginRight: '15px',
          width: '200px'
        }}
      />

      <button style={btnStyle} onClick={onNew}>Nuevo</button>
      <button style={btnStyle} onClick={onOpen}>Abrir</button>
      <button style={btnStyle} onClick={onSave}>Guardar</button>

      <div style={{ width: '1px', height: '20px', background: '#555', margin: '0 5px' }}></div>
      
      <button style={{...btnStyle, background: '#2e7d32'}} onClick={onExport}>
        Exportar MD
      </button>

      {projectName && (
        <span style={{ marginLeft: 'auto', color: '#666', fontSize: '0.8rem' }}>
          {projectName}
        </span>
      )}
    </div>
  );
}