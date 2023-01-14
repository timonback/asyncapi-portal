import { Graph, LinkDirection } from "../../types/main";

type NodeId = number;
type NodeRef = { index: NodeId };

export interface D3Graph {
  nodes: {
    id: NodeId;
    name: string;
    type: string;
  }[];
  links: {
    source: NodeRef;
    target: NodeRef;
    type: string;
    messageType: string;
  }[];
}

export interface VisualizerD3Result {
  graph: D3Graph;
}

export async function renderD3(graph: Graph): Promise<VisualizerD3Result> {
  const d3Graph = convertToD3Model(graph);

  return {
    graph: d3Graph,
  };
}

export function convertToD3Model(graph: Graph): D3Graph {
  let nodes: D3Graph["nodes"] = [];
  for (let applicationsKey in graph.applications) {
    nodes = [
      ...nodes,
      {
        id: graph.applications[applicationsKey].id,
        name: applicationsKey,
        type: "application",
      },
    ];
  }
  for (let queuesKey in graph.queues) {
    nodes = [
      ...nodes,
      {
        id: graph.queues[queuesKey].id,
        name: queuesKey,
        type: "topic",
      },
    ];
  }

  let links: D3Graph["links"] = [];
  graph.links.forEach((link) => {
    if (link.direction === LinkDirection.publish) {
      links = [
        ...links,
        {
          source: { index: link.queueId },
          target: { index: link.applicationId },
          type: "publish",
          messageType: link.messageType,
        },
      ];
    } else if (link.direction === LinkDirection.subscribe) {
      links = [
        ...links,
        {
          source: { index: link.applicationId },
          target: { index: link.queueId },
          type: "subscribe",
          messageType: link.messageType,
        },
      ];
    }
  });

  return {
    nodes,
    links,
  };
}
