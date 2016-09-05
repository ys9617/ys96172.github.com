            var w = 640, h = 480;

            var graph = {
                "nodes": [  
                            { "x": 200, "y": 200 },
                            { "x": 300, "y": 100 },
                            { "x": 300, "y": 300 },
                            { "x": 400, "y": 200 },
                            { "x": 500, "y": 150 },
                            { "x": 500, "y": 50 },
                            { "x": 600, "y": 50 },
                        ],
                "links": [ 
                            { "target": 0, "source": 1 },
                            { "target": 1, "source": 2 },
                            { "target": 1, "source": 3 },
                            { "target": 3, "source": 4 },
                            { "target": 4, "source": 5 },
                            { "target": 5, "source": 6 },
                            { "target": 0, "source": 4},
                            { "target": 6, "source": 3},
                            { "target": 6, "source": 1},
                        ]
            };

            var nodes = graph.nodes;
            var links = graph.links;

            var svg = d3.select("body")
                            .append("svg")
                            .attr("width", w)
                            .attr("height", h);

            var force = d3.layout.force()
                        .size([w, h])
                        .nodes(nodes)
                        .links(links);

            force.linkDistance(w/3);

            var link = svg.selectAll(".link")
                        .data(links)
                        .enter()
                            .append("line")
                            .attr("class", "link")
                            .attr('x1', function(d) { return nodes[d.source].x; })
                            .attr('y1', function(d) { return nodes[d.source].y; })
                            .attr('x2', function(d) { return nodes[d.target].x; })
                            .attr('y2', function(d) { return nodes[d.target].y; });

            var node = svg.selectAll(".node")
                        .data(nodes)
                        .enter()
                            .append("circle")
                            .attr("class", "node")
                            .attr('cx', function(d) { return d.x; })
                            .attr('cy', function(d) { return d.y; });
        
        

            force.on("tick", function(){

                node.transition().ease('linear').duration(500)
                    .attr("r", w/75)
                    .attr('cx', function(d) { return d.x; })
                    .attr('cy', function(d) { return d.y; });

                link.transition().ease('linear').duration(500)
                    .attr('x1', function(d) { return d.source.x; })
                    .attr('y1', function(d) { return d.source.y; })
                    .attr('x2', function(d) { return d.target.x; })
                    .attr('y2', function(d) { return d.target.y; });

                setTimeout(
                    function() { force.start(); },
                    500
                );
            });            

            force.start();