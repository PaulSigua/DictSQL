import { DbConnectionConfig, DatabaseSchema, TableDefinition } from '../../shared/dto'
import { ErrorDto } from '../../shared/dto/error.dto'

export interface IElectronAPI {
  loadPreferences: () => Promise<void>
}

export interface ICustomAPI {
  connectDb: (
    config: DbConnectionConfig
  ) => Promise<{ success: boolean; data?: DatabaseSchema; error?: ErrorDto }>
  saveProject: (content: string) => Promise<{ success: boolean; filePath?: string; error?: string }>
  openProject: () => Promise<{
    success: boolean
    data?: DatabaseSchema
    filePath?: string
    error?: string
  }>
  exportMarkdown: (
    tables: TableDefinition[]
  ) => Promise<{ success: boolean; filePath?: string; error?: string }>
  selectDatabaseFile: () => Promise<string | null>
  exportHtml: (
    tables: TableDefinition[]
  ) => Promise<{ success: boolean; filePath?: string; error?: string }>
  exportPdf: (
    tables: TableDefinition[]
  ) => Promise<{ success: boolean; filePath?: string; error?: string }>
}

declare global {
  interface Window {
    electron: IElectronAPI
    api: ICustomAPI // API personalizada
  }
}
