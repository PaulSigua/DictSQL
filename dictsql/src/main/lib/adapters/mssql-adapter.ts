import sql from 'mssql';
import { DatabaseAdapter } from '../db-adapter';
import { TableDefinition, ColumnDefinition, ForeignKeyDefinition } from '../../../shared/types';

export class MssqlAdapter extends DatabaseAdapter {
  private pool: sql.ConnectionPool | null = null;

  async connect(): Promise<void> {
    const config: sql.config = {
      user: this.config.user!,
      password: this.config.password!,
      server: this.config.host || 'localhost',
      database: this.config.database,
      port: this.config.port || 1433,
      options: {
        encrypt: false, // Usualmente necesario para desarrollo local
        trustServerCertificate: true // Importante para conexiones locales
      }
    };
    
    this.pool = await sql.connect(config);
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
    }
  }

  async getSchema(): Promise<TableDefinition[]> {
    if (!this.pool) throw new Error('MSSQL not connected');

    const result = await this.pool.request().query(`
      SELECT TABLE_NAME, TABLE_SCHEMA
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
    `);

    const tables: TableDefinition[] = [];

    for (const row of result.recordset) {
      const tableName = row.TABLE_NAME;
      const schemaName = row.TABLE_SCHEMA;
      
      const columns = await this.getColumns(tableName, schemaName);
      const foreignKeys = await this.getForeignKeys(tableName, schemaName);

      tables.push({
        name: tableName,
        schema: schemaName,
        columns,
        foreignKeys
      });
    }

    return tables;
  }

  private async getColumns(tableName: string, schemaName: string): Promise<ColumnDefinition[]> {
    if (!this.pool) return [];

    // Query para obtener columnas y saber si es PK en un solo viaje
    const query = `
      SELECT 
        c.COLUMN_NAME,
        c.DATA_TYPE,
        c.IS_NULLABLE,
        c.COLUMN_DEFAULT,
        CASE WHEN pk.COLUMN_NAME IS NOT NULL THEN 1 ELSE 0 END AS IS_PRIMARY
      FROM INFORMATION_SCHEMA.COLUMNS c
      LEFT JOIN (
        SELECT ku.TABLE_SCHEMA, ku.TABLE_NAME, ku.COLUMN_NAME
        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
        JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE ku ON tc.CONSTRAINT_NAME = ku.CONSTRAINT_NAME
        WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
      ) pk ON c.TABLE_SCHEMA = pk.TABLE_SCHEMA AND c.TABLE_NAME = pk.TABLE_NAME AND c.COLUMN_NAME = pk.COLUMN_NAME
      WHERE c.TABLE_NAME = @tableName AND c.TABLE_SCHEMA = @schemaName
    `;

    const result = await this.pool.request()
      .input('tableName', sql.VarChar, tableName)
      .input('schemaName', sql.VarChar, schemaName)
      .query(query);

    return result.recordset.map(row => ({
      name: row.COLUMN_NAME,
      type: row.DATA_TYPE,
      isNullable: row.IS_NULLABLE === 'YES',
      isPrimaryKey: !!row.IS_PRIMARY,
      defaultValue: row.COLUMN_DEFAULT
    }));
  }

  private async getForeignKeys(tableName: string, schemaName: string): Promise<ForeignKeyDefinition[]> {
    if (!this.pool) return [];

    const query = `
      SELECT 
        fk.name AS constraint_name,
        c1.name AS source_column,
        t2.name AS target_table,
        c2.name AS target_column
      FROM sys.foreign_keys fk
      INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
      INNER JOIN sys.tables t1 ON fkc.parent_object_id = t1.object_id
      INNER JOIN sys.columns c1 ON fkc.parent_object_id = c1.object_id AND fkc.parent_column_id = c1.column_id
      INNER JOIN sys.tables t2 ON fkc.referenced_object_id = t2.object_id
      INNER JOIN sys.columns c2 ON fkc.referenced_object_id = c2.object_id AND fkc.referenced_column_id = c2.column_id
      WHERE t1.name = @tableName AND SCHEMA_NAME(t1.schema_id) = @schemaName
    `;

    const result = await this.pool.request()
      .input('tableName', sql.VarChar, tableName)
      .input('schemaName', sql.VarChar, schemaName)
      .query(query);

    return result.recordset.map(row => ({
      constraintName: row.constraint_name,
      sourceColumn: row.source_column,
      targetTable: row.target_table,
      targetColumn: row.target_column
    }));
  }
}