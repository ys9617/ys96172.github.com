// svg size
var width = 900, height = 900;

// arc radius and color 
var ir = 350, or = 370;
var color = ["steelblue"];

// area generator
var area = d3.area()
                .x0(function(d){ return d.x0; })
                .x1(function(d){ return d.x1; })
                .y0(function(d){ return d.y0; })
                .y1(function(d){ return d.y1; })
                .curve(d3.curveBasis)

var rarea = d3.radialArea()
                .startAngle(function(d){ return d.startAngle; })
                .endAngle(function(d){ return d.endAngle; })
                .radius(function(d){ return d.radius; })


// data load - arc
var data_arc = [];      // inner
var data_arc_c = [];    // outer
var sum = 0;

for(var i = 0; i < data1.length + data2.length; i++){
    if( i < data1.length){
        sum += data1[i];
        data_arc.push(data1[i]);
    }
    else{
        if (i == data1.length){
            data_arc_c.push(sum);
            sum = 0;
        }

        sum += data2[i- data1.length];
        data_arc.push(data2[i - data1.length]);

        if (i == (data1.length + data2.length - 1) ){
            data_arc_c.push(sum);
           
        }   
    }
}


// arc varialbles
var group = d3.select("body")
                .select("div#circos")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

var arc = d3.arc()
            .innerRadius(ir)
            .outerRadius(or)
            .cornerRadius(2)
            .padRadius(300)
            .padAngle(0.01);

var pie = d3.pie()
            .sort(null)
            .value(function(d){ return d; });

var arcs = group.selectAll(".arc")
            .data(pie(data_arc))
            .enter()
                .append("g")
                .attr("class", "arc");


// arc coordinate variables
var arc_c = d3.arc()
            .innerRadius(or+10)
            .outerRadius(or+20)
            .padRadius(300)
            .padAngle(0.01);

var arcs_c = d3.select("svg")
                .append("g")
                    .attr("class", "axes")
                    .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
                    .selectAll(".arc_c")
                    .data(pie(data_arc_c))
                    .enter()
                        .append("g")
                        .attr("class", "arc_c");

// arc coordinate ticks variables
var ticks = d3.select("svg")
                .append("g")
                    .attr("class", "ticks")
                    .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
                    .selectAll(".arc_ticks")
                    .data(pie(data_arc_c))
                    .enter()
                        .append("g");

function group_ticks(d, i, step){
    var k = (d.endAngle - d.startAngle) * 180 / Math.PI;
    
    return d3.range(0, k, step).map(function(angle){
        return {num: i, angle: angle, start: d.startAngle * 180 / Math.PI};
    })
}

// ribbon variables
var ribbon_radius = ir - 20;

var temp_ribbon_data = [    // practice data
    {
        "score": 5656.000000,
        "s_angle1": 30*Math.PI/180, "s_angle2": 31*Math.PI/180,
        "t_angle1": 159*Math.PI/180, "t_angle2": 160*Math.PI/180 
    },
    {
        "score": -249.000000,
        "s_angle1": 50*Math.PI/180, "s_angle2": 51*Math.PI/180,
        "t_angle1": 300*Math.PI/180, "t_angle2": 302*Math.PI/180 
    }
];

var ribbon = d3.select("svg")
                .append("g")
                    .attr("class", "ribbons")
                    .selectAll("path.ribbon")
                    .data(temp_ribbon_data)
                    .enter();




// -----------------------------------------------------------------------------------------------

// arc rendering
arcs.append("path")
    .attr("d", arc)
    .attr("fill", function(d, i){
        if ( i >= 25)
            return "steelblue";
        else
            return "orange";
    })
    .style("stroke", "black")
    .style("stroke-width", 1);

// arc coordinate rendering
arcs_c.append("path")
    .attr("d", arc_c)
    .attr("fill", function(d, i){
        if(i == 0)
            return "orange";
        else
            return "steelblue";
    })
    .style("stroke", "black")
    .style("stroke-width", 1.5);

// arc coordinate ticks rendering
ticks.selectAll(".arc_ticks")
        .data(function(d, i){ return group_ticks(d, i, 1); })
        .enter()
            .append("line")
            .attr("class", "arc_ticks")
            .attr("x1", 0)
            .style("stroke", "black")
            .attr("transform", function(d){ 
                if(d.num == 0)
                    return "rotate(" + (d.angle-90 + (0.005 * 180 / Math.PI) ) + ") translate(" + (or+20) + ",0)";
                else
                    return "rotate(" + (d.angle - 90 + (0.005 * 180 / Math.PI) + d.start) + ") translate(" + (or+20) + ",0)"; 
            })
            .attr("x2", function(d,i){
                if(i%5 == 0)
                    return 6;
                else
                    return 4;
            })
            .style("stroke-width", function(d,i){
                if(i%5 == 0)
                    return 1.5;
                else
                    return 1;
            });

// ribbon rendering
ribbon.append("path")
        .attr("class", "ribbon")
        .attr("d", function(d){
            
            var area_data = [
                {
                    x0: width/2 + ribbon_radius * Math.sin(d.s_angle1), y0: height/2 - ribbon_radius * Math.cos(d.s_angle1),
                    x1: width/2 + ribbon_radius * Math.sin(d.s_angle2), y1: height/2 - ribbon_radius * Math.cos(d.s_angle2)
                },
                {
                    x0: width/2, y0: height/2, x1: width/2, y1: height/2
                },
                {
                    x0: width/2 + ribbon_radius * Math.sin(d.t_angle1), y0: height/2 - ribbon_radius * Math.cos(d.t_angle1),
                    x1: width/2 + ribbon_radius * Math.sin(d.t_angle2), y1: height/2 - ribbon_radius * Math.cos(d.t_angle2)
                }
            ];

            return area(area_data);
        })
        .attr("stroke", "orange")
        .attr("stroke-width", 0.05)
        .attr("fill", "orange");

//------------------------------------------------------------------

// ribbon radius controller

function ribbon_radius_controller(radius){
    d3.selectAll("path.ribbon")
        .attr("d", function(d){

            ribbon_radius = radius;

            var area_data = [
                {
                    x0: width/2 + ribbon_radius * Math.sin(d.s_angle1), y0: height/2 - ribbon_radius * Math.cos(d.s_angle1),
                    x1: width/2 + ribbon_radius * Math.sin(d.s_angle2), y1: height/2 - ribbon_radius * Math.cos(d.s_angle2)
                },
                {
                    x0: width/2, y0: height/2, x1: width/2, y1: height/2
                },
                {
                    x0: width/2 + ribbon_radius * Math.sin(d.t_angle1), y0: height/2 - ribbon_radius * Math.cos(d.t_angle1),
                    x1: width/2 + ribbon_radius * Math.sin(d.t_angle2), y1: height/2 - ribbon_radius * Math.cos(d.t_angle2)
                }
            ];

            return area(area_data);
        })    
}


d3.select("body div#controller-ribbon-radius")
    .append("input")
        .attr("type", "range")
        .attr("min", or/2)
        .attr("max", ribbon_radius)
        .attr("value", ribbon_radius)
        .attr("onchange", "ribbon_radius_controller(this.value)")



// bezier control point controller

function bezier_control_point_selector(dis){
    d3.selectAll("path.ribbon")
        .attr("d", function(d){

            var vector1 = [
                ribbon_radius * (Math.sin(d.s_angle1) + Math.sin(d.t_angle1)),
                ribbon_radius * -(Math.cos(d.s_angle1) + Math.cos(d.t_angle1))
            ];

            var vector2 = [
                ribbon_radius * (Math.sin(d.s_angle2) + Math.sin(d.t_angle2)),
                ribbon_radius * -(Math.cos(d.s_angle2) + Math.cos(d.t_angle2))
            ];

            for(var i = 0; i < 2; i++){
                vector1[i] /= (Math.sqrt(vector1[0]*vector1[0] + vector1[1]*vector1[1]));
                vector2[i] /= (Math.sqrt(vector2[0]*vector2[0] + vector2[1]*vector2[1]));

                vector1[i] *= dis;
                vector2[i] *= dis;

                vector1[i] += width/2;
                vector2[i] += height/2;
            }

            var area_data = [
                {
                    x0: width/2 + ribbon_radius * Math.sin(d.s_angle1), y0: height/2 - ribbon_radius * Math.cos(d.s_angle1),
                    x1: width/2 + ribbon_radius * Math.sin(d.s_angle2), y1: height/2 - ribbon_radius * Math.cos(d.s_angle2)
                },
                {
                   x0: vector1[0], y0: vector1[1], x1: vector2[0], y1: vector2[1]
                },
                {
                    x0: width/2 + ribbon_radius * Math.sin(d.t_angle1), y0: height/2 - ribbon_radius * Math.cos(d.t_angle1),
                    x1: width/2 + ribbon_radius * Math.sin(d.t_angle2), y1: height/2 - ribbon_radius * Math.cos(d.t_angle2)
                }
            ];

            return area(area_data);
        });
}

var control_point; 

d3.select("body div#controller-bezier-point")
    .append("input")
        .attr("type", "range")
        .attr("min", 0)
        .attr("max", ribbon_radius * 2)
        .attr("value", 0)
        .attr("onchange", "bezier_control_point_selector(this.value)")