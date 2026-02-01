export enum ErrorCode {
  // Database errors
  DB_CONNECTION_FAILED = 'DB_CONNECTION_FAILED',
  DB_QUERY_FAILED = 'DB_QUERY_FAILED',
  DB_INVALID_TYPE = 'DB_INVALID_TYPE',
  DB_INVALID_FILE = 'DB_INVALID_FILE',

  // File errors
  FILE_READ_ERROR = 'FILE_READ_ERROR',
  FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_PARSE_ERROR = 'FILE_PARSE_ERROR',

  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_IDENTIFIER = 'INVALID_IDENTIFIER',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  OPERATION_CANCELLED = 'OPERATION_CANCELLED'
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.DB_CONNECTION_FAILED]: 'No se pudo conectar a la base de datos',
  [ErrorCode.DB_QUERY_FAILED]: 'Error al ejecutar consulta en la base de datos',
  [ErrorCode.DB_INVALID_TYPE]: 'Tipo de base de datos no soportado',
  [ErrorCode.DB_INVALID_FILE]: 'El archivo no es una base de datos válida',

  [ErrorCode.FILE_READ_ERROR]: 'Error al leer el archivo',
  [ErrorCode.FILE_WRITE_ERROR]: 'Error al escribir el archivo',
  [ErrorCode.FILE_NOT_FOUND]: 'Archivo no encontrado',
  [ErrorCode.FILE_PARSE_ERROR]: 'Error al procesar el archivo',

  [ErrorCode.INVALID_INPUT]: 'Datos de entrada inválidos',
  [ErrorCode.INVALID_IDENTIFIER]: 'Nombre de identificador inválido',
  [ErrorCode.MISSING_REQUIRED_FIELD]: 'Falta un campo requerido',

  [ErrorCode.UNKNOWN_ERROR]: 'Ocurrió un error inesperado',
  [ErrorCode.OPERATION_CANCELLED]: 'Operación cancelada por el usuario'
}
