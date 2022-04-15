import './sketch.js'
import { drawSketch } from './sketch.js';

export let pose;

window.setup = function () {
    window.video = window.createCapture(VIDEO);
    video.hide();
    const poseNet = ml5.poseNet(video, modelLoaded);
  
    poseNet.on('pose', gotPoses);
  }
  
  function gotPoses(poses) {
    if (poses.length > 0) {
      pose = poses[0].pose;
      window.skeleton = poses[0].skeleton;
    }
  }
  
  function modelLoaded() {
    console.log('poseNet ready');
  }
  
  
  window.draw = function () {
      drawSketch();
    if (pose) {
        // console.log(pose.nose.x);
    }
  }
