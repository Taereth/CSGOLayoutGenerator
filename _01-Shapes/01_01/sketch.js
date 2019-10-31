// Based on the code P_2_0_02.pde from
// Generative Gestaltung, ISBN: 978-3-87439-759-9

// Global var
var b = 255, p = false;

var count = 0;
var start1 = 0;
var startlength= 250;
var countin = 0;
var maxcount = 5;




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

  angleMode(DEGREES);

  b = 0;

  smooth();


  translate(width/2, height/2);


  strokeWeight(2);
  stroke(b, 25);



  makeTriangle(start1,start1,startlength,countin);




}

function makeTriangle(startpointx, startpointy, length, countin) {



  var count = countin;
  count+=1;

  triangle(startpointx-length/2,startpointy,startpointx+length/2,startpointy,startpointx,startpointy-length);
  if (count<=maxcount){

    var tri1x = (startpointx-length/2 + startpointx+length/2)/2;
    var tri1y = (startpointy + startpointy)/2;
    var tri2x = (startpointx-length/2 + startpointx)/2;
    var tri2y = (startpointy + startpointy-length)/2;
    var tri3x = (startpointx+length/2+startpointx)/2;
    var tri3y = (startpointy+startpointy-length)/2;

    // rotation

    var hypothenuse = Math.sqrt(length**2+(length/2)**2);


    var siderotation = length/hypothenuse;
    print("siderotation:"+siderotation);
    siderotation = asin(siderotation);
    print("asinsiderotation:"+siderotation);





    rotate(180);
    makeTriangle(tri1x,tri1y,length/2,count);
    rotate(-180);

    rotate(siderotation);
    makeTriangle(tri2x,tri2y,length/2,count);
    rotate(-siderotation);

    rotate(-siderotation);
    makeTriangle(tri3x,tri3y,length/2,count);
    rotate(siderotation);





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
