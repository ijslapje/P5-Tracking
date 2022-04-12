let video;
let pose;
let skeleton;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  const poseNet = ml5.poseNet(video, modelLoaded);

  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function happyFace(x, y, diam) {
  // Face
  fill(255, 255, 0);
  stroke(0);
  strokeWeight(2);
  ellipse(x, y, diam, diam);

  // Smile
  var startAng = .1 * PI
  var endAng = .9 * PI
  var smileDiam = .6 * diam;
  arc(x, y, smileDiam, smileDiam, startAng, endAng);

  // Eyes
  var offset = .2 * diam;
  var eyeDiam = .1 * diam;
  fill(0);
  ellipse(x - offset, y - offset, eyeDiam, eyeDiam);
  ellipse(x + offset, y - offset, eyeDiam, eyeDiam);
}


function draw() {
  image(video, 0, 0);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    fill(255, 0, 0);
    happyFace(pose.nose.x, pose.nose.y, d * 4.5);

    for (let i = 5; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 255, 0);
      ellipse(x, y, 16, 16);
    }

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }
}