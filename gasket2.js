"use strict"

var canvas2;
var gl2;

var points2 = [];

var NumTimesToSubdivide = 5;

//window.onload = function init2(){
function init2(){
    canvas2 = document.getElementById("gl-canvas2");

    gl2 = WebGLUtils.setupWebGL(canvas2);

    if(!gl2){
        alert("WebGL isn't available");
    }

    var vertices2 = [
        vec2( -1, -1 ),
        vec2( 0, 1 ),
        vec2( 1, -1 )
    ];

    divideTriangle( vertices2[0], vertices2[1], vertices2[2], NumTimesToSubdivide);

    gl2.viewport(0, 0, canvas2.width, canvas2.height );
    gl2.clearColor(1.0, 1.0, 1.0, 1.0);

    var program2 = initShaders(gl2, "vertex-shader", "fragment-shader");
    gl2.useProgram(program2);

    var bufferId2 = gl2.createBuffer();
    gl2.bindBuffer(gl2.ARRAY_BUFFER, bufferId2);
    gl2.bufferData(gl2.ARRAY_BUFFER, flatten(points2), gl2.STATIC_DRAW);

    var vPosition2 = gl2.getAttribLocation(program2, "vPosition");
    gl2.vertexAttribPointer(vPosition2, 2, gl2.FLOAT, false, 0, 0);
    gl2.enableVertexAttribArray(vPosition2);

    render2();
}

function triangle(a,b,c){
    points2.push(a, b, c);
}

function divideTriangle(a, b, c, count){
    if( count == 0 ){
        triangle(a, b, c);
    }
    else {
        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);

        --count;

        divideTriangle(a, ab, ac, count);
        divideTriangle(c, ac, bc, count);
        divideTriangle(b, bc, ab, count);
    }
}

function render2(){
    gl2.clear(gl2.COLOR_BUFFER_BIT);
    gl2.drawArrays(gl2.TRIANGLES, 0, points2.length);
}