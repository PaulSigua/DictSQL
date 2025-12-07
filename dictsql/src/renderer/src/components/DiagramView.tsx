import { useMemo, useEffect } from 'react';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // ¡Importante! Estilos base

import { TableDefinition } from '../../../shared/types';
import { TableNode } from './diagram/TableNode'; // Nuestro nodo personalizado
import { getLayoutedElements } from '../utils/layout';

// Registramos nuestros tipos de nodos personalizados
const nodeTypes = {
  table: TableNode,
};

interface DiagramViewProps {
  tables: TableDefinition[];
}

export function DiagramView({ tables }: DiagramViewProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (tables.length === 0) return;

    // 1. Transformar Tablas -> Nodos
    const initialNodes: Node[] = tables.map((table) => ({
      id: table.name,
      type: 'table', // Debe coincidir con 'nodeTypes'
      position: { x: 0, y: 0 }, // El layout lo arreglará después
      data: { tableData: table },
    }));

    // 2. Transformar FKs -> Aristas (Edges)
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

    // 3. Aplicar Auto-Layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [tables, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#222' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView // Centrar el diagrama al inicio
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}