let totalWidth = document.body.clientWidth;
let totalHeight = document.body.clientHeight;
let svgWidth = 1023;
let svgHeight = 818;
let period = document.getElementById("period");
let war = document.getElementById("war");
let profile1 = document.getElementById("profile1");
let profileItems1 = profile1.getElementsByTagName("p");
let profile2 = document.getElementById("profile2");
let profileItems2 = profile2.getElementsByTagName("p");
let profileTexts1 = [];
let profileButton = document.getElementById("profile-button");

var svg = d3.select("graph")
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .attr("transform","translate(150, 0)");
	
var bg = svg.append('image')
	.attr('xlink:href', 'static/images/map.png')
    .attr('opacity', 0.7);

var tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('background-color', 'white')
    .style('color', 'black')
    .style('visibility', 'hidden')
    .style('font-size', '20px')
    .text('');

let index1 = period.selectedIndex;
let index2 = war.selectedIndex;
let selectType = 1;

for (let i = 0; i < profileItems1.length; i++) {
    profileItems1[i].style.display = "none";
}
profileItems1[index1].style.display = "inline";

for (let i = 0; i < profileItems2.length; i++) {
    profileItems2[i].style.display = "none";
}

period.onchange = function() {
    selectType = 1;
    index1 = this.selectedIndex;
    for (let i = 0; i < profileItems2.length; i++) {
        profileItems2[i].style.display = "none";
    }
    for (let i = 0; i < profileItems1.length; i++) {
        profileItems1[i].style.display = "none";
    }
    profileItems1[index1].style.display = "inline";
    // console.log(index);
    svg.selectAll("circle").remove();
    svg.selectAll('g').remove();
    svg.selectAll("defs").remove();
    switch (index1) {
        case 0:
            drawBornState();
            break;
        case 1:
            drawPeriod("static/data/power-1-2.csv");
            break;
        case 2:
            drawPeriod("static/data/power-3-9.csv");
            break;
        case 3:
            drawPeriod("static/data/power-10-24.csv");
            break;
        case 4:
            drawPeriod("static/data/power-25-33.csv");
            break;
        case 5:
            drawPeriod("static/data/power-34-50.csv");
            break;
        case 6:
            drawPeriod("static/data/power-51-85-1.csv");
            break;
        case 7:
            drawPeriod("static/data/power-51-85-2.csv");
            break;
        case 8:
            drawPeriod("static/data/power-86-104.csv");
            break;
        case 9:
            drawPeriod("static/data/power-105-120.csv");
            break;

    }
}

war.onchange = function() {
    selectType = 0;
    index2 = this.selectedIndex;
    for (let i = 0; i < profileItems1.length; i++) {
        profileItems1[i].style.display = "none";
    }
    for (let i = 0; i < profileItems2.length; i++) {
        profileItems2[i].style.display = "none";
    }
    if (index2 != 0)
        profileItems2[index2-1].style.display = "inline";
    else
    profileItems2[0].style.display = "inline";
    // console.log(index);
    svg.selectAll("circle").remove();
    svg.selectAll('g').remove();
    svg.selectAll("defs").remove();
    switch (index2) {
        case 0:
            drawBornState();
            profileItems1[0].style.display = "inline";
            break;
        case 1:
            drawWar("static/data/war-1.json");
            break;
        case 2:
            drawWar("static/data/war-2.json");
            break;
        case 3:
            drawWar("static/data/war-3.json");
            break;
        case 4:
            drawWar("static/data/war-4.json");
            break;
        case 5:
            drawWar("static/data/war-5.json");
            break;
        case 6:
            drawWar("static/data/war-6.json");
            break;
        case 7:
            drawWar("static/data/war-7.json");
            break;
        case 8:
            drawWar("static/data/war-8.json");
            break;
        case 9:
            drawWar("static/data/war-9.json");
            break;
        case 10:
            drawWar("static/data/war-10.json");
            break;
        case 11:
            drawWar("static/data/war-11.json");
            break;
        case 12:
            drawWar("static/data/war-12.json");
            break;
        case 13:
            drawWar("static/data/war-13.json");
            break;
        case 14:
            drawWar("static/data/war-14.json");
            break;
        case 15:
            drawWar("static/data/war-15.json");
            break;

    }
}


profileButton.onclick = function() {
    if (selectType === 1)
    {
        if (profileItems1[index1].style.display == "none") {
            profileItems1[index1].style.display = "inline";
        } else {
            profileItems1[index1].style.display = "none";
        }
    }
    else {
        if (profileItems2[index2-1].style.display == "none") {
            profileItems2[index2-1].style.display = "inline";
        } else {
            profileItems2[index2-1].style.display = "none";
        }
    }
    
}


function drawBornState() {
    d3.csv("static/data/map2.csv").then(function (data) {
    //申明圆集
    var circles = svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
            .attr("cx",function (d,i) {
                return d.posx;
            })
            .attr("cy",function (d,i) {
                return d.posy;
            })
            .attr("r",4)
            .attr("fill", function (d,i) {
                switch (d.power) {
                    case '魏':
                        return 'blue';
                    case '蜀':
                        return 'green';
                    case '吳':
                        return 'red';
                    case '晉':
                        return 'purple';
                    case '他':
                        return '#333333';
                }

            })
            .attr('opacity', 0.8)
            .on("mouseover", function(d) {
                d3.select(this).attr("r",5);
                tooltip.style('visibility', 'visible').text(d.name_zh);
            })
    
            .on('mousemove', function(d) {
                tooltip.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px');
            })
            .on('mouseout', function(d, i) {
                circles.attr("r",4);
                tooltip.style('visibility', 'hidden');
            });
    ///////////// 鼠标交互

    })

}

function drawPeriod(datafile) {
    d3.csv(datafile).then(function (data) {
        var power = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr('cx', function(d) {
                return d.posx;
            })
            .attr('cy', function(d) {
                return d.posy;
            })
            .attr("r", function(d) {
                return d.power;
            })
            .style("stroke", function(d) {
                if (d.faction == '魏') {
                    return "blue";
                } else if (d.faction == '蜀') {
                    return "green";
                } else if (d.faction == '吳') {
                    return "red";
                } else if (d.faction == '晉') {
                    return "purple";
                } else {
                    return "gray";
                }
            })
            .style("stroke-width", 4)
            //Add avatars
            .style("fill", function(d, i) {

                if (d.image == "undefined") {
                    if (d.faction == '魏') {
                        return "blue";
                    } else if (d.faction == '蜀') {
                        return "green";
                    } else if (d.faction == '吳') {
                        return "red";
                    } else if (d.faction == '晉') {
                        return "purple";
                    } else {
                        return "gray";
                    }
                }

                let img_w = d.power * 2.6;
                let img_h = d.power * 2.6;

                let defs = svg.append("defs").attr("id", "imgdefs")

                let catpattern = defs.append("pattern")
                    .attr("id", "catpattern" + i)
                    .attr("height", 1)
                    .attr("width", 1)

                catpattern.append("image")
                    .attr("x", -(img_w / 2 - d.power * 1.25))
                    .attr("y", -(img_h / 2 - d.power * 1.25))
                    .attr("width", img_w)
                    .attr("height", img_h)
                    .attr("xlink:href", "static/images/avatars/" + d.image)
                    .attr('opacity', 0.9)

                return "url(#catpattern" + i + ")";
            })
            .on("mouseover", function(d) {
                // 突出显示选中节点
                d3.select(this).attr("r",d.power * 1.5);
                let num = d3.select(this).style("fill").slice(16, -2);
    
                d3.select(this).style("fill", function(d, i) {
                    
                    if (d.image == "undefined") {
                        if (d.faction == '魏') {
                            return "blue";
                        } else if (d.faction == '蜀') {
                            return "green";
                        } else if (d.faction == '吳') {
                            return "red";
                        } else if (d.faction == '晉') {
                            return "purple";
                        } else {
                            return "gray";
                        }
                    }
                    let defs = svg.append("defs").attr("id", "imgdefs")
                    let newcatpattern = defs.append("pattern")
                        .attr("id", "newcatpattern" + num)
                        .attr("height", 1)
                        .attr("width", 1)
    
                    newcatpattern.append("image")
                        .attr("x", -(d.power * 3 / 2 - d.power * 1.5))
                        .attr("y", -(d.power * 3 / 2 - d.power * 1.5))
                        .attr("width", d.power * 3)
                        .attr("height", d.power * 3)
                        .attr("xlink:href", 'static/images/avatars/' + d.image)
                    
                    return "url(#newcatpattern" + num + ")";
                    
                })
                return tooltip.style('visibility', 'visible').text(d.name);
            })
    
            .on('mousemove', function(d) {
                return tooltip.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px')
            })
            .on('mouseout', function(d, i) {
                power.attr("r", function(d) {
                    return d.power * 1.2;
                })
                let num = d3.select(this).style("fill").slice(16, -2);
    
                d3.select(this).style("fill", function(d, i) {
                    
                    if (d.image == "undefined") {
                        if (d.faction == '魏') {
                            return "blue";
                        } else if (d.faction == '蜀') {
                            return "green";
                        } else if (d.faction == '吳') {
                            return "red";
                        } else if (d.faction == '晉') {
                            return "purple";
                        } else {
                            return "gray";
                        }
                    }
                    let img_w = d.power * 2.6;
                    let img_h = d.power * 2.6;
        
                    let defs = svg.append("defs").attr("id", "imgdefs")
        
                    let catpattern = defs.append("pattern")
                        .attr("id", "catpattern" + num)
                        .attr("height", 1)
                        .attr("width", 1)
        
                    catpattern.append("image")
                        .attr("x", -(img_w / 2 - d.power * 1.25))
                        .attr("y", -(img_h / 2 - d.power * 1.25))
                        .attr("width", img_w)
                        .attr("height", img_h)
                        .attr("xlink:href", 'static/images/avatars/' + d.image)
                    
                    return "url(#catpattern" + num + ")";
                    
                })
                return tooltip.style('visibility', 'hidden')
            });
            power.transition()
            .duration(3000)
            .ease(d3.easeElastic)
            .attr('r', function(d) {
                return d.power*1.2;
            });

            

    })
}

function drawWar(datafile) {
    d3.json(datafile).then(function (data) {
        var power = svg.selectAll("circle")
            .data(data.people)
            .enter()
            .append("circle")
            .attr('cx', function(d) {
                return d.posx;
            })
            .attr('cy', function(d) {
                return d.posy;
            })
            .attr("r", function(d) {
                return d.r * 1.25;
            })
            .style("stroke", function(d) {
                return d.color
            })
            .style("stroke-width", 4)
            //Add avatars
            .style("fill", function(d, i) {

                if (d.image == "undefined") {
                    return d.color
                }

                let img_w = d.r * 2.5;
                let img_h = d.r * 2.5;

                let defs = svg.append("defs").attr("id", "imgdefs")

                let catpattern = defs.append("pattern")
                    .attr("id", "catpattern" + i)
                    .attr("height", 1)
                    .attr("width", 1)

                catpattern.append("image")
                    .attr("x", -(img_w / 2 - d.r * 1.25))
                    .attr("y", -(img_h / 2 - d.r * 1.25))
                    .attr("width", img_w)
                    .attr("height", img_h)
                    .attr("xlink:href", "static/images/avatars/" + d.image)
                    .attr('opacity', 0.9)

                return "url(#catpattern" + i + ")";
            })
            .on("mouseover", function(d) {
                // 突出显示选中节点
                d3.select(this).attr("r",d.r * 1.5);
                let num = d3.select(this).style("fill").slice(16, -2);
    
                d3.select(this).style("fill", function(d, i) {
                    
                    if (d.image == "undefined") {
                        return d.color;
                    }
                    let defs = svg.append("defs").attr("id", "imgdefs")
                    let newcatpattern = defs.append("pattern")
                        .attr("id", "newcatpattern" + num)
                        .attr("height", 1)
                        .attr("width", 1)
    
                    newcatpattern.append("image")
                        .attr("x", -(d.r * 3 / 2 - d.r * 1.5))
                        .attr("y", -(d.r * 3 / 2 - d.r * 1.5))
                        .attr("width", d.r * 3)
                        .attr("height", d.r * 3)
                        .attr("xlink:href", 'static/images/avatars/' + d.image)
                    
                    return "url(#newcatpattern" + num + ")";
                    
                })
                return tooltip.style('visibility', 'visible').text(d.name);
            })
            .on('mousemove', function(d) {
                return tooltip.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px')
            })
            .on('mouseout', function(d, i) {
                power.attr("r", function(d) {
                    return d.r * 1.2;
                })
                let num = d3.select(this).style("fill").slice(16, -2);
    
                d3.select(this).style("fill", function(d, i) {
                    
                    if (d.image == "undefined") {
                        return d.color
                    }
                    let img_w = d.r * 2.6;
                    let img_h = d.r * 2.6;
        
                    let defs = svg.append("defs").attr("id", "imgdefs")
        
                    let catpattern = defs.append("pattern")
                        .attr("id", "catpattern" + num)
                        .attr("height", 1)
                        .attr("width", 1)
        
                    catpattern.append("image")
                        .attr("x", -(img_w / 2 - d.r * 1.25))
                        .attr("y", -(img_h / 2 - d.r * 1.25))
                        .attr("width", img_w)
                        .attr("height", img_h)
                        .attr("xlink:href", 'static/images/avatars/' + d.image)
                    
                    return "url(#catpattern" + num + ")";
                    
                })
                return tooltip.style('visibility', 'hidden')
            });

        power.transition()
            .duration(3000)
            .ease(d3.easeElastic)
            .attr('r', function(d) {
                return d.r*1.2;
            });

        var cross = svg.selectAll('cross').data(data.place).enter()
                .append('g')
                .append('image')
                .attr('xlink:href', 'static/images/cross.png')
                .attr('opacity', 0.5)
                .attr('x', function(d) {
                    return d.placex -50;
                })
                .attr('y', function(d) {
                    return d.placey -50;
                });

        cross.transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr('opacity', 1)
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr('opacity', 0.5)
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr('opacity', 1);
        
        
        var arrow = svg.selectAll('arrow').data(data.arrow).enter()
                .append('g')
                .append('image')
                
                .attr('xlink:href', function(d) {
                    return 'static/images/' + d.type + '.png';
                })
                .attr('opacity', 0)
                .attr('transform', function(d) {
                    return 'translate('+d.end[0]+','+(d.end[1])+')rotate('+d.rotate+')'
                })
                
                .on("mouseover", function(d) {
                    d3.select(this).attr("opacity",1);
                    return tooltip.style('visibility', 'visible').text(d.name);
                })
                .on('mousemove', function(d) {
                    return tooltip.style('top', (event.pageY - 10) + 'px').style('left', (event.pageX + 10) + 'px')
                })
                .on('mouseout', function(d, i) {
                    arrow.attr("opacity", 0.5);
                    return tooltip.style('visibility', 'hidden')
                });
        arrow.transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr('opacity', 0.5)
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr('opacity', 0)
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr('opacity', 0.5)
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr('opacity', 0)
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr('opacity', 0.5);
        

    })
}


drawBornState();