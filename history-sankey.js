d3.sankey = function(){
    var sankey = {};
    var nodeWidth = 20, nodePadding = 5, sankeyHeight = 400, size = [1, 1];
    var data, nodes = [], links = [];

    sankey.nodeWidth = function(_){
        if(!arguments.length) return nodeWidth;
        nodeWidth = _;
        return sankey;
    };

    sankey.nodePadding = function(_){
        if(!arguments.length) return nodePadding;
        nodePadding = _;
        return sankey;
    };

    sankey.sankeyHeight = function(_){
        if(!arguments.length) return sankeyHeight;
        sankeyHeight = _;
        return sankey;
    }

    sankey.size = function(_){
        if(!arguments.length) return size;
        size = _;
        return sankey;
    };

    sankey.data = function(_){
        if(!arguments.length) return data;
        data = _;
        return sankey;
    };

    sankey.nodes = function(){
        return nodes;
    }

    sankey.links = function(){
        return links;
    }

    sankey.link = function(){
        var  curvature = .5;

        var area = d3.area()
                    .x0(function(d){ return d.x0;})
                    .x1(function(d){ return d.x1;})
                    .y0(function(d){ return d.y0;})
                    .y1(function(d){ return d.y1;})
                    .curve(d3.curveBasis);

        function link(d){
            var area_data = [
                {'x0': d.source.x0, 'y0': d.source.y0, 
                 'x1': d.source.x1, 'y1': d.source.y1},
                {'x0': (3*d.source.x0+d.target.x0)/4, 'y0': d.source.y0,
                 'x1': (3*d.source.x1+d.target.x1)/4, 'y1': d.source.y1},
                {'x0': (d.source.x0+3*d.target.x0)/4, 'y0': d.target.y0,
                 'x1': (d.source.x1+3*d.target.x1)/4, 'y1': d.target.y1},
                {'x0': d.target.x0, 'y0': d.target.y0, 
                 'x1': d.target.x1, 'y1': d.target.y1}
            ];

            return area(area_data);
        }

        return link;
    };

    sankey.layout = function(){
        computeSankey(data.output, nodes, links, sankeyHeight, nodePadding);
    }

    // ------------------ functions

    function computeSankey(data, nodes, links, height, margin){
        //nodes
        computeNodeXDS(data, nodes, 0, null, height);
        computeNodeYH(nodes, height, margin);

        //links
        computeLink(nodes, links, nodeWidth, height);
    }

    function computeNodeXDS(data, nodes, depth, parent, height){
        var x = depth * 100;
        var source;

        if(parent == null) source = -1;
        else source = parent;

     //   if(depth != -1){
            nodes.push({
                'id': data.id,
                'total_action_num': data.total_action_num,
                'action_num': data.action_num,
                'last_date': data.last_date,
                'ver': data.ver,
                'anno_num': data.anno_num,
                'action_list': data.action_list,
                'x': x,
                'depth': depth,
                'source': source
            });
     //   }

        if(data.children){
            var tmp = nodes.length-1;
            for(var i = 0; i < data.children.length; i++){
                computeNodeXDS(data.children[i], nodes, depth+1, tmp, height);
            }
        }
    }

    function computeNodeYH(nodes, height, margin){

        var heightest = 0;
        var depthSum = [];
        var y_tmp = [];

        nodes.forEach(function(node){
            if(depthSum[node.depth] == undefined)
                depthSum[node.depth] = node.action_num;
            else
                depthSum[node.depth] += node.action_num;
        });

        depthSum.forEach(function(d){
            if(d > heightest) heightest = d;
        });
        
        nodes.forEach(function(node){
            var node_height;
            if(node.action_num == 0){
                if(node.depth == 0)
                    node_height = height;
                else 
                    node_height = height / heightest;
            }
            else 
                node_height = height * node.action_num / heightest;

            if(y_tmp[node.depth] == undefined){
                node['y'] = 0;
                y_tmp[node.depth] = node_height;
            }
            else {
                node['y'] = y_tmp[node.depth];
                y_tmp[node.depth] += node_height;
            }

            node['height'] = node_height - margin;
        });

        // centerization
        nodes.forEach(function(node){
            if(node.depth == 0)
                node['y'] = 0;
            else 
                node['y'] += (200 - height * depthSum[node.depth]/(2*heightest));
        });
    }

    function computeLink(nodes, links, nodeWidth, height){

        var sourceDepthSum = [];
        var source_sum = [];

        nodes.forEach(function(node){
            if(sourceDepthSum[node.source] == undefined)
                sourceDepthSum[node.source] = node.action_num;
            else
                sourceDepthSum[node.source] += node.action_num;
        });

        nodes.forEach(function(node){
            var source = node.source;
            
            if(source != -1){
                var source_y1 = nodes[source].height * node.action_num / sourceDepthSum[node.source];

                if(source_sum[source] == undefined)
                    source_sum[source] = 0;

                var actionList = node.action_list;

                var j = 0;
                actionList.forEach(function(action){
                    links.push({
                        'action': action.action,
                        'source':{
                            'x0': nodes[source].x + nodeWidth + 1,
                            'y0': nodes[source].y + source_sum[source] + source_y1 * j / actionList.length,
                            'x1': nodes[source].x + nodeWidth + 1,
                            'y1': nodes[source].y + source_sum[source] + source_y1 * (j+1) / actionList.length
                        },
                        'target':{
                            'x0': node.x-1, 'y0': node.y + node.height * j / actionList.length,
                            'x1': node.x-1, 'y1': node.y + node.height * (j+1) / actionList.length
                        }
                    })

                    j++;
                })

                source_sum[source] += source_y1
            }
        })
    }



    sankey.console = function(){
        console.log(data);
        console.log(nodes);
        console.log(links);
    };


    return sankey;
}