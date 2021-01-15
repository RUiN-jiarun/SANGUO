let margin = { top: 20, right: 180, bottom: 30, left: 50 };
let svgWidth = 1600 - margin.left - margin.right;
let svgHeight = 900 - margin.top - margin.bottom;
let period = document.getElementById("period");

let svg = d3.select("graph")
    .append('svg')
    .attr('width', 1600)
    .attr('height', 900)
var g = svg.append('g');
// var bg = svg.append('g');
	
var parseTime = d3.timeParse("%Y");

var x = d3.scaleTime().range([0, svgWidth]),
    y = d3.scaleLinear().range([svgHeight, 0]),
    z = d3.scaleOrdinal().domain(["曹操-魏","劉備-蜀","孫堅-吳","司馬懿-晉","董卓","呂布","劉表","袁紹","劉焉-劉璋"]).range(["blue","green","red","purple","black","grey","#FFCC00","cyan","#996600"]);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.price); });


var filterData = { "曹操-魏": true, "劉備-蜀": true, "孫堅-吳": true, "司馬懿-晉":true,"董卓": true, "呂布":true, "袁紹":true, "劉表":true,"劉焉-劉璋":true};

let rectL = svg.append('rect').attr('height',850).attr('fill','black').attr('x',0).attr('y',0).attr('opacity',0.2);
let rectR = svg.append('rect').attr('height',850).attr('fill','black').attr('opacity',0.2);
period.onchange = function() {
    lpy = 14;
    totallen = 1370;
    index = this.selectedIndex;
    console.log(index);
    switch (index) {
        case 0:
            rectL.attr('display','none');
            rectR.attr('display','none');
            console.log('clear');
            break;
        case 1:     // 185-189 -- 4
            rectL.attr('display','none');
            rectR.attr('display','inline-box')
                .attr('width', totallen - lpy*4)
                .attr('x', lpy*4)
                .attr('y', 0);
            break;
        case 2:     // 189-192 -- 3
            rectL.attr('display','inline-box')
                .attr('width',lpy*4);
            rectR.attr('display','inline-box')
                .attr('width', totallen - lpy*4 - lpy*3)
                .attr('x', lpy*4 + lpy*3)
                .attr('y', 0);
            break;
        case 3:     // 192-199 -- 7
            rectL.attr('display','inline-box')
                .attr('width',lpy*7);
            rectR.attr('display','inline-box')
                .attr('width', totallen - lpy*7 - lpy*7)
                .attr('x', lpy*7 + lpy*7)
                .attr('y', 0);
            break;        
        case 4:     // 199-205 -- 6
            rectL.attr('display','inline-box')
                .attr('width',lpy*14);
            rectR.attr('display','inline-box')
                .attr('width', totallen - lpy*14 - lpy*6)
                .attr('x', lpy*14 + lpy*6)
                .attr('y', 0);
            break;    
        case 5:     // 205-209 -- 4
            rectL.attr('display','inline-box')
                .attr('width',lpy*20);
            rectR.attr('display','inline-box')
                .attr('width', totallen - lpy*20 - lpy*4)
                .attr('x', lpy*20 + lpy*4)
                .attr('y', 0);
            break;
        case 6:     // 189-221 -- 32
            rectL.attr('display','inline-box')
                .attr('width',lpy*24);
            rectR.attr('display','inline-box')
                .attr('width', totallen - lpy*24 - lpy*32)
                .attr('x', lpy*24 + lpy*32)
                .attr('y', 0);
            break;
        case 7:     // 221-234 -- 13
            rectL.attr('display','inline-box')
                .attr('width',lpy*56);
            rectR.attr('display','inline-box')
                .attr('width', totallen - lpy*56 - lpy*13)
                .attr('x', lpy*56 + lpy*13)
                .attr('y', 0);
            break;    
        case 8:     // 234-280 -- 46
            rectL.attr('display','inline-box')
                .attr('width',lpy*69);
            rectR.attr('display','inline-box')
                .attr('width', totallen - lpy*69 - lpy*46)
                .attr('x', lpy*69 + lpy*46)
                .attr('y', 0);
            break;  
    }
    // // Rebuild canvas
    // svg = d3.select("graph").select("svg")
    // svg.remove()
    // svg = d3.select("graph")
    //     .append('svg')
    //     .attr('width', svgWidth)
    //     .attr('height', svgHeight)

    // // Rebuild graph
    // d3.json('static/data/' + nodePath, function(nodes) {
    //     d3.json('static/data/' + edgePath, function(edges) {
    //         makeGraph(nodes, edges);
    //     })
    // })
}


function drawChart(filterData) {
    d3.csv("static/data/data_1.csv", type).then(function (data) {

        var countries = data.columns.slice(1).map(function (id) {
            return {
                id: id,
                values: data.map(function (d) {
                    return { date: d.date, price: d[id] };
                })
            };
        });
        

        newcountries = countries;
        countries = countries.filter(function (d) { return filterData[d.id] == true });


        x.domain([d3.min(data, function (d) { return d.date; }),d3.max(data, function (d) { return d.date; })]);

        y.domain([
            d3.min(countries.filter(function (d) { return filterData[d.id] == true; }), function (c) { return d3.min(c.values, function (d) { return d.price; }); }),
            d3.max(countries.filter(function (d) { return filterData[d.id] == true; }), function (c) { return d3.max(c.values, function (d) { return d.price; }); })
        ]);


        z.domain(newcountries.map(function (c) { return c.id; }));


        g.selectAll("*").remove();
        var legend = g.selectAll('g')
            .data(newcountries)
            .enter()
            .append('g')
            .attr('class', 'legend');


        legend.append("rect")
            .attr('x', svgWidth + 70)
            .attr('y', function (d, i) { return i * 30; })
            .attr('width', 30)
            .attr('height', 20)

            .style('fill', function (d) {
                if (filterData[d.id] == true) {
                    return z(d.id);
                }

            })

            .style("stroke", function (d) {
                return z(d.id);
            });


        legend.append('text')
            .attr('x', svgWidth + 100)
            .attr('y', function (d, i) { return i * 30 + 18; })
            .attr("transform", "translate(10," + 3 + ")")
            .text(function (d) { return d.id; })
            .attr('font-size', 26);


        legend
            .on("click", function (d) {
                reDraw(d.id);
            });


        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + svgHeight + ")")
            .call(d3.axisBottom(x).tickFormat(function(v) 
                { 
                console.log(typeof v);
                return v.toString().substring(12,15);
              }).ticks(20)
              ).selectAll('text').attr("transform", "rotate(30)").style("text-anchor", "start").attr('font-size', 15);
            
            // .append("text")
            // .attr("x", 875)
            // .attr("dx", "0.71em")
            // .attr("fill", "#000")
            // .text("年份");

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(0))

            // .append("text")
            // .attr("transform", "rotate(-90)")
            // .attr("y", 6)
            // .attr("x", -175)
            // .attr("dy", "-4.5em")
            // .attr("fill", "#000")
            // .text("Million BTUs Per Person");



        var country = g.selectAll(".country")
            .data(countries.filter(function (d) { return filterData[d.id] == true; }))
            .enter().append("g")
            .attr("class", "country");

        country.append("path")
            .attr("class", "line")
            .attr("d", function (d) { return line(d.values); })
            .style("stroke", function (d) { return z(d.id); });

        svg.selectAll(".country")
            .data(countries.filter(function (d) { return filterData[d.id] == true; }))
            .exit()
            .remove();

        var totalLength = svgWidth * 2.5;


        country.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(3000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);


        // mouse event
       
        var mouseG = g.append("g")
            .attr("class", "mouse-over-effects");       
        mouseG.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", "0")

        var lines = document.getElementsByClassName('line');
  
        var mousePerLine = mouseG.selectAll('.mouse-per-line')
            .data(countries.filter(function (d) { return filterData[d.id] == true; }))
            .enter()
            .append("g")
            .attr("class", "mouse-per-line")
            ;

        
        mousePerLine.append("circle")
            .attr("r", 4)
            .style("stroke", function (d) {

                return z(d.id);

            })
            .style("fill", "none")
            .style("stroke-width", "1px")
            .style("opacity", "0")

        mousePerLine.append("text")
            .attr("transform", "translate(10,-4)")
            .attr('font-size', 20);

        mouseG.append('svg:rect') 
            .attr('width', svgWidth + margin.left - 50) 
            .attr('height', svgHeight + margin.top + margin.bottom)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseout', function () { 
                d3.select(".mouse-line")
                    .style("opacity", "0");
                d3.selectAll(".mouse-per-line circle")
                    .style("opacity", "0");
                d3.selectAll(".mouse-per-line text")
                    .style("opacity", "0");
            })
            .on('mouseover', function () { 
                d3.select(".mouse-line")
                    .style("opacity", "1")
                d3.selectAll(".mouse-per-line circle")
                    .style("opacity", "1")
                d3.selectAll(".mouse-per-line text")
                    .style("opacity", "1")
            })
            .on('mousemove', function () { 
                var mouse = d3.mouse(this);
                d3.select(".mouse-line")
                    .attr("d", function () {
                        var d = "M" + (mouse[0]) + "," + (svgHeight);
                        d += " " + mouse[0] + "," + 0;
                        return d;
                    });
            

            
            d3.selectAll(".mouse-per-line")
                .style("font-size", "14px")
                .attr("transform", function (d, i) {
                    //console.log(width / mouse[0])
                    /* var xDate = x.invert(mouse[0]),
                        bisect = d3.bisector(function (d) { return d.date; }).right;
                    idx = bisect(d.values, xDate);*/
                    var beginning = 0,
                        end = lines[i].getTotalLength(),
                        target = null;

                    while (true) {
                        target = Math.floor((beginning + end) / 2);
                        pos = lines[i].getPointAtLength(target);
                        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                            break;
                        }
                        if (pos.x > mouse[0]) end = target;
                        else if (pos.x < mouse[0]) beginning = target;
                        else break; //position found
                    }
                    d3.select(this).select('text')
                        .text(d.id);
                        // .text(y.invert(pos.y).toFixed(2));

                    return "translate(" + (mouse[0]) + "," + (pos.y) + ")";
                });
            });

        svg.selectAll(".country")
            .data(countries.filter(function (d) { return filterData[d.id] == true; }))
            .exit()
            .remove();


    })
}

function type(d, _, columns) {
    d.date = parseTime(d.date);
    for (var i = 1, n = columns.length, c; i < n; ++i) 
        d[c = columns[i]] = +d[c];
    return d;
}
console.log(filterData);
drawChart(filterData);
   
function reDraw(id) {

    filterData[id] = !filterData[id];
    console.log("redraw :");
    console.log(filterData);
    drawChart(filterData);
}