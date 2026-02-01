import { ErrorDto } from '../../shared/dto/error.dto'
import { ErrorCode, ERROR_MESSAGES } from '../../shared/constants/error-codes'
import { Logger } from './logger'

interface ErrorMapping {
  code: ErrorCode
  message: string
}

export class ErrorHandler {
  /**
   * Mapeo de códigos de error comunes a mensajes sanitizados
   */
  private static readonly errorMap: Record<string, ErrorMapping> = {
    // Errores de conexión de red
    ECONNREFUSED: {
      code: ErrorCode.DB_CONNECTION_FAILED,
      message: 'No se pudo conectar al servidor de base de datos. Verifica que esté ejecutándose.'
    },
    ENOTFOUND: {
      code: ErrorCode.DB_CONNECTION_FAILED,
      message: 'Servidor de base de datos no encontrado. Verifica el host y puerto.'
    },
    ETIMEDOUT: {
      code: ErrorCode.DB_CONNECTION_FAILED,
      message: 'Tiempo de espera agotado al conectar a la base de datos.'
    },
    ECONNRESET: {
      code: ErrorCode.DB_CONNECTION_FAILED,
      message: 'La conexión fue interrumpida por el servidor.'
    },

    // Errores de autenticación
    '28P01': {
      // PostgreSQL: invalid password
      code: ErrorCode.DB_CONNECTION_FAILED,
      message: 'Credenciales inválidas. Verifica usuario y contraseña.'
    },
    ER_ACCESS_DENIED_ERROR: {
      // MySQL
      code: ErrorCode.DB_CONNECTION_FAILED,
      message: 'Acceso denegado. Verifica usuario y contraseña.'
    },

    // Errores de archivo
    ENOENT: {
      code: ErrorCode.FILE_NOT_FOUND,
      message: 'Archivo no encontrado.'
    },
    EACCES: {
      code: ErrorCode.FILE_READ_ERROR,
      message: 'Permiso denegado para acceder al archivo.'
    },
    EISDIR: {
      code: ErrorCode.FILE_READ_ERROR,
      message: 'La ruta especificada es un directorio, no un archivo.'
    },

    // Errores de parsing
    SyntaxError: {
      code: ErrorCode.FILE_PARSE_ERROR,
      message: 'El archivo no tiene un formato válido.'
    }
  }

  /**
   * Sanitiza un error para enviar al frontend
   * @param error Error original
   * @param context Contexto donde ocurrió el error (para logging)
   * @returns ErrorDto sanitizado
   */
  static sanitize(error: ErrorDto, context: string): ErrorDto {
    // Log del error completo para debugging
    Logger.error(`Error en ${context}`, {
      message: error.message,
      code: error.code,
      stack: error.stack
    })

    // Buscar mapeo por código de error
    const mapped = this.errorMap[error.code] || this.errorMap[error.name]

    if (mapped) {
      return {
        code: mapped.code,
        message: mapped.message,
        details: this.getDetails(error)
      }
    }

    // Intentar extraer mensaje útil del error
    const sanitizedMessage = this.extractSafeMessage(error)

    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: sanitizedMessage || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
      details: this.getDetails(error)
    }
  }

  /**
   * Crea un ErrorDto personalizado
   */
  static create(code: ErrorCode, customMessage?: string, details?: string): ErrorDto {
    return {
      code,
      message: customMessage || ERROR_MESSAGES[code],
      details
    }
  }

  /**
   * Extrae un mensaje seguro del error original
   */
  private static extractSafeMessage(error: ErrorDto): string | null {
    // Lista de palabras clave que indican información sensible
    const sensitiveKeywords = [
      'password',
      'token',
      'secret',
      'key',
      'auth',
      '/home/',
      '/users/',
      'C:\\',
      'node_modules'
    ]

    const message = error.message || ''

    // Si el mensaje contiene información sensible, no lo usamos
    const hasSensitiveInfo = sensitiveKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword.toLowerCase())
    )

    if (hasSensitiveInfo) {
      return null
    }

    // Limitar longitud del mensaje
    return message.length > 200 ? message.substring(0, 200) + '...' : message
  }

  /**
   * Incluye detalles solo en modo desarrollo
   */
  private static getDetails(error: ErrorDto): string | undefined {
    if (process.env.NODE_ENV === 'development') {
      return error.stack || error.message || String(error)
    }
    return undefined
  }

  /**
   * Valida si un error es de tipo específico
   */
  static isConnectionError(error: ErrorDto): boolean {
    const connectionCodes = ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNRESET']
    return connectionCodes.includes(error.code)
  }

  static isAuthenticationError(error: ErrorDto): boolean {
    const authCodes = ['28P01', 'ER_ACCESS_DENIED_ERROR']
    return authCodes.includes(error.code) || authCodes.includes(error.name)
  }

  static isFileError(error: ErrorDto): boolean {
    const fileCodes = ['ENOENT', 'EACCES', 'EISDIR']
    return fileCodes.includes(error.code)
  }
}
