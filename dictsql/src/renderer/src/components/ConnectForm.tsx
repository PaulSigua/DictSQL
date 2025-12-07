import { useState } from 'react';
import { DbConnectionConfig, TableDefinition } from '../../../shared/types';

interface ConnectFormProps {
  onSuccess?: (tables: TableDefinition[]) => void;
}

export function ConnectForm({onSuccess }: ConnectFormProps) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'port' ? parseInt(e.target.value) : e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Conectar a Base de Datos</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Conectar e Importar Esquema
        </button>
      </form>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <strong>Estado:</strong> {status}
      </div>

      {/* Visualización rápida de los resultados */}
      {tables.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Tablas Encontradas:</h3>
          <ul>
            {tables.map((t) => (
              <li key={t.name}>
                <strong>{t.name}</strong> ({t.columns.length} columnas)
                <ul style={{ fontSize: '0.8em', color: '#666' }}>
                  {t.columns.slice(0, 3).map(c => <li key={c.name}>{c.name} ({c.type})</li>)}
                  {t.columns.length > 3 && <li>...</li>}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}