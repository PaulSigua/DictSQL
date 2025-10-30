// Define la estructura de una sola columna
export interface ColumnMetadata {
  name: string;
  type: string;
  nullable: boolean;
  primary_key: boolean;
  default: string | null;
  description?: string | null;
}

// Define la estructura de una Foreign Key
export interface ForeignKey {
  column: string[];
  references_table: string;
  references_column: string[];
}

// Define la estructura de una sola tabla (que contiene columnas y FKs)
export interface TableMetadata {
  table: string;
  description?: string | null;
  columns: ColumnMetadata[];
  foreign_keys: ForeignKey[];
}

// Esta es la interfaz COMPLETA que devuelve tu API /metadata/{id}
export interface MetadataApiResponse {
  status: 'success' | 'error';
  description?: string; // Descripción general de la base de datos
  dialect: string;
  tables_count: number;
  metadata: TableMetadata[]; // Este es el array principal de tablas
  detail?: string; // En caso de error
}