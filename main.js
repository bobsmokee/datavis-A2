window.onload = () => {
  // Wähle beliebige Spalten für x- und y-Achse
  const xKey = "Horsepower(HP)";
  const yKey = "Retail Price";
  const colorKey = "Type"; // Legende nach Fahrzeugtyp

  d3.csv("cars.csv").then(data => {
    data.forEach(d => {
      d.x = +d[xKey];
      d.y = +d[yKey];
    });

    var svg = d3.select("svg"),
        margin = {top: 30, right: 160, bottom: 50, left: 60},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Farbskala für Fahrzeugtypen
    const types = Array.from(new Set(data.map(d => d[colorKey])));
    const color = d3.scaleOrdinal()
      .domain(types)
      .range(d3.schemeCategory10);

    // Skalen
    var xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .nice()
      .range([0, width]);
    var yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.y))
      .nice()
      .range([height, 0]);

    // Achsen
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));
    g.append("g")
      .call(d3.axisLeft(yScale));

    // Achsenbeschriftungen
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

    // Punkte zeichnen
    g.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 4)
      .attr("fill", d => color(d[colorKey]));

    // Legende
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
