import { useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, 
  Edit, 
  MousePointer, 
  CheckCircle, 
  Eye, 
  GitBranch, 
  Clock,
  Play
} from "lucide-react";
import type { FlowNode, FlowConnection } from "@shared/schema";

interface FlowCanvasProps {
  nodes: FlowNode[];
  connections: FlowConnection[];
  onNodesChange: (nodes: FlowNode[]) => void;
  onConnectionsChange: (connections: FlowConnection[]) => void;
  selectedNode: FlowNode | null;
  onNodeSelect: (node: FlowNode | null) => void;
}

const iconMap = {
  'start': Play,
  'navigate-record': ArrowRight,
  'set-field': Edit,
  'click-button': MousePointer,
  'verify-field': CheckCircle,
  'verify-visibility': Eye,
  'condition': GitBranch,
  'wait': Clock,
};

const colorMap = {
  'start': 'border-green-500 bg-green-50',
  'navigate-record': 'border-blue-500 bg-blue-50',
  'set-field': 'border-green-500 bg-green-50',
  'click-button': 'border-orange-500 bg-orange-50',
  'verify-field': 'border-green-500 bg-green-50',
  'verify-visibility': 'border-blue-500 bg-blue-50',
  'condition': 'border-orange-500 bg-orange-50',
  'wait': 'border-gray-500 bg-gray-50',
};

function CustomNode({ data, selected }: NodeProps) {
  const IconComponent = iconMap[data.type as keyof typeof iconMap] || Edit;
  const nodeColor = colorMap[data.type as keyof typeof colorMap] || 'border-gray-300 bg-white';
  
  return (
    <Card className={`p-4 min-w-[200px] border-2 ${nodeColor} ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      
      <div className="flex items-center gap-3 mb-2">
        <IconComponent className="h-5 w-5 text-gray-700" />
        <span className="font-medium text-gray-900">{data.label}</span>
      </div>
      
      {data.entity && (
        <div className="text-sm text-gray-600 mb-1">
          Entity: <span className="font-medium">{data.entity}</span>
        </div>
      )}
      
      {data.field && (
        <div className="text-sm text-gray-600 mb-1">
          Field: <span className="font-medium">{data.field}</span>
        </div>
      )}
      
      {data.value && (
        <div className="text-sm text-gray-600 mb-1">
          Value: <span className="font-medium">{data.value}</span>
        </div>
      )}
      
      {data.action && (
        <div className="text-sm text-gray-600 mb-1">
          Action: <span className="font-medium">{data.action}</span>
        </div>
      )}
      
      {data.expected && (
        <div className="text-sm text-gray-600 mb-1">
          Expected: <span className="font-medium">{data.expected}</span>
        </div>
      )}
      
      {data.buttonType && (
        <div className="text-sm text-gray-600 mb-1">
          Button: <span className="font-medium">{data.buttonType}</span>
        </div>
      )}
      
      {data.delay && (
        <div className="text-sm text-gray-600 mb-1">
          Delay: <span className="font-medium">{data.delay}ms</span>
        </div>
      )}
    </Card>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

export default function FlowCanvas({
  nodes: flowNodes,
  connections: flowConnections,
  onNodesChange,
  onConnectionsChange,
  selectedNode,
  onNodeSelect,
}: FlowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Convert FlowNode[] to ReactFlow Node[]
  const reactFlowNodes: Node[] = flowNodes.map(node => ({
    id: node.id,
    type: 'custom',
    position: node.position,
    data: { ...node.data, type: node.type },
    selected: selectedNode?.id === node.id,
  }));

  // Convert FlowConnection[] to ReactFlow Edge[]
  const reactFlowEdges: Edge[] = flowConnections.map(conn => ({
    id: conn.id,
    source: conn.source,
    target: conn.target,
    sourceHandle: conn.sourceHandle,
    targetHandle: conn.targetHandle,
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  }));

  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(reactFlowNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(reactFlowEdges);

  // Update ReactFlow nodes when flowNodes change
  useEffect(() => {
    setNodes(reactFlowNodes);
  }, [flowNodes]);

  // Update ReactFlow edges when flowConnections change
  useEffect(() => {
    setEdges(reactFlowEdges);
  }, [flowConnections]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newConnection: FlowConnection = {
        id: `e${flowConnections.length + 1}`,
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
      };
      
      onConnectionsChange([...flowConnections, newConnection]);
      setEdges((eds) => addEdge(params, eds));
    },
    [flowConnections, onConnectionsChange, setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const flowNode = flowNodes.find(n => n.id === node.id);
      onNodeSelect(flowNode || null);
    },
    [flowNodes, onNodeSelect]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowBounds) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      const newNode: FlowNode = {
        id: `${type}-${Date.now()}`,
        type: type as any,
        position,
        data: {
          label: type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        },
      };

      onNodesChange([...flowNodes, newNode]);
    },
    [flowNodes, onNodesChange]
  );

  const onNodesChangeWrapper = useCallback(
    (changes: any[]) => {
      onNodesChangeInternal(changes);
      
      // Update position changes back to flowNodes
      const nodeChanges = changes.filter(change => change.type === 'position' && change.position);
      if (nodeChanges.length > 0) {
        const updatedFlowNodes = flowNodes.map(node => {
          const change = nodeChanges.find(c => c.id === node.id);
          if (change && change.position) {
            return { ...node, position: change.position };
          }
          return node;
        });
        onNodesChange(updatedFlowNodes);
      }
    },
    [onNodesChangeInternal, flowNodes, onNodesChange]
  );

  return (
    <div className="flex-1 bg-gray-50 relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeWrapper}
        onEdgesChange={onEdgesChangeInternal}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>
      
      {flowNodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-500 max-w-md">
            <MousePointer className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Build Your Test Flow</p>
            <p className="text-sm">Drag components from the left panel to create automated test scenarios for Dynamics 365</p>
          </div>
        </div>
      )}
    </div>
  );
}
