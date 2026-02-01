import { useState } from 'react'
import { ConnectForm } from './components/ConnectForm'
import { DiagramView } from './components/diagram/DiagramView'
import { PropertiesPanel } from './components/PropertiesPanel'
import { TopBar } from './layouts/TopBar'
import { TableDefinition } from '@shared/dto/database.dto'
import { Toaster } from 'react-hot-toast'
import { useToast } from './hooks/useToast'
function App(): React.JSX.Element {
  const toast = useToast()
  const [tables, setTables] = useState<TableDefinition[]>([])
  const [selectedTableName, setSelectedTableName] = useState<string | null>(null)
  const [currentFilePath, setCurrentFilePath] = useState<string | undefined>(undefined)

  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleSave = async (): Promise<void> => {
    if (tables.length === 0) return toast.error('No hay nada que guardar')

    const content = JSON.stringify({ tables }, null, 2)

    const result = await window.api.saveProject(content)
    if (result.success && result.filePath) {
      setCurrentFilePath(result.filePath)
      toast.success('Proyecto guardado correctamente')
    } else {
      toast.error(`Error: ${result.error}`)
    }
  }

  const handleOpen = async (): Promise<void> => {
    const result = await window.api.openProject()
    if (result.success && result.data) {
      setTables(result.data.tables)
      setCurrentFilePath(result.filePath)
      setSelectedTableName(null)
      toast.success('Proyecto abierto correctamente')
    } else {
      toast.error(`Error: ${result.error}`)
    }
  }

  const handleNew = (): void => {
    if (confirm('¿Estás seguro? Se perderán los cambios no guardados.')) {
      setTables([])
      setCurrentFilePath(undefined)
      setSelectedTableName(null)
    }
  }

  const handleConnectSuccess = (data: TableDefinition[]): void => setTables(data)
  const handleNodeClick = (_e: unknown, node: unknown): void => setSelectedTableName(node.id)

  const updateTableComment = (tableName: string, comment: string): void => {
    setTables((prev) => prev.map((t) => (t.name === tableName ? { ...t, comment } : t)))
  }
  const updateColumnComment = (tableName: string, colName: string, comment: string): void => {
    setTables((prev) =>
      prev.map((table) => {
        if (table.name !== tableName) return table
        const updatedColumns = table.columns.map((col) =>
          col.name === colName ? { ...col, comment } : col
        )
        return { ...table, columns: updatedColumns }
      })
    )
  }
  const selectedTable = tables.find((t) => t.name === selectedTableName) || null

  const handleExportMarkdown = async (): Promise<void> => {
    if (tables.length === 0) return toast.error('Sin datos')
    const result = await window.api.exportMarkdown(tables)
    if (result.success) toast.success(`Markdown guardado en: ${result.filePath}`)
    else if (result.error) toast.error(`Error: ${result.error}`)
  }

  const handleExportHtml = async (): Promise<void> => {
    if (tables.length === 0) return toast.error('Sin datos')
    const result = await window.api.exportHtml(tables)
    if (result.success) toast.success(`HTML guardado en: ${result.filePath}`)
    else if (result.error) toast.error(`Error: ${result.error}`)
  }

  const handleExportPdf = async (): Promise<void> => {
    if (tables.length === 0) return toast.error('Sin datos')
    const toastId = setTimeout(() => toast.info('Generando PDF... por favor espera'), 500)

    const result = await window.api.exportPdf(tables)
    clearTimeout(toastId)

    if (result.success) toast.success(`PDF guardado en: ${result.filePath}`)
    else if (result.error) toast.error(`Error: ${result.error}`)
  }

  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-gray-100 font-sans">
      <TopBar
        onSave={handleSave}
        onOpen={handleOpen}
        onNew={handleNew}
        onExportMarkdown={handleExportMarkdown}
        onExportHtml={handleExportHtml}
        onExportPdf={handleExportPdf}
        onSearch={setSearchTerm}
        projectName={currentFilePath}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 relative bg-dots-pattern">
          {tables.length === 0 ? (
            <div className="h-full flex items-center justify-center p-10">
              <ConnectForm onSuccess={handleConnectSuccess} />
            </div>
          ) : (
            <DiagramView tables={filteredTables} onNodeClick={handleNodeClick} />
          )}
        </div>

        {selectedTable && (
          <PropertiesPanel
            table={selectedTable}
            onClose={() => setSelectedTableName(null)}
            onUpdateTableComment={updateTableComment}
            onUpdateColumnComment={updateColumnComment}
          />
        )}
      </div>
      <Toaster />
    </div>
  )
}

export default App
