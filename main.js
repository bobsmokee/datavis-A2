window.onload = () => {
  const xKey = "Horsepower(HP)";
  const yKey = "Retail Price";
  const colorKey = "Type";
  const attributes = [
    "Name",
    "Type",
    "Retail Price",
    "Engine Size (l)",
    "Horsepower(HP)",
    "Width"
  ];

  d3.csv("cars.csv").then(data => {
    data.forEach(d => {
      d.x = +d[xKey];
      d.y = +d[yKey];
    });

    const svg = d3.select("svg"),
          margin = {top: 30, right: 160, bottom: 50, left: 60},
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const types = Array.from(new Set(data.map(d => d[colorKey])));
    const color = d3.scaleOrdinal().domain(types).range(d3.schemeCategory10);

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x)).nice().range([0, width]);
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.y)).nice().range([height, 0]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));
    g.append("g")
      .call(d3.axisLeft(yScale));

    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .attr("x", margin.left + width/2)
      .attr("y", margin.top + height + 40)
      .text(xKey);

    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "middle")
      .attr("y", margin.left/3)
      .attr("x", -(margin.top + height/2))
      .attr("transform", "rotate(-90)")
      .text(yKey);

    // Punkte zeichnen mit klickbarer Auswahl
    const points = g.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 4)
      .attr("fill", d => color(d[colorKey]))
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("click", function(event, d) {
        points.attr("stroke", "white").attr("stroke-width", 1);
        d3.select(this).attr("stroke", "black").attr("stroke-width", 3);

        // --- Details anzeigen ---
        let html = "<b>Details:</b><br><table>";
        attributes.forEach(attr =>
          html += `<tr><td>${attr}</td><td>${d[attr]}</td></tr>`
        );
        html += "</table>";
        d3.select("#details").html(html);
      });

    // Legende bleibt wie gehabt...
    const legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${margin.left+width+10},${margin.top})`);
    types.forEach((t, i) => {
      legend.append("circle")
        .attr("cx", 0)
        .attr("cy", i*22)
        .attr("r", 6)
        .attr("fill", color(t));
      legend.append("text")
        .attr("x", 16)
        .attr("y", i*22+5)
        .text(t)
        .attr("alignment-baseline", "middle")
        .style("font-size", "14px");
    });
  });
};


