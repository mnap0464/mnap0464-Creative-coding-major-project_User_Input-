//backgroung image variable
let img;  // Original background mosaic image
let sacry;  // Declare the scary image
let numSegments = 200;  // How many pieces the image is divided into.
let segments = [];
let drawSegments = true;
let imgDrwPrps = {aspect: 0, width: 0, height: 0, xOffset: 0, yOffset: 0}; // These properties help 
//make sure your background image always looks good, no matter the screen size.
let canvasAspectRatio = 0;

// CHANGE: Added reference dimensions and scaling factors
let referenceWidth = 1800; // Original width the game was designed for
let referenceHeight = 900; // Original height the game was designed for
let scaleX; // Scaling factor for horizontal elements
let scaleY; // Scaling factor for vertical elements

//variables for "scary" mosaic effect
  /**
 * The following lines were taken from Gemini. I require to solve the 
 * problem of the changing background when the enemy hit the player.
 */
let showScaryMosaic = false;
let scaryMosaicTimer = 0;
const SCARY_MOSAIC_DURATION = 30; // those are the frames.


//Game
var stage = 0;
var pressStart; // Font variable

//player
var Jhonny;
var playerX = 400; // Player's X position in unscaled game units
var playerY = 700; // Player's Y position in unscaled game units
var playerWidth = 187; // Player's width in unscaled game units
var playerHeight = 187; // Player's height in unscaled game units

// CHANGE: Variable to store player's Y position from the previous frame for collision detection
let oldPlayerY;

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
var enemySpeed = 2; // Enemy speed in unscaled game units
var enemyDirection = 1; // Unused, keeping for consistency
var enemyDistance= 130; // Enemy patrol distance in unscaled game units
var enemy1Distance= 300; // Enemy patrol distance in unscaled game units
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

//platforms horizontal barrier (hitting underside of platform)
var barrier1Y = platform1Y + 20;
var barrier2Y = platform2Y + 20;
var barrier3Y = platform3Y + 20;
var barrier4Y = platform4Y + 20;
var barrier5Y = platform5Y + 20;
var barrier6Y = platform6Y + 20;
var barrierHeight = 20;


// music note
var note
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


// gravity
var jump = false;
var direction = 1; // Unused, keeping for consistency
var velocity = 2; // Unused, player movement is directly via jumpPower/fallingSpeed
var jumpPower = 20; // Jump strength in unscaled game units
var fallingSpeed = 5; // Fall speed in unscaled game units
var minHeight = 760; // Ground level (player bottom) in unscaled game units
var maxHeight = 10; // Top screen boundary (player top) in unscaled game units
var jumpCunter = 0;


//ground
var ground
// CHANGE: Ground image now spans the full reference width for better scaling
var groundX = referenceWidth / 2; // Centered on the reference width
var groundY = 1000; // Position still below the screen
var groundWidth = referenceWidth; // Spans full reference width
var groundHeight = 502; // Original height, will scale proportionally


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


// Preload all assets
function preload() {
  img = loadImage("assets/nyc_opacity.jpg");
  Jhonny = loadImage ("assets/Jhonny.png");
  platforms = loadImage ("assets/oW.png");
  ground = loadImage ("assets/ground.png");
  nyc = loadImage ("assets/nyc .jpg");
  note = loadImage ("assets/music-note_11336134.png");
  enemy = loadImage ("assets/enemy.png");
  sacry = loadImage ("assets/scary.png");
  pressStart = loadFont ("assets/PressStart2P-Regular.ttf");
  jumpSound = loadSound ("assets/cartoon-jump-6462.mp3");
  noteSound1 = loadSound ("assets/do-80236.mp3");
  noteSound2 = loadSound ("assets/re-78500.mp3");
  noteSound3 = loadSound ("assets/mi-80239.mp3");
  noteSound4 = loadSound ("assets/fa-78409.mp3");
  noteSound5 = loadSound ("assets/sol-101774.mp3");
  noteSound6 = loadSound ("assets/la-80237.mp3");
  noteSound7 = loadSound ("assets/si-80238.mp3");
  louseLifeSound = loadSound ("assets/slap-hurt-pain-sound-effect-262618.mp3");
  louseGameSound = loadSound ("assets/cartoon-trombone-sound-effect-241387.mp3");
  winGameSound = loadSound ("assets/winning-218995.mp3");
}


// Setup function: runs once at the beginning
function setup() {
  imageMode (CENTER);
  createCanvas(windowWidth, windowHeight);
  // Calculate initial scaling factors based on current window size
  scaleX = windowWidth / referenceWidth;
  scaleY = windowHeight / referenceHeight;

  imgDrwPrps.aspect = img.width / img.height;
  calculateImageDrawProps(); // Calculates properties for background image based on current window size
  // The segment creation loop should use the *original* 'img' for initial setup.
  // The dynamically change which image is used later.
  // Initialize mosaic segments
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
  // Calculate draw properties for each segment after initial setup
  for (const segment of segments) {
    segment.calculateSegDrawProps();
  }

  // CHANGE: Initialize oldPlayerY with current playerY
  oldPlayerY = playerY;
}


// Draw function: runs continuously
function draw() {
  // CHANGE: Store player's Y position BEFORE gravity and game logic for collision prediction
  oldPlayerY = playerY;

  background(0);
  totalTime = millis();

  // Background mosaic drawing logic
  if (drawSegments) {
    if (showScaryMosaic) {
      let currentMosaicImage = sacry; // Use scary image when active
      for (const segment of segments) {
        // Update segment color based on the current mosaic image
        let segX = segment.rowPostion * (currentMosaicImage.width / numSegments);
        let segY = segment.columnPosition * (currentMosaicImage.height / numSegments);
        segment.srcImgSegColour = currentMosaicImage.get(segX + (currentMosaicImage.width / numSegments) / 2,
        segY + (currentMosaicImage.height / numSegments) / 2);
        segment.drawMosaicSegment();
      }
      scaryMosaicTimer--;
      if (scaryMosaicTimer <= 0) {
        showScaryMosaic = false;
        // Reset segment colors to original image after scary mosaic is done
        let originalImage = img;
        for (const segment of segments) {
          let segX = segment.rowPostion * (originalImage.width / numSegments);
          let segY = segment.columnPosition * (originalImage.height / numSegments);
          segment.srcImgSegColour = originalImage.get(segX + (originalImage.width / numSegments) / 2,
          segY + (originalImage.height / numSegments) / 2);
        }
      }
    } else {
      for (const segment of segments) {
        segment.drawMosaicSegment();
      }
    }
  } else {
    // Draw the full background image (scaled)
    image(img, imgDrwPrps.xOffset, imgDrwPrps.yOffset, imgDrwPrps.width, imgDrwPrps.height);
  }


  // Game state management
  if (stage == 0) {
    splash();
  } else if (stage == 1) {
    // Input handling
    // Player movement speed is unscaled. The visual effect will be scaled.
    if (keyIsDown(RIGHT_ARROW)){
      playerX = playerX + 5;
    }
    if (keyIsDown(LEFT_ARROW)){
      playerX = playerX - 5;
    }

    if (keyIsDown(32)){
      jump = true;
      // Prevent jump sound from re-playing too fast if key is held
      if (!jumpSound.isPlaying()) {
        jumpSound.play();
      }
    } else {
      jump = false;
    }


    // Game physics and logic
    gravity(); // Gravity updates playerY
    game();    // Game handles collisions based on potentially new playerY

    gameTime = int((totalTime - splashTime)/1000)

    let displayTimeRemaining = timeLimit - gameTime;
    if (displayTimeRemaining <= 0) {
      displayTimeRemaining = 0;
    }

    // Ground drawing (scaled)
    image(ground, groundX * scaleX, groundY * scaleY, groundWidth * scaleX, groundHeight * scaleY);

    // Player drawing (scaled)
    image(Jhonny, playerX * scaleX, playerY * scaleY, playerWidth * scaleX, playerHeight * scaleY);

    // Platforms drawing (scaled)
    image(platforms, platform1X * scaleX, platform1Y * scaleY, platformWidth * scaleX, platformHeight * scaleY);
    image(platforms, platform2X * scaleX, platform2Y * scaleY, platformWidth * scaleX, platformHeight * scaleY);
    image(platforms, platform3X * scaleX, platform3Y * scaleY, platformWidth * scaleX, platformHeight * scaleY);
    image(platforms, platform4X * scaleX, platform4Y * scaleY, platformWidth * scaleX, platformHeight * scaleY);
    image(platforms, platform5X * scaleX, platform5Y * scaleY, platformWidth * scaleX, platformHeight * scaleY);
    image(platforms, platform6X * scaleX, platform6Y * scaleY, platformWidth * scaleX, platformHeight * scaleY);


    // Music notes (points) drawing and collision
    // Scale note position and dimensions for drawing, and for collision detection
    // Using p5.js dist() function for more robust circular collision.
    image(note, noteX * scaleX, noteY * scaleY, noteWidth * scaleX, noteHeight * scaleY);
    if(dist(playerX * scaleX, playerY * scaleY, noteX * scaleX, noteY * scaleY) < ((playerWidth * scaleX)/2 + (noteWidth * scaleX)/2)){
      score = score + 1;
      noteX = -10000; // Move off-screen (stored as unscaled, but will be drawn off-screen)
      noteSound1.play();
    }
    // Repeat for all other notes
    image(note, note2X * scaleX, note2Y * scaleY, noteWidth * scaleX, noteHeight * scaleY);
    if(dist(playerX * scaleX, playerY * scaleY, note2X * scaleX, note2Y * scaleY) < ((playerWidth * scaleX)/2 + (noteWidth * scaleX)/2)){
      score = score + 1;
      note2X = -10000;
      noteSound2.play();
    }
    image(note, note3X * scaleX, note3Y * scaleY, noteWidth * scaleX, noteHeight * scaleY);
    if(dist(playerX * scaleX, playerY * scaleY, note3X * scaleX, note3Y * scaleY) < ((playerWidth * scaleX)/2 + (noteWidth * scaleX)/2)){
      score = score + 1;
      note3X = -10000;
      noteSound3.play();
    }
    image(note, note4X * scaleX, note4Y * scaleY, noteWidth * scaleX, noteHeight * scaleY);
    if(dist(playerX * scaleX, playerY * scaleY, note4X * scaleX, note4Y * scaleY) < ((playerWidth * scaleX)/2 + (noteWidth * scaleX)/2)){
      score = score + 1;
      note4X = -10000;
      noteSound4.play();
    }
    image(note, note5X * scaleX, note5Y * scaleY, noteWidth * scaleX, noteHeight * scaleY);
    if(dist(playerX * scaleX, playerY * scaleY, note5X * scaleX, note5Y * scaleY) < ((playerWidth * scaleX)/2 + (noteWidth * scaleX)/2)){
      score = score + 1;
      note5X = -10000;
      noteSound5.play();
    }
    image(note, note6X * scaleX, note6Y * scaleY, noteWidth * scaleX, noteHeight * scaleY);
    if(dist(playerX * scaleX, playerY * scaleY, note6X * scaleX, note6Y * scaleY) < ((playerWidth * scaleX)/2 + (noteWidth * scaleX)/2)){
      score = score + 1;
      note6X = -10000;
      noteSound6.play();
    }
    image(note, note7X * scaleX, note7Y * scaleY, noteWidth * scaleX, noteHeight * scaleY);
    if(dist(playerX * scaleX, playerY * scaleY, note7X * scaleX, note7Y * scaleY) < ((playerWidth * scaleX)/2 + (noteWidth * scaleX)/2)){
      score = score + 1;
      note7X = -10000;
      noteSound7.play();
    }


    // Enemies drawing and collision
    // Scale enemy position and dimensions for drawing, and for collision detection
    image(enemy, enemy1X * scaleX, enemy1Y * scaleY, enemyWidth * scaleX, enemyHeight * scaleY);
    if(dist(playerX * scaleX, playerY * scaleY, enemy1X * scaleX, enemy1Y * scaleY) < ((playerWidth * scaleX)/2 + (enemyWidth * scaleX)/2)){
      lives = lives-1;
      louseLifeSound.play();
      showScaryMosaic = true;
      scaryMosaicTimer = SCARY_MOSAIC_DURATION;
      // Reset player to initial position (initial values are unscaled)
      playerX = initialPlayerX;
      playerY = initialPlayerY;
    }
    // Repeat for other enemies
    image(enemy, enemy2X * scaleX, enemy2Y * scaleY, enemyWidth * scaleX, enemyHeight * scaleY);
    if(dist(playerX * scaleX, playerY * scaleY, enemy2X * scaleX, enemy2Y * scaleY) < ((playerWidth * scaleX)/2 + (enemyWidth * scaleX)/2)){
      lives = lives-1;
      louseLifeSound.play();
      showScaryMosaic = true;
      scaryMosaicTimer = SCARY_MOSAIC_DURATION;
      playerX = initialPlayerX;
      playerY = initialPlayerY;
        }
    image(enemy, enemy3X * scaleX, enemy3Y * scaleY, enemyWidth * scaleX, enemyHeight * scaleY);
    if(dist(playerX * scaleX, playerY * scaleY, enemy3X * scaleX, enemy3Y * scaleY) < ((playerWidth * scaleX)/2 + (enemyWidth * scaleX)/2)){
      lives = lives-1;
      louseLifeSound.play();
      showScaryMosaic = true;
      scaryMosaicTimer = SCARY_MOSAIC_DURATION;
      playerX = initialPlayerX;
      playerY = initialPlayerY;
    }

    // Enemy movement
    // Enemy movement speed and patrol distances are unscaled.
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

    // Font details and scoreboard
    // Scale text size, stroke, and positions for drawing
    textSize(15 * scaleX);
    fill(255);
    stroke(0);
    strokeWeight(2 * scaleX);
    textFont (pressStart);
    //score board
    text("Points:", 50 * scaleX, 50 * scaleY);
    text(score, 110 * scaleX, 50 * scaleY);
    //lives
    text("Lives:", 50 * scaleX, 80 * scaleY);
    text(lives, 110 * scaleX, 80 * scaleY);
    //timer
    text("Time remaining:", 1500 * scaleX, 50 * scaleY);
    text(displayTimeRemaining, 1640 * scaleX, 50 * scaleY);
  } else if (stage == 2) {
    winScreen();
  } else if (stage == 3) {
    loseScreen();
  }
}


// Splash screen logic
function splash(){
  // Draw background image using windowWidth and windowHeight directly
  image(nyc, windowWidth/2, windowHeight/2, windowWidth, windowHeight);

  // Scale text size, stroke, and position for drawing
  textSize(100 * scaleX);
  fill(255);
  stroke(0);
  strokeWeight(5 * scaleX);
  textFont (pressStart);
  textAlign(CENTER);
  text("Jazz dream", width/2, height/2);
}


// Win screen logic
function winScreen(){
  // Draw background image using windowWidth and windowHeight directly
  image(nyc, windowWidth/2, windowHeight/2, windowWidth, windowHeight);
  // Original code had a duplicate image call here, keeping it as-is.
  image(nyc, windowWidth/2, windowHeight/2, windowWidth, windowHeight);
  // Scale text size, stroke, and position for drawing
  textSize(100 * scaleX);
  fill(255);
  stroke(0);
  strokeWeight(5 * scaleX);
  textFont (pressStart);
  textAlign(CENTER);
  text("YOU WIN!!!", width/2, height/2);
}


// Lose screen logic
function loseScreen(){
  // Draw background image using windowWidth and windowHeight directly
  image(nyc, windowWidth/2, windowHeight/2, windowWidth, windowHeight);
  // Original code had a duplicate image call here, keeping it as-is.
  image(nyc, windowWidth/2, windowHeight/2, windowWidth, windowHeight);
  // Scale text size, stroke, and position for drawing
  textSize(100 * scaleX);
  fill(255);
  stroke(0);
  strokeWeight(5 * scaleX);
  textFont (pressStart);
  textAlign(CENTER);
  text("YOU LOSE", width/2, height/2);
}


// Mouse pressed event handler
function mousePressed() {
  if (stage == 0) {
    stage = 1;
    splashTime = millis();
  }
}



/**
 * The following lines were taken from Gemini. I require to help me whit the 
 * windowReaized, not just of the window but of the general game. 
 */

// Window resized event handler
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Recalculate scaling factors when window is resized
  scaleX = windowWidth / referenceWidth;
  scaleY = windowHeight / referenceHeight;
  calculateImageDrawProps(); // Update background image properties
  // Update segment drawing properties to match new canvas size
  for (const segment of segments) {
    segment.calculateSegDrawProps();
  }
}


// Function to calculate background image drawing properties
function calculateImageDrawProps() {
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


// Class for image segments used in the mosaic background
class ImageSegment {
  constructor(columnPositionInPrm, rowPostionInPrm  ,srcImgSegColourInPrm) {
    this.columnPosition = columnPositionInPrm;
    this.rowPostion = rowPostionInPrm;
    this.srcImgSegColour = srcImgSegColourInPrm;
    this.drawXPos = 0;
    this.drawYPos = 0;
    this.drawWidth = 0;
    this.drawHeight = 0;
  }

  // Calculates drawing properties for each segment based on the scaled background properties
  calculateSegDrawProps() {
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


// Main game logic function
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

  for (let i = 0; i < platformsArray.length; i++) {
    let currentPlatformX = platformsArray[i].x;
    let currentPlatformY = platformsArray[i].y;

    // Horizontal overlap check (using scaled coordinates for screen accuracy)
    if (((playerX * scaleX) + (playerWidth * scaleX) / 2 > (currentPlatformX * scaleX) - (platformWidth * scaleX) / 2) &&
        ((playerX * scaleX) - (playerWidth * scaleX) / 2 < (currentPlatformX * scaleX) + (platformWidth * scaleX) / 2)) {

        // CHANGE: Revised Platform landing logic using oldPlayerY for robust detection
        let oldPlayerBottom = oldPlayerY + playerHeight / 2; // Player's bottom before gravity
        let playerBottomCurrentFrame = playerY + playerHeight / 2; // Player's bottom after gravity
        let platformTop = currentPlatformY - platformHeight / 2; // Platform's top in unscaled units

        // Check if player was above the platform last frame AND is now below/at platform top
        // (meaning they just landed) AND they are not actively trying to jump upwards
        if (oldPlayerBottom <= platformTop &&
            playerBottomCurrentFrame >= platformTop &&
            !jump) { // This condition implies falling onto the platform

            playerY = platformTop - playerHeight / 2; // Snap player to the platform's top (unscaled Y)
            jumpCunter = 0; // Reset jump counter
            jump = false; // Player is no longer jumping
            velocity = 0; // Stop vertical movement
            break; // Player has landed, no need to check other platforms
        }
    }
    // Platform horizontal barrier collisions (hitting head on platform bottom)
    // Scale all values for collision detection. This logic remains the same.
    // It correctly forces a fall if hitting the underside of a platform.
    if ((playerX * scaleX) >= (platform1X * scaleX) - (platformWidth * scaleX)/2 &&
        (playerX * scaleX) <= (platform1X * scaleX) + (platformWidth * scaleX)/2 &&
        (playerY * scaleY) + (playerHeight * scaleY)/2 >= (barrier1Y * scaleY) - (barrierHeight * scaleY)/2 &&
        (playerY * scaleY) - (playerHeight * scaleY)/2 <= (barrier1Y * scaleY) + (barrierHeight * scaleY)/2){
      jumpCunter = jumpPower; // jumpPower is an absolute value used in gravity
      velocity = fallingSpeed; // This causes the player to fall if they hit the underside
    }

    // platform 2 barrier
    if ((playerX * scaleX) >= (platform2X * scaleX) - (platformWidth * scaleX)/2 &&
      (playerX * scaleX) <= (platform2X * scaleX) + (platformWidth * scaleX)/2 &&
      (playerY * scaleY) + (playerHeight * scaleY)/2 >= (barrier2Y * scaleY) - (barrierHeight * scaleY)/2 &&
      (playerY * scaleY) - (playerHeight * scaleY)/2 <= (barrier2Y * scaleY) + (barrierHeight * scaleY)/2){
    jumpCunter = jumpPower;
    velocity = fallingSpeed;
  }

    // platform 3 barrier
    if ((playerX * scaleX) >= (platform3X * scaleX) - (platformWidth * scaleX)/2 &&
      (playerX * scaleX) <= (platform3X * scaleX) + (platformWidth * scaleX)/2 &&
      (playerY * scaleY) + (playerHeight * scaleY)/2 >= (barrier3Y * scaleY) - (barrierHeight * scaleY)/2 &&
      (playerY * scaleY) - (playerHeight * scaleY)/2 <= (barrier3Y * scaleY) + (barrierHeight * scaleY)/2){
    jumpCunter = jumpPower;
    velocity = fallingSpeed;
  }

    // platform 4 barrier
    if ((playerX * scaleX) >= (platform4X * scaleX) - (platformWidth * scaleX)/2 &&
      (playerX * scaleX) <= (platform4X * scaleX) + (platformWidth * scaleX)/2 &&
      (playerY * scaleY) + (playerHeight * scaleY)/2 >= (barrier4Y * scaleY) - (barrierHeight * scaleY)/2 &&
      (playerY * scaleY) - (playerHeight * scaleY)/2 <= (barrier4Y * scaleY) + (barrierHeight * scaleY)/2){
    jumpCunter = jumpPower;
    velocity = fallingSpeed;
  }

  // platform 5 barrier
  if ((playerX * scaleX) >= (platform5X * scaleX) - (platformWidth * scaleX)/2 &&
    (playerX * scaleX) <= (platform5X * scaleX) + (platformWidth * scaleX)/2 &&
    (playerY * scaleY) + (playerHeight * scaleY)/2 >= (barrier5Y * scaleY) - (barrierHeight * scaleY)/2 &&
    (playerY * scaleY) - (playerHeight * scaleY)/2 <= (barrier5Y * scaleY) + (barrierHeight * scaleY)/2){
  jumpCunter = jumpPower;
  velocity = fallingSpeed;
}

  // platform 6 barrier
  if ((playerX * scaleX) >= (platform6X * scaleX) - (platformWidth * scaleX)/2 &&
    (playerX * scaleX) <= (platform6X * scaleX) + (platformWidth * scaleX)/2 &&
    (playerY * scaleY) + (playerHeight * scaleY)/2 >= (barrier6Y * scaleY) - (barrierHeight * scaleY)/2 &&
    (playerY * scaleY) - (playerHeight * scaleY)/2 <= (barrier6Y * scaleY) + (barrierHeight * scaleY)/2){
  jumpCunter = jumpPower;
  velocity = fallingSpeed;
}

  } // End of platformsArray loop

  // Win/Lose conditions
  if (score >= 7){
    // Only play sound and change stage once
    if (stage != 2) {
      winGameSound.play();
      stage = 2;
    }
  } else if (lives <= 0){
    // Only play sound and change stage once
    if (stage != 3) {
      louseGameSound.play();
      stage = 3;
    }
  } else if (gameTime >= timeLimit){
    // Only play sound and change stage once
    if (stage != 3) {
      louseGameSound.play();
      stage = 3;
    }
  }
}


// Gravity logic
function gravity(){
  // jumpPower and fallingSpeed are applied directly to playerY (unscaled)
  if (jump == true){
    if (jumpCunter < jumpPower){
      playerY -= jumpPower;
      jumpCunter++;
    } else {
      jump = false; // Player reaches max jump height, starts falling
      velocity = fallingSpeed; // Set velocity to falling speed after jump peak
    }
  } else { // Player is not jumping (i.e., falling)
    // Check if player is above ground, apply fallingSpeed, or snap to ground
    if (playerY + playerHeight / 2 < minHeight) {
      playerY += fallingSpeed;
      velocity = fallingSpeed; // Set velocity to falling speed when falling
    } else { // Player is on the ground
      playerY = minHeight - playerHeight / 2; // Snap to unscaled ground position
      // Ensure all relevant states are reset when on ground
      velocity = 0; // Set velocity to 0 when on ground
      jumpCunter = 0;
      jump = false;
    }
  }

  // maxHeight and player position check are based on unscaled values
  if (playerY < maxHeight) { // If player is above max top height
    playerY = maxHeight; // Snap player to unscaled maxHeight
    if (jump) { // If still trying to jump, stop it
      jump = false;
      velocity = fallingSpeed; // Start falling if hit max height while jumping
    }
  }

  // Do not pass the window wall (Horizontal boundaries)
  // PlayerX bounds checked against unscaled referenceWidth
  if (playerX + playerWidth/2 >= referenceWidth){
      playerX = referenceWidth - playerWidth/2; // Snap player to the right edge (unscaled)
  }
  if (playerX - playerWidth/2 <= 0){
    playerX = playerWidth/2; // Snap player to the left edge (unscaled)
}
}




//Reference
//To create this code several video tutorials were watched 
//most of them are in series of more that 2 part.

// first 5 video made by: Tech Head Online
// 1 https://www.youtube.com/watch?v=enLvg0VTsAo
// 2 https://www.youtube.com/watch?v=waF0_y7XheQ&list=PLoHS9P-kC-252Pd9MJD_ItfaVuYV2kTCE&index=23
// 3 https://www.youtube.com/watch?v=5aHBK7Yw8xs&list=PLoHS9P-kC-252Pd9MJD_ItfaVuYV2kTCE&index=24
// 4 https://www.youtube.com/watch?v=CuC4sZ5p3Hw&list=PLoHS9P-kC-252Pd9MJD_ItfaVuYV2kTCE&index=25
// 5 https://www.youtube.com/watch?v=IHBqtJGJDXU&list=PLoHS9P-kC-252Pd9MJD_ItfaVuYV2kTCE&index=26

// second serie of video by: Jason Erdreich
// 1 https://www.youtube.com/watch?v=FZlpuQeCvlk&list=PLBDInqUM5B26FjwMMZqGDxqQr1kX5V9Ul&index=1
// 2 https://www.youtube.com/watch?v=8Cqtoo2Fq-s&list=PLBDInqUM5B26FjwMMZqGDxqQr1kX5V9Ul&index=2
// 3 https://www.youtube.com/watch?v=StoBCNiQakM&list=PLBDInqUM5B26FjwMMZqGDxqQr1kX5V9Ul&index=3
// 4 https://www.youtube.com/watch?v=qprwX-FMdSY&list=PLBDInqUM5B26FjwMMZqGDxqQr1kX5V9Ul&index=4
// 5 https://www.youtube.com/watch?v=mPKSkbnQzjc&list=PLBDInqUM5B26FjwMMZqGDxqQr1kX5V9Ul&index=5
// 6 https://www.youtube.com/watch?v=VnRqA1v10w8&list=PLBDInqUM5B26FjwMMZqGDxqQr1kX5V9Ul&index=6
// 7 https://www.youtube.com/watch?v=3Gl6cvfEFyk&list=PLBDInqUM5B26FjwMMZqGDxqQr1kX5V9Ul&index=7
// 8 https://www.youtube.com/watch?v=L-aTxyWmaTU&list=PLBDInqUM5B26FjwMMZqGDxqQr1kX5V9Ul&index=8

//p5.js projects:
// https://editor.p5js.org/L0808866/sketches/lvURvk4QN
// https://editor.p5js.org/GWCEducation/sketches/Kfqp0lql9
