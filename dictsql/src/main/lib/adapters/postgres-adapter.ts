import { Client } from 'pg';
import { DatabaseAdapter } from '../db-adapter';
import { TableDefinition, ColumnDefinition, ForeignKeyDefinition } from '../../../shared/types';

export class PostgresAdapter extends DatabaseAdapter {
  private client: Client | null = null;

  async connect(): Promise<void> {
    this.client = new Client({
      host: this.config.host,
      port: this.config.port,
      user: this.config.user,
      password: this.config.password,
      database: this.config.database,
      ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
    });
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
  }

  async getSchema(): Promise<TableDefinition[]> {
    if (!this.client) throw new Error('Client not connected');

    // 1. Obtener Tablas (solo del esquema 'public' por ahora)
    const tablesRes = await this.client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `);

    const tables: TableDefinition[] = [];

    // 2. Iterar sobre cada tabla para buscar sus detalles
    // (Nota: En producción, esto se podría optimizar con un solo query grande, pero así es más legible)
    for (const row of tablesRes.rows) {
      const tableName = row.table_name;
      
      const columns = await this.getColumns(tableName);
      const foreignKeys = await this.getForeignKeys(tableName);

      tables.push({
        name: tableName,
        schema: 'public',
        columns,
        foreignKeys
      });
    }

    return tables;
  }

  private async getColumns(tableName: string): Promise<ColumnDefinition[]> {
    if (!this.client) return [];

    const query = `
      SELECT 
        c.column_name, 
        c.data_type, 
        c.is_nullable, 
        c.column_default,
        (SELECT CASE WHEN count(*) > 0 THEN true ELSE false END 
         FROM information_schema.table_constraints tc 
         JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name 
         WHERE tc.constraint_type = 'PRIMARY KEY' 
         AND ccu.table_name = c.table_name 
         AND ccu.column_name = c.column_name) as is_primary
      FROM information_schema.columns c
      WHERE c.table_name = $1 AND c.table_schema = 'public';
    `;

    const res = await this.client.query(query, [tableName]);

    return res.rows.map(row => ({
      name: row.column_name,
      type: row.data_type,
      isNullable: row.is_nullable === 'YES',
      isPrimaryKey: row.is_primary,
      defaultValue: row.column_default
    }));
  }

  private async getForeignKeys(tableName: string): Promise<ForeignKeyDefinition[]> {
    if (!this.client) return [];

    // Query complejo para extraer relaciones FK
    const query = `
      SELECT
        kcu.constraint_name,
        kcu.column_name as source_column,
        ccu.table_name AS target_table,
        ccu.column_name AS target_column
      FROM information_schema.key_column_usage AS kcu
      JOIN information_schema.referential_constraints AS rc ON kcu.constraint_name = rc.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu ON rc.unique_constraint_name = ccu.constraint_name
      WHERE kcu.table_name = $1 AND kcu.table_schema = 'public';
    `;

    const res = await this.client.query(query, [tableName]);

    return res.rows.map(row => ({
      constraintName: row.constraint_name,
      sourceColumn: row.source_column,
      targetTable: row.target_table,
      targetColumn: row.target_column
    }));
  }
}