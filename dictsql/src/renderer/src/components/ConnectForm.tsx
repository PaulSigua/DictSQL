import { useState } from 'react';
import { DbConnectionConfig, TableDefinition } from '../../../shared/types';

interface ConnectFormProps {
  onSuccess?: (tables: TableDefinition[]) => void;
}

export function ConnectForm({ onSuccess }: ConnectFormProps) {
  // Estado para los inputs del formulario
  const [formData, setFormData] = useState<DbConnectionConfig>({
    type: 'postgres', // Default
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '',
    database: 'postgres',
  });

  // Estado para manejar la respuesta
  const [status, setStatus] = useState<string>('');
  const [tables, setTables] = useState<TableDefinition[]>([]);

  // Handler genérico para inputs de texto
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'port' ? parseInt(e.target.value) : e.target.value
    });
  };

  // Handler específico para el SELECT (Cambia el puerto por defecto)
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as any;
    let defaultPort = 5432;
    
    if (newType === 'mysql') defaultPort = 3306;
    if (newType === 'mssql') defaultPort = 1433;
    
    // Mantenemos el resto de la data, pero actualizamos tipo y puerto
    setFormData({ ...formData, type: newType, port: defaultPort });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    
    // Validación básica para SQLite
    if (formData.type === 'sqlite' && !formData.database) {
      setStatus('Error: Debes seleccionar un archivo .db o .sqlite');
      return;
    }

    setStatus('Conectando...');
    setTables([]);

    try {
      // LLAMADA AL BACKEND (IPC)
      const response = await window.api.connectDb(formData);

      if (response.success && response.data) {
        setStatus(`¡Éxito! Se encontraron ${response.data.length} tablas.`);
        if (onSuccess) onSuccess(response.data);
        setTables(response.data);
      } else {
        setStatus(`Error: ${response.error}`);
      }
    } catch (err) {
      setStatus('Error crítico al intentar conectar.');
      console.error(err);
    }
  };

  // Función auxiliar para pedir el archivo (sin enviar el formulario)
  const handleFileSelect = async () => {
    const path = await window.api.selectDatabaseFile();
    if (path) {
      setFormData({ ...formData, database: path });
    }
  };

  // Helper para el texto del botón
  const getButtonText = () => {
    switch(formData.type) {
      case 'sqlite': return 'Abrir Archivo SQLite';
      case 'mysql': return 'Conectar a MySQL';
      case 'mssql': return 'Conectar a SQL Server';
      default: return 'Conectar a PostgreSQL';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Conectar a Base de Datos</h2>
      
      {/* 1. EL FORM WRAPPER EMPIEZA AQUÍ */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <label>
          Tipo de Base de Datos:
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleTypeChange} // <--- Usamos el nuevo handler inteligente
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="postgres">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mssql">SQL Server</option>
            <option value="sqlite">SQLite</option>
          </select>
        </label>

        {/* 2. CONTENIDO DINÁMICO DENTRO DEL FORM */}
        {formData.type === 'sqlite' ? (
          /* FORMULARIO SQLITE (Solo archivo) */
          <div style={{ border: '1px dashed #555', padding: '15px', borderRadius: '5px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Archivo de Base de Datos:</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              <input 
                type="text" 
                value={formData.database} 
                readOnly 
                placeholder="Selecciona un archivo..."
                style={{ flex: 1, padding: '5px', background: '#333', color: '#fff', border: '1px solid #555' }} 
              />
              <button 
                type="button" 
                onClick={handleFileSelect}
                style={{ cursor: 'pointer', padding: '5px 10px' }}
              >
                📂 Buscar
              </button>
            </div>
            <p style={{ fontSize: '0.8em', color: '#aaa', marginTop: '5px' }}>
              Formatos soportados: .db, .sqlite, .sqlite3
            </p>
          </div>
        ) : (
          /* FORMULARIO ESTÁNDAR (Postgres, MySQL, SQL Server) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label>
              Host:
              <input type="text" name="host" value={formData.host} onChange={handleChange} style={{ marginLeft: '10px' }} />
            </label>
            
            <label>
              Port:
              <input type="number" name="port" value={formData.port} onChange={handleChange} style={{ marginLeft: '10px' }} />
            </label>
            
            <label>
              User:
              <input type="text" name="user" value={formData.user} onChange={handleChange} style={{ marginLeft: '10px' }} />
            </label>
            
            <label>
              Password:
              <input type="password" name="password" value={formData.password} onChange={handleChange} style={{ marginLeft: '10px' }} />
            </label>
            
            <label>
              Database Name:
              <input type="text" name="database" value={formData.database} onChange={handleChange} style={{ marginLeft: '10px' }} />
            </label>
          </div>
        )}

        {/* 3. BOTÓN SUBMIT DENTRO DEL FORM */}
        <button 
          type="submit" 
          style={{ 
            padding: '12px', 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer',
            borderRadius: '4px',
            fontSize: '1rem',
            marginTop: '10px'
          }}
        >
          {getButtonText()}
        </button>

      </form>
      {/* FIN DEL FORM */}

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #333', background: '#222', minHeight: '40px' }}>
        <strong>Estado:</strong> {status}
      </div>

      {/* Visualización rápida de los resultados */}
      {tables.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Tablas Encontradas:</h3>
          <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {tables.map((t) => (
              <li key={t.name}>
                <strong>{t.name}</strong> ({t.columns.length} columnas)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}