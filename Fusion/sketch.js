import { pose } from './getJoints.js';

window.onload = function () {
	
}

export function drawSketch() {
	if (typeof pose == 'undefined') {
		console.log('GA IN DE CAMERA STAAN KUT!');
	}
	else {
		//console.log(pose.nose.x);
	}
}
