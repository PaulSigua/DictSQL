import { useEffect, JSX } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { TableDefinition } from '@shared/dto/database.dto'
import { TableNode } from './TableNode'
import { getLayoutedElements } from '../../utils/layout'
import { useTheme } from '../../contexts/ThemeContext'

// Registramos nuestros tipos de nodos personalizados
const nodeTypes = {
  table: TableNode
}

interface DiagramViewProps {
  tables: TableDefinition[]
  onNodeClick: (event: React.MouseEvent, node: Node) => void
}

export function DiagramView({ tables, onNodeClick }: DiagramViewProps): JSX.Element {
  const { effectiveTheme } = useTheme() // ✅ Obtener tema actual
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Solo recalcular layout cuando cambian las tablas (no en cada render)
  useEffect(() => {
    if (tables.length === 0) {
      setNodes([])
      setEdges([])
      return
    }

    // Crear Set de nombres visibles para búsqueda rápida
    const visibleTableNames = new Set(tables.map((t) => t.name))

    // Transformar Tablas a Nodos
    const initialNodes: Node[] = tables.map((table) => ({
      id: table.name,
      type: 'table',
      position: { x: 0, y: 0 },
      data: { tableData: table }
    }))

    // Transformar FKs a Aristas (con filtro de seguridad)
    const initialEdges: Edge[] = []
    tables.forEach((table) => {
      table.foreignKeys.forEach((fk) => {
        if (visibleTableNames.has(fk.targetTable)) {
          initialEdges.push({
            id: `${table.name}-${fk.constraintName}`,
            source: table.name,
            target: fk.targetTable,
            animated: true,
            style: {
              stroke: effectiveTheme === 'dark' ? '#6b7280' : '#9ca3af',
              strokeWidth: 2
            },
            markerEnd: {
              type: 'arrowclosed',
              color: effectiveTheme === 'dark' ? '#6b7280' : '#9ca3af'
            }
          })
        }
      })
    })

    // Layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    )

    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tables]) // ✅ Solo cuando cambian las tablas, NO effectiveTheme

  // Actualizar colores de edges cuando cambia el tema (sin resetear posiciones)
  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        style: {
          stroke: effectiveTheme === 'dark' ? '#6b7280' : '#9ca3af',
          strokeWidth: 2
        },
        markerEnd: {
          type: 'arrowclosed',
          color: effectiveTheme === 'dark' ? '#6b7280' : '#9ca3af'
        }
      }))
    )
  }, [effectiveTheme, setEdges])

  // Colores según tema
  const dotColor = effectiveTheme === 'dark' ? '#333333' : '#d1d5db'

  return (
    <div className="w-full h-full bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background color={dotColor} gap={16} variant={BackgroundVariant.Dots} />
        <Controls
          className="bg-surface border border-border rounded-lg shadow-lg"
          style={{
            button: {
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              borderBottom: '1px solid var(--color-border)'
            }
          }}
        />
      </ReactFlow>
    </div>
  )
}
