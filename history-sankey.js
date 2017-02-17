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
        computeLink(nodes, links, height);
    }

    function computeNodeXDS(data, nodes, depth, parent, height){
        var x = depth * 100;
        var source;

        if(parent == null) source = -1;
        else source = parent;

        nodes.push({
            'id': data.id,
            'total_action_num': data.total_action_num,
            'action_num': data.action_num,
            'last_date': data.last_date,
            'ver': data.ver,
            'anno_num': data.anno_num,
            'x': x,
            'depth': depth,
            'source': source
        });

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
            if(node.action_num == 0)
                node_height = height / heightest;
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
            node['y'] += (200 - height * depthSum[node.depth]/(2*heightest));
        });
    }

    function computeLink(nodes, links, height){

        var depthSum = [];
        var source_sum = [];

        nodes.forEach(function(node){
            if(depthSum[node.depth] == undefined)
                depthSum[node.depth] = node.action_num;
            else
                depthSum[node.depth] += node.action_num;
        });

        for(var i = 0; i < nodes.length; i++){
            var source = nodes[i].source;
            var target = i;

            if(source != -1){

                var source_y1 = nodes[source].height * (nodes[target].action_num/depthSum[nodes[i].depth]);

                if(source_sum[source] == undefined)
                    source_sum[source] = 0;

                    links.push({
                    'source':{
                    'x0': nodes[source].x+20, 
                    'y0': nodes[source].y + source_sum[source],
                    'x1': nodes[source].x+20, 
                    'y1': nodes[source].y + source_sum[source] + source_y1
                    },
                    'target':{
                    'x0': nodes[target].x, 'y0': nodes[target].y,
                    'x1': nodes[target].x, 'y1': nodes[target].y + nodes[target].height
                    }
                })

                source_sum[source] += source_y1;
            }
        }
    }



    sankey.console = function(){
        console.log(data);
        console.log(nodes);
    };


    return sankey;
}