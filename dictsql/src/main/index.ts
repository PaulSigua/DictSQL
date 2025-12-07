import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import fs from 'node:fs/promises'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { PostgresAdapter } from './lib/adapters/postgres-adapter'
import { DbConnectionConfig } from '../shared/types'
import { MarkdownGenerator } from './lib/markdown-generator';
import { TableDefinition } from '../shared/types';
import { SqliteAdapter } from './lib/adapters/sqlite-adapter'
import { MysqlAdapter } from './lib/adapters/mysql-adapter'
import { MssqlAdapter } from './lib/adapters/mssql-adapter'
import { HtmlGenerator } from './lib/html-generator';

// --- IPC Handlers para Base de Datos ---
ipcMain.handle('db:connect', async (_event, config: DbConnectionConfig) => {
  console.log('Intentando conectar a:', config.database)

  try {
    let adapter

    // Factory simple: elegimos el adaptador según el tipo
    if (config.type === 'postgres') {
      adapter = new PostgresAdapter(config);
    } else if (config.type === 'sqlite') {
      adapter = new SqliteAdapter(config)
    } else if (config.type === 'mysql') {
      adapter = new MysqlAdapter(config)
    } else if (config.type === 'mssql') {
      adapter = new MssqlAdapter(config)
    } else {
      throw new Error(`Tipo de base de datos no soportado: ${config.type}`)
    }

    await adapter.connect()
    const schema = await adapter.getSchema()
    await adapter.disconnect() // Por ahora desconectamos al terminar de leer

    console.log(`Esquema obtenido: ${schema.length} tablas encontradas.`)
    return { success: true, data: schema }

  } catch (error: any) {
    console.error('Error de conexión:', error)
    return { success: false, error: error.message }
  }
})

// IPC para seleccionar archivo DB (SQLite)
ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Seleccionar archivo de Base de Datos',
    properties: ['openFile'],
    filters: [{ name: 'SQLite Database', extensions: ['db', 'sqlite', 'sqlite3'] }]
  })
  
  if (canceled || filePaths.length === 0) return null
  return filePaths[0]
})

// --- IPC Handlers para Archivos ---

// Guardar Proyecto
ipcMain.handle('file:save', async (_event, content: string) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Guardar Documentación',
    defaultPath: 'mi-proyecto.dictsql',
    filters: [{ name: 'DictSQL Project', extensions: ['dictsql', 'json'] }]
  })

  if (canceled || !filePath) return { success: false }

  try {
    await fs.writeFile(filePath, content, 'utf-8')
    return { success: true, filePath }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Abrir Proyecto
ipcMain.handle('file:open', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Abrir Proyecto',
    properties: ['openFile'],
    filters: [{ name: 'DictSQL Project', extensions: ['dictsql', 'json'] }]
  })

  if (canceled || filePaths.length === 0) return { success: false }

  try {
    const content = await fs.readFile(filePaths[0], 'utf-8')
    return { success: true, data: JSON.parse(content), filePath: filePaths[0] }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})

// Exportar a Markdown
ipcMain.handle('file:export-markdown', async (_event, tables: TableDefinition[]) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Exportar Documentación',
    defaultPath: 'documentacion-db.md',
    filters: [{ name: 'Markdown File', extensions: ['md'] }]
  })

  if (canceled || !filePath) return { success: false }

  try {
    // Generamos el string Markdown usando la clase que creamos
    const markdownContent = MarkdownGenerator.generate(tables)

    // Escribimos el archivo
    await fs.writeFile(filePath, markdownContent, 'utf-8')

    return { success: true, filePath }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: error.message }
  }
})

// ---------------------------------------------------------
// 4. HANDLERS: EXPORTAR HTML Y PDF
// ---------------------------------------------------------

// Exportar HTML
ipcMain.handle('file:export-html', async (_event, tables: TableDefinition[]) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Exportar a HTML',
    defaultPath: 'documentacion.html',
    filters: [{ name: 'HTML Webpage', extensions: ['html'] }]
  });

  if (canceled || !filePath) return { success: false };

  try {
    const htmlContent = HtmlGenerator.generate(tables);
    await fs.writeFile(filePath, htmlContent, 'utf-8');
    return { success: true, filePath };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Exportar PDF (Truco: Renderizar HTML en ventana oculta)
ipcMain.handle('file:export-pdf', async (_event, tables: TableDefinition[]) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Exportar a PDF',
    defaultPath: 'documentacion.pdf',
    filters: [{ name: 'PDF Document', extensions: ['pdf'] }]
  });

  if (canceled || !filePath) return { success: false };

  // 1. Generamos el HTML
  const htmlContent = HtmlGenerator.generate(tables);

  // 2. Creamos una ventana oculta temporal
  const printWindow = new BrowserWindow({ show: false });

  try {
    // 3. Cargamos el HTML (usando data URI para no crear archivos temporales)
    const htmlBase64 = Buffer.from(htmlContent).toString('base64');
    await printWindow.loadURL(`data:text/html;charset=utf-8;base64,${htmlBase64}`);

    // 4. Imprimimos a PDF
    const pdfData = await printWindow.webContents.printToPDF({
      printBackground: true, // Imprimir colores de fondo
      pageSize: 'A4',
      margins: { top: 1, bottom: 1, left: 1, right: 1 } // Márgenes en cm (aprox)
    });

    // 5. Guardamos el archivo
    await fs.writeFile(filePath, pdfData);

    printWindow.close(); // Limpieza
    return { success: true, filePath };

  } catch (error: any) {
    printWindow.close();
    console.error(error);
    return { success: false, error: error.message };
  }
});

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
