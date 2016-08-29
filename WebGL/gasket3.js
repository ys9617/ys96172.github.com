"use strict";

var canvas;
var gl;
var points;

var NumPoints = 10000;

function init3(){
    canvas = document.getElementById("gl-canvas3");

    gl = WebGLUtils.setupWebGL(canvas);

    if(!gl){
        alert("WebGL isn't available");
    }

    var vertices = [
        vec3( -1, -1, -1 ),
        vec3( 1, -1, -1 ),
        vec3( 0.0, 1, 0.0 ),
        vec3( 0.0, -1, 1 )
    ];

    points = [vec3(0.0, 0.0, 0.0)];

    for( var i = 0; points.length < NumPoints; i++ ){
        var j = Math.floor(Math.random() * 4);

        points.push(mix(points[i], vertices[j], 0.5));
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    var program = initShaders(gl, "vertex-shader3", "fragment-shader3");
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length);
}