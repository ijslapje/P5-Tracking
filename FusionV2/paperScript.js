var facePoint;
var leftHand;
var rightHand;
// var amount = 25;
// var colors = ['orange', 'white', 'cyan', 'white'];

// for (var i = 0; i < amount; i++) {
//     var rect = new Rectangle([0, 0], [25, 25]);
//     rect.center = facePoint;
//     var path = new Path.Rectangle(rect, 6);
//     path.fillColor = colors[i % 4];
//     var scale = (1 - i / amount) * 20;
//     path.scale(scale);
// }

// Create a centered text item at the center of the view:
var text = new PointText({
	point: view.center,
	justification: 'center',
	fontSize: 30,
	fillColor: 'black'
});


function getJoints() {
    var video = document.getElementById('webcam');
    var liveView = document.getElementById('liveView');
    
    // An object to configure parameters to set for the bodypix model.
    // See github docs for explanations.
    var bodyPixProperties = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 4
    };
    
    // An object to configure parameters for detection. I have raised
    // the segmentation threshold to 90% confidence to reduce the
    // number of false positives.
    var segmentationProperties = {
    flipHorizontal: false,
    internalResolution: 'high',
    segmentationThreshold: 0.9
    };
    
    
    // A function to render returned segmentation data to a given canvas context.
    function processSegmentation(canvas, segmentation) {
    var ctx = canvas.getContext('2d');
    
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    ctx.putImageData(imageData, 0, 0);
    
    }
    
    
    
    // Let's load the model with our parameters defined above.
    // Before we can use bodypix class we must wait for it to finish
    // loading. Machine Learning models can be large and take a moment to
    // get everything needed to run.
    var modelHasLoaded = false;
    var model = undefined;
    
    model = bodyPix.load(bodyPixProperties).then(function (loadedModel) {
    model = loadedModel;
    modelHasLoaded = true;
    });
    
    
    
    /********************************************************************
     // Demo: Continuously grab image from webcam stream and classify it.
    // Note: You must access the demo on https for this to work.
    ********************************************************************/
    
    var previousSegmentationComplete = true;
    
    // Check if webcam access is supported.
    function hasGetUserMedia() {
    return !!(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
    }
    
    
    // This function will repeatidly call itself when the browser is ready to process
    // the next frame from webcam.
    function predictWebcam() {
        if (previousSegmentationComplete) {
            // Copy the video frame from webcam to a tempory canvas in memory only (not in the DOM).
            videoRenderCanvasCtx.drawImage(video, 0, 0);
            previousSegmentationComplete = false;
            // Now classify the canvas image we have available.
            model.segmentPersonParts(videoRenderCanvas, segmentationProperties).then(function(segmentation) {
                processSegmentation(webcamCanvas, segmentation);
                previousSegmentationComplete = true;
    
                //GET KEYPOINTS BODY
                noseX = segmentation.allPoses[0].keypoints[0].position.x;
                noseY = segmentation.allPoses[0].keypoints[0].position.y;
                
                getDataFace(noseX, noseY);

                handLx = segmentation.allPoses[0].keypoints[9].position.x;
                handLy = segmentation.allPoses[0].keypoints[9].position.y;

                handRx  = segmentation.allPoses[0].keypoints[10].position.x;
                handRy  = segmentation.allPoses[0].keypoints[10].position.y;
                
                getDataHands(handLx, handLy, handRx, handRy);
    
            });
        }
    
        // Call this function again to keep predicting when the browser is ready.
        window.requestAnimationFrame(predictWebcam);
    
    }
    

    
    // Enable the live webcam view and start classification.
    function enableCam(event) {
    if (!modelHasLoaded) {
        return;
    }
    
    // Hide the button.
    event.target.classList.add('removed');  
    
    // getUsermedia parameters.
    var constraints = {
        video: true
    };
    
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        video.addEventListener('loadedmetadata', function() {
        // Update widths and heights once video is successfully played otherwise
        // it will have width and height of zero initially causing classification
        // to fail.
        webcamCanvas.width = video.videoWidth;
        webcamCanvas.height = video.videoHeight;
        videoRenderCanvas.width = video.videoWidth;
        videoRenderCanvas.height = video.videoHeight;
        });
        
        video.srcObject = stream;
        
        video.addEventListener('loadeddata', predictWebcam);
    });
    }
    
    
    // Lets create a canvas to render our findings to the DOM.
    var webcamCanvas = document.createElement('canvas');
    webcamCanvas.setAttribute('class', 'overlay');
    liveView.appendChild(webcamCanvas);
    
    // We will also create a tempory canvas to render to that is in memory only
    // to store frames from the web cam stream for classification.
    var videoRenderCanvas = document.createElement('canvas');
    var videoRenderCanvasCtx = videoRenderCanvas.getContext('2d');
    
    // If webcam supported, add event listener to button for when user
    // wants to activate it.
    if (hasGetUserMedia()) {
    var enableWebcamButton = document.getElementById('webcamButton');
    enableWebcamButton.addEventListener('click', enableCam);
    } else {
    console.warn('getUserMedia() is not supported by your browser');
    }
}


//Gebruik data om Facepoint te maken
function getDataFace(x, y){
    facePoint = [x-200, y-200];
    //data = facePoint;

    // facePoint.x = x;
    // facePoint.y = y;

    console.log(facePoint[0]);
}

function getDataHands(xL,yL, xR, yR){
    leftHand = [xL, yL];
    rightHand = [xR, yR];

    //console.log(leftHand);
}


// function onFrame(event) {
//     if(facePoint[0] != 'undefined'){
//         myPath._segments[1]._point._x = facePoint[0];
//         console.log(myPath._segments[1]._point._x);
//     }
// }



getDataFace();
getDataHands();

// // function onMouseMove(event) {
// // 	facePoint = event.point;
// //     console.log(facePoint);
// // }

var destination = Point.random() * view.size;

function onFrame(event) {
	// Each frame, move the path 1/30th of the difference in position
	// between it and the destination.
	
	// The vector is the difference between the position of
	// the text item and the destination point:
	var vector = destination - text.position;
	
	// We add 1/30th of the vector to the position property
	// of the text item, to move it in the direction of the
	// destination point:
	text.position += vector / 30;
	
	// Set the content of the text item to be the length of the vector.
	// I.e. the distance it has to travel still:
	text.content = Math.round(vector.length);
	
	// If the distance between the path and the destination is less
	// than 5, we define a new random point in the view to move the
	// path to:
	if (vector.length < 5) {
		destination = Point.random() * view.size;
	}
}


// var children = project.activeLayer.children;
// function onFrame(event) {
//     for (var i = 0, l = children.length; i < l; i++) {
//         var item = children[i];
//         var delta = (view.center - item.position) / (i + 5);
//         item.rotate(Math.sin((event.count + i) / 10) * 7);
//         if (delta.length > 0.1)
//             item.position += delta;
//     }
// }

getJoints();