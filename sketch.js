// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  // 1. 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  // 2. 設定背景顏色為 e7c6ff
  background('#e7c6ff');

  // 3. 計算顯示影像的寬高為整個畫布寬高的 50%
  let displayW = width * 0.5;
  let displayH = height * 0.5;

  // 4. 計算置中位置
  let offsetX = (width - displayW) / 2;
  let offsetY = (height - displayH) / 2;

  // 5. 繪製縮放並置中的影像
  image(video, offsetX, offsetY, displayW, displayH);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 6. 重新映射偵測點座標，使其對齊縮放後的影像位置
          let mappedX = map(keypoint.x, 0, video.width, offsetX, offsetX + displayW);
          let mappedY = map(keypoint.y, 0, video.height, offsetY, offsetY + displayH);

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(mappedX, mappedY, 16);
        }
      }
    }
  }
}

function windowResized() {
  // 當視窗大小改變時，重新調整畫布大小以維持全螢幕
  resizeCanvas(windowWidth, windowHeight);
}
