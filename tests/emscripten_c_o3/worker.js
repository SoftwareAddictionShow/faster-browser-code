

var g_mem_init = null;

self.addEventListener('message', function(e) {
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


	var Module = {
	  print: (function() {
		console.info('print called .....');
	  })(),
	  printErr: function(text) {
		console.info('printErr called ......:' + text);
	  },
	  setStatus: function(text) {
		  console.info('setStatus: ' + text);
	  },
	  totalDependencies: 0,
	  monitorRunDependencies: function(left) {
		this.totalDependencies = Math.max(this.totalDependencies, left);
		Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
	  }
	};

	console.info('before');
	var start_time = new Date().getTime();
	importScripts('fibonacci.js');
	var end_time = new Date().getTime();
	console.info('after');

	var message = {
		action: 'end',
		start_time: start_time,
		result: null,
		end_time: end_time
	};
	self.postMessage(message);
}, false);
