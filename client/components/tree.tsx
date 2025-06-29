import React from "react";

interface TreeNode {
  head: string;
  child: TreeNode[];
}

interface TreeProps {
  node: TreeNode;
}

interface NodeProps {
  node: TreeNode;
  x: number;
  y: number;
  onNodeClick?: (node: TreeNode) => void;
}

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const Edge: React.FC<EdgeProps> = ({ x1, y1, x2, y2 }) => {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#6b7280"
      strokeWidth={2}
      className="pointer-events-none"
    />
  );
};

interface TreeLayoutProps {
  node: TreeNode;
  x: number;
  y: number;
  level: number;
  parentX?: number;
  parentY?: number;
  onNodeClick?: (node: TreeNode) => void;
}

const TreeLayout: React.FC<TreeLayoutProps> = ({
  node,
  x,
  y,
  level,
  parentX,
  parentY,
  onNodeClick,
}) => {
  const levelHeight = 100;
  const spacing = 80;

  const getSubtreeWidth = (node: TreeNode): number => {
    if (node.child.length === 0) return 1;
    return node.child.reduce((sum, child) => sum + getSubtreeWidth(child), 0);
  };

  const totalWidth = getSubtreeWidth(node);
  const startX = x - (totalWidth * spacing) / 2 + spacing / 2;

  let currentX = startX;
  const childPositions = node.child.map((child) => {
    const subtreeWidth = getSubtreeWidth(child);
    const childX = currentX + (subtreeWidth * spacing) / 2 - spacing / 2;
    const childY = y + levelHeight;
    currentX += subtreeWidth * spacing;
    return { x: childX, y: childY, node: child };
  });

  return (
    <g>
      {parentX !== undefined && parentY !== undefined && (
        <Edge x1={parentX} y1={parentY} x2={x} y2={y} />
      )}

      <TreeNodeComponent node={node} x={x} y={y} onNodeClick={onNodeClick} />

      {childPositions.map((child, index) => (
        <React.Fragment key={index}>
          <Edge x1={x} y1={y} x2={child.x} y2={child.y} />
          <TreeLayout
            node={child.node}
            x={child.x}
            y={child.y}
            level={level + 1}
            parentX={x}
            parentY={y}
            onNodeClick={onNodeClick}
          />
        </React.Fragment>
      ))}
    </g>
  );
};

const TreeNodeComponent: React.FC<NodeProps> = ({
  node,
  x,
  y,
  onNodeClick,
}) => {
  return (
    <g className="transition-all duration-200 ease-in-out">
      <circle
        cx={x}
        cy={y}
        r={25}
        fill="#3b82f6"
        stroke="#1e40af"
        strokeWidth={2}
        className="cursor-pointer transition hover:fill-blue-500 hover:stroke-blue-800 drop-shadow-md"
        onClick={() => onNodeClick?.(node)}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
        className="pointer-events-none select-none"
      >
        {node.head}
      </text>
    </g>
  );
};

const VisualTree: React.FC<TreeProps> = ({ node }) => {
  const [selectedNode, setSelectedNode] = React.useState<TreeNode | null>(null);

  const handleNodeClick = (clickedNode: TreeNode) => {
    setSelectedNode(clickedNode);
  };

  const getSvgWidth = (node: TreeNode): number => {
    const getWidth = (n: TreeNode): number =>
      n.child.length === 0
        ? 1
        : n.child.map(getWidth).reduce((a, b) => a + b, 0);
    return Math.max(600, getWidth(node) * 80);
  };

  const getSvgHeight = (node: TreeNode): number => {
    const getDepth = (n: TreeNode): number =>
      n.child.length === 0 ? 1 : 1 + Math.max(...n.child.map(getDepth));
    return getDepth(node) * 100;
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-6 py-8 bg-gradient-to-b from-sky-50 to-white">
      {selectedNode && (
        <div className="mb-6 w-full max-w-md p-4 bg-blue-100/80 border border-blue-300 rounded-xl shadow-sm">
          <p className="text-blue-900 text-base font-medium">
            <strong>Selected Node:</strong> {selectedNode.head}
            {selectedNode.child.length > 0 && (
              <span className="ml-2 text-sm text-blue-700">
                ({selectedNode.child.length} children)
              </span>
            )}
          </p>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-xl p-4 border border-gray-200 overflow-auto max-w-full max-h-[80vh]">
        <svg
          width={getSvgWidth(node)}
          height={getSvgHeight(node)}
          className="border border-gray-300 rounded-lg"
        >
          <TreeLayout
            node={node}
            x={getSvgWidth(node) / 2}
            y={50}
            level={0}
            onNodeClick={handleNodeClick}
          />
        </svg>
      </div>

      <div className="mt-5 text-sm text-gray-600 italic">
        Click on any node to select it.
      </div>
    </div>
  );
};

export default VisualTree;
