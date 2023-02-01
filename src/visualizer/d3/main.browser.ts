import { render } from "./htmlRenderer.template.node";

window.asyncApiPortal = window.asyncApiPortal || {};
window.asyncApiPortal.renderer = window.asyncApiPortal.renderer || {};
window.asyncApiPortal.renderer.d3 = render;
