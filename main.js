// Waiting until document has loaded
window.onload = () => {

  // YOUR CODE GOES HERE
  console.log("YOUR CODE GOES HERE");

  // Load the data set from the assets folder:

  d3.csv("cars.csv").then(function(data) {
    // Daten verarbeiten, z.B. Werte aus Strings in Zahlen konvertieren
    data.forEach(d => {
      d.x = +d.x;  
      d.y = +d.y;
    });
  
    var svg = d3.select('svg'),
        width = +svg.attr('width'),
        height = +svg.attr('height');

    // Skalen für Achsen definieren
    var xScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
      .range([0, width]);
  
    var yScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
      .range([height, 0]);
  
    // Achsen zeichnen
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));
  
    svg.append("g")
      .call(d3.axisLeft(yScale));
  
    // Punkte zeichnen
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 5);
  });
};
