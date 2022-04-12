let video;
let pose;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
const poseNet = ml5.poseNet(video, modelLoaded);
  
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses){
  if(poses.length > 0){
    pose = poses[0].pose;
  }
}

function modelLoaded()
{
  console.log('poseNet ready');
}

function draw() {
  image(video,0,0);

  if(pose){
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);

      fill(255,0,0);
      ellipse(pose.nose.x, pose.nose.y, d);

      console.log(mouseX,mouseY);
  }
}

// export function greet(name) {
//     return `Hello, ${name}`;
//   }
  
// export const message = "How you doing?";