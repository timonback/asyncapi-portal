import { processAsyncApiFiles } from "./index";

window.asyncApiPortal = window.asyncApiPortal || {};
window.asyncApiPortal.parser = window.asyncApiPortal.parser || {};
window.asyncApiPortal.parser.relaxedAsyncApiParser = processAsyncApiFiles;
