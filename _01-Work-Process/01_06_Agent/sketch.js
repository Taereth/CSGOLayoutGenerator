// Based on the code P_2_0_02.pde from
// Generative Gestaltung, ISBN: 978-3-87439-759-9

// Global var
var b = 255, p = false;
var startposx = 0;
var startposy = 0;

var mousePosition;


var Agents = []

var DirectionArray = [
  "NORTH",
  "SOUTH",
  "EAST",
  "WEST"
]



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

  Agents.push(new Agent(random(0,200),random(0,200),"NORTH",5));
  Agents.push(new Agent(random(0,200),random(0,200),"SOUTH",5));
  Agents.push(new Agent(random(0,200),random(0,200),"WEST",5));
  Agents.push(new Agent(random(0,200),random(0,200),"EAST",5));






}

class Agent{

  constructor(xposition, yposition, direction, speed){
    this.xposition = xposition;
    this.yposition = yposition;
    this.direction = direction;
    this.speed = speed;
    this.color = color(0,0,255);
    this.duration = 0;

  }

  move(){

    if (this.direction=="NORTH"){
      this.xposition -= this.speed;
    }
    if (this.direction=="SOUTH"){
      this.xposition += this.speed;
    }
    if (this.direction=="WEST"){
      this.yposition -= this.speed;
    }
    if (this.direction=="EAST"){
      this.yposition += this.speed;
    }

    stroke(this.color);
    //ellipse(this.xposition,this.yposition,20);
    beginShape();
    vertex(startposx,startposy);
    vertex(this.xposition,this.yposition);
    endShape();

    if(this.duration>0){
      this.duration-=1;
    }
    if(this.duration<=0){
      this.setcolor(color(0,150,205));
      this.multiplied=0;
    }

    if(this.xposition>500 || this.xposition <-500 || this.yposition > 300 || this.ypostion <-300){
      this.xposition = startposx;
      this.yposition = startposy;
    }

  }

  setspeed(speed){
    this.speed=speed;
  }
  setdirection(direction){
    this.direction=direction;
  }
  setmultiplied(){
    this.multiplied=1; //makes it so agent doesnt multiply anymore
    this.duration=1000;
  }
  setcolor(color){
    this.color=color;
  }





}

function draw() {



  translate(width/2,height/2);


  if (p){
    mousePosition = createVector(mouseX,mouseY);
    startposx = mousePosition.x-width/2;
    startposy= mousePosition.y-height/2;
  }



  for(i=0;i<Agents.length;i++){

    var directionrandom = Math.floor(Math.random()*DirectionArray.length);

    Agents[i].setdirection(DirectionArray[directionrandom]);
    Agents[i].setspeed(random(0,10));
    Agents[i].move();

    var currentAgentX = Agents[i].xposition;
    var currentAgentY = Agents[i].yposition;

    for(j=0;j<Agents.length;j++){

      var dx = currentAgentX - Agents[j].xposition;
      var dy = currentAgentY - Agents[j].yposition;
      var distance = Math.sqrt(dx*dx+dy*dy);





      if (distance < 40 && j!=i && Agents[i].multiplied!=1 &&Agents[j].multiplied!=1){
        Agents[i].setmultiplied();
        Agents[j].setmultiplied();
        Agents[i].setcolor(color(0,0,200));
        Agents[j].setcolor(color(0,0,200));
        print("Hossa.");

        var BoinkedAgent = new Agent(currentAgentX,currentAgentY,"NORTH",5);
        BoinkedAgent.setcolor(color(145,0,200));
        BoinkedAgent.setmultiplied();

        Agents.push(BoinkedAgent);
      }



    }



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
