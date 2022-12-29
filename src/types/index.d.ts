import { D3Graph } from "../visualizer/d3";
import { AsyncAPIDocument } from "@asyncapi/parser";

declare global {
  interface Window {
    asyncApiPortal?: {
      process?: (yaml: string[]) => Promise<AsyncApiPortalResponse>;
      d3Renderer?: (data: D3Graph) => void;
    };
    AsyncAPIParser: {
      parse: (yaml: string) => Promise<AsyncAPIDocument>;
    };
  }
}

export {};
