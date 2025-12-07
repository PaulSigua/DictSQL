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

export function DiagramView({ tables, onNodeClick }: DiagramViewProps ) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (tables.length === 0) return;

    // transformar Tablas en Nodos
    const initialNodes: Node[] = tables.map((table) => ({
      id: table.name,
      type: 'table',
      position: { x: 0, y: 0 },
      data: { tableData: table },
    }));

    // transformar FKs en Aristas (Edges)
    const initialEdges: Edge[] = [];
    tables.forEach((table) => {
      table.foreignKeys.forEach((fk) => {
        initialEdges.push({
          id: `${table.name}-${fk.constraintName}`,
          source: table.name,        // Tabla Origen (donde está la FK)
          target: fk.targetTable,    // Tabla Destino
          animated: true,            // Línea animada (opcional)
          style: { stroke: '#fff' }, // Color de la línea
        });
      });
    });

    // aplicar Auto-Layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [tables, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '100%', background: '#222' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}