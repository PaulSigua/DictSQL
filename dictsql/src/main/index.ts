import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { DbConnectionConfig, TableDefinition } from '../shared/dto/database.dto'
import { DatabaseService } from './services/database.service'
import { FileService } from './services/file.service'

// --- IPC Handlers para Base de Datos ---
ipcMain.handle('db:connect', async (_event, config: DbConnectionConfig) => {
  return await DatabaseService.getSchema(config)
})

// IPC para seleccionar archivo DB (SQLite)
ipcMain.handle('dialog:openFile', async () => {
  return await FileService.selectDatabaseFile()
})

// --- IPC Handlers para Archivos ---

// Guardar Proyecto
ipcMain.handle('file:save', async (_event, content: string) => {
  return await FileService.saveProject(content)
})

// Abrir Proyecto
ipcMain.handle('file:open', async () => {
  return await FileService.openProject()
})

// Exportar a Markdown
ipcMain.handle('file:export-markdown', async (_event, tables: TableDefinition[]) => {
  return await FileService.exportMarkdown(tables)
})

// ---------------------------------------------------------
// 4. HANDLERS: EXPORTAR HTML Y PDF
// ---------------------------------------------------------

// Exportar HTML
ipcMain.handle('file:export-html', async (_event, tables: TableDefinition[]) => {
  return await FileService.exportHtml(tables)
})

// Exportar PDF (Truco: Renderizar HTML en ventana oculta)
ipcMain.handle('file:export-pdf', async (_event, tables: TableDefinition[]) => {
  return await FileService.exportPdf(tables)
})

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
