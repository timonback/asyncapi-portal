const types = [0, 1];
const color = d3.scaleOrdinal(types, d3.schemeCategory10);
const width = 800;
const height = 600;

function render(data) {
  const links = data.links.map((d) => Object.create(d));
  const nodes = data.nodes.map((d) => Object.create(d));
  console.log(links, nodes);

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody().strength(-450))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .force(
      "collide",
      d3.forceCollide(function (d) {
        return 80;
      })
    );

  const svg = d3
    .select("#d3Plot")
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .style("font", "12px sans-serif");

  // Per-type markers, as they don't inherit styles.
  svg
    .append("defs")
    .selectAll("marker")
    .data(types)
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

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("id", (d) => `path-${d.source.index}-${d.target.index}`)
    .attr("stroke", (d) => color(d.type));
  // .attr("marker-end", (d) => `url(${new URL(`#arrow-${d.type}`, location)})`);

  var text = svg
    .append("g")
    .selectAll("path")
    .data(links)
    .join("g")
    .append("text")
    .attr("x", 6)
    .attr("dy", 15);

  text
    .append("textPath")
    .attr("stroke", "black")
    .attr("xlink:href", (d) => {
      var source = links[d.index].source.index;
      var target = links[d.index].target.index;
      return `#path-${source}-${target}`;
    })
    .text((d) => {
      var source = links[d.index].source.index;
      var target = links[d.index].target.index;
      return `path-${source}-${target}`;
    });

  const node = svg
    .append("g")
    .attr("fill", "currentColor")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .call(drag(simulation));

  node
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("color", "green");

  node
    .append("circle")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .attr("r", 4);

  node
    .append("text")
    .attr("x", 8)
    .attr("y", "0.31em")
    .text((d) => d.id + "-test2")
    .clone(true)
    .lower()
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 5);

  simulation.on("tick", () => {
    link.attr("d", (d) => linkArc(d, nodes));
    node.attr("transform", (d) => `translate(${d.x},${d.y})`);
  });

  // invalidation.then(() => simulation.stop());

  return svg.node();
}

function linkArc(d, nodes) {
  const source = nodes[d.source.index];
  const target = nodes[d.target.index];
  const r = Math.hypot(target.x - source.x, target.y - source.y);
  return `
    M${source.x},${source.y}
    A${r},${r} 0 0,1 ${target.x},${target.y}
  `;
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
