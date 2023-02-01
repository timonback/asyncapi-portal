import { VisualizerD3Result } from "../visualizer/d3";

export enum LinkDirection {
  "publish",
  "subscribe",
}

export type GraphServers = {
  [key: string]: {
    id: number;
  };
};
export type GraphApplications = {
  [key: string]: {
    id: number;
  };
};

export interface GraphQueues {
  [key: string]: {
    id: number;
    serverId: number;
  };
}

export interface GraphLink {
  applicationId: number;
  queueId: number;
  direction: LinkDirection;
  messageType: string;
}

export interface Graph {
  servers: GraphServers;
  applications: GraphApplications;
  queues: GraphQueues;
  links: GraphLink[];
}

export interface AsyncApiPortalResponse {
  graph: Graph;
  plugins: {
    renderer: {
      d3?: VisualizerD3Result;
    };
  };
}
