const d3Settings = {
  types: ["publish", "subscribe"],
  width: 800,
  height: 600,
};

const render = function render(data) {
  const nodes = data.nodes.map((d) => Object.create(d));
  const links = data.links.map((d) => Object.create(d));
  const nodesLookup = {};
  nodes.forEach((d) => (nodesLookup[d.id] = d));
  console.log("Nodes", nodes, nodesLookup);
  console.log("Links", links);
  const color = d3.scaleOrdinal(d3Settings.types, d3.schemeCategory10);

  const simulation = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(links))
    .force(
      "charge",
      d3.forceManyBody().strength((d) => (d.type === "topic" ? -450 : -800))
    )
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force(
      "collide",
      d3.forceCollide((d) => 80)
    );

  const svg = d3
    .select("#d3Plot")
    .append("svg")
    .attr("viewBox", [
      -d3Settings.width / 2,
      -d3Settings.height / 2,
      d3Settings.width,
      d3Settings.height,
    ])
    .style("font", "12px sans-serif");

  // Per-type markers, as they don't inherit styles.
  const markers = svg.append("defs");
  markers
    .selectAll("marker")
    .data(d3Settings.types)
    .join("marker")
    .attr("id", (d) => `arrow-${d}`)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -0.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", color)
    .attr("d", "M0,-5L10,0L0,5");
  // apache kafka svg
  markers
    .append("svg")
    .attr("id", `apache-kafka`)
    .attr("viewBox", "0 0 256 416")
    .attr("orient", "auto")
    .append("path")
    .attr("fill", "#231f20")
    .attr(
      "d",
      "M201.816 230.216c-16.186 0-30.697 7.171-40.634 18.461l-25.463-18.026c2.703-7.442 4.255-15.433 4.255-23.797 0-8.219-1.498-16.076-4.112-23.408l25.406-17.835c9.936 11.233 24.409 18.365 40.548 18.365 29.875 0 54.184-24.305 54.184-54.184 0-29.879-24.309-54.184-54.184-54.184-29.875 0-54.184 24.305-54.184 54.184 0 5.348.808 10.505 2.258 15.389l-25.423 17.844c-10.62-13.175-25.911-22.374-43.333-25.182v-30.64c24.544-5.155 43.037-26.962 43.037-53.019C124.171 24.305 99.862 0 69.987 0 40.112 0 15.803 24.305 15.803 54.184c0 25.708 18.014 47.246 42.067 52.769v31.038C25.044 143.753 0 172.401 0 206.854c0 34.621 25.292 63.374 58.355 68.94v32.774c-24.299 5.341-42.552 27.011-42.552 52.894 0 29.879 24.309 54.184 54.184 54.184 29.875 0 54.184-24.305 54.184-54.184 0-25.883-18.253-47.553-42.552-52.894v-32.775a69.965 69.965 0 0 0 42.6-24.776l25.633 18.143c-1.423 4.84-2.22 9.946-2.22 15.24 0 29.879 24.309 54.184 54.184 54.184 29.875 0 54.184-24.305 54.184-54.184 0-29.879-24.309-54.184-54.184-54.184zm0-126.695c14.487 0 26.27 11.788 26.27 26.271s-11.783 26.27-26.27 26.27-26.27-11.787-26.27-26.27c0-14.483 11.783-26.271 26.27-26.271zm-158.1-49.337c0-14.483 11.784-26.27 26.271-26.27s26.27 11.787 26.27 26.27c0 14.483-11.783 26.27-26.27 26.27s-26.271-11.787-26.271-26.27zm52.541 307.278c0 14.483-11.783 26.27-26.27 26.27s-26.271-11.787-26.271-26.27c0-14.483 11.784-26.27 26.271-26.27s26.27 11.787 26.27 26.27zm-26.272-117.97c-20.205 0-36.642-16.434-36.642-36.638 0-20.205 16.437-36.642 36.642-36.642 20.204 0 36.641 16.437 36.641 36.642 0 20.204-16.437 36.638-36.641 36.638zm131.831 67.179c-14.487 0-26.27-11.788-26.27-26.271s11.783-26.27 26.27-26.27 26.27 11.787 26.27 26.27c0 14.483-11.783 26.271-26.27 26.271z"
    );
  markers
    .append("svg")
    .attr("id", `application`)
    .attr("viewBox", "0 0 512 512")
    .attr("orient", "auto")
    .append("path")
    .attr("fill", "#231f20")
    .attr(
      "d",
      "M 480 208 h -38.3 c -4.5 -17.6 -11.4 -34.1 -20.5 -49.4 l 27.1 -27.1 c 12.5 -12.5 12.5 -32.8 0 -45.3 l -22.6 -22.6 c -12.5 -12.5 -32.8 -12.5 -45.3 0 L 353.4 90.8 c -15.3 -9 -31.8 -15.9 -49.4 -20.4 V 32 c 0 -17.7 -14.3 -32 -32 -32 h -32 c -17.7 0 -32 14.3 -32 32 v 38.3 c -17.6 4.5 -34.1 11.4 -49.4 20.4 l -27.1 -27.1 c -12.5 -12.5 -32.8 -12.5 -45.3 0 L 63.7 86.3 c -12.5 12.5 -12.5 32.8 0 45.3 l 27.1 27.1 c -9 15.3 -15.9 31.8 -20.4 49.4 H 32 c -17.7 0 -32 14.3 -32 32 v 32 c 0 17.7 14.3 32 32 32 h 38.3 c 4.5 17.6 11.4 34.1 20.4 49.4 l -27.1 27.1 c -12.5 12.5 -12.5 32.8 0 45.3 l 22.6 22.6 c 12.5 12.5 32.8 12.5 45.3 0 l 27.1 -27.1 c 15.3 9 31.8 15.9 49.4 20.5 V 480 c 0 17.7 14.3 32 32 32 h 32 c 17.7 0 32 -14.3 32 -32 v -38.3 c 17.6 -4.5 34.1 -11.4 49.4 -20.4 l 27.1 27.1 c 12.5 12.5 32.8 12.5 45.3 0 l 22.6 -22.6 c 12.5 -12.5 12.5 -32.8 0 -45.3 l -27.1 -27.1 c 9 -15.3 15.9 -31.8 20.4 -49.4 H 480 c 17.7 0 32 -14.3 32 -32 v -32 C 512 222.3 497.7 208 480 208"
    );

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("id", (d) => `path-${d.source.index}-${d.target.index}`)
    .attr("class", (d) => {
      return `link-${d.source.index} link-${d.target.index}`;
    })
    .attr("stroke", (d) => color(d.type))
    .attr("marker-end", (d) => `url(${new URL(`#arrow-${d.type}`, location)})`);

  var linkLabel = svg
    .append("g")
    .selectAll("path")
    .data(links)
    .join("g")
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", 20) // overwritten by simulation step
    .attr("dy", -5);

  linkLabel
    .append("textPath")
    .attr("stroke", "black")
    .attr("stroke-width", 0.2)
    .attr("font-size", "smaller")
    .attr("class", (link) => {
      var source = links[link.index].source.index;
      var target = links[link.index].target.index;
      return `linkLabel-${source} linkLabel-${target}`;
    })
    .attr("href", (link) => {
      var source = links[link.index].source.index;
      var target = links[link.index].target.index;
      return `#path-${source}-${target}`;
    })
    .text((link) => {
      return `${link.messageType}`;
    });

  const node = svg
    .append("g")
    .attr("fill", "currentColor")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .call(drag(simulation))
    .on("dblclick", (n) => {
      const active = !n.target.active;
      const newOpacity = active ? 0 : 1;

      const nodeId = d3.select(n.target).data()[0].id;

      // d3.selectAll("g g use").attr("opacity", newOpacity);
      d3.selectAll("g path").attr("opacity", newOpacity);
      d3.selectAll("g g text textPath").attr("opacity", newOpacity);
      // d3.selectAll(`g g use.node-${nodeId}`).attr("opacity", 1);
      d3.selectAll(`g path.link-${nodeId}`).attr("opacity", 1);
      d3.selectAll(`g g text textPath.linkLabel-${nodeId}`).attr("opacity", 1);

      n.target.active = active;
    });

  const nodeUse = node.append("use").attr("class", (d) => {
    return `node-${d.id}`;
  });
  nodeUse
    .filter((node) => node.type === "topic")
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", -10)
    .attr("y", -10)
    .attr("href", "#apache-kafka");
  nodeUse
    .filter((node) => node.type !== "topic")
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", -10)
    .attr("y", -10)
    .attr("href", "#application");

  const nodeLabels = node.append("text").attr("x", 8).attr("y", "0.31em");
  nodeLabels.append("tspan").text((node) => node.name);
  nodeLabels
    .append("tspan")
    .text((node) => node.type)
    .attr("font-size", "bigger")
    .attr("x", 10)
    .attr("y", "1.31em");
  nodeLabels
    .clone(true)
    .lower()
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 5);

  simulation.on("tick", () => {
    link.attr("d", (link) => linkArc(link, nodesLookup));
    linkLabel.attr("x", (linkText) => linkTextArc(linkText, nodesLookup));
    node.attr("transform", (link) => `translate(${link.x},${link.y})`);
  });

  return svg.node();
};

function linkArc(link, nodes) {
  const source = nodes[link.source.index];
  const target = nodes[link.target.index];
  const r = Math.hypot(target.x - source.x, target.y - source.y);
  return `
    M${source.x},${source.y}
    A${r},${r} 0 0,1 ${target.x},${target.y}
  `;
}

function linkTextArc(link, nodes) {
  const source = nodes[link.source.index];
  const target = nodes[link.target.index];
  return (
    Math.sqrt(
      Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)
    ) / 2
  );
}

const drag = (simulation) => {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

window.asyncApiPortal = window.asyncApiPortal || {};
window.asyncApiPortal.d3Renderer = render;
