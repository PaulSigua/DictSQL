import { dialog, BrowserWindow } from 'electron'
import fs from 'node:fs/promises'
import { TableDefinition } from '../../shared/dto/database.dto'
import { ErrorDto } from '../../shared/dto/error.dto'
import { MarkdownGenerator } from '../core/generators/markdown-generator'
import { HtmlGenerator } from '../core/generators/html-generator'
import { Logger } from '../core/logger'
import { ErrorHandler } from '../core/error-handler'

export interface FileOperationResponse {
  success: boolean
  filePath?: string
  error?: ErrorDto
}

export interface ProjectData {
  tables: TableDefinition[]
}

export interface OpenProjectResponse {
  success: boolean
  data?: ProjectData
  filePath?: string
  error?: ErrorDto
}

export class FileService {
  /**
   * Guarda un proyecto en formato .dictsql
   */
  static async saveProject(content: string): Promise<FileOperationResponse> {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Guardar Documentación',
      defaultPath: 'mi-proyecto.dictsql',
      filters: [{ name: 'DictSQL Project', extensions: ['dictsql', 'json'] }]
    })

    if (canceled || !filePath) {
      return { success: false }
    }

    try {
      await fs.writeFile(filePath, content, 'utf-8')
      Logger.info('Proyecto guardado', { filePath })
      return { success: true, filePath }
    } catch (error: unknown) {
      Logger.error('Error al guardar proyecto', {
        error: error instanceof Error ? error.message : String(error)
      })
      return {
        success: false,
        error: ErrorHandler.sanitize(error, 'file_save')
      }
    }
  }

  /**
   * Abre un proyecto desde un archivo .dictsql
   */
  static async openProject(): Promise<OpenProjectResponse> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Abrir Proyecto',
      properties: ['openFile'],
      filters: [{ name: 'DictSQL Project', extensions: ['dictsql', 'json'] }]
    })

    if (canceled || filePaths.length === 0) {
      return { success: false }
    }

    try {
      const content = await fs.readFile(filePaths[0], 'utf-8')
      const data = JSON.parse(content) as ProjectData
      Logger.info('Proyecto abierto', { filePath: filePaths[0] })
      return { success: true, data, filePath: filePaths[0] }
    } catch (error: unknown) {
      Logger.error('Error al abrir proyecto', {
        error: error instanceof Error ? error.message : String(error)
      })
      return {
        success: false,
        error: ErrorHandler.sanitize(error, 'file_open')
      }
    }
  }

  /**
   * Exporta la documentación a formato Markdown
   */
  static async exportMarkdown(tables: TableDefinition[]): Promise<FileOperationResponse> {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Exportar Documentación',
      defaultPath: 'documentacion-db.md',
      filters: [{ name: 'Markdown File', extensions: ['md'] }]
    })

    if (canceled || !filePath) {
      return { success: false }
    }

    try {
      const markdownContent = MarkdownGenerator.generate(tables)
      await fs.writeFile(filePath, markdownContent, 'utf-8')
      Logger.info('Markdown exportado', { filePath, tableCount: tables.length })
      return { success: true, filePath }
    } catch (error: unknown) {
      Logger.error('Error al exportar markdown', {
        error: error instanceof Error ? error.message : String(error)
      })
      return {
        success: false,
        error: ErrorHandler.sanitize(error, 'export_markdown')
      }
    }
  }

  /**
   * Exporta la documentación a formato HTML
   */
  static async exportHtml(tables: TableDefinition[]): Promise<FileOperationResponse> {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Exportar a HTML',
      defaultPath: 'documentacion.html',
      filters: [{ name: 'HTML Webpage', extensions: ['html'] }]
    })

    if (canceled || !filePath) {
      return { success: false }
    }

    try {
      const htmlContent = HtmlGenerator.generate(tables)
      await fs.writeFile(filePath, htmlContent, 'utf-8')
      Logger.info('HTML exportado', { filePath, tableCount: tables.length })
      return { success: true, filePath }
    } catch (error: unknown) {
      Logger.error('Error al exportar HTML', {
        error: error instanceof Error ? error.message : String(error)
      })
      return {
        success: false,
        error: ErrorHandler.sanitize(error, 'export_html')
      }
    }
  }

  /**
   * Exporta la documentación a formato PDF
   */
  static async exportPdf(tables: TableDefinition[]): Promise<FileOperationResponse> {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Exportar a PDF',
      defaultPath: 'documentacion.pdf',
      filters: [{ name: 'PDF Document', extensions: ['pdf'] }]
    })

    if (canceled || !filePath) {
      return { success: false }
    }

    // 1. Generamos el HTML
    const htmlContent = HtmlGenerator.generate(tables)

    // 2. Creamos una ventana oculta temporal
    const printWindow = new BrowserWindow({ show: false })

    try {
      // 3. Cargamos el HTML (usando data URI para no crear archivos temporales)
      const htmlBase64 = Buffer.from(htmlContent).toString('base64')
      await printWindow.loadURL(`data:text/html;charset=utf-8;base64,${htmlBase64}`)

      // 4. Imprimimos a PDF
      const pdfData = await printWindow.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4',
        margins: { top: 1, bottom: 1, left: 1, right: 1 }
      })

      // 5. Guardamos el archivo
      await fs.writeFile(filePath, pdfData)

      printWindow.close()
      Logger.info('PDF exportado', { filePath, tableCount: tables.length })
      return { success: true, filePath }
    } catch (error: unknown) {
      printWindow.close()
      Logger.error('Error al exportar PDF', {
        error: error instanceof Error ? error.message : String(error)
      })
      return {
        success: false,
        error: ErrorHandler.sanitize(error, 'export_pdf')
      }
    }
  }

  /**
   * Abre un diálogo para seleccionar un archivo de base de datos SQLite
   */
  static async selectDatabaseFile(): Promise<string | null> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Seleccionar archivo de Base de Datos',
      properties: ['openFile'],
      filters: [{ name: 'SQLite Database', extensions: ['db', 'sqlite', 'sqlite3'] }]
    })

    if (canceled || filePaths.length === 0) {
      return null
    }

    return filePaths[0]
  }
}
