import mysql from 'mysql2/promise';
import { DatabaseAdapter } from '../db-adapter';
import { TableDefinition, ColumnDefinition, ForeignKeyDefinition } from '../../../shared/types';

export class MysqlAdapter extends DatabaseAdapter {
  private connection: mysql.Connection | null = null;

  async connect(): Promise<void> {
    this.connection = await mysql.createConnection({
      host: this.config.host,
      port: this.config.port || 3306,
      user: this.config.user,
      password: this.config.password,
      database: this.config.database,
    });
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }

  async getSchema(): Promise<TableDefinition[]> {
    if (!this.connection) throw new Error('MySQL not connected');

    // 1. Obtener Tablas
    const [rows] = await this.connection.execute<mysql.RowDataPacket[]>(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ? 
      AND table_type = 'BASE TABLE';
    `, [this.config.database]);

    const tables: TableDefinition[] = [];

    for (const row of rows) {
      const tableName = row['TABLE_NAME'] || row['table_name']; // A veces MySQL devuelve mayúsculas/minúsculas según config
      
      const columns = await this.getColumns(tableName);
      const foreignKeys = await this.getForeignKeys(tableName);

      tables.push({
        name: tableName,
        schema: this.config.database,
        columns,
        foreignKeys,
        comment: '' // MySQL guarda comentarios en TABLE_COMMENT, opcional implementarlo
      });
    }

    return tables;
  }

  private async getColumns(tableName: string): Promise<ColumnDefinition[]> {
    if (!this.connection) return [];

    const query = `
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_key,
        column_default,
        column_comment
      FROM information_schema.columns 
      WHERE table_schema = ? AND table_name = ?
      ORDER BY ordinal_position;
    `;

    const [rows] = await this.connection.execute<mysql.RowDataPacket[]>(query, [this.config.database, tableName]);

    return rows.map(row => ({
      name: row['COLUMN_NAME'] || row['column_name'],
      type: row['DATA_TYPE'] || row['data_type'],
      isNullable: (row['IS_NULLABLE'] || row['is_nullable']) === 'YES',
      isPrimaryKey: (row['COLUMN_KEY'] || row['column_key']) === 'PRI',
      defaultValue: row['COLUMN_DEFAULT'] || row['column_default'],
      comment: row['COLUMN_COMMENT'] || row['column_comment']
    }));
  }

  private async getForeignKeys(tableName: string): Promise<ForeignKeyDefinition[]> {
    if (!this.connection) return [];

    const query = `
      SELECT 
        k.constraint_name,
        k.column_name,
        k.referenced_table_name,
        k.referenced_column_name
      FROM information_schema.key_column_usage k
      WHERE k.table_schema = ? 
      AND k.table_name = ?
      AND k.referenced_table_name IS NOT NULL;
    `;

    const [rows] = await this.connection.execute<mysql.RowDataPacket[]>(query, [this.config.database, tableName]);

    return rows.map(row => ({
      constraintName: row['CONSTRAINT_NAME'] || row['constraint_name'],
      sourceColumn: row['COLUMN_NAME'] || row['column_name'],
      targetTable: row['REFERENCED_TABLE_NAME'] || row['referenced_table_name'],
      targetColumn: row['REFERENCED_COLUMN_NAME'] || row['referenced_column_name']
    }));
  }
}