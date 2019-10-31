// Based on the code P_2_0_02.pde from
// Generative Gestaltung, ISBN: 978-3-87439-759-9

// Global var
var b = 255, p = false;

var resolution = 260; //Amount of points in a circle
var rad = 150;
var x = 1;
var y = 1;
var nVal = 2; //noise Value
var nInt = 2; //noise Intensity
var nAmp = 5; //noise Amplitude
var t = 0;
var sound;  //sound to be played
var fft, peakDetect; //vars for peakDetection
var mountain = Math.random(0,1);

function preload() {
  sound = loadSound("High.mp3");
}


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
  sound.play();

  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect();





}



function draw(){


  background(0);

  rect()



  var waveform = fft.waveform();
  fft.analyze();
  peakDetect.update(fft);

  colorMode(RGB,255,255,255,1);

  stroke(1,205,254);
  fill(2,205,254);

//Floor Basis

beginShape();
vertex(-2000,2000);
for (var i = 0; i < 30; i++){
  var backx = map(i,0,30,0,width+200);
  var backy = 300
  vertex(backx,backy);


}
vertex(2000,2000);
endShape();

//Lines

translate(width/2, height/2);

stroke(0,0,200);

strokeWeight(3);
for (var i = 0; i<40; i++){
  var linex = map(i,0,20,0,width+500);
  var liney = 500;
  line(linex,liney,0,-150);
}

for (var i = 0; i<40; i++){
  var linex = map(i,0,20,0,width+500);
  var liney = 500;
  line(-linex,liney,0,-150);
}

for (var i = 0; i<10; i++){
  var linex = map(i,0,10,0,width);
  var liney = map(i,0,10,0,height/2);
  line(-linex*200,liney,linex*200,liney);
}
strokeWeight(2);
stroke(255,255,255);

for (var i = 0; i<40; i++){
  var linex = map(i,0,20,0,width+500);
  var liney = 500;
  line(linex,liney,0,-150);
}

for (var i = 0; i<40; i++){
  var linex = map(i,0,20,0,width+500);
  var liney = 500;
  line(-linex,liney,0,-150);
}

for (var i = 0; i<10; i++){
  var linex = map(i,0,10,0,width);
  var liney = map(i,0,10,0,height/2);
  line(-linex*200,liney,linex*200,liney);
}

//Background

translate(-width/2, -height/2);
fill(0,0,0);
rect(0,0,width,height/2);



  fill(color(250,100,0));
  stroke(250,100,0);

//Sun
translate(width/2+200, height/2-100);


  beginShape();

  var chooser = Math.round(Math.random(0,1))

    for (var i = 0; i< waveform.length+1; i++){

      var angle = map(i, 0, waveform.length, 0, TWO_PI);

      x = cos(angle)*rad+waveform[i]*nAmp*10;
      y = sin(angle)*rad;

      if ( peakDetect.isDetected ) {


        if(chooser==1){
          y = y-waveform[i]*nAmp*10;

        }
        if(chooser==0){
          y = y+waveform[i]*nAmp*10;

        }


      } else {
        x=x;
      }


      vertex(x/2,y/2);


  }

  endShape();

  translate(-width/2+200, -height/2-100);









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
