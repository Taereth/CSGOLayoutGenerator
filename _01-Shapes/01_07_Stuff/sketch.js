// Based on the code P_2_0_02.pde from
// Generative Gestaltung, ISBN: 978-3-87439-759-9

// Global var
var b = 255, p = false;

var drawings = [];

var Snake;

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


  Snake = new Agent(0,0);






}

class Agent{

  constructor(xposition, yposition, direction){
    this.xposition = xposition;
    this.yposition = yposition;
    this.direction = direction;
    this.vertices = [];
    this.vertices.push(createVector(this.xposition,this.yposition));
    this.done=0;

  }

  setdirection(direction){
    this.direction = direction;
  }



  move(){

    if(this.done!=1){



    this.xposition = this.direction.x;
    this.yposition = this.direction.y;
    this.vertices.push(createVector(this.xposition,this.yposition));

    beginShape();
    for(var i=0;i<this.vertices.length;i++){
      vertex(this.vertices[i].x,this.vertices[i].y);
    }
    endShape();

  }
  else{
    beginShape();
    for(var i=0;i<this.vertices.length;i++){
      vertex(this.vertices[i].x,this.vertices[i].y);
    }
    endShape();
  }



    if(this.xposition>500 || this.xposition <-500 || this.yposition > 300 || this.ypostion <-300){
      this.done=1; // sets a stop
    }

  }

}








function draw(){

  background(255);

  translate(width/2,height/2);


  Snake.setdirection(createVector(Snake.xposition+500,Snake.yposition+500,0));
  Snake.move();
  print(Snake.vertices);
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
