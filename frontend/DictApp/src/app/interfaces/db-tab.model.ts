import { BaseConnectionInput, MetadataResponse } from "./connection.interface";

export interface DbTab {
  /** * El ID único de la conexión, devuelto por la API. 
   * Se usa para todas las futuras llamadas a la API (ej. /metadata/{id}).
   */
  id: string;
  
  /** * El nombre amigable del proyecto (ej. "DB Producción"). 
   * Es lo que se muestra en la pestaña.
   */
  title: string;
  
  /** * El tipo de base de datos (ej. 'postgresql', 'sqlserver'). 
   * Usamos el tipo de BaseConnectionInput para mantener consistencia.
   */
  dbType: BaseConnectionInput['type'];
  
  /** El estado de la pestaña (activa o inactiva). */
  active: boolean;

  /** * El esquema inicial devuelto por la API /connect.
   * (Contiene { tables: [...], views: [...] }).
   * Es opcional por si se carga después.
   */
  schema?: any; // O una interfaz más fuerte: { tables: string[], views: string[], ... }

  /**
   * La metadata enriquecida devuelta por la API /metadata/{id}.
   * Se guarda aquí para cachear y no volver a pedirla.
   * Es opcional porque se carga asíncronamente.
   */
  metadata?: MetadataResponse['data']; // Reutilizamos la interfaz
}