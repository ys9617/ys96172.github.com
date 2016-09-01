"use strict"

var canvas;
var gl;

// map variable
var program;

var pointsArray = [];
var texCoordsArray = [];

var vBuffer;
var vPosition;
var tBuffer;
var vTexCoord;
var image;
var texture;


// object variable
var program2;

var circle_object = [];

var vBuffer2;
var vPosition2;
var update = 0.0;
var ul;
var endLocation;





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

//    var image = document.getElementById("south_korea");
  //  configureTexture(image);

   // render();




    //----------flowing part----------

    

    program2 = initShaders(gl, "vertex-shaderf", "fragment-shaderf");
    gl.useProgram(program2);

    flow_object(vec2(-0.6, 0.26), vec2(0.5, 0));

    vBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(circle_object), gl.STATIC_DRAW);

    vPosition2 = gl.getAttribLocation(program2, "vPosition2");
    gl.vertexAttribPointer(vPosition2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition2);

    

    

    render();
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

    // render map
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);


    // render flow
    gl.useProgram(program2);
    location_update();
    gl.uniform1f(ul, update);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    gl.vertexAttribPointer(vPosition2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition2);

    gl.drawArrays(gl.POINTS, 0, circle_object.length);

    // animation
    window.requestAnimFrame(render);
}


function flow_object(start, end){

    //modeling example circle

    circle_object.push(start);

    //moving

    ul = gl.getUniformLocation(program2, "update");
}

function location_update(){
    update += 0.001;
}