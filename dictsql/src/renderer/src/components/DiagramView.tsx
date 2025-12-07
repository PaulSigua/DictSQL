import { useMemo, useEffect } from 'react';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // estilos base
import { TableDefinition } from '../../../shared/types';
import { TableNode } from './diagram/TableNode'; // nodo personalizado
import { getLayoutedElements } from '../utils/layout';

// Registramos nuestros tipos de nodos personalizados
const nodeTypes = {
  table: TableNode,
};

interface DiagramViewProps {
    tables: TableDefinition[];
    onNodeClick: (event: React.MouseEvent, node: Node) => void;
}

export function DiagramView({ tables, onNodeClick }: DiagramViewProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (tables.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // crear Set de nombres visibles para búsqueda rápida (O(1))
    // Esto nos sirve para saber si el "target" de una relación existe actualmente
    const visibleTableNames = new Set(tables.map(t => t.name));

    // transformar Tablas a Nodos
    const initialNodes: Node[] = tables.map((table) => ({
      id: table.name,
      type: 'table', 
      position: { x: 0, y: 0 },
      data: { tableData: table },
    }));

    // transformar FKs a Aristas (CON FILTRO DE SEGURIDAD)
    const initialEdges: Edge[] = [];
    tables.forEach((table) => {
      table.foreignKeys.forEach((fk) => {
        // LÓGICA CLAVE: Solo crear la línea si la tabla destino TAMBIÉN está visible
        if (visibleTableNames.has(fk.targetTable)) {
          initialEdges.push({
            id: `${table.name}-${fk.constraintName}`,
            source: table.name,
            target: fk.targetTable,
            animated: true,
            style: { stroke: '#555' },
          });
        }
      });
    });

    // layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [tables, setNodes, setEdges]); // Se ejecuta cada vez que 'tables' cambia (al filtrar)

  return (
    <div style={{ width: '100%', height: '100%', background: '#222' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}