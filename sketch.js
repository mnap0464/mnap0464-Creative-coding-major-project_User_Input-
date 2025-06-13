//backgroung image variable
let img; // Original background mosaic image
let sacry; // Declare the scary image
let numSegments = 200; // How many pieces the image is divided into.
let segments = [];
let drawSegments = true;
let imgDrwPrps = {aspect: 0, width: 0, height: 0, xOffset: 0, yOffset: 0}; // These properties help make sure your background image always looks good, no matter the screen size.
let canvasAspectRatio = 0;


  /**
 * The following lines were taken from Gemini. I require to solve the 
 * problem of the changing background when the enemy hit the player.
 */
// Variables for scary mosaic effect
let showScaryMosaic = false; // Flag to draw the scary mosaic
let scaryMosaicTimer = 0;   // Timer for how long the scary mosaic is active
const SCARY_MOSAIC_DURATION = 30; // Duration in frames (30 frames)

//Game
var stage = 0;

//player
var Jhonny;
var playerX = 400;
var playerY = 700;
var playerWidth = 187;
var playerHeight = 187;

// player starting position
//These constants are tied to when the enemy hits the player, 
//in order to send him back to his starting position.
const initialPlayerX = 400;
const initialPlayerY = 700;


//enemy
var enemy;
//1
var enemy1X = 900;
var enemy1Y = 700;
var enemyWidth = 130;
var enemyHeight = 100;
//2
var enemy2X = 630;
var enemy2Y = 430;
//3
var enemy3X = 1000;
var enemy3Y = 180;
// enemy moviment
var enemy1Position = 900;
var enemy2Position = 630;
var enemy3Position = 1000;
var enemySpeed = 2;
var enemyDirection = 1;
var enemyDistance= 130;
var enemy1Distance= 300;
var enemy1Direction = -1; 
var enemy2Direction = 1; 
var enemy3Direction = -1;



// platforms
var platforms;
//1
var platform1X = 145;
var platform1Y = 530;
var platformWidth = 290;
var platformHeight = 99;
//2
var platform2X = 630;
var platform2Y = 530;
//3
var platform3X = 350;
var platform3Y = 280;
//4
var platform4X = 1000;
var platform4Y = 280;
//5
var platform5X = 1350;
var platform5Y = 530;
//6
var platform6X = 1650;
var platform6Y = 280;

//platforms horizontal barrier
var barrier1Y = platform1Y + 20;
var barrier2Y = platform2Y + 20;
var barrier3Y = platform3Y + 20;
var barrier4Y = platform4Y + 20;
var barrier5Y = platform5Y + 20;
var barrier6Y = platform6Y + 20;
var barrierHeight = 20; 



// music note
var note
//1
var noteX = 145;
var noteY = 430;
var noteWidth = 100;
var noteHeight = 99;
//2
var note2X = 630;
var note2Y = 430;
//3
var note3X = 350;
var note3Y = 180;
//4
var note4X = 1000;
var note4Y = 180;
//5
var note5X = 1350;
var note5Y = 430;
//6
var note6X = 1600;
var note6Y = 180;
//7
var note7X = 900;
var note7Y = 700;



//counters
var score = 0;
var lives = 3;
var totalTime;
var timeLimit = 60;
var splashTime;
var gameTime;



//ground variables
var ground
var groundX = 846;
var groundY = 1000;
var groundWidth = 1695;
var groundHeight = 502;



// gravity
var jump = false;
var direction = 1;
var velocity = 2;
var jumpPower = 20;
var fallingSpeed = 2; 
var minHeight = 760; 
var maxHeight = 10; 
var jumpCunter = 0; 


//sounds
var jumpSound;
var noteSound1;
var noteSound2;
var noteSound3;
var noteSound4;
var noteSound5;
var noteSound6;
var noteSound7;
var louseLifeSound;
var louseGameSound;
var winGameSound;


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
   //image for stage 0
  nyc = loadImage ("assets/nyc .jpg")
  //the note are point
  note = loadImage ("assets/music-note_11336134.png");
  //the instrument are enemy
  enemy = loadImage ("assets/enemy.png");
  //hit the enemy and cange the backgroung image
  sacry = loadImage ("assets/scary.png");
  //font
  pressStart = loadFont ("assets/PressStart2P-Regular.ttf");
  //jump sound
  jumpSound = loadSound ("assets/cartoon-jump-6462.mp3");
  //note sound from "do" to "si"
  noteSound1 = loadSound ("assets/do-80236.mp3");
  noteSound2 = loadSound ("assets/re-78500.mp3");
  noteSound3 = loadSound ("assets/mi-80239.mp3");
  noteSound4 = loadSound ("assets/fa-78409.mp3");
  noteSound5 = loadSound ("assets/sol-101774.mp3");
  noteSound6 = loadSound ("assets/la-80237.mp3");
  noteSound7 = loadSound ("assets/si-80238.mp3");
  //louse a life sound
  louseLifeSound = loadSound ("assets/slap-hurt-pain-sound-effect-262618.mp3");
  //game over
  louseGameSound = loadSound ("assets/cartoon-trombone-sound-effect-241387.mp3");
  // win game
  winGameSound = loadSound ("assets/winning-218995.mp3");
}








//setup
function setup() {
  imageMode (CENTER);
  //backgroung image setup
  createCanvas(windowWidth, windowHeight);
  imgDrwPrps.aspect = img.width / img.height;
  calculateImageDrawProps();
  // The segment creation loop should use the *original* 'img' for initial setup.
  // The dynamically change which image is used later.
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
}








// draw
function draw() {
  //backgroung image
  background(0);
  // MAIN CHANGE 1: Control which image is used for the mosaic based on showScaryMosaic flag
  if (drawSegments) {
    // If scary mosaic is active, use its segments
    if (showScaryMosaic) {
      // Re-create segments with scary image colors if not already done
      // (This is a simplified approach; ideally, you'd pre-generate segments for both or swap image source)
      // For minimal change, we'll re-calculate segment colors on the fly based on which image is "active"
      let currentMosaicImage = showScaryMosaic ? sacry : img;
      for (const segment of segments) {
        let segX = segment.rowPostion * (currentMosaicImage.width / numSegments);
        let segY = segment.columnPosition * (currentMosaicImage.height / numSegments);
        segment.srcImgSegColour = currentMosaicImage.get(segX + (currentMosaicImage.width / numSegments) / 2, segY + (currentMosaicImage.height / numSegments) / 2);
        segment.drawMosaicSegment();
      }
      scaryMosaicTimer--; // Decrement timer
      if (scaryMosaicTimer <= 0) {
        showScaryMosaic = false; // Turn off scary mosaic
        // Reset segment colors to original image
        let originalImage = img;
        for (const segment of segments) {
          let segX = segment.rowPostion * (originalImage.width / numSegments);
          let segY = segment.columnPosition * (originalImage.height / numSegments);
          segment.srcImgSegColour = originalImage.get(segX + (originalImage.width / numSegments) / 2, segY + (originalImage.height / numSegments) / 2);
        }
      }
    } else {
      // Draw normal mosaic segments
      for (const segment of segments) {
        segment.drawMosaicSegment();
      }
    }
  } else {
    // If not drawing segments, just draw the full image
    image(img, imgDrwPrps.xOffset, imgDrwPrps.yOffset, imgDrwPrps.width, imgDrwPrps.height);
  }


    //game part
  if (stage == 0) {
    splash(); 
  } else if (stage == 1) { 
    // Input handling
    if (keyIsDown(RIGHT_ARROW)){
      playerX = playerX + 5;
    }
    if (keyIsDown(LEFT_ARROW)){
      playerX = playerX - 5;
    }

    if (keyIsDown(32)){ 
      jump = true;
    } else {
      jump = false;
    }
  


  //game physics and logic
    gravity();
    game(); //call game logic after gravity to apply current position changes
    gameTime = int((totalTime - splashTime)/1000)

    let displayTimeRemaining = timeLimit - gameTime;
    if (displayTimeRemaining <= 0) {
      displayTimeRemaining = 0; 
    }



    //ground
    image(ground, groundX, groundY, groundWidth, groundHeight);

    //player
    image(Jhonny, playerX, playerY, playerWidth, playerHeight);

    //platforms
    image(platforms, platform1X, platform1Y, platformWidth, platformHeight);
    image(platforms, platform2X, platform2Y, platformWidth, platformHeight);
    image(platforms, platform3X, platform3Y, platformWidth, platformHeight);
    image(platforms, platform4X, platform4Y, platformWidth, platformHeight);
    image(platforms, platform5X, platform5Y, platformWidth, platformHeight);
    image(platforms, platform6X, platform6Y, platformWidth, platformHeight);


        //the note are point
    //1
    image(note, noteX, noteY, noteWidth, noteHeight);
    if(playerX >= noteX - noteWidth/2 &&
      playerX <= noteX + noteWidth/2  &&
      playerY >= noteY - noteHeight/2 &&
      playerY <= noteY + noteHeight/2){
      score = score + 1;
      noteX = - 10000;
      noteSound1.play();
    }
    //2
    image(note, note2X, note2Y, noteWidth, noteHeight);
    if(playerX >= note2X - noteWidth/2 &&
      playerX <= note2X + noteWidth/2  &&
      playerY >= note2Y - noteHeight/2 &&
      playerY <= note2Y + noteHeight/2){
      score = score + 1;
      note2X = - 10000;
      noteSound2.play();
    }
    //3
    image(note, note3X, note3Y, noteWidth, noteHeight);
    if(playerX >= note3X - noteWidth/2 &&
      playerX <= note3X + noteWidth/2  &&
      playerY >= note3Y - noteHeight/2 &&
      playerY <= note3Y + noteHeight/2){
      score = score + 1;
      note3X = - 10000;
      noteSound3.play();
    }
    //4
    image(note, note4X, note4Y, noteWidth, noteHeight);
    if(playerX >= note4X - noteWidth/2 &&
      playerX <= note4X + noteWidth/2  &&
      playerY >= note4Y - noteHeight/2 &&
      playerY <= note4Y + noteHeight/2){
      score = score + 1;
      note4X = - 10000;
      noteSound4.play();
    }
    //5
    image(note, note5X, note5Y, noteWidth, noteHeight);
    if(playerX >= note5X - noteWidth/2 &&
      playerX <= note5X + noteWidth/2  &&
      playerY >= note5Y - noteHeight/2 &&
      playerY <= note5Y + noteHeight/2){
      score = score + 1;
      note5X = - 10000;
      noteSound5.play();
    }
    //6
    image(note, note6X, note6Y, noteWidth, noteHeight);
    if(playerX >= note6X - noteWidth/2 &&
      playerX <= note6X + noteWidth/2  &&
      playerY >= note6Y - noteHeight/2 &&
      playerY <= note6Y + noteHeight/2){
      score = score + 1;
      note6X = - 10000;
      noteSound6.play();
    }
    //7
    image(note, note7X, note7Y, noteWidth, noteHeight);
    if(playerX >= note7X - noteWidth/2 &&
      playerX <= note7X + noteWidth/2  &&
      playerY >= note7Y - noteHeight/2 &&
      playerY <= note7Y + noteHeight/2){
      score = score + 1;
      note7X = - 10000;
      noteSound7.play();
    }




   //enemy
    //1
    image(enemy, enemy1X, enemy1Y, enemyWidth, enemyHeight);
    if(playerX >= enemy1X - enemyWidth/2 &&
      playerX <= enemy1X + enemyWidth/2 &&
      playerY >= enemy1Y  - enemyHeight/2 &&
      playerY <= enemy1Y  + enemyHeight/2){
      lives = lives-1;
      louseLifeSound.play();
      //active scary  mosaic
      showScaryMosaic = true;
      scaryMosaicTimer = SCARY_MOSAIC_DURATION; //set trigger
      playerX = initialPlayerX;
      playerY = initialPlayerY;
    }

    //2
    image(enemy, enemy2X, enemy2Y, enemyWidth, enemyHeight);
    if(playerX >= enemy2X - enemyWidth/2 &&
      playerX <= enemy2X + enemyWidth/2 &&
      playerY >= enemy2Y  - enemyHeight/2 &&
      playerY <= enemy2Y  + enemyHeight/2){
      lives = lives-1;
      louseLifeSound.play();
      showScaryMosaic = true;
      scaryMosaicTimer = SCARY_MOSAIC_DURATION;
      playerX = initialPlayerX;
      playerY = initialPlayerY;
        }
    //3
    image(enemy, enemy3X, enemy3Y, enemyWidth, enemyHeight);
    if(playerX >= enemy3X - enemyWidth/2 &&
      playerX <= enemy3X + enemyWidth/2 &&
      playerY >= enemy3Y  - enemyHeight/2 &&
      playerY <= enemy3Y  + enemyHeight/2){
      lives = lives-1;
      louseLifeSound.play();
      showScaryMosaic = true;
      scaryMosaicTimer = SCARY_MOSAIC_DURATION;
      playerX = initialPlayerX;
      playerY = initialPlayerY;
    }

    //moving
    //1
    enemy1X = enemy1X + (enemySpeed * enemy1Direction); 
    if(enemy1X >= enemy1Position + enemy1Distance || enemy1X <= enemy1Position - enemy1Distance){
      enemy1Direction = enemy1Direction * -1; 
    }

    // Enemy 2 Movement
    enemy2X = enemy2X + (enemySpeed * enemy2Direction);
    if(enemy2X >= enemy2Position + enemyDistance || enemy2X <= enemy2Position - enemyDistance){
      enemy2Direction = enemy2Direction * -1;
    }

    // Enemy 3 Movement
    enemy3X = enemy3X + (enemySpeed * enemy3Direction);
    if(enemy3X >= enemy3Position + enemyDistance || enemy3X <= enemy3Position - enemyDistance){
      enemy3Direction = enemy3Direction * -1;
    }


    //font details
    textSize(15);
    fill(255);
    stroke(0);
    strokeWeight(2);
    textFont (pressStart);
    //score board
    text("Piont:", 50, 50);
    text(score, 110, 50);
    //lives
    text("Lives:", 50, 80);
    text(lives, 110, 80);
    //timer
    text("Time remaining:", 1500, 50);
    text(timeLimit - gameTime, 1640, 50);
  } else if (stage == 2) {
    winScreen(); 
  } else if (stage == 3) {
    loseScreen(); 
  }
}


function splash(){
  image(nyc, windowWidth/2, windowHeight/2,windowWidth, windowHeight);

  textSize(100);
  fill(255);
  stroke(0);
  strokeWeight(5);
  textFont (pressStart);
  textAlign(CENTER); 
  text("jhonnyyyyyy", width/2, height/2); 
}


function winScreen(){
  image(nyc, windowWidth/2, windowHeight/2,windowWidth, windowHeight);
  textSize(100);
  fill(255);
  stroke(0);
  strokeWeight(5);
  textFont (pressStart);
  textAlign(CENTER);
  text("YOU WIN!!!", width/2, height/2);
}


function loseScreen(){
  image(nyc, windowWidth/2, windowHeight/2,windowWidth, windowHeight);
  image(nyc, windowWidth/2, windowHeight/2,windowWidth, windowHeight);
  textSize(100);
  fill(255);
  stroke(0);
  strokeWeight(5);
  textFont (pressStart);
  textAlign(CENTER);
  text("YOU LOUSE", width/2, height/2);
}



function mousePressed() {
  if (stage == 0) {
    stage = 1;
    splashTime = millis();
  }
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
    this.srcImgSegColour = srcImgSegColourInPrm; // This color will be updated in draw()
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
  drawMosaicSegment() {
    noStroke();
    fill(this.srcImgSegColour);
    rect(this.drawXPos, this.drawYPos, this.drawWidth, this.drawHeight);
  }
}



//////game
  function game (){

  /**
 * The following lines were taken from Gemini. I require to solve the 
 * "magnet" problem. because the player couldnt left the platform, he was 
 * magnet stuck on them..
 */
  const platformsArray = [
    {x: platform1X, y: platform1Y},
    {x: platform2X, y: platform2Y},
    {x: platform3X, y: platform3Y},
    {x: platform4X, y: platform4Y},
    {x: platform5X, y: platform5Y},
    {x: platform6X, y: platform6Y}
  ];

  let onPlatform = false; // Flag to check if player is currently on any platform

  for (let i = 0; i < platformsArray.length; i++) {
    let currentPlatformX = platformsArray[i].x;
    let currentPlatformY = platformsArray[i].y;

    // MAIN CHANGE: Refined platform collision logic
    // Check if player is horizontally aligned with the platform
    if (playerX + playerWidth / 2 > currentPlatformX - platformWidth / 2 &&
        playerX - playerWidth / 2 < currentPlatformX + platformWidth / 2) {

      // Check if player is falling AND their bottom is passing the platform's top
      if (playerY + playerHeight / 2 >= currentPlatformY - platformHeight / 2 &&
          playerY + playerHeight / 2 <= currentPlatformY - platformHeight / 2 + fallingSpeed) { // Check slightly below platform top
        // Player has landed on the platform
        playerY = currentPlatformY - platformHeight / 2 - playerHeight / 2; // Snap to top of platform
        velocity = 0; // Stop vertical movement
        jumpCunter = 0; // Reset jump counter
        jump = false; // Ensure jump state is off
        onPlatform = true; // Mark that player is on a platform
        break; // Exit loop, player is on this platform

  // Ensure gravity continues if not on any platform
  // This part is handled by the gravity function, but it's good to note that
  // if onPlatform is false, then gravity should apply.
      }
    }


        //platform 1
        if (playerX >= platform1X - platformWidth/2 &&
          playerX <= platform1X + platformWidth/2 &&
          playerY + playerHeight/2 >= barrier1Y - barrierHeight/2 &&
          playerY - playerHeight/2 <= barrier1Y + barrierHeight/2){
        jumpCunter = jumpPower;
        velocity = fallingSpeed;
      }
  
      //platform 2
      if (playerX >= platform2X - platformWidth/2 &&
        playerX <= platform2X + platformWidth/2 &&
        playerY + playerHeight/2 >= barrier2Y - barrierHeight/2 &&
        playerY - playerHeight/2 <= barrier2Y + barrierHeight/2){
      jumpCunter = jumpPower;
      velocity = fallingSpeed;
    }
  
      //platform 3
      if (playerX >= platform3X - platformWidth/2 &&
        playerX <= platform3X + platformWidth/2 &&
        playerY + playerHeight/2 >= barrier3Y - barrierHeight/2 &&
        playerY - playerHeight/2 <= barrier3Y + barrierHeight/2){
      jumpCunter = jumpPower;
      velocity = fallingSpeed;
    }
  
      //platform 4
      if (playerX >= platform4X - platformWidth/2 &&
        playerX <= platform4X + platformWidth/2 &&
        playerY + playerHeight/2 >= barrier4Y - barrierHeight/2 &&
        playerY - playerHeight/2 <= barrier4Y + barrierHeight/2){
      jumpCunter = jumpPower;
      velocity = fallingSpeed;
    }
  
    //platform 5
    if (playerX >= platform5X - platformWidth/2 &&
      playerX <= platform5X + platformWidth/2 &&
      playerY + playerHeight/2 >= barrier5Y - barrierHeight/2 &&
      playerY - playerHeight/2 <= barrier5Y + barrierHeight/2){
    jumpCunter = jumpPower;
    velocity = fallingSpeed;
  }
  
    //platform 6
    if (playerX >= platform6X - platformWidth/2 &&
      playerX <= platform6X + platformWidth/2 &&
      playerY + playerHeight/2 >= barrier6Y - barrierHeight/2 &&
      playerY - playerHeight/2 <= barrier6Y + barrierHeight/2){
    jumpCunter = jumpPower;
    velocity = fallingSpeed;
  }
  
    }
    if (score >= 7){
      winGameSound.play();
      stage = 2; 
    } else if (lives <= 0){
      louseGameSound.play();
      stage = 3; 
    } else if (gameTime >= timeLimit){ 
      louseGameSound.play();
      stage = 3; 
  }

}





//////gravity
function gravity(){
  if (jump == true){
    if (jumpCunter < jumpPower){ 
      playerY -= jumpPower;
      jumpCunter++; 
    } else {
      jump = false; 
      velocity = fallingSpeed; 
    }
  } else {
    // Apply falling if not jumping
    if (playerY + playerHeight / 2 < minHeight) { 
      playerY += fallingSpeed; 
      velocity = fallingSpeed; 
    } else {
      // On the ground
      playerY = minHeight - playerHeight / 2; 
      velocity = 0; 
      jumpCunter = 0; 
    }
  }

  if (playerY < maxHeight) {
    playerY = maxHeight;
    if (jump) {
      jump = false;
      velocity = fallingSpeed;
    }
  }
   //do not pass the window wall
    if (playerX + playerWidth/2 >= windowWidth){
        playerX = playerX - 2;
  }
    if (playerX - playerWidth/2 <= 0){
        playerX = playerX + 2;
  }
}
