import { app } from 'electron'
import fs from 'node:fs/promises'
import path from 'path'
import { MetadataDto } from '../../shared/dto/logger.dto'

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY'
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  metadata?: MetadataDto
}

export class Logger {
  private static logDir: string | null = null
  private static isInitialized = false

  /**
   * Inicializa el sistema de logging
   */
  private static async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      this.logDir = path.join(app.getPath('userData'), 'logs')
      await fs.mkdir(this.logDir, { recursive: true })
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize logger:', error)
      this.logDir = null
    }
  }

  /**
   * Escribe una entrada de log
   */
  static async log(level: LogLevel, message: string, metadata?: MetadataDto): Promise<void> {
    await this.initialize()

    const timestamp = new Date().toISOString()
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      ...(metadata && { metadata })
    }

    // En desarrollo, mostrar en consola
    if (process.env.NODE_ENV === 'development') {
      const color = this.getColor(level)
      console.log(`${color}[${level}]${'\x1b[0m'} ${message}`, metadata || '')
    }

    // Escribir a archivo
    await this.writeToFile(logEntry)
  }

  /**
   * Escribe el log a un archivo
   */
  private static async writeToFile(entry: LogEntry): Promise<void> {
    if (!this.logDir) return

    try {
      const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      const logFile = path.join(this.logDir, `${date}.log`)
      const logLine = JSON.stringify(entry) + '\n'

      await fs.appendFile(logFile, logLine, 'utf-8')
    } catch (error) {
      // Evitar recursión infinita si falla el logging
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to write log:', error)
      }
    }
  }

  /**
   * Obtiene el color ANSI para cada nivel de log
   */
  private static getColor(level: LogLevel): string {
    const colors: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[32m', // Green
      [LogLevel.WARN]: '\x1b[33m', // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.SECURITY]: '\x1b[35m' // Magenta
    }
    return colors[level]
  }

  // Métodos de conveniencia
  static debug(message: string, metadata?: MetadataDto): Promise<void> {
    return this.log(LogLevel.DEBUG, message, metadata)
  }

  static info(message: string, metadata?: MetadataDto): Promise<void> {
    return this.log(LogLevel.INFO, message, metadata)
  }

  static warn(message: string, metadata?: MetadataDto): Promise<void> {
    return this.log(LogLevel.WARN, message, metadata)
  }

  static error(message: string, metadata?: MetadataDto): Promise<void> {
    return this.log(LogLevel.ERROR, message, metadata)
  }

  static security(message: string, metadata?: MetadataDto): Promise<void> {
    return this.log(LogLevel.SECURITY, message, metadata)
  }

  /**
   * Limpia logs antiguos (mantiene solo los últimos 30 días)
   */
  static async cleanOldLogs(daysToKeep = 30): Promise<void> {
    await this.initialize()
    if (!this.logDir) return

    try {
      const files = await fs.readdir(this.logDir)
      const now = Date.now()
      const maxAge = daysToKeep * 24 * 60 * 60 * 1000

      for (const file of files) {
        if (!file.endsWith('.log')) continue

        const filePath = path.join(this.logDir, file)
        const stats = await fs.stat(filePath)
        const age = now - stats.mtime.getTime()

        if (age > maxAge) {
          await fs.unlink(filePath)
          this.info('Log antiguo eliminado', { file })
        }
      }
    } catch (error) {
      this.error('Error al limpiar logs antiguos', { error })
    }
  }
}
