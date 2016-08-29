//"use strict"

var gl;
var point;

var NumPoints = 5000;

window.onload = function init(){
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);

    if(!gl){
        alert("WebGl isn't available");
    }

    var vertices = [
        vec2(-1, -1),
        vec2( 0,  1),
        vec2( 1, -1)
    ];

    var u = add( vertices[0], vertices[1] );
    var v = add( vertices[0], vertices[2] );
    var p = scale( 0.25, add(u,v) );

    points = [p];

    for ( var i = 0; points.length < NumPoints; i++ ){
        var j = Math.floor(Math.random() * 3);
        p = add( points[i], vertices[j] );
        p = scale( 0.5, p );
        points.push(p);
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();

    init2();

    init3();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT);
    gl.drawArrays( gl.POINTS, 0, points.length );
}