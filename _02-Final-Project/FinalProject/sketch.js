// Global var

var mapSize = 500

//Define max and min values for drawing

var maxX = mapSize/2-20;
var minX = -mapSize/2+20;
var maxY = mapSize/2-20;
var minY = -mapSize/2+20;

var centerVector;



var areas = [];
var rooms = [];


function setup() {
  // Canvas setup
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5Container");
  // Detect screen density (retina)
  var density = displayDensity();
  pixelDensity(density);

  centerVector = createVector(maxX/2,maxY/2);

  //Define possible areas for TSpawn,CTSpawn,BombSiteA,BombSiteB
  defineAreas();
  //Define definitive locations of TSpawn,CTSpawn,BombSiteA,BombSiteB
  defineSpawns();
  defineLongPaths();

}

function draw() {

  console.log(randN(1,6));


  stroke(255);
  background(0);

  translate(width/2,height/2);

  drawOutline();


    //THIS IS ONLY FOR TESTING AREA PLACEMENT
/*
  for(var i=0;i<areas.length;i++){
    areas[i].draw();
  }
*/
  for(var i=0;i<rooms.length;i++){
    rooms[i].draw();
    }

}

function drawOutline(){

  // Draw outer edges of Map

  noFill();
  translate(-mapSize/2,-mapSize/2);
  rect(0,0,mapSize,mapSize);
  translate(mapSize/2,mapSize/2);
  fill(0);
}

function defineAreas(){

  //Define possible Areas for main assets (TSpawn,CTSpawn,BombSiteA,BombSiteB)
  //Add them to a list
  areas.push(new Area("TSpawn"),new Area("CTSpawn"),new Area("BombSiteA"),new Area("BombSiteB"));

}

function defineSpawns(){

  //Define positions for main assets (TSpawn,CTSpawn,BombSiteA,BombSiteB)
  //Add them to the roomlist
  for(var i=0;i<areas.length;i++){

    var centerx = randN(areas[i].areaminX,areas[i].areamaxX);
    var centery = randN(areas[i].areaminY,areas[i].areamaxY);
    var width = 20;
    var height = 20;
    var designation = areas[i].designation;
    rooms.push(new Room(centerx,centery,width,height,designation));
  }

}

function defineLongPaths(){

  var TLongBEdge = createVector(randN(rooms[0].vector.x,maxX),randN(rooms[0].vector.y,centerVector.y)); //Edge of Path Long B
  var TLongAEdge = createVector(randN(minX,rooms[0].vector.x),randN(rooms[0].vector.y,centerVector.y)); //Edge of Path Long A
  var outerEdgeB = createVector((TLongBEdge.x+rooms[3].vector.x)/2,(TLongBEdge.y+rooms[3].vector.y)/2); //Center of Edge B and BSite
  var outerEdgeA = createVector((TLongAEdge.x+rooms[2].vector.x)/2,(TLongAEdge.y+rooms[2].vector.y)/2); //Center of Edge A and ASite
  var LongBEdgeBSite = createVector(randN(outerEdgeB.x,maxX),randN(TLongBEdge.y,rooms[3].vector.y));    //Path Center of Long B
  var LongAEdgeASite = createVector(randN(outerEdgeA.x,minX),randN(TLongAEdge.y,rooms[2].vector.y));    //Path Center of Long A

  TLongBEdge = new Room(TLongBEdge.x,TLongBEdge.y,20,20,"TLongBEdge");
  TLongAEdge = new Room(TLongAEdge.x,TLongAEdge.y,20,20,"TLongAEdge");
  LongBEdgeBSite = new Room(LongBEdgeBSite.x,LongBEdgeBSite.y,20,20,"LongBEdgeBSite");
  LongAEdgeASite = new Room(LongAEdgeASite.x,LongAEdgeASite.y,20,20,"LongAEdgeASite");


  rooms.push(TLongBEdge,TLongAEdge,LongBEdgeBSite,LongAEdgeASite);

}


//Only for Testing Purposes
function drawTestLines(){

}

class Room{
  constructor(centerx,centery,width,height,designation){
    this.vector=createVector(centerx,centery);  //center position of room
    this.width=width; //width of room
    this.height=height; //height of room
    this.designation=designation; //Type
    this.x1=this.vector.x-width/2;  //edge coordinates
    this.x2=this.vector.x+width/2;  //edge coordinates
    this.y1=this.vector.y-height/2; //edge coordinates
    this.y2=this.vector.y+height/2; //edge coordinates

    if(designation=="TSpawn"){
      this.color=color("brown");
    }
    else if(designation=="CTSpawn"){
      this.color=color("blue");
    }
    else if(designation=="BombSiteA"){
      this.color=color("green");
    }
    else if(designation=="BombSiteB"){
      this.color=color("green");
    }
    else{
      this.color=color("white");
    }

  }
  draw(){

    fill(this.color);
    quad(this.x1,this.y1,this.x1,this.y2,this.x2,this.y2,this.x2,this.y1);

  }


}

class Area{
  constructor(designation){

    this.designation=designation;

    //different constructor based on designation
    if(designation=="TSpawn"){

      this.areaminX=minX+100;
      this.areaminY=maxY-50;
      this.areamaxX=maxX-100;
      this.areamaxY=maxY;
      this.color=color("brown");


    }
    else if(designation=="CTSpawn"){

      this.areaminX=minX+150;
      this.areaminY=minY;
      this.areamaxX=maxX-150;
      this.areamaxY=minY+50;
      this.color=color("blue");

    }
    else if(designation=="BombSiteA"){

      this.areaminX=minX;
      this.areaminY=minY;
      this.areamaxX=minX+(abs(maxX)+abs(minX))/2-100;
      this.areamaxY=minY+50;
      this.color=color("green");

    }
    else if(designation=="BombSiteB"){

      this.areaminX=minX+(abs(maxX)+abs(minX))/2+100;
      this.areaminY=minY;
      this.areamaxX=maxX;
      this.areamaxY=minY+50;
      this.color=color("green");

    }

  }
  draw(){


    fill(this.color);
    quad(this.areamaxX,this.areamaxY,this.areamaxX,this.areaminY,this.areaminX,this.areaminY,this.areaminX,this.areamaxY);
    fill(0);


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

//Normal Distributed number generator

function randN(x,y){
  return (random(x,y)+random(x,y))/2;

}