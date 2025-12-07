import { useState } from 'react';
import { ConnectForm } from './components/ConnectForm';
import { DiagramView } from './components/DiagramView';
import { PropertiesPanel } from './components/PropertiesPanel';
import { TopBar } from './components/TopBar'; // <-- Importar
import { TableDefinition } from '../../shared/types';

function App(): React.JSX.Element {
  const [tables, setTables] = useState<TableDefinition[]>([]);
  const [selectedTableName, setSelectedTableName] = useState<string | null>(null);
  const [currentFilePath, setCurrentFilePath] = useState<string | undefined>(undefined);

  // --- Lógica de Archivos ---

  const handleSave = async () => {
    if (tables.length === 0) return alert("No hay nada que guardar");
    
    // Convertimos el estado actual a string
    const content = JSON.stringify({ tables }, null, 2);
    
    const result = await window.api.saveProject(content);
    if (result.success && result.filePath) {
      setCurrentFilePath(result.filePath);
      alert("Proyecto guardado correctamente");
    }
  };

  const handleOpen = async () => {
    const result = await window.api.openProject();
    if (result.success && result.data) {
      // Cargamos los datos del archivo en el estado
      // Aquí asumimos que el archivo tiene la estructura { tables: [...] }
      setTables(result.data.tables);
      setCurrentFilePath(result.filePath);
      setSelectedTableName(null); // Limpiamos selección
    }
  };

  const handleNew = () => {
    if (confirm("¿Estás seguro? Se perderán los cambios no guardados.")) {
      setTables([]);
      setCurrentFilePath(undefined);
      setSelectedTableName(null);
    }
  };

  // ... (funciones handleNodeClick, updates existentes sin cambios)
  const handleConnectSuccess = (data: TableDefinition[]) => setTables(data);
  const handleNodeClick = (_e: any, node: any) => setSelectedTableName(node.id);
  
  // Copia tus funciones updateTableComment y updateColumnComment aquí...
  const updateTableComment = (tableName: string, comment: string) => {
      setTables(prev => prev.map(t => t.name === tableName ? { ...t, comment } : t));
  };
  const updateColumnComment = (tableName: string, colName: string, comment: string) => {
      setTables(prev => prev.map(table => {
        if (table.name !== tableName) return table;
        const updatedColumns = table.columns.map(col => col.name === colName ? { ...col, comment } : col);
        return { ...table, columns: updatedColumns };
      }));
  };
  const selectedTable = tables.find(t => t.name === selectedTableName) || null;

  return (
    <div className="app-container" style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. BARRA SUPERIOR */}
      <TopBar 
        onSave={handleSave} 
        onOpen={handleOpen} 
        onNew={handleNew}
        projectName={currentFilePath}
      />

      {/* 2. AREA DE TRABAJO */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          {tables.length === 0 ? (
            <ConnectForm onSuccess={handleConnectSuccess} />
          ) : (
            <DiagramView tables={tables} onNodeClick={handleNodeClick} />
          )}
        </div>

        {selectedTable && (
          <PropertiesPanel 
            table={selectedTable}
            onClose={() => setSelectedTableName(null)}
            onUpdateTableComment={updateTableComment}
            onUpdateColumnComment={updateColumnComment}
          />
        )}
      </div>
    </div>
  );
}

export default App;