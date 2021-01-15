let width = 82;
let height = 400;
let mysvg = d3.select("aside").append("svg").attr("width", width).attr("height", height);

d3.json("static/data/count-people.json", function(data) {
    console.log(data);
    let dataset = [data.count["魏"], data.count["蜀"], data.count["吳"], data.count["晉"], data.count["他"]];
    let color = ["blue", "green", "red", "purple", "grey"];
    let faction = ["魏", "蜀", "吳", "晉", "他"];
    let ylinear = d3.scale.linear().domain([0, d3.max(dataset)]).range([0, 100]);
    let yPos = [];
    for (let i = 0; i < dataset.length; i++) {
        dataset[i] = ylinear(dataset[i]);
        yPos[i] = i == 0 ? 0 : dataset[i - 1] + yPos[i - 1];
    }
    let rectWidth = 80;
    let fontSize = 25;

    let g = mysvg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("g")

    g.append("rect")
        .attr("x", (width - rectWidth) / 2)
        .attr("y", function(d, i) {
            return yPos[i];
        })
        .attr("width", rectWidth)
        .attr("height", function(d) {
            return d;
        })
        .attr("fill", function(d, i) {
            return color[i];
        });

    g.append("text")
        .text(function(d, i) {
            return faction[i];
        })
        .attr("x", width / 2)
        .attr("y", function(d, i) {
            return yPos[i] + d / 2;
        })
        .attr("font-size", fontSize)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("dy", fontSize / 4);
});