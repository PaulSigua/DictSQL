import { DbConnectionConfig, TableDefinition } from '../../shared/dto/database.dto'
import { ErrorDto } from '../../shared/dto/error.dto'
import { PostgresAdapter } from '../core/adapters/postgres-adapter'
import { SqliteAdapter } from '../core/adapters/sqlite-adapter'
import { MysqlAdapter } from '../core/adapters/mysql-adapter'
import { MssqlAdapter } from '../core/adapters/mssql-adapter'
import { DatabaseAdapter } from '../core/db-adapter'
import { Logger } from '../core/logger'
import { ErrorHandler } from '../core/error-handler'
import { Validators } from '../core/validators'
import { ErrorCode } from '../../shared/constants/error-codes'

export interface DatabaseSchemaResponse {
  success: boolean
  data?: TableDefinition[]
  error?: ErrorDto
}

export class DatabaseService {
  /**
   * Conecta a una base de datos y extrae su esquema
   */
  static async getSchema(config: DbConnectionConfig): Promise<DatabaseSchemaResponse> {
    // 1. Validar configuración
    const validation = Validators.validateDbConfig(config)
    if (!validation.valid) {
      return {
        success: false,
        error: {
          code: validation.errorCode!,
          message: validation.error!
        }
      }
    }

    // 2. Validar archivo SQLite si aplica
    if (config.type === 'sqlite') {
      const isValid = await Validators.isSQLiteFile(config.database)
      if (!isValid) {
        Logger.warn('Archivo SQLite inválido', { path: config.database })
        return {
          success: false,
          error: ErrorHandler.create(
            'DB_INVALID_FILE' as ErrorCode,
            'El archivo no es una base de datos SQLite válida'
          )
        }
      }
    }

    Logger.info('Iniciando conexión a BD', {
      type: config.type,
      database: config.database,
      host: config.host
    })

    try {
      // 3. Factory pattern para crear adaptador
      const adapter = this.createAdapter(config)

      // 4. Conectar y extraer esquema
      await adapter.connect()
      const schema = await adapter.getSchema()
      await adapter.disconnect()

      Logger.security('Esquema extraído exitosamente', {
        database: config.database,
        tableCount: schema.length
      })

      return { success: true, data: schema }
    } catch (error: unknown) {
      Logger.error('Error al conectar a BD', {
        error: error instanceof Error ? error.message : String(error),
        config: { type: config.type, database: config.database }
      })

      return {
        success: false,
        error: ErrorHandler.sanitize(error, 'database_connection')
      }
    }
  }

  /**
   * Factory method para crear el adaptador correcto según el tipo de BD
   */
  private static createAdapter(config: DbConnectionConfig): DatabaseAdapter {
    switch (config.type) {
      case 'postgres':
        return new PostgresAdapter(config)
      case 'sqlite':
        return new SqliteAdapter(config)
      case 'mysql':
        return new MysqlAdapter(config)
      case 'mssql':
        return new MssqlAdapter(config)
      default:
        throw new Error(`Tipo de base de datos no soportado: ${config.type}`)
    }
  }
}
