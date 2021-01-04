var svg = d3.select("svg"),
    margin = { top: 20, right: 80, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.price); });



var filterData = { "曹操": true, "刘备": true, "孙坚": true, "董卓": true};


function drawChart(filterData) {
    d3.csv("data/data_1.csv", type).then(function (data) {

        var countries = data.columns.slice(1).map(function (id) {
            return {
                id: id,
                values: data.map(function (d) {
                    return { date: d.date, price: d[id] };
                })
            };
        });
        
 /*----------------------------------------------------------------------------------------------------------------------------------------------
newcountries have the original data from the file whereas countries have the filtered data which are selected by the user. This is done to have
the names of all the countries even when the filter is changed.
-----------------------------------------------------------------------------------------------------------------------------------------------*/
       
        newcountries = countries;
        countries = countries.filter(function (d) { return filterData[d.id] == true });
/*----------------------------------------------------------------------------------------------------------------------------------------------
d3.extent helps us to get the values of the range for years i.e the min and the max value:
In this case for years the values are as follows:
on x axis: [Sat Jan 01 2000 00:00:00 GMT-0800 (Pacific Standard Time), Wed Jan 01 2014 00:00:00 GMT-0800 (Pacific Standard Time)] where min is year 2000 and max is year 2014  by default and updates based on the filtered data.
Similarly for y axis we get the min and max values for the usage as use it as the domain based on the filtered data.
 z.domain(countries.map(function(c) { return c.id; })); is used to assign the colors with each of the country by passing each of the country name to z. 
-----------------------------------------------------------------------------------------------------------------------------------------------*/ 
    

        x.domain([d3.min(data, function (d) { return d.date; }),d3.max(data, function (d) { return d.date; })]);

        y.domain([
            d3.min(countries.filter(function (d) { return filterData[d.id] == true; }), function (c) { return d3.min(c.values, function (d) { return d.price; }); }),
            d3.max(countries.filter(function (d) { return filterData[d.id] == true; }), function (c) { return d3.max(c.values, function (d) { return d.price; }); })
        ]);


        z.domain(newcountries.map(function (c) { return c.id; }));

/*----------------------------------------------------------------------------------------------------------------------------------------------
The below code is used to create a legend for all the BRICS countries and use them as a filter. For each country a rectangle is filled with the corresponding color and the text / name of the country is displayed next to it.
-----------------------------------------------------------------------------------------------------------------------------------------------*/
         


        g.selectAll("*").remove();
        var legend = g.selectAll('g')
            .data(newcountries)
            .enter()
            .append('g')
            .attr('class', 'legend');

/*----------------------------------------------------------------------------------------------------------------------------------------------
The code appends rect => rectange to legend with specific height and width and iterates over all the BRICS country names, passes the country name as
the argument to z and the rectangle is filled with the color returned by the function z.
-----------------------------------------------------------------------------------------------------------------------------------------------*/
         
        legend.append("rect")
            .attr('x', width + 100)
            .attr('y', function (d, i) { return i * 20; })
            .attr('width', 10)
            .attr('height', 10)

            .style('fill', function (d) {
                if (filterData[d.id] == true) {
                    return z(d.id);
                }

            })

            .style("stroke", function (d) {
                return z(d.id);
            });

/*----------------------------------------------------------------------------------------------------------------------------------------------
Append the country name next to rectangles drawn
-----------------------------------------------------------------------------------------------------------------------------------------------*/
  
        legend.append('text')
            .attr('x', width + 108)
            .attr('y', function (d, i) { return (i * 20) + 9; })
            .attr("transform", "translate(10," + 3 + ")")
            .text(function (d) { return d.id; });


        legend
            .on("click", function (d) {
                reDraw(d.id);
            });


        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(function(v) 
                { 
                console.log(typeof v);
                return v.toString().substring(12,15);
              }))
            
            .append("text")
            .attr("x", 875)
            .attr("dx", "0.71em")
            .attr("fill", "#000")
            .text("年份");

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

        var totalLength = width + width;

/*----------------------------------------------------------------------------------------------------------------------------------------------
The code below creates the animation effect using the d3.easeLinear effect and duration of 2000
-----------------------------------------------------------------------------------------------------------------------------------------------*/ 
      
        country.attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(3000)
            .ease(d3.easeLinear)

            .attr("stroke-dashoffset", 0);


/*----------------------------------------------------------------------------------------------------------------------------------------------
The code below appends the text / countryname with each line at the end.
-----------------------------------------------------------------------------------------------------------------------------------------------*/ 
        
        country.append("text")
            .datum(function (d) { return { id: d.id, value: d.values[d.values.length - 1] }; })
            .attr("transform", function (d) {console.log(d.value.price); return "translate(" + x(d.value.date) + ", " + y(d.value.price) + ")"; })
            .attr("x", 3)
            .attr("dy", "0.35em")
            .style("font", "10px sans-serif")
            .text(function (d) { return d.id; });

/*----------------------------------------------------------------------------------------------------------------------------------------------
The code below helps to provide a title to the visualization
-----------------------------------------------------------------------------------------------------------------------------------------------*/ 

        g.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2) + 10)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style('fill', "#1A719C")

            .text("势力图");

/*----------------------------------------------------------------------------------------------------------------------------------------------
The code below helps to provide the mouse-over-effects which is as per 2nd requirement of the bonus question.
-----------------------------------------------------------------------------------------------------------------------------------------------*/ 
       
        var mouseG = g.append("g")
            .attr("class", "mouse-over-effects");
/*----------------------------------------------------------------------------------------------------------------------------------------------
The code below helps to create a black vertical line which will follow the mouse
-----------------------------------------------------------------------------------------------------------------------------------------------*/ 
       
        mouseG.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", "0")

        var lines = document.getElementsByClassName('line');
/*----------------------------------------------------------------------------------------------------------------------------------------------
The code below helps to display the text using the circle for each line when the mouseover even takes place. Only the filtered data is displayed
when the mouseover event takes place and to represent where the line intersects with each of the line we define a circle with radius 4 which has same color as of that line for the respective country.
-----------------------------------------------------------------------------------------------------------------------------------------------*/ 
       
   
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
            .attr("transform", "translate(10,-4)");
/*----------------------------------------------------------------------------------------------------------------------------------------------
The code below append a rectangle to catch mouse movements on canvas. When the mouseout event takes place it hides line, circles and text.
 In the case of on-mouse-in the rectangle or onmouseover event show line, circles and text.
-----------------------------------------------------------------------------------------------------------------------------------------------*/ 
  

        mouseG.append('svg:rect') 
            .attr('width', width + margin.left - 50) 
            .attr('height', height + margin.top + margin.bottom)
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
/*----------------------------------------------------------------------------------------------------------------------------------------------
The code below is used the handle the mouse moving over the canvas event.The code sets the attribute d which is used to specify the points which needs
to be drawn. M => means move to point (x,y). In our case, d= M mouse[0] ,height means draw a line with x coordinate where the mouse is currently placed and 
height to mouse[0], 0. This gives us a vertical line whenever we mouse over the canvas of the height of canvas and x coordinate same as where our mouse is placed.
-----------------------------------------------------------------------------------------------------------------------------------------------*/ 
  
            .on('mousemove', function () { 
                var mouse = d3.mouse(this);
                d3.select(".mouse-line")
                    .attr("d", function () {
                        var d = "M" + (mouse[0]) + "," + (height);
                        d += " " + mouse[0] + "," + 0;
                        return d;
                    });
            
/*----------------------------------------------------------------------------------------------------------------------------------------------
For the path of circle and values to be displayed through the path, we get lenght of the path, get the x and y coords of the path and plot the circle accoordingly.
Incase the mouse is out of the canvas then the loop break. Basically it helps to display the value which is shown by the circle.
The value for text is displayed upto 2 decimals.
-----------------------------------------------------------------------------------------------------------------------------------------------*/ 
            
            
                d3.selectAll(".mouse-per-line")
            .style("font-size", "14px")
                    .attr("transform", function (d, i) {
                        //console.log(width / mouse[0])
                       /* var xDate = x.invert(mouse[0]),
                            bisect = d3.bisector(function (d) { return d.date; }).right;
                        idx = bisect(d.values, xDate);
*/
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
                            .text(y.invert(pos.y).toFixed(2));

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
/*----------------------------------------------------------------------------------------------------------------------------------------------
The redraw function inverts the selection of the passed country name. If the legend when clicked is checked it will be unchecked and vice-versa
and accordingly the filterdata is updated as filterData[id] = !filterData[id];
As the filterdata is now updated ,  chart needs to be redrawn hence we call the function drawchart with the updated filterdata.
-----------------------------------------------------------------------------------------------------------------------------------------------*/ 
            
   
function reDraw(id) {

    filterData[id] = !filterData[id];
    console.log("redraw :");
    console.log(filterData);
    drawChart(filterData);
}