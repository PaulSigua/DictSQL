import { useState } from 'react';
import { ConnectForm } from './components/ConnectForm';
import { DiagramView } from './components/DiagramView';
import { TableDefinition } from '../../shared/types';

function App(): React.JSX.Element {
  const [tables, setTables] = useState<TableDefinition[]>([]);

  const handleConnectSuccess = (data: TableDefinition[]) => {
    setTables(data);
  };

  return (
    <div className="app-container" style={{ width: '100vw', height: '100vh' }}>
      {tables.length === 0 ? (
        // Si no hay tablas, mostramos el formulario
        // (Nota: Tendrás que pasarle el prop 'onSuccess' a ConnectForm, ver abajo)
        <ConnectForm onSuccess={handleConnectSuccess} />
      ) : (
        // Si hay tablas, mostramos el diagrama
        <DiagramView tables={tables} />
      )}
    </div>
  );
}

// Pequeño wrapper o modificación necesaria en ConnectForm
// Para no complicarte editando todo el archivo anterior, puedes modificar 
// ConnectForm.tsx para que acepte una prop: onSuccess: (tables: TableDefinition[]) => void
// Y llamarla cuando response.success es true.

// OJO: Para probar rápido, podemos editar ConnectForm.tsx ahora mismo.
export default App;