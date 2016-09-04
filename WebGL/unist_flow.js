"use strict"

var canvas;
var gl;

var program;

var pointsArray = [];
var texCoordsArray = [];

var vBuffer;
var vPosition;
var tBuffer;
var vTexCoord;
var image;
var texture;

// curve
var curveArray1 = [];
var curveArray2 = [];
var curveArray3 = [];
var curveArray4 = [];
var curveArray5 = [];

var pointArray1 = [];
var pointArray2 = [];
var pointArray3 = [];
var pointArray4 = [];
var pointArray5 = [];

var program3;
var loc;

window.onload = function init(){
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl)
        alert("WbGL isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    pointsArray.push(vec2(-1,-1), vec2(-1,1), vec2(1,1));
    pointsArray.push(vec2(-1,-1), vec2(1,1), vec2(1,-1));

    texCoordsArray.push(vec2(0,0), vec2(0,1), vec2(1,1));
    texCoordsArray.push(vec2(0,0), vec2(1,1), vec2(1,0));


    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    image = new Image();
    image.src = "ulsan.png";
    configureTexture(image);

    render();

    // curve

    bezier(vec2(-0.65, 0.29), vec2(-0.09, 0.25), vec2(-0.2, 0.4), 4, curveArray1);   // to gu yeong ri
    bezier(vec2(-0.65, 0.29), vec2(0.1, -0.1), vec2(-0.1, 0.3), 4, curveArray2);      // to Ulsan university
    bezier(vec2(-0.65, 0.29), vec2(0.707, -0.165), vec2(0.4, 0.7), 4, curveArray3);        // to city hall
    bezier(vec2(-0.65, 0.29), vec2(-0.24, 0.12), vec2(-0.3, 0.35), 4, curveArray4);     // to chunsang


    var program2 = initShaders(gl, "vertex-shader2", "fragment-shader2");
    gl.useProgram(program2);

    var vBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(curveArray1), gl.STATIC_DRAW);

    var vPosition2 = gl.getAttribLocation(program2, "vPosition2");
    gl.vertexAttribPointer(vPosition2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition2);

    render2(curveArray1);


    gl.bufferData(gl.ARRAY_BUFFER, flatten(curveArray2), gl.STATIC_DRAW);
    render2(curveArray2);

    gl.bufferData(gl.ARRAY_BUFFER, flatten(curveArray3), gl.STATIC_DRAW);
    render2(curveArray3);

    gl.bufferData(gl.ARRAY_BUFFER, flatten(curveArray4), gl.STATIC_DRAW);
    render2(curveArray4);



//-----------------point location-----------------

    program3 = initShaders(gl, "vertex-shader3", "fragment-shader3");
    gl.useProgram(program3);


  //  loc = gl.getUniformLocation(program3, "origin");
    point_plcae(vec2(-0.65, 0.29), pointArray1);     // unist
    point_plcae(vec2(-0.09, 0.25), pointArray2);     // gu yeong ri
    point_plcae(vec2(0.1, -0.1), pointArray3);       // UU
    point_plcae(vec2(0.707, -0.165), pointArray4);
    point_plcae(vec2(-0.24, 0.12), pointArray5);



    var vBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointArray1), gl.STATIC_DRAW);

    var vPosition3 = gl.getAttribLocation(program3, "vPosition3");
    gl.vertexAttribPointer(vPosition3, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition3);

   // gl.uniform1f(loc, 0.0);
    render3(pointArray1);

    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointArray2), gl.STATIC_DRAW);
    render3(pointArray2);

    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointArray3), gl.STATIC_DRAW);
    render3(pointArray3);

    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointArray4), gl.STATIC_DRAW);
    render3(pointArray4);

    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointArray5), gl.STATIC_DRAW);
    render3(pointArray5);
}

function configureTexture(image) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );  

    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
}

function render2(array){
    gl.drawArrays(gl.LINE_STRIP, 0, array.length);
}

function render3(array){
    gl.drawArrays(gl.TRIANGLES, 0, array.length);
}

function bezier(start, end, con, n, array){

    var x = (start[0]+end[0])/2;
    var y = (start[1]+end[1])/2;

    array.push(start);   

    if (n > 1){
        n--;
        bezier(start, vec2((con[0]+x)/2,(con[1]+y)/2), vec2((start[0]+con[0])/2, (start[1]+con[1])/2), n, array);
        bezier(vec2((con[0]+x)/2,(con[1]+y)/2), end, vec2((end[0]+con[0])/2, (end[1]+con[1])/2), n, array);
    }
    else{
        array.push(vec2((con[0]+x)/2,(con[1]+y)/2));
    }

    array.push(end);
}

function point_plcae(origin, array){
    var arcNum = 100;
    var r = 0.005;
    var rad = (Math.PI*2)/arcNum; 

    for (var i = 0; i < arcNum; i++){
        array.push(origin);
        array.push(vec2(r*Math.sin(rad*i)+origin[0],r*Math.cos(rad*i)+origin[1]));
        array.push(vec2(r*Math.sin(rad*(i+1))+origin[0],r*Math.cos(rad*(i+1))+origin[1]));
    }
  //  location = gl.getUniformLocation(program3, "origin");
    
}