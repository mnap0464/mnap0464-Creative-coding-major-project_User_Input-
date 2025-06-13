

//Global settings
let numKeys = 7; // Number of piano keys
let s; // scale factor for responsiveness
let gap, cellSize1, cellSize2; //variables for figureing out the spacing and size of the grid elements.

let backgroundMusic; //store the main background tune.
let audioStarted = false; // with this the music starts when we decide.
let notes = [];  // variable of the floating notes of the instruments on the walls and of the piano.
const COLS1     = 25; //number of columns the background grid will have.



//Color palettes and Background dynamics
const bgPalette = ['#f2f2f2', '#ad011a', '#cccccc', '#F7DF4D']; //main colors for the changing background areas.
const colorWeights = [0.9, 0.05, 0.1, 0.05]; //how often each color from the palette shows up.
let regionQuarterColors = []; //hold the specific color choices for each little section of the background.
let colorZoneLastSwitch = 0;  //keeps track of when the background colors last changed.
const colorZoneInterval = 2500; //how long (in milliseconds) before the background colors shuffle again.

const yellowCols = [0, 3, 5, 10, 23, 33, 35, 45, 60, 78]; //yellow columns and where the lines are drawn.
const yellowRows = [2, 4, 12, 20, 33]; // yellow rows and where they are drawn.

//Sounds and Resources
function preload() {
  backgroundMusic = loadSound('assets/p.mp3'); //loads the main background jazz tune.

  //sets up  for all the individual instrument sounds.
  instrumentSounds = {
    A: loadSound('assets/Saxophone.mp3'), //sound for the 'A' key (trumpet).
    S: loadSound('assets/guitar.mp3'), //sound for the 'S' key (guitar).
    D: loadSound('assets/Flute.mp3'), //sound for the 'D' key (violin).
    F: loadSound('assets/drum.mp3') //sound for the 'F' key (drum).
  }
    const pianoKeys = ['Z','X','C','V','B','N','M']; //the piano keys on your keyboard.
     //this loop goes through each piano key letter and loads its specific piano sound file.
    for (let k of pianoKeys) {
      pianoSounds[k] = loadSound(`assets/piano_${k}.mp3`);
    }
  }

//canvas setup
  function setup() {
    canvas = createCanvas(windowWidth, windowHeight); //the canvas fill the entire browser window.
    canvas.elt.setAttribute("tabindex", "0"); //makes the canvas "focusable" so it can listen for the keyboard presses.
    canvas.elt.focus(); //puts the "focus" on the canvas so it's ready to hear the keys.
    s = windowWidth / 1920; //calculates the scale factor again, just in case, based on a reference width of 1920.
  
    trumpetPos = createVector(100 * s, 120 * s);  //position for the main trumpet visual.
    guitarPos = createVector(160 * s, 560 * s);   //position for the guitar visual. 
    violinPos = createVector(180 * s, 790 * s);   //position for the violin visual.
    drumPos    = createVector(1660 * s, 180 * s); //position for the drum visual.
  
    frameRate(60);   //sets how smoothly the animation runs.
    let m = min(windowWidth, windowHeight); //finds the smaller dimension of the window (width or height).
    gap = m * 0.02;  //calculates the spacing (gap) of the grid based on the smaller window dimension.
    cellSize1 = (m - (COLS1 + 1) * gap) / COLS1;  //calculates the size of each cell in the grid.
  }
  

let trumpetPos, guitarPos, violinPos, drumPos; //make sure they are accessible globally, though they are set in setup().




function windowResized() {
  resizeCanvas(windowWidth, windowHeight); //resizes the drawing area to fit the new window size.
  s = windowWidth / 1920; //recalculates the scale factor to keep everything properly proportioned.
}

//static background
function drawStaticBackground() {
  strokeCap(SQUARE);   //sets how lines will end (square, for sharp corners).
  


  //yellow Lines:
  stroke('#F7DF4D'); //sets the color for these lines to a bright yellow.
  strokeWeight(gap * 1.3); //makes the yellow lines a bit thicker than the general gap.

   // vertical yellow lines.
  yellowCols.forEach(i => {
    let x = gap + i * (cellSize1 + gap) + cellSize1 / 2; //x-position for each line.
    line(x, 0, x, height); //draws a vertical line from the top to the bottom of the canvas.
  });

  //horizontal yellow lines.
  yellowRows.forEach(j => { 
    let y = gap + j * (cellSize1 + gap) + cellSize1 / 2; //y-position for each line.
    line(0, y, width, y);  //draws a horizontal line from the left to the right of the canvas.
  });
  rectMode(CORNER); //makes sure rectangles are drawn from their top-left corner.
}



//it's runs the animation  over and over (60 times a second), redrawing everything.
function draw() {
  background(220);
  drawColorZones(); //calls the function that draws the dynamic, shifting background color zones.

  drawStaticBackground();  //calls the function that draws the fixed yellow lines.

  //this loop goes through all the little "notes" that appear when you play, moves them, and leave the screen.
  for (let i = notes.length - 1; i >= 0; i--) { //remove  the notes fron the screen.
    let n = notes[i];
    // Sets the note's color, including its transparency (alpha) so it fades out.
    fill(n.col.levels[0], n.col.levels[1], n.col.levels[2], n.alpha);
    noStroke();
    rect(n.x, n.y, n.w, n.h); // Draws the note as a rectangle.
  
     //floating notes (for Piano) 
    if (n.speed < 0) {
      n.y += n.speed;   //moves the note upward (because speed is negative).
      n.alpha -= 0.1;  //makes the note slowly disappear.
      if (n.y < 0 || n.alpha <= 0) {
        notes.splice(i, 1);   //if the note goes off-screen or totally fades, remove it from the list.
      }
      //moving notes (for side instruments)
    } else if (n.speed > 0) {
      n.x += n.speed; //moves the note to the right.
      n.alpha -= 0.1;  //makes the note slowly disappear.
      if (n.x > width || n.alpha <= 0) {
        notes.splice(i, 1);  //if the note goes off-screen or totally fades, remove it from the list.
      }
      //static notes (for Drum)
    } else {
      n.lifetime--;  //decreases the note's lifespan.
      if (n.lifetime <= 0) {
        notes.splice(i, 1);  //if the note's life runs out, remove it.
      }
    }
  }
  
  
  
//drawing the instruments
//these sections draw the various musical instruments on the canvas.
//'push()' and 'pop()' are like temporary sketchpads, allowing us to move and scale each instrument without affecting others.
//'translate()' moves the instrument, and 'scale(s)' makes sure it's the right size for the screen.

// trumpet 1
  push();
  translate(0, -30 * s);
  scale(s);
  drawTrumpet();
  pop();

  // trumpet 2
  push();
  translate(0, 150 * s);
  scale(s);
  drawTrumpet();
  pop();

  // guitar
  push();
  translate(0, -30 * s);
  scale(s);
  drawGuitar();
  pop();

  // violin
  push();
  translate(0, -30 * s);
  scale(s);
  drawViolin();
  pop();

  // drum
  push();
  translate(225 * s, -30 * s);
  scale(s);
  drawDrum();
  pop();

  // trumpet 3
  push();
  translate(225 * s, -30 * s);
  scale(s);
  drawTrumpet3();
  pop();

  // trumpet 4
  push();
  translate(225 * s, -30 * s);
  scale(s);
  drawTrumpet4();
  pop();

  // Piano keys
  let w = width / numKeys;  //calculates the width of each piano key.
  let pianoY = height * 0.9;  //determines how high up the piano keys are on the screen (90% from the top).
  for (let i = 0; i < numKeys; i++) { //loops through each piano key.
    let x = i * w;  //figures out the x-position for the current key.
     //checks if the mouse is hovering over a piano key.
    if (mouseX > x && mouseX < x + w && mouseY > pianoY && mouseY < height) {
      fill(355, 10, 90); //if hovering, makes the key a bright, reddish color.
    } else {
      fill(255); //otherwise, keeps the key white.
    }
    stroke(0);
    strokeWeight(1);
    rect(x, pianoY, w - 1, height - pianoY - 1); //draws the piano key rectangle.
  }

// Draw instructions text at the top
fill('#333'); 
textSize(18 * s); //sets the text size based on the scale factor.
textAlign(CENTER, TOP); 
text(
  "Press A: Trumpet  |  S: Guitar  |  D: Violin  |  F: Drum  |  Z–M: Piano Keys",
  width / 2,
  20);
  text(
  "Follow the music and improvise whith the instrument like a real jazz musician",
  width / 2,
  40);
}

//instrument drawing functions
// These functions are like blueprints for drawing each instrument.
// They use specific coordinates and shapes to create the visual representations.
// Each `beginShape()` and `endShape(CLOSE)` block defines a polygon (a multi-sided shape).
// `vertex()` defines a corner point, and `bezierVertex()` creates smooth curves between points.
function drawTrumpet() {
  stroke(0); 
  strokeWeight(1); 
  fill('#022d65');
  beginShape()
  vertex(0, 111);
  vertex(65,111);
  vertex(65, 105);
  vertex(69, 105);
  vertex(69, 88);
  vertex(74, 88);
  vertex(74, 105);
  vertex(78, 105);
  vertex(78, 110);
  vertex(84, 110);
  vertex(85, 106);
  vertex(88, 106);
  vertex(88, 93);
  vertex(92, 93);
  vertex(92, 106);
  vertex(96, 107);
  vertex(96, 110);
  vertex(104, 111);
  vertex(104, 107);
  vertex(108, 107);
  vertex(108, 88);
  vertex(113, 88);
  vertex(112, 107);
  vertex(115, 107);
  vertex(115,111);
  vertex(198, 111);
  bezierVertex(207,110, 218, 108, 229, 102);
  bezierVertex(238, 96, 243, 90, 249, 84);
  bezierVertex(255, 77, 259, 68, 259, 68);
  vertex(259, 68);
  vertex(254, 186);
  bezierVertex(254, 186, 253, 180, 251, 176);
  bezierVertex(250, 174,247, 166, 240, 157);
  bezierVertex(235, 150, 230, 144, 222, 139);
  bezierVertex(211, 132, 200, 131, 193, 131);
  vertex(193, 131);
  vertex(157, 130);
  
  bezierVertex(158, 132, 161, 135, 163, 140);
  bezierVertex(165, 146, 163, 152, 163, 155);
  bezierVertex(162, 156, 160, 163, 154, 168);
  bezierVertex(149, 172, 145, 173, 143, 173);
  vertex(136, 174);
  vertex(0, 170);
  vertex(0, 159);
  vertex(65, 160);
  vertex(65, 130);
  vertex(77, 130);
  vertex(77, 160);
  vertex(83, 160);
  vertex(83, 130);
  vertex(95, 130);
  vertex(95, 160);
  vertex(103, 160);
  vertex(104, 130);
  vertex(115, 130);
  vertex(114, 162);
  vertex(140, 162);
  bezierVertex(141, 162, 142, 162, 144, 161);
  bezierVertex(145, 160, 148, 159, 150, 156);
  bezierVertex(151, 155, 152, 154, 153, 152);
  bezierVertex(154, 148, 152, 143, 152, 143);
  bezierVertex(152, 143, 151, 137, 146, 135);
  bezierVertex(144, 133, 142, 133, 141, 133);
  vertex(141, 133);
  vertex(115, 132);
  vertex(0, 129);
  endShape(CLOSE);
}

function drawGuitar() {
  stroke(0); 
  strokeWeight(1); 
  fill('#ad011a');
  beginShape();
  vertex(0, 503);
  bezierVertex(1, 503, 3, 504, 5, 504);
  bezierVertex(7, 504, 11, 505, 15, 504);
  bezierVertex(18, 504, 20, 503, 25, 502);
  bezierVertex(29, 500, 30, 500, 36, 498);
  bezierVertex(39, 497, 42, 496, 45, 495);
  bezierVertex(48, 494, 52, 493, 56, 492);
  bezierVertex(61, 492, 66, 491, 73, 493);
  bezierVertex(78, 494, 81, 495, 82, 496);
  bezierVertex(83, 497, 86, 499, 87, 501);
  bezierVertex(89, 504, 89, 507, 89, 508);
  bezierVertex(89, 509, 90, 511, 88, 513);
  bezierVertex(87, 514, 86, 514, 85, 514);
  bezierVertex(82, 515, 81, 515, 79, 515);
  bezierVertex(75, 515, 71, 516, 70, 516);
  bezierVertex(68, 517, 66, 517, 64, 519);
  bezierVertex(61, 521, 60, 523, 59, 526);
  bezierVertex(58, 528, 56, 531, 56, 536);
  bezierVertex(56, 538, 56, 540, 58, 542);
  bezierVertex(59, 544, 61, 545, 62, 546);
  vertex(62, 546);
  vertex(231, 549);
  bezierVertex(232, 549, 233, 549, 234, 548);
  bezierVertex(234, 548, 236, 548, 236, 546);
  bezierVertex(239, 543, 240, 542, 251, 542);
  bezierVertex(243, 542, 243, 542, 246, 543);
  bezierVertex(246, 543, 247, 543, 248, 544);
  vertex(248, 544);
  vertex(302, 562);
  bezierVertex(302, 562, 307, 564, 309, 569);
  bezierVertex(311, 573, 310, 577, 310, 578);
  bezierVertex(309, 579, 307, 585, 301, 586);
  bezierVertex(295, 588, 290, 584, 289, 582);
  bezierVertex(286, 578, 286, 577, 285, 577);
  bezierVertex(285, 576, 284, 576, 282, 576);
  vertex(282, 576);
  vertex(251,582);
  bezierVertex(246, 576, 244, 573, 240, 572);
  vertex(232, 570);
  vertex(42, 573);
  bezierVertex(40, 575, 37, 579, 36, 586);
  bezierVertex(36, 592, 39, 600, 44, 603);
  bezierVertex(47, 604, 48, 604, 55, 606);
  bezierVertex(60, 608, 61, 610, 62, 610);
  bezierVertex(63, 614, 62, 619, 59, 622);
  bezierVertex(52, 630, 36, 626, 34, 626);
  bezierVertex(26, 624, 25, 621, 14, 618);
  bezierVertex(8, 616, 3, 615, 0, 615);
  endShape(CLOSE);
}

function drawViolin() {
  stroke(255);
  strokeWeight(1);
  fill(0);
  
  beginShape()
  vertex(0, 725);
  bezierVertex(12, 732, 22, 734, 28, 734);
  bezierVertex(33, 734, 39, 735, 42, 731);
  bezierVertex(45, 727, 43, 721, 46, 720);
  bezierVertex(48, 720, 50, 722, 53, 724);
  bezierVertex(59, 726, 64, 724, 67, 723);
  bezierVertex(75, 721, 87, 722, 97, 725);
  bezierVertex(112, 731, 119, 745, 119, 747);
  bezierVertex(122, 752, 123, 756, 123, 759);
  vertex(203, 773);
  vertex(204, 767);
  bezierVertex(201, 766, 199, 763, 200, 760);
  bezierVertex(201, 756, 204, 756, 206, 757);
  bezierVertex(209, 757, 211, 761, 209, 765);
  vertex(208, 767);
  vertex(208, 775);
  vertex(219, 778);
  vertex(218, 773);
  vertex(217, 773);
  bezierVertex(217, 773, 215, 770, 215, 768);
  bezierVertex(215, 766, 217, 765, 218, 765);
  bezierVertex(219, 764, 221, 764, 221, 765);
  bezierVertex(223, 765, 225, 767, 225, 769);
  bezierVertex(225, 771, 224, 774, 223, 773);
  vertex(222, 779);
  vertex(223, 781);
  vertex(227, 784);
  vertex(234, 790);
  bezierVertex(234, 790, 233, 787, 234, 785);
  bezierVertex(235, 780, 242, 778, 245, 780);
  bezierVertex(246, 781, 246, 782, 247, 783);
  bezierVertex(249, 784, 249, 784, 251, 784);
  bezierVertex(254, 785, 255, 787, 255, 788);
  bezierVertex(257, 790, 257, 794, 255, 797);
  bezierVertex(252, 800, 248, 800, 248, 800);
  vertex(247, 802);
  vertex(243, 803);
  vertex(240, 802);
  vertex(230, 803);
  vertex(229, 808);
  bezierVertex(229, 808, 230, 809, 230, 810 );
  bezierVertex(232, 811, 233, 812, 233, 813);
  bezierVertex(234, 815, 233, 819, 230, 820);
  bezierVertex(228, 821, 226, 821, 225, 820);
  bezierVertex(224, 818, 225, 815, 224, 814);
  bezierVertex(223, 814, 223, 815, 221, 816);
  bezierVertex(220, 816, 217, 818, 214, 816);
  bezierVertex(213, 815, 212, 813, 212, 811);
  bezierVertex(211, 809, 213, 807, 215, 805);
  vertex(215, 799);
  vertex(205, 795);
  bezierVertex(202, 795, 200, 795, 199, 795);
  bezierVertex(197, 794, 195, 794, 194, 792);
  bezierVertex(193, 791, 192, 789, 192, 788);
  bezierVertex(192, 788, 191, 787, 191, 787);
  bezierVertex(190, 786, 188, 786, 188, 786);
  vertex(131, 782);
  bezierVertex(129, 782, 126, 783, 125, 786);
  bezierVertex(124, 787, 124, 788, 124, 789);
  bezierVertex(124, 792, 122, 795, 120, 803);
  bezierVertex(117, 811, 112, 816, 112, 816);
  bezierVertex(108, 820, 103, 824, 96, 826);
  bezierVertex(96, 826, 82, 831, 61, 823);
  bezierVertex(59, 822, 57, 822, 53, 821);
  bezierVertex(52, 821, 51, 821, 50, 820);
  bezierVertex(48, 822, 48, 823, 47, 824);
  bezierVertex(46, 824, 44, 824, 43, 823);
  bezierVertex(42, 821, 44, 820, 44, 817);
  bezierVertex(45, 813, 38, 810, 37, 809);
  bezierVertex(28, 804, 19, 806, 12, 807);
  bezierVertex(7, 808, 2, 809, 0, 810);
  
  endShape(CLOSE);
}

function drawDrum() {
  stroke(0);
  strokeWeight(1);
  fill('#0156a5');
  beginShape();
  vertex(1694, 114);
  vertex(1622, 112);
  bezierVertex(1616, 112, 1614, 111, 1607, 121);
  bezierVertex(1598, 132, 1590, 181, 1590, 228);
  bezierVertex(1590, 271, 1598, 329, 1604, 338);
  bezierVertex(1606, 340, 1607, 342, 1609, 343);
  bezierVertex(1612, 347, 1616, 349, 1620, 349);
  vertex(1694, 345);
  vertex(1694, 292);
  vertex(1654, 297);
  bezierVertex(1654, 297, 1650, 295, 1650, 293);
  vertex(1650, 291);
  bezierVertex(1650, 289, 1651, 287, 1653, 287);
  vertex(1694, 285);
  vertex(1694, 187);
  vertex(1653, 185);
  bezierVertex(1651, 185, 1650, 184, 1650, 182);
  vertex(1650, 179);
  bezierVertex(1650, 177, 1652, 175, 1654, 176);
  vertex(1694, 180);
  endShape(CLOSE);
}

function drawTrumpet3() {
  stroke(255);
  strokeWeight(1);
  fill(0);
  beginShape()
  vertex(1694, 518)
  bezierVertex(1694, 518, 1606, 541, 1580, 467);
  bezierVertex(1530, 398, 1524, 611, 1564, 640);
  bezierVertex(1586, 654, 1590, 596, 1619, 575);
  bezierVertex(1664, 545, 1775, 535, 1773, 615);
  vertex(1730, 609);
  bezierVertex(1748, 492, 1563, 595, 1669, 684);
  bezierVertex(1766, 736, 1693, 693, 1694, 693);
  vertex(1694, 679);
  bezierVertex(1670, 676, 1658, 653, 1655, 648);
  bezierVertex(1656, 648, 1657, 648, 1658, 647);
  bezierVertex(1669, 645, 1679, 650, 1680, 648);
  bezierVertex(1680, 648, 1680, 648, 1680, 647);
  bezierVertex(1672, 642, 1657, 649, 1652, 640);
  bezierVertex(1648, 627, 1651, 596, 1668, 598);
  bezierVertex(1674, 599, 1682, 597, 1686, 602);
  bezierVertex(1686, 618, 1682, 635, 1681, 652);
  bezierVertex(1681, 678, 1721, 680, 1724, 653);
  vertex(1717, 641);
  bezierVertex(1717, 652, 1714, 667, 1700, 664);
  bezierVertex(1692, 662, 1689, 654, 1690, 646);
  vertex(1694, 609);
  vertex(1694, 575); 
  bezierVertex(1688, 583, 1691, 592, 1686, 596);
  vertex(1661, 594); 
  bezierVertex(1662, 591, 1664, 587, 1667, 582); 
  bezierVertex(1673, 574, 1682, 571, 1686, 570);
  vertex(1694, 564);
  vertex(1694, 557); 
  endShape(CLOSE);
}

function drawTrumpet4() {
  stroke(0);
  strokeWeight(1);
  fill('#ad011a');
  beginShape()
  vertex(1694, 782);
  vertex(1514, 758);
  bezierVertex(1496, 756, 1479, 753, 1461, 749);
  bezierVertex(1454, 747, 1451, 741, 1448, 733);
  vertex(1441, 712);
  vertex(1440, 712);
  vertex(1439, 711);
  bezierVertex(1438, 711, 1437, 714, 1437, 714);
  bezierVertex(1437, 714, 1431, 731, 1430, 740);
  bezierVertex(1427, 752, 1425, 764, 1424, 775);
  bezierVertex(1423, 790, 1423, 806, 1425, 820);
  bezierVertex(1425, 823, 1426, 827, 1429, 824);
  bezierVertex(1434, 807, 1440, 794, 1457, 790);
  bezierVertex(1468, 788, 1481, 787, 1493, 787);
  bezierVertex(1502, 787, 1512, 787, 1522, 788);
  vertex(1631, 792);
  vertex(1694, 798);
  vertex(1694, 805);
  vertex(1681, 804);
  vertex(1683, 796);
  vertex(1666, 795);
  vertex(1666, 803);
  vertex(1663, 803);
  vertex(1665, 794);
  vertex(1649, 793);
  vertex(1648, 801);
  vertex(1645, 801);
  vertex(1646, 793);
  vertex(1631, 792);
  vertex(1629, 800);
  vertex(1556, 791);
  vertex(1544, 789);
  bezierVertex(1541, 789, 1536, 788, 1531, 788);
  bezierVertex(1531, 788, 1519, 788, 1514, 790);
  bezierVertex(1507, 794, 1503, 800, 1502, 802);
  bezierVertex(1497, 811, 1498, 820, 1499, 825);
  bezierVertex(1500, 830, 1501, 838, 1508, 844);
  bezierVertex(1514, 848, 1520, 849, 1522, 850);
  
  vertex(1621, 861);
  vertex(1620, 870);
  bezierVertex(1619, 873, 1619, 879, 1621, 881);
  bezierVertex(1624, 884, 1632, 884, 1634, 879);
  bezierVertex(1636, 875, 1637, 870, 1637, 865);
  vertex(1640, 865);
  bezierVertex(1639, 869, 1637, 879, 1640, 883);
  bezierVertex(1642, 887, 1651, 886, 1653, 880); 
  bezierVertex(1654, 876, 1655, 872, 1656, 867);
  vertex(1657, 867);
  vertex(1656, 876);
  bezierVertex(1656, 876, 1657, 887, 1663, 887); 
  bezierVertex(1668, 887, 1670, 884, 1672, 879);
  vertex(1673, 875);
  vertex(1694, 877);
  vertex(1694, 842);
  vertex(1676, 841);
  vertex(1676, 854);
  vertex(1537, 834);
  vertex(1527, 832);
  bezierVertex(1527, 832, 1521, 830, 1519, 828);
  bezierVertex(1514, 823, 1514, 812, 1521, 808);  
  bezierVertex(1532, 802, 1549, 806, 1561, 807);
  vertex(1629, 815);
  vertex(1624, 854);
  vertex(1638, 854);
  vertex(1642, 816);
  vertex(1648, 817);
  vertex(1643, 854);
  vertex(1658, 854);
  vertex(1662, 818);
  vertex(1665, 819);
  vertex(1660, 854);
  vertex(1676, 854);
  vertex(1678, 820);
  vertex(1694, 821);

  endShape();
}




//user interactions
function mousePressed() {
  if (!audioStarted) { //checks if the audio hasn't started yet.
    getAudioContext().resume(); //resumes the audio context (necessary for web audio to play after a user interaction).
    backgroundMusic.loop(); //starts playing the background music in a loop.
    backgroundMusic.setVolume(0.3); //sets the background music volume (0.3 is 30%).
    audioStarted = true; //sets our flag to true so the music doesn't try to start again
  }
}



function keyPressed() {
  if (!audioStarted) { //checks if the audio needs to be started.
    getAudioContext().resume();
    backgroundMusic.loop();
    backgroundMusic.setVolume(0.3);
    audioStarted = true;
  }

  let k = key.toUpperCase(); //converts the pressed key to uppercase so 'a' and 'A' are treated the same.

  //instrument triggering
  if (instrumentSounds[k]) {
    //depending on the key, it adds a visual "note" at the instrument's position with a specific color.
    if (k === 'A') addNote(color('#022d65'), trumpetPos.x, trumpetPos.y);  //blue note for trumpet.
    if (k === 'S') addNote(color('#ad011a'), guitarPos.x, guitarPos.y);  //reddish-brown note for guitar.
    if (k === 'D') addNote(color(0), violinPos.x, violinPos.y);  //black note for violin.
    if (k === 'F') {   //special case for the drum.
      let randX = random(width - 100);  //picks a random x-position for the drum note.
      let randY = random(height - 100);  //picks a random y-position for the drum note.
      addNote(color('#0156a5'), randX, randY, true, 200, 140);  //adds a larger, static blue note for the drum.
    }
    
    instrumentSounds[k].play();  //plays the sound corresponding to the pressed instrument key.
  }

  //piano key triggering 
  let idx = ['Z','X','C','V','B','N','M'].indexOf(k);
  if (idx >= 0) { 
    let w = width / 7;  //calculates the width of a single piano key.
    let x = idx * w + w / 2;  //finds the horizontal center of the pressed piano key.
    let y = height * 0.9;  //gets the vertical position of the piano keys.

    //picks a random color from a small set for the piano notes.
    let pianoColors = ['#022660', '#b0021a', '#d7dae1'];
    let c = color(random(pianoColors)); //chooses one of the color randomly.

    //adds a note that floats *upward* (negative speed) from the piano key.
    addNote(c, x, y - 20, false, 30, 30, -2); //it's a small note, floating up at speed -2.
    pianoSounds[k].play();
  }
}


//managing visual notes.
// This function creates a new "note" object to be drawn on the screen.
function addNote(c, x, y, isStatic = false, w = 30, h = 30, customSpeed = null) {
  let note = {
    x: x,  //starting x-position of the note.
    y: y,  //starting y-position of the note.
    col: c,  //color of the note.
    alpha: 255,  //initial transparency (fully visible).

    // Determines how fast the note moves:
    // If it's static (like drum), speed is 0.
    // If customSpeed is provided (like piano), use that.
    // Otherwise, pick a random speed for normal instrument notes.
    speed: isStatic ? 0 : (customSpeed ?? random(1.5, 2.5)), 
    lifetime: isStatic ? 180 : null,
    w: w, //width of the note.
    h: h  //height of the note.
  };
  notes.push(note);  //adds this new note to our list of active notes.
}

/*
The addNote() function is designed to dynamically create and configure visual elements ("notes") that represent 
either static or animated components in the interactive canvas. Depending on the instrument type, the function 
supports static positioning, randomized motion, or customizable speed. These note objects are stored in a global 
array to be iteratively drawn and updated during the animation loop. I had asked about the logic of the gpt loop 
to achieve the design extension.*/


//dynamic background color areas
// This function handles the shifting background colors.
function drawColorZones() {
  //calculates the dividing lines (cuts) for the background zones based on the yellow lines
  const xCuts = [0];
  yellowCols.forEach(i => {
    xCuts.push(gap + i * (cellSize1 + gap) + cellSize1 / 2);
  });
  xCuts.push(width);  //adds the right edge of the canvas as a cut.

  const yCuts = [0];
  yellowRows.forEach(j => {
    yCuts.push(gap + j * (cellSize1 + gap) + cellSize1 / 2);
  });
  yCuts.push(height);  //adds the bottom edge of the canvas as a cut.

  const now = millis();  //gets the current time in milliseconds.

  //checks if it's time to switch colors, or if we haven't set up the colors yet.
  if (
    now - colorZoneLastSwitch > colorZoneInterval ||
    regionQuarterColors.length !== xCuts.length - 1
  ) {
    colorZoneLastSwitch = now;  //resets the timer for the next color switch.
    regionQuarterColors = [];   //clears the old color choices.

    //this nested loop goes through each large background region.
    //for each region, it picks 4 random colors (one for each quarter of the region) using the weighted system.
    for (let xi = 0; xi < xCuts.length - 1; xi++) {
      regionQuarterColors[xi] = [];
      for (let yj = 0; yj < yCuts.length - 1; yj++) {
        regionQuarterColors[xi][yj] = [
          weightedRandomIndex(colorWeights),
          weightedRandomIndex(colorWeights),
          weightedRandomIndex(colorWeights),
          weightedRandomIndex(colorWeights),
        ];
      }
    }
  }

/* AI Consultation
To achieve the concept of “controlled randomness” inspired by Generative Art, 
I consulted ChatGPT on how to apply weighted randomness for color selection and 
how to divide regions into separate quadrants. With the help of GPT, I implemented 
a nested loop structure to generate a color combination for each section. The use 
of weighting allows for different probabilities to be assigned to preferred colors.
*/


  //drawing the color areas
  noStroke();
  rectMode(CORNER);

  //This double loop actually draws all the colored rectangles.
  for (let xi = 0; xi < xCuts.length - 1; xi++) {
    for (let yj = 0; yj < yCuts.length - 1; yj++) {
      const x0 = xCuts[xi];  //top-left x of the current region.
      const y0 = yCuts[yj];  //top-left y of the current region.
      const w  = xCuts[xi + 1] - x0;  //width of the current region.
      const h  = yCuts[yj + 1] - y0;  //height of the current region.
      const cols = regionQuarterColors[xi][yj];  //the 4 chosen colors for this region.

      // Draws the four quarter-rectangles within the current region, each with its assigned color.
      fill(bgPalette[cols[0]]); rect(x0, y0, w/2, h/2);        //top-left quarter.
      fill(bgPalette[cols[1]]); rect(x0 + w/2, y0, w/2, h/2);  //top-right quarter.
      fill(bgPalette[cols[2]]); rect(x0, y0 + h/2, w/2, h/2);  //bottom-left quarter.
      fill(bgPalette[cols[3]]); rect(x0 + w/2, y0 + h/2, w/2, h/2); //bottom-right quarter.
    }
  }
}


//helper function for random colors
// This function helps pick a color from the palette based on the "weights" we assigned,
// making some colors more likely to appear than others.
function weightedRandomIndex(weights) {
  const total = weights.reduce((sum, w) => sum + w, 0);   //adds up all the weights to get a total.
  let r = random(total);  //picks a random number between 0 and the total weight.
  for (let i = 0; i < weights.length; i++) {  //this loop finds which color the random number "lands" on.
    if (r < weights[i]) return i;  //if the random number is within this color's weight range, return its index.
    r -= weights[i];  //otherwise, subtract this color's weight and try the next one.
  }
  return weights.length - 1; //fallback: if somehow nothing is picked, return the last color's index.
}



/* AI Consultation
The weightedRandomIndex() function was implemented to support probability-based color selection. 
It accumulates weights into a total range and selects a random index by simulating a virtual segment selection, 
where items with higher weights occupy larger ranges. This approach supports the design goal of introducing 
controlled randomness in visual outputs.
Combined with the above function, it allows for dynamic color changes in the background,
creating a visually engaging experience that aligns with the concept of Generative Art.

*/