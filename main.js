var vertexShaderText = `
    precision mediump float;

    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;
    
    uniform mat4 uTranslate;

    void main() {
        fragColor = vertColor;
        gl_Position = uTranslate * vec4(vertPosition, 0.0, 1.0);
    }
`;

var fragmentShaderText = `
    precision mediump float;
    
    varying vec3 fragColor;
    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`;

function main() {
    //
    //  Inisialisasi
    //
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    //
    //  compatibility check
    //
    if (!gl) {
        console.log("WebGL not supporte, falling back on experimental");
        gl = canvas.getContext("experimental-webgl");
    }
    if (!gl) {
        alert("Your browser does not support WebGL");
    }
    
    //
    //  Create shaders
    //
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("ERROR validating program!", gl.getProgramInfoLog(program));
        return;
    }

    // only do this for debungging purpose only
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("ERROR validating program!", gl.getProgramInfoLog(program));
        return;
    }

    // 
    //  Create buffer
    //
    var triangleVertices_kiri = 
    [ // X, Y,      R, G, B
        // laptop kiri atas

        // kiri layar
        -0.8, 0.1,   0.2, 0.2, 0.2,
        -0.5, 0.3,   0.2, 0.2, 0.2,
        -0.455, 0.075,   0.2, 0.2, 0.2,
        
        -0.8, 0.1,   0.2, 0.2, 0.2,
        -0.65, -0.15,   0.2, 0.2, 0.2,
        -0.455, 0.075,   0.2, 0.2, 0.2,

        // kiri layar dalam
        -0.735, 0.085,   0.0, 0.0, 0.0,
        -0.515, 0.25,   0.0, 0.0, 0.0,
        -0.475 ,0.074,   0.0, 0.0, 0.0,
        
        -0.735, 0.085,   0.0, 0.0, 0.0,
        -0.64, -0.1,   0.0, 0.0, 0.0,
        -0.475 ,0.074,   0.0, 0.0, 0.0,

        // kiri body laptop
        -0.65, -0.15,   0.7, 0.7, 0.7,
        -0.455, 0.075,   0.7, 0.7, 0.7,
        -0.2, 0.0,   0.7, 0.7, 0.7,

        -0.65, -0.15,   0.7, 0.7, 0.7,
        -0.2, 0.0,   0.7, 0.7, 0.7,
        -0.3, -0.3,   0.7, 0.7, 0.7,

        // kiri body shadow
        -0.65, -0.15,   0.3, 0.3, 0.3,
        -0.3, -0.3,   0.3, 0.3, 0.3,
        -0.31, -0.31,   0.3, 0.3, 0.3,

        -0.65, -0.15,   0.3, 0.3, 0.3,
        -0.31, -0.31,   0.3, 0.3, 0.3,
        -0.65, -0.165,   0.3, 0.3, 0.3,

        // kiri keyboard
        -0.44, 0.05,   0.3, 0.3, 0.3,
        -0.325, 0.016,   0.3, 0.3, 0.3,
        -0.453, -0.205,   0.3, 0.3, 0.3,

        -0.44, 0.05,   0.3, 0.3, 0.3,
        -0.60, -0.145,   0.3, 0.3, 0.3,
        -0.453, -0.205,   0.3, 0.3, 0.3
    ];

    var triangleVertices_kanan = 
    [
        // laptop depan atas

        // depan layar
        0.2, 0.3,   0.2, 0.2, 0.2,
        0.8, 0.3,   0.2, 0.2, 0.2,
        0.725, 0.0,   0.2, 0.2, 0.2,

        0.725, 0.0,   0.2, 0.2, 0.2,
        0.275, 0.0,   0.2, 0.2, 0.2,
        0.2, 0.3,   0.2, 0.2, 0.2,
        
        // depan layar dalam
        0.25, 0.25,   0.0, 0.0, 0.0,
        0.75, 0.25,   0.0, 0.0, 0.0,
        0.7, 0.025,   0.0, 0.0, 0.0,

        0.25, 0.25,   0.0, 0.0, 0.0,
        0.3, 0.025,   0.0, 0.0, 0.0,
        0.7, 0.025,   0.0, 0.0, 0.0,
        
        // depan body laptop
        0.275, 0.0,   0.7, 0.7, 0.7,
        0.725, 0.0,   0.7, 0.7, 0.7,
        0.8, -0.3,   0.7, 0.7, 0.7,

        0.275, 0.0,   0.7, 0.7, 0.7,
        0.2, -0.3,   0.7, 0.7, 0.7,
        0.8, -0.3,   0.7, 0.7, 0.7,

        // depan body shadow
        0.2, -0.3,   0.3, 0.3, 0.3,
        0.8, -0.3,   0.3, 0.3, 0.3,
        0.8, -0.315,   0.3, 0.3, 0.3,

        0.2, -0.3,   0.3, 0.3, 0.3,
        0.8, -0.315,   0.3, 0.3, 0.3,
        0.2, -0.315,   0.3, 0.3, 0.3,

        // depan keyboard
        0.3, -0.025,   0.3, 0.3, 0.3,
        0.7, -0.025,   0.3, 0.3, 0.3,
        0.725, -0.15,   0.3, 0.3, 0.3,

        0.3, -0.025,   0.3, 0.3, 0.3,
        0.275, -0.15,   0.3, 0.3, 0.3,
        0.725, -0.15,   0.3, 0.3, 0.3
    ];

    var lineVertices_kiri = 
    [
        // touch pad
        -0.34,-0.05,   0.5, 0.5, 0.5,
        -0.25,-0.080,   0.5, 0.5, 0.5,
        -0.287,-0.18,   0.5, 0.5, 0.5,
        -0.39,-0.140,   0.5, 0.5, 0.5,
        -0.34,-0.05,   0.5, 0.5, 0.5
    ];

    var lineVertices_kanan = 
    [
        // touch pad
        0.415, -0.175,   0.5, 0.5, 0.5,
        0.585, -0.175,   0.5, 0.5, 0.5,
        0.6, -0.275,   0.5, 0.5, 0.5,
        0.4, -0.275,   0.5, 0.5, 0.5,
        0.415, -0.175,   0.5, 0.5, 0.5
    ];

    var verticesLaptop = [...triangleVertices_kiri, ...triangleVertices_kanan];
    var verticesTouchpad = [...lineVertices_kiri, ...lineVertices_kanan];
    var vertices = [...verticesLaptop, ...verticesTouchpad];

    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, // Attribute location
        2, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a 
    );
    gl.vertexAttribPointer(
        colorAttribLocation, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    //
    //  Main render loop
    //
    var uTranslate = gl.getUniformLocation(program, 'uTranslate');
    var speed = 0.0164;
    var dy = 0;

    function render() {
        if (dy >= 0.7 || dy <= -0.7) {
            speed = -speed;
        }
		
        dy += speed;
        
		const kiri = [
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0,
		];
		
		const kanan = [
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.0, dy, 0.0, 1.0,
		];

        //  clear color
        gl.clearColor(0.75, 0.85, 0.8, 1.0); // warna background
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);
        gl.uniformMatrix4fv(uTranslate, false, kiri);
        gl.drawArrays(gl.TRIANGLES, 0, triangleVertices_kiri.length/5);
        gl.drawArrays(gl.LINE_STRIP, verticesLaptop.length/5, lineVertices_kiri.length/5);

		gl.uniformMatrix4fv(uTranslate, false, kanan);
        gl.drawArrays(gl.TRIANGLES, triangleVertices_kiri.length/5, triangleVertices_kanan.length/5);
        gl.drawArrays(gl.LINE_STRIP, (vertices.length-lineVertices_kanan.length)/5, lineVertices_kanan.length/5);
            
        requestAnimationFrame(render);
    }
    render();
}
