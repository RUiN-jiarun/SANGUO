
d3.json('data/count-1-2.json', function(nodes) {
    console.log(nodes)

})

var words_list = [
    {text:"互联网医疗", size:'20'},
    {text:"基因检测", size:'30'},
    {text:"医疗服务", size:'26'},
    {text:"再生医学", size:'30'},
    {text:"生物科技", size:'26'},
    {text:"医药", size:'34'},
    {text:"免疫治疗", size:'16'},
    {text:"体外诊断", size:'20'},
    {text:"医疗设备", size:'30'},
    {text:"医疗影像", size:'24'},
    {text:"脑科学", size:'20'},
];

var fill = d3.scale.category5();  //输出5种类别的颜色 ---颜色比例尺

var layout = d3.layout.cloud()
    .size([360, 200])  //size([x,y]) 词云显示的大小
    .words(words_list)
    .padding(5)
    .rotate(function() { return ~~(Math.random() * 2) * 0; })
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", draw);
layout.start();

function draw(words) {
    d3.select("#d3_cloud").append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "translate(" + [d.x-2, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}    //word cloud layout  词云布局，d3布局中为词云设立的单独的一种布局方式    //d3.layout.cloud() 构造一个词云的布局实例    //on(type,listener) 注册特定的listener来接收布局中特定类型的event。    //目前只有 word和end这两种event是被支持的。    //word这种event在该布局完成对每一个word的布局时被调度。    //end这种活动在改布局完成对所有的words的布局时被调度。    //注册的listener通过两个参数被调度：    //被成功布局的单词数组    //以[{x0,y0},{x1,y1}]形式为界限，代表words范围    a bounds object of the form [{x0, y0}, {x1, y1}] representing the extent of the placed objects.    //       //start 布局算法   初始化单词数组上的各种参数，并且从最大的单词开始布局单词，    //从矩形区域的中间开始，每一个单词在布局时都要检测是否与先前已经布局好的单词位置冲突。    //一旦检测到冲突，该算法会沿着螺旋线重新布局该单词。    //如果一个单词不能在沿着螺旋线的任何地方被布局，该单词最终将不会显示在词云图上，该问题可能在后续版本中被解决。    //stop() 停止布局算法    // timeInterval([time])   布局时通过setInterval来避免浏览器的event loop被锁住。       //words([words array].map(function(d)(return{text:d;size:某一个数值}))    //为words数组中的每一个word分配一个字体大小
