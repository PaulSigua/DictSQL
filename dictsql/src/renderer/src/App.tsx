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
  const [searchTerm, setSearchTerm] = useState<string>('');

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

const handleExportMarkdown = async () => {
    if (tables.length === 0) return alert("Sin datos");
    const result = await window.api.exportMarkdown(tables);
    if (result.success) alert(`Guardado en: ${result.filePath}`);
    else if (result.error) alert(`Error: ${result.error}`);
  };

  const handleExportHtml = async () => {
    if (tables.length === 0) return alert("Sin datos");
    const result = await window.api.exportHtml(tables);
    if (result.success) alert(`Guardado en: ${result.filePath}`);
    else if (result.error) alert(`Error: ${result.error}`);
  };

  const handleExportPdf = async () => {
    if (tables.length === 0) return alert("Sin datos");
    // Aviso de "Cargando" porque el PDF puede tardar 1 o 2 segundos
    const toastId = setTimeout(() => alert("Generando PDF... por favor espera"), 500); // Simple feedback
    
    const result = await window.api.exportPdf(tables);
    clearTimeout(toastId); // Limpiamos si fue muy rápido
    
    if (result.success) alert(`PDF generado en: ${result.filePath}`);
    else if (result.error) alert(`Error: ${result.error}`);
  };
  
  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
return (
    <div className="app-container" style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#1a1a1a', color: '#fff' }}>
      
      <TopBar 
        onSave={handleSave} 
        onOpen={handleOpen} 
        onNew={handleNew}
        onExportMarkdown={handleExportMarkdown}
        onExportHtml={handleExportHtml}
        onExportPdf={handleExportPdf}
        onSearch={setSearchTerm}
        projectName={currentFilePath}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          {tables.length === 0 ? (
            <ConnectForm onSuccess={handleConnectSuccess} />
          ) : (
            <DiagramView 
              tables={filteredTables} // lista filtrada
              onNodeClick={handleNodeClick} 
            />
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