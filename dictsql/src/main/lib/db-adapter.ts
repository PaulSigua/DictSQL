// fichero para soporte
import { DbConnectionConfig, TableDefinition } from '../../shared/types.ts';

/**
 * Clase abstracta que todo adaptador de base de datos debe implementar
 */
export abstract class DatabaseAdapter {
    protected config: DbConnectionConfig;

    constructor(config: DbConnectionConfig) {
        this.config = config;
    }

    /**
     * Verifica si la conexion es exitosa
     */
    abstract connect(): Promise<void>;

    /**
     * Cierra la conexion a la base de datos
     */
    abstract disconnect(): Promise<void>;

    /**
     * Obtiene el esquema de la base de datos (tablas, columnas, relaciones)
     */
    abstract getDatabaseSchema(): Promise<{ tables: TableDefinition[] }>;
}
