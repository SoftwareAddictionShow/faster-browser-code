
function attachListeners() {
  document.getElementById('start').addEventListener('click', startTest);
}

var start_time = null;
var end_time = null;

function startTest() {
  if (common.naclModule) {
    var numberEl = document.querySelector('#number');
    var number = parseInt(numberEl.value, 10);

    common.updateStatus('Running Test');
    start_time = new Date().getTime();
    common.naclModule.postMessage(number);
  }
}


function handleMessage(message_event) {
	end_time = new Date().getTime();
	console.info(message_event);
	var d = message_event.data;

	diff_time = end_time - start_time;
	document.querySelector('#result').innerHTML = diff_time;
}
