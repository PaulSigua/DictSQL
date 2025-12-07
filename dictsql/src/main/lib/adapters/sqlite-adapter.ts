import Database from 'better-sqlite3';
import { DatabaseAdapter } from '../db-adapter';
import { TableDefinition, ColumnDefinition, ForeignKeyDefinition } from '../../../shared/types';

export class SqliteAdapter extends DatabaseAdapter {
  private db: Database.Database | null = null;

  async connect(): Promise<void> {
    try {
      this.db = new Database(this.config.database, { readonly: true });
    } catch (error: any) {
      throw new Error(`No se pudo abrir el archivo SQLite: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  async getSchema(): Promise<TableDefinition[]> {
    if (!this.db) throw new Error('Database not connected');

    // obtener lista de tablas
    const tablesQuery = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';";
    const tablesRaw = this.db.prepare(tablesQuery).all() as { name: string }[];

    const tables: TableDefinition[] = [];

    for (const row of tablesRaw) {
      const tableName = row.name;
      const columns = this.getColumns(tableName);
      const foreignKeys = this.getForeignKeys(tableName);

      tables.push({
        name: tableName,
        schema: 'main', // SQLite usa 'main' por defecto
        columns,
        foreignKeys
      });
    }

    return tables;
  }

  private getColumns(tableName: string): ColumnDefinition[] {
    if (!this.db) return [];
    
    // PRAGMA table_info devuelve: cid, name, type, notnull, dflt_value, pk
    const colsRaw = this.db.prepare(`PRAGMA table_info('${tableName}')`).all() as any[];

    return colsRaw.map(col => ({
      name: col.name,
      type: col.type,
      isNullable: col.notnull === 0,
      isPrimaryKey: col.pk > 0,
      defaultValue: col.dflt_value,
      comment: '' // SQLite no soporta comentarios de columnas nativamente de forma estándar fácil de leer
    }));
  }

  private getForeignKeys(tableName: string): ForeignKeyDefinition[] {
    if (!this.db) return [];

    // PRAGMA foreign_key_list devuelve: id, seq, table, from, to, on_update, on_delete, match
    const fksRaw = this.db.prepare(`PRAGMA foreign_key_list('${tableName}')`).all() as any[];

    return fksRaw.map(fk => ({
      constraintName: `fk_${tableName}_${fk.id}`, // Generamos un nombre ya que SQLite no siempre los nombra explícitamente en el pragma
      sourceColumn: fk.from,
      targetTable: fk.table,
      targetColumn: fk.to
    }));
  }
}