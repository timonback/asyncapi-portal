import { D3Graph } from "../visualizer/d3";
import { AsyncAPIDocument } from "@asyncapi/parser";
import { Graph } from "./main";

declare global {
  interface Window {
    asyncApiPortal?: {
      parser?: {
        asyncApiParser?: (yaml: string[]) => Promise<Graph>;
      };
      process?: (
        yaml: string[],
        parser: (yaml: string[]) => Promise<Graph>
      ) => Promise<AsyncApiPortalResponse>;
      renderer?: {
        d3?: (data: D3Graph) => void;
      };
    };

    // provided by @asyncapi/parser
    AsyncAPIParser: {
      parse: (yaml: string) => Promise<AsyncAPIDocument>;
    };
  }
}

export {};
