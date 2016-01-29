



self.addEventListener('message', function(e) {
	var fibonacci = function(n) {
		if (n < 2) {
			return n;
		}
		return fibonacci(n - 2) + fibonacci(n - 1);
	};

	var message = {
		action: 'end',
		start_time: new Date().getTime(),
		result: fibonacci(43),
		end_time: new Date().getTime()
	};
	self.postMessage(message);
}, false);
