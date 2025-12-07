import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { DbConnectionConfig, TableDefinition } from '../shared/types'

// Custom APIs for renderer
const api = {
  connectDb: (config: DbConnectionConfig) => ipcRenderer.invoke('db:connect', config),
  saveProject: (content: string) => ipcRenderer.invoke('file:save', content),
  openProject: () => ipcRenderer.invoke('file:open'),
  exportMarkdown: (tables: TableDefinition[]) => ipcRenderer.invoke('file:export-markdown', tables),
  selectDatabaseFile: () => ipcRenderer.invoke('dialog:openFile'),
  exportHtml: (tables: any[]) => ipcRenderer.invoke('file:export-html', tables),
  exportPdf: (tables: any[]) => ipcRenderer.invoke('file:export-pdf', tables),
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}