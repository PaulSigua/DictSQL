import { readFile } from 'fs/promises'
import { DbConnectionConfig } from '../../shared/dto/database.dto'
import { ErrorCode } from '../../shared/constants/error-codes'

export interface ValidationResult {
  valid: boolean
  error?: string
  errorCode?: ErrorCode
}

export class Validators {
  /**
   * Valida que un archivo sea realmente una base de datos SQLite
   * mediante la verificación de magic numbers
   */
  static async isSQLiteFile(filePath: string): Promise<boolean> {
    try {
      const buffer = await readFile(filePath)

      // SQLite files start with "SQLite format 3\0"
      const header = buffer.toString('utf-8', 0, 16)
      return header.startsWith('SQLite format 3')
    } catch {
      return false
    }
  }

  /**
   * Valida que un nombre de identificador SQL sea seguro
   * Solo permite letras, números y guiones bajos
   */
  static isValidIdentifier(name: string): boolean {
    if (!name || name.length === 0) return false

    // Solo alfanuméricos y guiones bajos
    // No puede empezar con número
    const pattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/
    return pattern.test(name)
  }

  /**
   * Valida que un nombre de esquema sea seguro
   */
  static isValidSchemaName(name: string): boolean {
    // Los esquemas pueden tener puntos (ej: "dbo.schema")
    if (!name || name.length === 0) return false

    const pattern = /^[a-zA-Z_][a-zA-Z0-9_.]*$/
    return pattern.test(name)
  }

  /**
   * Valida configuración de conexión a base de datos
   */
  static validateDbConfig(config: DbConnectionConfig): ValidationResult {
    // Validar tipo de BD
    const validTypes = ['postgres', 'mysql', 'sqlite', 'mssql']
    if (!validTypes.includes(config.type)) {
      return {
        valid: false,
        error: `Tipo de base de datos no soportado: ${config.type}`,
        errorCode: ErrorCode.DB_INVALID_TYPE
      }
    }

    // Validaciones específicas por tipo
    if (config.type === 'sqlite') {
      if (!config.database || config.database.trim().length === 0) {
        return {
          valid: false,
          error: 'Ruta de archivo requerida para SQLite',
          errorCode: ErrorCode.MISSING_REQUIRED_FIELD
        }
      }
    } else {
      // Validaciones para BD de red (PostgreSQL, MySQL, MSSQL)
      if (!config.host || config.host.trim().length === 0) {
        return {
          valid: false,
          error: 'Host es requerido',
          errorCode: ErrorCode.MISSING_REQUIRED_FIELD
        }
      }

      if (!config.user || config.user.trim().length === 0) {
        return {
          valid: false,
          error: 'Usuario es requerido',
          errorCode: ErrorCode.MISSING_REQUIRED_FIELD
        }
      }

      if (!config.database || config.database.trim().length === 0) {
        return {
          valid: false,
          error: 'Nombre de base de datos es requerido',
          errorCode: ErrorCode.MISSING_REQUIRED_FIELD
        }
      }

      // Validar puerto si está presente
      if (config.port !== undefined) {
        if (config.port < 1 || config.port > 65535) {
          return {
            valid: false,
            error: 'Puerto debe estar entre 1 y 65535',
            errorCode: ErrorCode.INVALID_INPUT
          }
        }
      }
    }

    return { valid: true }
  }

  /**
   * Valida que una ruta de archivo sea segura
   * Previene path traversal attacks
   */
  static isValidFilePath(filePath: string): boolean {
    if (!filePath || filePath.trim().length === 0) return false

    // Detectar intentos de path traversal
    const dangerousPatterns = ['../', '..\\', '%2e%2e', '%252e%252e']
    const hasDangerousPattern = dangerousPatterns.some((pattern) =>
      filePath.toLowerCase().includes(pattern)
    )

    return !hasDangerousPattern
  }

  /**
   * Valida un array de nombres de tabla
   */
  static validateTableNames(names: string[]): ValidationResult {
    for (const name of names) {
      if (!this.isValidIdentifier(name)) {
        return {
          valid: false,
          error: `Nombre de tabla inválido: ${name}`,
          errorCode: ErrorCode.INVALID_IDENTIFIER
        }
      }
    }
    return { valid: true }
  }

  /**
   * Sanitiza un nombre de identificador removiendo caracteres peligrosos
   * Útil para logging seguro
   */
  static sanitizeIdentifier(name: string): string {
    // Remover todo excepto alfanuméricos y guiones bajos
    return name.replace(/[^a-zA-Z0-9_]/g, '_')
  }

  /**
   * Valida longitud de string para prevenir ataques de memoria
   */
  static isValidLength(str: string, maxLength = 1000): boolean {
    return str.length <= maxLength
  }
}
