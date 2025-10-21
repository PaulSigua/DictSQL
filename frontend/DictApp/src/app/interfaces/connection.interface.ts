// Interfaz para el formulario de nueva conexión
export interface BaseConnectionInput {
  connection_name: string; // Es buena práctica darle un nombre amigable
  type: 'postgresql' | 'mysql' | 'sqlserver' | 'oracle'; // Tipo de BD
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string; // La contraseña puede ser opcional si se usan otros métodos
}

// Interfaz para la respuesta del endpoint /connect
export interface ConnectionTestResponse {
  status: 'success' | 'error';
  detail: string;
  id: string; // El ID de la conexión guardada
  schema: {
    tables: string[];
    views: string[];
    // ...cualquier otra info de esquema que devuelva test_connection_and_schema
  };
}

// Interfaz para la respuesta del endpoint /metadata
export interface MetadataResponse {
  status: 'success' | 'error';
  detail?: string;
  data?: any; // Aquí iría la estructura de tu metadata enriquecida
}