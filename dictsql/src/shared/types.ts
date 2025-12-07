// define que tipos de bases de datos soportamos
export type DbType = 'postgres' | 'mysql' | 'sqlite';

// configuracion de conexion del usuario
export interface DbConnectionConfig {
    type: DbType;
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database: string; // nombre de la base de datos
    ssl?: boolean;
}

// representacion de una columna
export interface ColumnDefinition {
    name: string;
    type: string; // 'varchar', 'int', 'uuid'
    isNullable: boolean;
    isPrimaryKey: boolean;
    defaultValue?: string | number | boolean;
    comment?: string;
}

// representacion de una relacion
export interface ForeignKeyDefinition {
    constraintName: string;
    sourceColumn: string; // columna en esta tabla
    targetTable: string; // tabla a la que apunta
    targetColumn: string; // columna en la tabla objetivo
}

// representacion de una tabla
export interface TableDefinition {
    name: string;
    schema: string; // 'public' en PG, o en el nombre de la DB en MySQL
    columns: ColumnDefinition[];
    foreignKeys: ForeignKeyDefinition[];
    comment?: string; // documentacion de la tabla
}

// respuesta completa que el backend enviara al frontend
export interface DatabaseSchema {
    tables: TableDefinition[];
}