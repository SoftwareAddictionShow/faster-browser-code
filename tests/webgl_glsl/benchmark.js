


function benchmarkWebGlGLSL(cb) {
	var currentScriptPath = function() {
		// NOTE: document.currentScript does not work in a Web Worker
		// So we have to parse a stack trace maually
		try {
			throw new Error('');
		} catch(e) {
			var stack = e.stack;
			var line = null;

			// Chrome and IE
			if (stack.indexOf('@') !== -1) {
				line = stack.split('@')[1].split('\n')[0];
			// Firefox
			} else {
				line = stack.split('(')[1].split(')')[0];
			}
			line = line.substring(0, line.lastIndexOf('/')) + '/';
			return line;
		}
	};

	function main(vshader_src, fshader_src) {
		var array_buffer = new ArrayBuffer(8);
		var OUT_DATA_WIDTH = 128;
		var OUT_DATA_HEIGHT = 128;
		var IN_DATA_SIZE = Math.pow(2, 7);//128 * 128 texture;
		var IN_DATA_LENGTH = array_buffer.byteLength;

		// Get A WebGL context
		var surface = document.createElement('canvas');
		surface.width = OUT_DATA_WIDTH;
		surface.height = OUT_DATA_HEIGHT;
		surface.setAttribute('style', "border: 1px solid black");
		document.body.appendChild(surface);
		var gl = surface.getContext('webgl') || surface.getContext('experimental-webgl');
		if (! gl) {
			console.error('Failed to init WebGL');
			return;
		}

		// Print the open gl version
		console.info('WebGL Version: ' + gl.getParameter(gl.VERSION));
		console.info('GLSL Version: ' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
		console.info('Vendor: ' + gl.getParameter(gl.VENDOR));
		/*
		var ext = gl.getExtension('WEBGL_debug_renderer_info');
		if (ext) {
			console.info(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL));
			console.info(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
		}
		*/

		// Compile the Vertex Shader
		var shaderSource = vshader_src;
		var shaderVertex = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(shaderVertex, shaderSource);
		gl.compileShader(shaderVertex);
		var compiled = gl.getShaderParameter(shaderVertex, gl.COMPILE_STATUS);
		if (! compiled) {
			var lastError = gl.getShaderInfoLog(shaderVertex);
			console.error("Shader compile error:" + lastError);
			gl.deleteShader(shaderVertex);
		}

		// Inject our sizes into the shader source code
		var shaderSource = fshader_src;
		shaderSource = shaderSource.replace(/OUT_DATA_WIDTH/g, OUT_DATA_WIDTH + '.0');
		shaderSource = shaderSource.replace(/OUT_DATA_HEIGHT/g, OUT_DATA_HEIGHT + '.0');
		shaderSource = shaderSource.replace(/IN_DATA_SIZE/g, IN_DATA_SIZE + '.0');
		shaderSource = shaderSource.replace(/IN_DATA_LENGTH/g, IN_DATA_LENGTH + '.0');

		// Compile the Fragment Shader
		var shaderFragment = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(shaderFragment, shaderSource);
		gl.compileShader(shaderFragment);
		var compiled = gl.getShaderParameter(shaderFragment, gl.COMPILE_STATUS);
		if (! compiled) {
			var lastError = gl.getShaderInfoLog(shaderFragment);
			console.error("Shader compile error:" + lastError);
			gl.deleteShader(shaderFragment);
		}

		// Build the program
		var program = gl.createProgram();
		gl.attachShader(program, shaderVertex);
		gl.attachShader(program, shaderFragment);
		gl.linkProgram(program);
		var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (! linked) {
			var lastError = gl.getProgramInfoLog(program);
			console.error("Program link error:" + lastError);
		}
		gl.useProgram(program);

		// Create a vertex buffer
		var vertexPosBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
		var vertices = [-1, -1, 1, -1, -1, 1, 1, 1];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		vertexPosBuffer.itemSize = 2;
		vertexPosBuffer.numItems = 4;

		// Setup the attributes, uniforms, and textures
		gl.enableVertexAttribArray(program.vertexPosArray);
		gl.vertexAttribPointer(program.vtxpos, 2, gl.FLOAT, false, 0, 0);
		program.vtxpos = gl.getAttribLocation(program, 'vtxpos');
		program.sampler = [gl.getUniformLocation(program, 'tex0')];
		program.tex = [gl.createTexture()];

		// Create the input buffer
		var inBuffer = new Uint8Array(4 * IN_DATA_SIZE * IN_DATA_SIZE);
		console.info('In buffer size:  ' + inBuffer.byteLength);
		console.info('Data size:	   ' + array_buffer.byteLength);
		var view = new Uint8Array(array_buffer);
		for (var i = 0; i < view.length; ++i) {
			inBuffer[i] = view[i];
		}

		// Create the output buffer
		var outBuffer = new Uint8Array(4 * OUT_DATA_WIDTH * OUT_DATA_HEIGHT);
		console.info('Out buffer size: ' + outBuffer.byteLength);

		function getLine(source, index, size) {
			var line = new Array(size);
			for (var i=0; i<size; ++i) {
				line[i] = String.fromCharCode(source[index + i]);
			}
			return line.join('');
		}

		function blit() {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, program.tex[0]);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, IN_DATA_SIZE, IN_DATA_SIZE, 0, gl.RGBA, gl.UNSIGNED_BYTE, inBuffer);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.uniform1i(program.sampler[0], 0);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			gl.readPixels(0, 0, OUT_DATA_WIDTH, OUT_DATA_HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE, outBuffer);
		};
		blit();
/*
		for (var i=0; i<outBuffer.length; ++i) {
			if (outBuffer[i] != 0) {
				console.info(i + ', ' + outBuffer[i]);
			}
		}
*/
		var result = 0;
		result += (outBuffer[0] << 0);
		result += (outBuffer[1] << 8);
		result += (outBuffer[2] << 16);
		result += (outBuffer[3] << 24);
		console.info(result);
		for (var i=0; i<4; ++i) {
			console.info(i + ', ' + outBuffer[i].toString(16));
		}

		return result;
	}

	function httpGet(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function () {
			callback(this.responseText);
		};
		xhr.open('GET', url, true);
		xhr.send();
	}

	var path = currentScriptPath();
	httpGet(path + 'vshader.glsl', function(vshader_src) {
		httpGet(path + 'fshader.glsl', function(fshader_src) {
			var start_time = new Date().getTime();
			var result = main(vshader_src, fshader_src);
			var end_time = new Date().getTime();
			console.info(end_time - start_time);
			cb(end_time - start_time, result);
		});
	});


}
