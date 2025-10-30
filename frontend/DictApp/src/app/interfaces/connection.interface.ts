// Interfaz para el formulario de nueva conexión
export interface BaseConnectionInput {
  connection_name: string;
  type: 'postgresql' | 'mysql' | 'sqlserver' | 'oracle';
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
}

// Interfaz para la respuesta del endpoint /connect
export interface ConnectionTestResponse {
  status: 'success' | 'error';
  detail: string;
  id: string;
  schema: {
    tables: string[];
    views: string[];
  };
}

// Interfaz para la respuesta del endpoint /metadata
export interface MetadataResponse {
  status: 'success' | 'error';
  detail?: string;
  data?: any; // Aquí iría la estructura de tu metadata enriquecida
}