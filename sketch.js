
//backgroung image variable
let img;
let numSegments = 200;
let segments = [];
let drawSegments = true;
let imgDrwPrps = {aspect: 0, width: 0, height: 0, xOffset: 0, yOffset: 0};
let canvasAspectRatio = 0;

//Game
var stage = 0;

//player
var playerX = 593;
var playerY = 675;
var playerWidth = 187;
var playerHeight = 187;

// platforms
//the image have the clear border
var platform1X = 145;
var platform1Y = 500;
var platformWidth = 290;
var platformHeight = 99;

// gravity
var jump = false;
var direction = 1;
var velocity = 2;
var jumpPower = 15;
var fallingSpeed = 2;
var minHeight = 800;
var maxHeight = 50;
var jumpCunter = 0;

var Jhonny;
var platforms;

var ground
var groundX = 846;
var groundY = 1000;
var groundWidth = 1695;
var groundHeight = 502;




// Preload
function preload() {
  //nyc
  img = loadImage("assets/nyc_opacity.jpg");
  //Jhonny
  Jhonny = loadImage ("assets/Jhonny.png");
  //platforms
  platforms = loadImage ("assets/oW.png");
  // ground
  ground = loadImage ("assets/ground.png");
}








//setup
function setup() {
  imageMode (CENTER);
  //backgroung image setup
  createCanvas(windowWidth, windowHeight);
  imgDrwPrps.aspect = img.width / img.height;
  calculateImageDrawProps();
  let segmentWidth = img.width / numSegments;
  let segmentHeight = img.height / numSegments;
let positionInColumn = 0;
  for (let segYPos=0; segYPos<img.height; segYPos+=segmentHeight) {
    let positionInRow = 0
    for (let segXPos=0; segXPos<img.width; segXPos+=segmentWidth) {
      let segmentColour = img.get(segXPos + segmentWidth / 2, segYPos + segmentHeight / 2);
      let segment = new ImageSegment(positionInColumn, positionInRow,segmentColour);
      segments.push(segment);
      positionInRow++;
    }
    positionInColumn++;
  }
  for (const segment of segments) {
    segment.calculateSegDrawProps();
  }







  playerX = width / 2;
  playerY = height * 0.7; // Example starting height
  minHeight = height - groundHeight / 2 - playerHeight / 2;
}








// draw
function draw() {
  //backgroung image 
  background(0);
  if (drawSegments) {
    for (const segment of segments) {
      segment.draw();
    }
  } else {
    image(img, imgDrwPrps.xOffset, imgDrwPrps.yOffset, imgDrwPrps.width, imgDrwPrps.height);
  }
  
  //call game function 
  //game stage
  //keyPressed();
  //keyTyped();

  if (keyIsDown(RIGHT_ARROW)) { // p5.js constant for right arrow
    playerX = playerX + 5;
  }
  if (keyIsDown(LEFT_ARROW)) { // p5.js constant for left arrow
    playerX = playerX - 5;
  }

  // Jump trigger (if holding space makes you jump)
  // You might want to use keyPressed for a single jump trigger,
  // but if keyIsDown(32) means "jump as long as held", this is okay.
  if (keyIsDown(32)) { // 32 is the keyCode for spacebar
    jump = true;
  } else {
    jump = false;
  }





  gravity();

  if (stage == 0){
    game();
  }






  image(Jhonny, playerX, playerY, playerWidth, playerHeight);
  image(platforms, platform1X, platform1Y, platformWidth, platformHeight);
  image(ground, groundX, groundY, groundWidth, groundHeight);








}


function windowResized() {
  //backgroung image 
  resizeCanvas(windowWidth, windowHeight);
  calculateImageDrawProps();
  for (const segment of segments) {
    segment.calculateSegDrawProps();
  }
}

function calculateImageDrawProps() {
//backgroung image 
  canvasAspectRatio = width / height;

  if (imgDrwPrps.aspect > canvasAspectRatio) {
    imgDrwPrps.width = width;
    imgDrwPrps.height = width / imgDrwPrps.aspect;
    imgDrwPrps.yOffset = (height - imgDrwPrps.height) / 2;
    imgDrwPrps.xOffset = 0;
  } else if (imgDrwPrps.aspect < canvasAspectRatio) {
    imgDrwPrps.height = height;
    imgDrwPrps.width = height * imgDrwPrps.aspect;
    imgDrwPrps.xOffset = (width - imgDrwPrps.width) / 2;
    imgDrwPrps.yOffset = 0;
  }
  else if (imgDrwPrps.aspect == canvasAspectRatio) {
    imgDrwPrps.width = width;
    imgDrwPrps.height = height;
    imgDrwPrps.xOffset = 0;
    imgDrwPrps.yOffset = 0;
  }
}

class ImageSegment {
  //backgroung image 
  constructor(columnPositionInPrm, rowPostionInPrm  ,srcImgSegColourInPrm) {

    this.columnPosition = columnPositionInPrm;
    this.rowPostion = rowPostionInPrm;
    this.srcImgSegColour = srcImgSegColourInPrm;
    this.drawXPos = 0;
    this.drawYPos = 0;
    this.drawWidth = 0;
    this.drawHeight = 0;
  
    
  }

  calculateSegDrawProps() {
    //backgroung image 
    this.drawWidth = imgDrwPrps.width / numSegments;
    this.drawHeight = imgDrwPrps.height / numSegments;
    this.drawXPos = this.rowPostion * this.drawWidth + imgDrwPrps.xOffset;
    this.drawYPos = this.columnPosition * this.drawHeight + imgDrwPrps.yOffset;
  }





  ///////////////////////////Image
  draw() {
    //backgroung image 
    noStroke();
    fill(this.srcImgSegColour);
    rect(this.drawXPos, this.drawYPos, this.drawWidth, this.drawHeight);

    

    //Image for the game
    //image(Jhonny, playerX, playerY, playerWidth, playerHeight);
    //image(platforms, platform1X, platform1Y, platformWidth, platformHeight);
    //image(ground, groundX, groundY, groundWidth, groundHeight);
    //image(ground, 1290, 950);
  }

}




//////game
function game (){
  //robba




  //collision
  if (playerX >= platform1X - platformWidth/2 && 
      playerX <= platform1X + platformWidth/2 && 
      playerY + playerHeight >= platform1Y - platformHeight/2 &&
      playerY + playerHeight <= platform1Y - platformHeight/2 &&
      jump == false)
    playerY = playerY - 55;
    velocity = 0;
    jumpCunter = 0;


}




//////gravity
function gravity(){
  if (playerY >= minHeight && jump == false){
    playerY = playerY;
    jumpCunter = 0;
  }
  else {
    playerY = playerY + (direction * velocity);
  }

  if (jump == true){
    if (playerY <= maxHeight || jumpCunter >= jumpPower){
      if (playerY >= minHeight) {
        playerY = minHeight;
      }
      else{
        velocity = fallingSpeed;
      }
    }
    else{
      velocity = - jumpPower;
      jumpCunter = jumpCunter + 1;
    }
  }
  else{
    velocity = fallingSpeed;
  }
}





///////keyboard

function keyPressed(){
  if (keyIsDown("RIGHT_ARROW")){
    playerX = playerX + 5;
  }
  if (keyIsDown("LEFT_ARROW")){
    playerX = playerX - 5;
  }
}


function keyTyped(){
  if (keyIsDown(" ")){
    jump = true;
  }
  else {
    jump = false;
  }
}