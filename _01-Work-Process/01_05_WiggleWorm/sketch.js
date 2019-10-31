// Based on the code P_2_0_02.pde from
// Generative Gestaltung, ISBN: 978-3-87439-759-9

// Global var
var b = 255, p = false;

var drawing = [];


var circlex = 0;
var circley = 0;


var right = 1;
var down = 1;
var rotate1 = 0;
var startnr = 1;

var drawing = [];
var countof = [];





function setup() {
  // Canvas setup
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5Container");
  // Detect screen density (retina)
  var density = displayDensity();
  pixelDensity(density);
  // Colors and drawing modes
  background(255);
  smooth();
  // Init Var






}

function draw() {

  


  if (p){
    drawing.push(createVector(mouseX,mouseY,0));
    countof.push(1);
  }

  linedraws();

  translate(width/2,height/2);

fill(color(random(150,200),random(0),random(150,250)));



stroke(0);

ellipse(circlex,circley,100,100);



if(right==1){
  circlex+=random(0,10);
}
if(right==0){
  circlex-=random(0,10);
}
if(down==1){
  circley+=random(0,10);
}
if(down==0){
  circley-=random(0,10);
}

if(circlex>=670){
  right=0;
}
if(circlex<=-670){
  right=1;
}
if(circley>=280){
  down=0;
}
if(circley<=-280){
  down=1;
}


//Rotating Orbs
translate(circlex,circley);
rotate(rotate1);
ellipse(75,75,25,25);
ellipse(-75,75,25,25);
ellipse(75,-75,25,25);
ellipse(-75,-75,25,25);
rotate(-rotate1);
translate(-circlex,-circley);



rotate1+=0.05;








}

function linedraws(){

  for(i=0;i<drawing.length;i++){
    var drawX = drawing[i].x;
    var drawY = drawing[i].y;
    fill(color(0,random(200,255),random(200,255)));
    ellipse(drawX,drawY+countof[i],10);
    countof[i]+=5;
  }

}




function mousePressed() {
  p = true;
}

function mouseReleased() {
  p = false;
}

function keyPressed() {
  // Clear sketch
  if (keyCode === 32) background(255) // 32 = SPACE BAR
  if (key == 's' || key == 'S') saveThumb(650, 350);
}

// Tools

// resize canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

// Int conversion
function toInt(value) {
  return ~~value;
}

// Timestamp
function timestamp() {
  return Date.now();
}

// Thumb
function saveThumb(w, h) {
  let img = get( width/2-w/2, height/2-h/2, w, h);
  save(img,'thumb.jpg');
}
