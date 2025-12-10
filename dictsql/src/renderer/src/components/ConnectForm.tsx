import { useState } from 'react';
import { Database, FileCode, Server, HardDrive, FolderOpen, ArrowRight, Loader2 } from 'lucide-react'; // Iconos nuevos
import { DbConnectionConfig, TableDefinition } from '../../../shared/types';
import { Logo } from './dicsql-info/Logo';

interface ConnectFormProps {
  onSuccess?: (tables: TableDefinition[]) => void;
}

export function ConnectForm({ onSuccess }: ConnectFormProps) {
  const [formData, setFormData] = useState<DbConnectionConfig>({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '',
    database: 'postgres',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'port' ? parseInt(e.target.value) : e.target.value
    });
    setError(null); // Limpiar error al escribir
  };

  const handleTypeChange = (type: any) => {
    let defaultPort = 5432;
    if (type === 'mysql') defaultPort = 3306;
    if (type === 'mssql') defaultPort = 1433;
    setFormData({ ...formData, type, port: defaultPort });
    setError(null);
  };

  const handleFileSelect = async () => {
    const path = await window.api.selectDatabaseFile();
    if (path) setFormData({ ...formData, database: path });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type === 'sqlite' && !formData.database) {
      setError('Selecciona un archivo .db primero');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await window.api.connectDb(formData);
      if (response.success && response.data) {
        if (onSuccess) onSuccess(response.data);
      } else {
        setError(response.error || 'Error desconocido');
      }
    } catch (err) {
      setError('Error crítico de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  // --- COMPONENTES VISUALES INTERNOS ---
  
  const TypeCard = ({ id, label, icon: Icon }: any) => (
    <div 
      onClick={() => handleTypeChange(id)}
      className={`
        cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200
        ${formData.type === id 
          ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
          : 'bg-surface border-border text-textMuted hover:bg-surfaceHighlight hover:border-gray-500'}
      `}
    >
      <Icon size={20} className="mb-2" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );

  const InputField = ({ label, name, type = "text", placeholder, className = "" }: any) => (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs font-semibold text-textMuted uppercase tracking-wider">{label}</label>
      <input
        type={type}
        name={name}
        value={(formData as any)[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-surface border border-border rounded px-3 py-2 text-sm text-textMain focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-gray-600"
      />
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      
      {/* TARJETA PRINCIPAL */}
      <div className="bg-[#111] border border-border rounded-xl shadow-2xl overflow-hidden relative">
        
        {/* Header Decorativo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mb-10 text-center">
            <Logo size="lg" showSlogan={true} />
          </div>
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Database className="text-primary" /> Conectar
            </h1>
            <p className="text-textMuted text-sm">Elige tu motor de base de datos</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* SELECTOR DE TIPO (GRID) */}
            <div className="grid grid-cols-4 gap-3">
              <TypeCard id="postgres" label="Postgres" icon={Database} />
              <TypeCard id="mysql" label="MySQL" icon={Server} />
              <TypeCard id="mssql" label="SQL Srv" icon={HardDrive} />
              <TypeCard id="sqlite" label="SQLite" icon={FileCode} />
            </div>

            {/* CAMPOS DEL FORMULARIO */}
            <div className="space-y-4 animate-slide-up">
              {formData.type === 'sqlite' ? (
                <div className="bg-surfaceHighlight/50 p-4 rounded-lg border border-border border-dashed text-center">
                  <FolderOpen size={32} className="mx-auto text-textMuted mb-2" />
                  <p className="text-sm text-textMuted mb-3">Archivo local (.db, .sqlite)</p>
                  
                  <div className="flex gap-2">
                    <input 
                      value={formData.database.split(/[\\/]/).pop() || ''} // Mostrar solo nombre archivo
                      readOnly 
                      placeholder="Ningún archivo seleccionado"
                      className="flex-1 bg-background border border-border rounded px-3 text-sm text-textMuted focus:outline-none" 
                    />
                    <button 
                      type="button" 
                      onClick={handleFileSelect}
                      className="bg-surface border border-border hover:bg-surfaceHighlight text-white px-4 py-2 rounded text-sm transition-colors"
                    >
                      Buscar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <InputField label="Host" name="host" placeholder="localhost" className="col-span-2" />
                    <InputField label="Puerto" name="port" type="number" placeholder="5432" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Usuario" name="user" placeholder="root" />
                    <InputField label="Contraseña" name="password" type="password" placeholder="••••••" />
                  </div>
                  <InputField label="Base de Datos" name="database" placeholder="nombre_db" />
                </>
              )}
            </div>

            {/* MENSAJES DE ERROR */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* BOTÓN DE ACCIÓN */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`
                w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all
                ${isLoading 
                  ? 'bg-surface border border-border text-textMuted cursor-not-allowed' 
                  : 'bg-primary hover:bg-primaryHover text-white shadow-lg shadow-blue-500/20'}
              `}
            >
              {isLoading ? (
                <><Loader2 className="animate-spin" size={16} /> Conectando...</>
              ) : (
                <>Conectar Ahora <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>
      </div>
      
      <div className="text-center mt-6 text-xs text-textMuted opacity-50">
        DictSQL v1.0.0 &bull; Secure Local Connection
      </div>
    </div>
  );
}