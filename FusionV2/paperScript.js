var facePoint = view.center;
var amount = 25;
var colors = ['orange', 'white', 'cyan', 'white'];

for (var i = 0; i < amount; i++) {
    var rect = new Rectangle([0, 0], [25, 25]);
    rect.center = facePoint;
    var path = new Path.Rectangle(rect, 6);
    path.fillColor = colors[i % 4];
    var scale = (1 - i / amount) * 20;
    path.scale(scale);
}

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
    
    
    //  // This array will hold the colours we wish to use to highlight different body parts we find.
    //  // RGBA (Red, Green, Blue, and Alpha (transparency) channels can be specified).
    //  const colourMap = [];
    
    //  // Left_face
    //  colourMap.push({r: 244, g: 67, b: 54, a: 255});
    //  // Right_face
    //  colourMap.push({r: 183, g: 28, b: 28, a: 255});
    //  // left_upper_arm_front
    //  colourMap.push({r: 233, g: 30, b: 99, a: 255});
    //  // left_upper_arm_back  
    //  colourMap.push({r: 136, g: 14, b: 79, a: 255});
    //  // right_upper_arm_front
    //  colourMap.push({r: 233, g: 30, b: 99, a: 255});
    //  // 	right_upper_arm_back
    //  colourMap.push({r: 136, g: 14, b: 79, a: 255});
    //  // 	left_lower_arm_front
    //  colourMap.push({r: 233, g: 30, b: 99, a: 255});
    //  // 	left_lower_arm_back
    //  colourMap.push({r: 136, g: 14, b: 79, a: 255});
    //  // right_lower_arm_front
    //  colourMap.push({r: 233, g: 30, b: 99, a: 255});
    //  // right_lower_arm_back
    //  colourMap.push({r: 136, g: 14, b: 79, a: 255});
    //  // left_hand 
    //  colourMap.push({r: 156, g: 39, b: 176, a: 255});
    //  // right_hand
    //  colourMap.push({r: 156, g: 39, b: 176, a: 255});
    //  // torso_front
    //  colourMap.push({r: 63, g: 81, b: 181, a: 255}); 
    //  // torso_back 
    //  colourMap.push({r: 26, g: 35, b: 126, a: 255});
    //  // left_upper_leg_front
    //  colourMap.push({r: 33, g: 150, b: 243, a: 255});
    //  // left_upper_leg_back
    //  colourMap.push({r: 13, g: 71, b: 161, a: 255});
    //  // right_upper_leg_front
    //  colourMap.push({r: 33, g: 150, b: 243, a: 255});
    //  // right_upper_leg_back
    //  colourMap.push({r: 13, g: 71, b: 161, a: 255});
    //  // left_lower_leg_front
    //  colourMap.push({r: 0, g: 188, b: 212, a: 255});
    //  // left_lower_leg_back
    //  colourMap.push({r: 0, g: 96, b: 100, a: 255});
    //  // right_lower_leg_front
    //  colourMap.push({r: 0, g: 188, b: 212, a: 255});
    //  // right_lower_leg_back
    //  colourMap.push({r: 0, g: 188, b: 212, a: 255});
    //  // left_feet
    //  colourMap.push({r: 255, g: 193, b: 7, a: 255});
    //  // right_feet
    //  colourMap.push({r: 255, g: 193, b: 7, a: 255});
    
    
    // A function to render returned segmentation data to a given canvas context.
    function processSegmentation(canvas, segmentation) {
    var ctx = canvas.getContext('2d');
    
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //    var data = imageData.data;
    
    //    let n = 0;
    //    for (let i = 0; i < data.length; i += 4) {
    //      if (segmentation.data[n] !== -1) {
    //        data[i] = colourMap[segmentation.data[n]].r;     // red
    //        data[i + 1] = colourMap[segmentation.data[n]].g; // green
    //        data[i + 2] = colourMap[segmentation.data[n]].b; // blue
    //        data[i + 3] = colourMap[segmentation.data[n]].a; // alpha
    //      } else {
    //        data[i] = 0;    
    //        data[i + 1] = 0;
    //        data[i + 2] = 0;
    //        data[i + 3] = 0;
    //      }
    //      n++;
    //    }
    
    ctx.putImageData(imageData, 0, 0);
    
    //console.log(imageData);
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
                keypointX = segmentation.allPoses[0].keypoints[0].position.x;
                keypointY = segmentation.allPoses[0].keypoints[0].position.y;
                
                sendData(keypointX, keypointY);
    
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

function sendData(x, y){
    console.log(x,y);
    facePoint.x = x;
    facePoint.y = y;
    //data = facePoint;
}

sendData();

// function onMouseMove(event) {
// 	facePoint = event.point;
//     console.log(facePoint);
// }

var children = project.activeLayer.children;
function onFrame(event) {
    for (var i = 0, l = children.length; i < l; i++) {
        var item = children[i];
        var delta = (facePoint - item.position) / (i + 5);
        item.rotate(Math.sin((event.count + i) / 10) * 7);
        if (delta.length > 0.1)
            item.position += delta;
    }
}

getJoints();