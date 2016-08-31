"use strict"

var texSize = 256;
var canvas;
var gl;

var program;
var texture;

var pointsArray = [];
var texCoordsArray = [];


var temp1 = [];


window.onload = function init(){
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl)
        alert("WbGL isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    pointsArray.push(vec2(-1,-1), vec2(-1,1), vec2(1,1));
    pointsArray.push(vec2(-1,-1), vec2(1,1), vec2(1,-1));

    texCoordsArray.push(vec2(0,0), vec2(0,1), vec2(1,1));
    texCoordsArray.push(vec2(0,0), vec2(1,1), vec2(1,0));


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    var image = new Image();
    image.src = "ulsan.png";
    configureTexture(image);

//    var image = document.getElementById("south_korea");
  //  configureTexture(image);

    render();




    //----------flowing part----------

    var program2 = initShaders(gl, "vertex-shaderf", "fragment-shaderf");
    gl.useProgram(program2);

    temp1.push(vec2(0.0, 0.0));

    var vBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(temp1), gl.STATIC_DRAW);

    var vPosition2 = gl.getAttribLocation(program2, "vPosition2");
    gl.vertexAttribPointer(vPosition2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition2);

    render_flow();
}

function configureTexture(image) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );



    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );

    gl.generateMipmap( gl.TEXTURE_2D );

//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);     
//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  //  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP);
    

    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
}

function render_flow(){
  //  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, temp1.length);
}