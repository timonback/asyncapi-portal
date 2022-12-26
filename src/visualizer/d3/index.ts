import { Graph, LinkDirection } from "../../types/main";
import fs from "fs/promises";
import * as path from "path";
import { writeToFile } from "../../config";

type NodeId = number;
type NodeRef = { index: NodeId };

interface D3Graph {
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

export async function renderD3Html(graph: Graph, htmlD3Path: string) {
  let template = (
    await fs.readFile(path.join(__dirname, "template.html"))
  ).toString();

  const jsCode = (await fs.readFile(path.join(__dirname, "d3.js"))).toString();
  const data = JSON.stringify(convertGraphToD3Model(graph), undefined, 2);

  template = template.replace('"PLACEHOLDER-CODE"', jsCode);
  template = template.replace('"PLACEHOLDER-DATA"', data);

  await writeToFile(htmlD3Path, template);
}

function convertGraphToD3Model(graph: Graph): D3Graph {
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
        type: "queue",
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
