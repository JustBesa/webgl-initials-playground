var canvas;
var gl;
var program;
var vPosition;

var letter1vertices, letter2vertices;
var buffer1, buffer2;

// initial values for position, scale, and color
var posX = 0.0, posY = 0.0;
var scaleX = 1.0, scaleY = 1.0;
var red = 0.5, green = 0.5, blue = 0.5;

window.onload = function init()
{
	canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // set up viewport and background color
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // white background

    // load shaders and get attribute location
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    vPosition = gl.getAttribLocation(program, "vPosition");

    // vertices for letter 'B'
    letter1vertices = [
        // vertical body of B
        vec2(-0.85,  0.8), vec2(-0.7,  0.8),
        vec2(-0.85, -0.8), vec2(-0.7, -0.8),
        
        // top horizontal part
        vec2(-0.7, 0.8), vec2(-0.7, 0.7),
        vec2(-0.4, 0.8), vec2(-0.4, 0.7),

        // middle horizontal part
        vec2(-0.7, -0.8), vec2(-0.7, -0.7),
        vec2(-0.2, -0.8), vec2(-0.2, -0.7),
 
        // connecting rectangle in middle
        vec2(-0.7, 0.07), vec2(-0.7, -0.07),
        vec2(-0.3, 0.07), vec2(-0.3, -0.07),

        // curved-ish top section
        vec2(-0.4, 0.07), vec2(-0.3, -0.07),
        vec2(-0.35, 0.4), vec2(-0.25, 0.4),

        vec2(-0.35, 0.4), vec2(-0.25, 0.4),
        vec2(-0.47, 0.7), vec2(-0.4, 0.8),

        // curved-ish bottom section
        vec2(-0.4, -0.07), vec2(-0.3, 0.07),
        vec2(-0.25, -0.4), vec2(-0.15, -0.4),

        vec2(-0.25, -0.4), vec2(-0.15, -0.4),
        vec2(-0.3, -0.7), vec2(-0.2, -0.8),
    ];
    
    // vertices for letter 'A'
    letter2vertices = [
        // left leg of A
        vec2(0.45, 0.8), vec2(0.55, 0.8),
        vec2(0.15,  -0.8), vec2(0.25,  -0.8),

        // right leg of A
        vec2(0.45, 0.8), vec2(0.55, 0.8),
        vec2(0.75,  -0.8), vec2(0.85,  -0.8),

        // middle horizontal bar of A
        vec2(0.35, 0.07), vec2(0.65, 0.07),
        vec2(0.35, -0.07), vec2(0.65, -0.07),
    ];

    // sending letter B data to GPU
	buffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(letter1vertices), gl.STATIC_DRAW);  
  
    // sending letter A data to GPU
    buffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(letter2vertices), gl.STATIC_DRAW);      

    // sliders to control position, scale, and color
	document.getElementById("posX").oninput = function(event) {
        posX = parseFloat(event.target.value);
    };    
    document.getElementById("posY").oninput = function(event) {
        posY = parseFloat(event.target.value);
    };
    document.getElementById("scaleX").oninput = function(event) {
        scaleX = parseFloat(event.target.value);
    };
    document.getElementById("scaleY").oninput = function(event) {
        scaleY = parseFloat(event.target.value);
    };  
    document.getElementById("redSlider").oninput = function(event) {
        red = parseFloat(event.target.value);
    };
    document.getElementById("greenSlider").oninput = function(event) {
        green = parseFloat(event.target.value);
    };
    document.getElementById("blueSlider").oninput = function(event) {
        blue = parseFloat(event.target.value);
    };

    document.getElementById("resetBtn").onclick = function () {

        posX = 0.0;
        posY = 0.0;
        scaleX = 1.0;
        scaleY = 1.0;
        red = 0.5;
        green = 0.5;
        blue = 0.5;

        document.getElementById("posX").value = posX;
        document.getElementById("posY").value = posY;
        document.getElementById("scaleX").value = scaleX;
        document.getElementById("scaleY").value = scaleY;
        document.getElementById("redSlider").value = red;
        document.getElementById("greenSlider").value = green;
        document.getElementById("blueSlider").value = blue;
    };

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    var uTranslation = gl.getUniformLocation(program, "uTranslation");
    var uScale = gl.getUniformLocation(program, "uScale");
    var uColor = gl.getUniformLocation(program, "uColor");

    // apply transformation and color for letter B
    gl.uniform2f(uTranslation, posX, posY);
    gl.uniform2f(uScale, scaleX, scaleY);
    gl.uniform3f(uColor, red, green, blue);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	
    // drawing letter B using strips of 4 vertices
	for (let i = 0; i < letter1vertices.length; i += 4) {
		gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
	}
    
    // color for letter A is inverse of B for contrast
    gl.uniform3f(uColor, 1 - red, 1 - green, 1 - blue);

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	
    for (let i = 0; i < letter2vertices.length; i += 4) {
		gl.drawArrays(gl.TRIANGLE_STRIP, i, 4);
	}

    window.requestAnimFrame(render);
}
