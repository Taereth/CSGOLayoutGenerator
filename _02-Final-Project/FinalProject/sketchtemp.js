// Global var

var boids = [];
var startAmount = 20;

function setup() {
  // Canvas setup
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5Container");
  // Detect screen density (retina)
  var density = displayDensity();
  pixelDensity(density);

  for(var i=0; i<startAmount; i++){
    var newBoid = new Boid(random(-400,400),random(-400,400));
    boids.push(newBoid);
  }





}

function draw() {

  background(255);

  translate(width/2,height/2);
  ellipse(0,0,50);

  for(var i=0;i<boids.length;i++){
    boids[i].move();
    boids[i].groupup();
    boids[i].flock();
    boids[i].seperate();
    boids[i].rotation += random(-0.2,0.2);
  }
  for(var i=0;i<boids.length;i++){
    boids[i].draw();
    boids[i].group = [];
  }





}

class Boid {
  constructor(x,y){
    this.xposition = x;
    this.yposition = y;
    this.velocity = 1;
    this.rotation = random(0,360);
    this.group = [];
    this.thevector = createVector((this.xposition+this.velocity*cos(this.rotation))-this.xposition, (this.yposition+this.velocity*sin(this.rotation))-this.yposition);

  }

  draw(){
    ellipse(this.xposition,this.yposition,20);
  }
  move(){

    this.thevector = createVector((this.xposition+this.velocity*cos(this.rotation))-this.xposition, (this.yposition+this.velocity*sin(this.rotation))-this.yposition);
    this.xposition = this.xposition+this.thevector.x;
    this.yposition = this.yposition+this.thevector.y;
    if(this.xposition > 400 || this.xposition < -400 || this.yposition > 400 || this.yposition < -400){
      var zerovector = createVector(-this.xposition,-this.yposition);
      this.rotation = zerovector.angleBetween(this.thevector);
      this.xposition = this.xposition+zerovector.x/100;
      this.yposition = this.yposition+zerovector.y/100;

    }


  }
  //Function to group boids that are close together
  groupup(){
    for(var i=0;i<boids.length;i++){
      if(boids[i]!=this){

        var dx = this.xposition - boids[i].xposition;
        var dy = this.yposition - boids[i].yposition;
        var distance = Math.sqrt(dx*dx+dy*dy);

          if (distance < 200){
            this.group.push(boids[i]);
          }
          if (distance < 50){
            line(this.xposition,this.yposition,boids[i].xposition,boids[i].yposition);
          }

      }
      else{
        //do nothing
      }
    }
  }

  flock(){

    var thisguy = createVector(this.xposition,this.yposition);

    for(var i=0;i<this.group.length;i++){
      thisguy = thisguy.add(createVector(this.group[i].xposition,this.group[i].yposition));
    }

    thisguy = thisguy.div(this.group.length);
    var newX = thisguy.x;
    var newY = thisguy.y;

    var centerdirection = createVector(newX-this.xposition,newY-this.yposition);
    this.xposition = this.xposition + centerdirection.x/100;
    this.yposition = this.yposition + centerdirection.y/100;

  }


  seperate(){



    for(var i=0;i<this.group.length;i++){
      if(this.group[i]!=this){



        var dx = this.xposition - this.group[i].xposition;
        var dy = this.yposition - this.group[i].yposition;
        var distance = Math.sqrt(dx*dx+dy*dy);

          if (distance < 30){



            var checkrotation = this.group[i].thevector;
            checkrotation = checkrotation.add(this.thevector);
            checkrotation = checkrotation.div(2);

            this.rotation += checkrotation/500;



            var checkvector = createVector(this.group[i].xposition-this.xposition,this.group[i].yposition-this.yposition);
            this.xposition = this.xposition - checkvector.x/50;
            this.yposition = this.yposition - checkvector.y/50;
            this.group[i].xposition = this.group[i].xposition + checkvector.x/50;
            this.group[i].yposition = this.group[i].yposition + checkvector.y/50;


          }

      }
      else{
        //do nothing
      }
    }

  }




}












function keyPressed() {
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
