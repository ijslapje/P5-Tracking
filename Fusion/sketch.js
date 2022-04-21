import { pose } from './getJoints.js';

var path;
var canvas;
var start;
var test = 200;
var rectangle;

window.onload = function () {
		canvas = document.getElementById('canvas');
		// Create an empty project and a view for the canvas:
		paper.setup(canvas);
		// Create a Paper.js Path to draw a line into it:
		//path = new paper.Path();
		// Give the stroke a color
		rectangle = new paper.Rectangle(new paper.Point(50, 50), new paper.Point(150, 100));
		path = new paper.Path.Rectangle(rectangle);
		path.fillColor = '#e9e9ff';
		path.selected = true;

		console.log(rectangle.x);
		

		//path.moveTo(start);

		paper.view.onFrame = function(event) {

			console.log(test)
			// On each frame, rotate the path by 3 degrees:
			test = test+2;
			//rectangle.x = test;

			//path.position()
			path.scale(test);
			//path.lineTo(start.add([ test, -50 ]));
			// Draw the view now:
			//paper.view.draw();
		}
}



export function drawSketch() {
	if (typeof pose == 'undefined') {
		//console.log('GA IN DE CAMERA STAAN KUT!');
	}
	else {
		console.log(pose.nose.x);
		
		// in JavaScript. Instead, we need to call the add() function:


	}
}
