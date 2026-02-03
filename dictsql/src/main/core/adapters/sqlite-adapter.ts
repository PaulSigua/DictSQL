import Database from 'better-sqlite3'
import { DatabaseAdapter } from '../db-adapter'
import { TableDefinition, ColumnDefinition, ForeignKeyDefinition } from '../../../shared/dto'
import { Validators } from '../validators'
import { ErrorDto } from '../../../shared/dto/error.dto'

export class SqliteAdapter extends DatabaseAdapter {
  private db: Database.Database | null = null

  async connect(): Promise<void> {
    try {
      this.db = new Database(this.config.database, { readonly: true })
    } catch (error: unknown) {
      throw new Error(`No se pudo abrir el archivo SQLite: ${(error as ErrorDto).message}`)
    }
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }

  async getSchema(): Promise<TableDefinition[]> {
    if (!this.db) throw new Error('Database not connected')

    // obtener lista de tablas
    const tablesQuery =
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
    const tablesRaw = this.db.prepare(tablesQuery).all() as { name: string }[]

    const tables: TableDefinition[] = []

    for (const row of tablesRaw) {
      const tableName = row.name
      const columns = this.getColumns(tableName)
      const foreignKeys = this.getForeignKeys(tableName)

      tables.push({
        name: tableName,
        schema: 'main', // SQLite usa 'main' por defecto
        columns,
        foreignKeys
      })
    }

    return tables
  }

  private getColumns(tableName: string): ColumnDefinition[] {
    if (!this.db) return []

    // Validar nombre de tabla para prevenir inyección SQL
    if (!this.isValidTableName(tableName)) {
      throw new Error(`Invalid table name: ${tableName}`)
    }

    // SEGURO: Usar prepared statement con placeholder
    // Nota: PRAGMA table_info no soporta placeholders directamente en better-sqlite3
    // pero validamos el nombre antes de usarlo
    const colsRaw = this.db.prepare(`PRAGMA table_info("${tableName}")`).all() as Array<{
      cid: number
      name: string
      type: string
      notnull: number
      dflt_value: string | null
      pk: number
    }>

    return colsRaw.map((col) => ({
      name: col.name,
      type: col.type,
      isNullable: col.notnull === 0,
      isPrimaryKey: col.pk > 0,
      defaultValue: col.dflt_value,
      comment: '' // SQLite no soporta comentarios de columnas nativamente de forma estándar fácil de leer
    }))
  }

  private getForeignKeys(tableName: string): ForeignKeyDefinition[] {
    if (!this.db) return []

    // Validar nombre de tabla
    if (!this.isValidTableName(tableName)) {
      throw new Error(`Invalid table name: ${tableName}`)
    }

    // PRAGMA foreign_key_list devuelve: id, seq, table, from, to, on_update, on_delete, match
    const fksRaw = this.db.prepare(`PRAGMA foreign_key_list("${tableName}")`).all() as Array<{
      id: number
      seq: number
      table: string
      from: string
      to: string
      on_update: string
      on_delete: string
      match: string
    }>

    return fksRaw.map((fk) => ({
      constraintName: `fk_${tableName}_${fk.id}`, // Generamos un nombre ya que SQLite no siempre los nombra explícitamente en el pragma
      sourceColumn: fk.from,
      targetTable: fk.table,
      targetColumn: fk.to
    }))
  }

  /**
   * Valida que un nombre de tabla sea seguro
   */
  private isValidTableName(name: string): boolean {
    return Validators.isValidIdentifier(name)
  }
}
