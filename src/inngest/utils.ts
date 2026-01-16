import toposort from "toposort";
import {
  Connection,
  Node,
} from "@/generated/prisma/client";
import { inngest } from "./client";

//确定执行顺序且保证节点不丢失
export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {
  if (connections.length === 0) {
    return nodes;
  }

  const edges: [string, string][] = connections.map(
    (connection) => [
      connection.fromNodeId,
      connection.toNodeId,
    ]
  );
  const connectedNoteIds = new Set<string>();
  for (const connection of connections) {
    connectedNoteIds.add(connection.fromNodeId);
    connectedNoteIds.add(connection.toNodeId);
  }

  for (const node of nodes) {
    if (!connectedNoteIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);
    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Cycle detected")
    ) {
      throw new Error("工作流节点存在循环依赖");
    }
    throw error;
  }

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return sortedNodeIds
    .map((id) => nodeMap.get(id)!)
    .filter(Boolean);
};

export const sendWorkflowExecution = async (data: {
  workflowId: string;
  [key: string]: any;
}) => {
  await inngest.send({
    name: "workflows/execute.workflow",
    data,
  });
};
