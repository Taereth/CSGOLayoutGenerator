// Global var

var mapSize = 800

//Interface

let resetButton;
let mapSizeSlider;
let segmentlengthSlider;
let maxAngleSlider;
let noiseIncSlider;
let randomPathAmountSlider;
let roomSizeSlider;
let coverMaxSizeSlider;
let coverScarcitySlider;
let coverCombinationDistanceSlider;

//Define max and min values for drawing

var maxX = mapSize/2-20;
var minX = -mapSize/2+20;
var maxY = mapSize/2-20;
var minY = -mapSize/2+20;

var centerVector;

//Actual Rooms to be drawn
var actualRooms = [];

var areas = [];
var rooms = [];
var paths = [];   //Different Paths (f.e. LongA,LongB);
var groups = [];  //groups of room vectors that should form drawn rooms together

var cover = []; // array where cover location[0+3i],rotation[1+3i] and size[2+3i] are stored


function setup() {
  // Canvas setup
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5Container");
  // Detect screen density (retina)
  var density = displayDensity();
  pixelDensity(density);

  createInterface();

  centerVector = createVector(maxX/2,maxY/2);

  //Define possible areas for TSpawn,CTSpawn,BombSiteA,BombSiteB
  defineAreas();
  //Define definitive locations of TSpawn,CTSpawn,BombSiteA,BombSiteB
  defineSpawns();
  defineLongPaths();
  defineMid();

  //Generate Main Paths

  randomPath(rooms[1].vector,rooms[2].vector);
  randomPath(rooms[1].vector,rooms[3].vector);
  randomPath(rooms[0].vector,rooms[5].vector);
  randomPath(rooms[0].vector,rooms[4].vector);
  randomPath(rooms[4].vector,rooms[6].vector);
  randomPath(rooms[5].vector,rooms[7].vector);
  randomPath(rooms[7].vector,rooms[2].vector);
  randomPath(rooms[6].vector,rooms[3].vector);
  randomPath(rooms[6].vector,rooms[8].vector);
  randomPath(rooms[7].vector,rooms[8].vector);
  randomPath(rooms[0].vector,rooms[8].vector);
  randomPath(rooms[1].vector,rooms[8].vector);

  //random smaller Paths

  for(var i=0;i<randomPathAmountSlider.value();i++){
    randomPath(rooms[Math.floor(random(0,rooms.length-1))].vector,rooms[Math.floor(random(0,rooms.length-1))].vector);
  }



  //Group Points for room drawing

  for(var i=0;i<paths.length;i++){
    groupPoints(paths[i]);
  }

  //generate rectangles

  for(var i=0;i<groups.length;i++){
  minimalAreaRectangle(groups[i],5);
  }

  //generate cover
  coverGeneration();




}

function draw() {



  stroke(255);
  background(0);

  translate(width/2,height/2);

//TODO DEFUNCT: Adjust outline to mapsize

  //drawOutline();



    //Draw Map Rectangles
    noStroke();

    drawCover();

    for(var i=0;i<actualRooms.length;i++){
      actualRooms[i].draw2();
    }

    for(var i=0;i<actualRooms.length;i++){
      actualRooms[i].draw();
    }

    drawCover();

    drawInterface();





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

  //This function defines positions for The main roads main intersections and the lower edges and adds them to the list

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

function defineMid(){

  //This defines a middle position based on the existing positions

  var TSpawn = rooms[0];
  var CTSpawn = rooms[1];
  var TLongAEdgeASite = rooms[7];
  var TLongBEdgeBSite = rooms[6];

  var Mid = createVector(randN(TLongAEdgeASite.vector.x,TLongBEdgeBSite.vector.x),randN(TSpawn.vector.y,CTSpawn.vector.y));
  Mid = new Room(Mid.x,Mid.y,20,20,"Mid");
  rooms.push(Mid);
}

class Room{

  //This class defines points upon which the rooms are generated. It is not the room itself (TODO: Rename this class and all references to something like "point"), as the class changed function during the process

  constructor(centerx,centery,width,height,designation){
    this.vector=createVector(centerx,centery);  //center position of room
    this.width=width; //width of room //TODO CHANGE WIDTH
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

    //this function is not needed for the final process, but its helpful to have incase you want to check where exactly the points are

    fill(this.color);
    quad(this.x1,this.y1,this.x1,this.y2,this.x2,this.y2,this.x2,this.y1);

  }


}

class Area{

  //this defines possible areas where spawns and sites can be generated
  //note that in order to change the possible positions of spawns and sites, one needs to change the "areamin"-variables in this class

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

    //this function is not needed for the final process, but it is helpful to check where the areas are generated.


    fill(this.color);
    quad(this.areamaxX,this.areamaxY,this.areamaxX,this.areaminY,this.areaminX,this.areaminY,this.areaminX,this.areamaxY);
    fill(0);


  }


}

function keyPressed() {

  //innate function to make a screensave

  if (key == 's' || key == 'S') saveThumb(650, 350);
}

// resize canvas when the window is resized, not used atm
function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

//Normal Distributed number generator

function randN(x,y){
  return (random(x,y)+random(x,y))/2;

}

//random Path between two points

function randomPath(start,end){

  //This function takes in a start and an end point and then generates a random path between them. It is used for all paths. The variables below can be changed to change map generation behaviour. TODO: Implement a UI with which these can be changed

  var lineLen =      segmentlengthSlider.value()           // length of segments
  var maxAngle =     radians(maxAngleSlider.value());   // range of random angle towards end
  var noiseInc =     noiseIncSlider.value();          // increment in Perlin noise
  var minDistToEnd = 50;            // how close to the end before we quit?

  var noiseOffset = 0;

  // create random starting point
  var start = start;
  var current = start;

  // start line


  // run until we hit the endpoint!
  var counter=0;
  var path = []; //array for specific path being generated
  path.push(start); //push start point into path array

  while (true) {

    // compute angle b/w current position and the end point
    var xDist = end.x - current.x;
    var yDist = end.y - current.y;
    var between = atan2(yDist, xDist);

    // use Perlin noise to compute a random value (0-1), change
    // to range of the maxAngle (this makes the line vary instead of
    // heading straight towards the endpoint!)
    var newAngle = between + (noise(noiseOffset) * maxAngle - maxAngle/2);

    // calculate new x/y position based on the angle, draw a line
    var xps = current.x + cos(newAngle) * lineLen;
    var yps = current.y + sin(newAngle) * lineLen;

    //Create new room and push it into room array

    var connection = new Room(xps,yps,5,5,"connection");
    rooms.push(connection);

    //Save Rooms to arrays based on paths for outline generation

    path.push(connection.vector);

    // update current position to the end of the line, figure
    // out how far we have left to go
    current = createVector(xps,yps);
    var distLeft = current.dist(end);

    // if we're near the endpoint, draw a line to the end and quit
    if (distLeft <= minDistToEnd) {
      path.push(end); //push end point into path array
      paths.push(path); //push path array into global array
      break;
    }

    // update count and Perlin noise variables, continue
    counter += 1;
    noiseOffset += noiseInc;
  }

}


//Group Paths into smaller groups in order to draw rooms

function groupPoints(path){

  //This function takes a path that has been generated with randomPath() and splits its points into smaller groups.

    var size=0
    for(var i=0;i<path.length;i+=size){
      size=Math.floor(random(2,roomSizeSlider.value()));
      var pushgroup=path.slice(i,i+size);
      if(i!=0&&i!==1){
        pushgroup.unshift(path[i-2],path[i-1]);
      }
      groups.push(pushgroup);
    }


}

//Calculate smallest possible rectangle and draw it ()

function minimalAreaRectangle(points, size){

  //This function takes the points from a group generated in groupPoints() and generates its minimal Area Rectangle. It then creates an actualRoom and pushes it into an array. Note, in order to change roomcolor, it has to be adjusted here.
  //It also assigns an important to spawns and sites, as they need to be drawn last.

  var minimalX,minimalY;
  var maximalX,maximalY;
  minimalX=minimalY=0;
  maximalX=maximalY=9999;
  var xarray=[];
  var yarray=[];
  for(var i=0;i<points.length;i++){
    xarray.push(points[i].x);
    yarray.push(points[i].y);
  }
  minimalX=Math.min(...xarray);
  maximalX=Math.max(...xarray);
  minimalY=Math.min(...yarray);
  maximalY=Math.max(...yarray);

  noStroke();

  var roomcolor;
  var important;

  if(points.includes(rooms[0].vector)==true){

    roomcolor=color("#90b286");
    important=true;
    size--;
  }
  else if(points.includes(rooms[1].vector)==true){

    roomcolor=color("#90b286");
    important=true;
    size--;
  }
  else if(points.includes(rooms[2].vector)==true){

    roomcolor=color("#b46d64");
    important=true;
    size++;
  }
  else if(points.includes(rooms[3].vector)==true){

    roomcolor=color("#b46d64");
    important=true;
    size++;
  }
  else{
    roomcolor=color("#909090");
  }

  var center=createVector((minimalX-size+maximalX+size)/2,(minimalY-size+maximalY+size)/2);
  var newactualRoom = new actualRoom(minimalX,minimalY,maximalX,maximalY,size,center,roomcolor,important);

  actualRooms.push(newactualRoom);



}

class actualRoom{

  //this defines the room that is drawn in the end. It consists of the minimal Area rectangle defined earlier and holds two drawing functions

  constructor(minimalX,minimalY,maximalX,maximalY,size,center,color,important){
    this.minimalX=minimalX;
    this.minimalY=minimalY;
    this.maximalX=maximalX;
    this.maximalY=maximalY;
    this.size=size;
    this.center=center;
    this.color=color;
    this.important=important;
    this.checkedRoom=findclosestRoom(this);

    //the following code adds cases to the drawing function, that smooth out the map generation during draw2()

    this.possibleCases = [1,2,3,4,5];
    this.caseQueue = [];
    this.randomizer=Math.floor(random(1,5));
    for(var i=0;i<this.randomizer;i++){
      var randomCase = Math.floor(random(0,this.possibleCases.length));
      this.caseQueue.push(this.possibleCases[randomCase]);
      this.possibleCases.splice(randomCase,1);
    }
  }
  draw(){

    //This function first checks whether the drawn room holds any points that belong to an important group. In order to have enough area for spawn, these important rooms need to be drawn last.
    //If the room is important it gets pushed to the end of the draw array.
    //It then draws the minimum area rectangle defined earlier. In order to make rooms bigger or smaller in general, one needs to add or subtract here.

    if(this.important==true){
      console.log("itstrue");
      actualRooms.push(actualRooms.splice(actualRooms.indexOf(this), 1)[0]);
      this.important=false;
      this.checkedRoom=findclosestRoom(this);
    }
    else{
      fill(this.color);
      quad(this.minimalX-this.size,this.minimalY-this.size,this.maximalX+this.size,this.minimalY-this.size,this.maximalX+this.size,this.maximalY+this.size,this.minimalX-this.size,this.maximalY+this.size);


    }
  }
  draw2(){

    //This function is to be used before draw(), not sure why but if used after draw() it screws with the generation.
    //it takes the minimal area rectangles and applies cases, should they be in the caseQueue defined in the constructor.
    //these basically smooth out the generation and connect the edges of a MAR to its closest neighbour
    //It only does this to rooms that are not important.


    if(this.important!=true && this.checkedRoom.important!=true){

      fill(this.color);

      for(var i=0;i<this.caseQueue.length;i++){

        switch(this.caseQueue[i]) {
          case 1:
            quad(this.minimalX-this.size,this.minimalY-this.size,this.checkedRoom.minimalX-this.checkedRoom.size,this.checkedRoom.minimalY-this.checkedRoom.size,this.checkedRoom.center.x,this.checkedRoom.center.y,this.center.x,this.center.y);
            break;
          case 2:
            quad(this.maximalX+this.size,this.minimalY-this.size,this.checkedRoom.maximalX+this.checkedRoom.size,this.checkedRoom.minimalY-this.checkedRoom.size,this.checkedRoom.center.x,this.checkedRoom.center.y,this.center.x,this.center.y);
            break;
          case 3:
            quad(this.maximalX+this.size,this.maximalY+this.size,this.checkedRoom.maximalX+this.checkedRoom.size,this.checkedRoom.maximalY+this.checkedRoom.size,this.checkedRoom.center.x,this.checkedRoom.center.y,this.center.x,this.center.y);
            break;
          case 4:
            quad(this.minimalX-this.size,this.maximalY+this.size,this.checkedRoom.minimalX-this.checkedRoom.size,this.checkedRoom.maximalY+this.checkedRoom.size,this.checkedRoom.center.x,this.checkedRoom.center.y,this.center.x,this.center.y);
            break;
          case 5:
            break;
        }

      }



    }
    else{
      //do nothing.
    }

  }
}

function findclosestRoom(checkedRoom){

  //this function is used by the actualRoom class to check for the closest neighboring actualRoom.

  var checkedX = checkedRoom.center.x;
  var checkedY = checkedRoom.center.y;
  var shortestDistance = 99999;
  var returnRoom;


  for(var i=0;i<actualRooms.length;i++){
    if(actualRooms[i]!=checkedRoom){
      if(dist(checkedX,checkedY,actualRooms[i].center.x,actualRooms[i].center.y)<shortestDistance){
        shortestDistance=dist(checkedX,checkedY,actualRooms[i].center.x,actualRooms[i].center.y);
        returnRoom=actualRooms[i];

      }
    }
    else{
      //Do nothing.
    }
  }

  return returnRoom;

}

function coverGeneration(){
  stroke(0);
  for(var i=0;i<actualRooms.length;i++){
    var actualSize=Math.floor((actualRooms[i].maximalX-actualRooms[i].minimalX)*(actualRooms[i].maximalY-actualRooms[i].minimalY)/100);

    if(typeof actualRooms[i].checkedRoom === "undefined"){
      var closestRoomSize=0;
    }
    else{
      var closestRoomSize=Math.floor((actualRooms[i].checkedRoom.maximalX-actualRooms[i].checkedRoom.minimalX)*(actualRooms[i].checkedRoom.maximalY-actualRooms[i].checkedRoom.minimalY)/100);
    }



    if(actualSize>coverScarcitySlider.value()){
      var location = createVector(random(actualRooms[i].minimalX+5,actualRooms[i].maximalX-5),random(actualRooms[i].minimalY+5,actualRooms[i].maximalY-5));
      var randomrotation = random(0,0);
      var randomsize = createVector(random(15,coverMaxSizeSlider.value()),random(15,coverMaxSizeSlider.value()));
      cover.push(location,randomrotation,randomsize);
    }
    else if(actualSize+closestRoomSize>coverScarcitySlider.value()){
      var location = createVector(random(Math.min(actualRooms[i].minimalX+5,actualRooms[i].checkedRoom.minimalX+5),Math.max(actualRooms[i].maximalX-5,actualRooms[i].checkedRoom.maximalX-5)),random(Math.min(actualRooms[i].minimalY+5,actualRooms[i].checkedRoom.minimalY+5),Math.max(actualRooms[i].maximalY-5,actualRooms[i].checkedRoom.maximalY-5)));
      var randomrotation = random(0,0);
      var randomsize = createVector(random(15,coverMaxSizeSlider.value()/2),random(15,coverMaxSizeSlider.value()/2));
      cover.push(location,randomrotation,randomsize);
    }



  }
}

function drawCover(){

  for(var i=0;i<cover.length;i+=3){
    translate(cover[i].x,cover[i].y);
    rotate(cover[i+1]);
    fill("black");

    rect(0,0,cover[i+2].x,cover[i+2].y);

    rotate(-cover[i+1]);
    translate(-cover[i].x,-cover[i].y);



    for(var j=0;j<i;j+=3){
      if(dist(cover[i].x,cover[i].y,cover[j].x,cover[j].y) < coverCombinationDistanceSlider.value()){

        fill("black");

        quad(cover[i].x,cover[i].y,cover[j].x,cover[j].y,cover[j].x,cover[j].y+cover[j+2].y,cover[i].x,cover[i].y+cover[i+2].y);
        quad(cover[i].x+cover[i+2].x,cover[i].y,cover[j].x+cover[j+2].x,cover[j].y,cover[j].x+cover[j+2].x,cover[j].y+cover[j+2].y,cover[i].x+cover[i+2].x,cover[i].y+cover[i+2].y);
        quad(cover[i].x,cover[i].y+cover[i+2].y,cover[j].x,cover[j].y+cover[j+2].y,cover[j].x+cover[j+2].x,cover[j].y+cover[j+2].y,cover[i].x+cover[i+2].x,cover[i].y+cover[i+2].y);
        quad(cover[i].x,cover[i].y,cover[j].x,cover[j].y,cover[j].x,cover[j].y+cover[j+2].y,cover[i].x,cover[i].y+cover[i+2].y);



      }
    }

  }



}

function reset(){

  mapSize=mapSizeSlider.value();

  maxX = mapSize/2-20;
  minX = -mapSize/2+20;
  maxY = mapSize/2-20;
  minY = -mapSize/2+20;


  //Empty all Arrays and restart the algorithm

  actualRooms = [];

  areas = [];
  rooms = [];
  paths = [];
  groups = [];

  cover = [];

  //Define possible areas for TSpawn,CTSpawn,BombSiteA,BombSiteB
  defineAreas();
  //Define definitive locations of TSpawn,CTSpawn,BombSiteA,BombSiteB
  defineSpawns();
  defineLongPaths();
  defineMid();

  //Generate Main Paths

  randomPath(rooms[1].vector,rooms[2].vector);
  randomPath(rooms[1].vector,rooms[3].vector);
  randomPath(rooms[0].vector,rooms[5].vector);
  randomPath(rooms[0].vector,rooms[4].vector);
  randomPath(rooms[4].vector,rooms[6].vector);
  randomPath(rooms[5].vector,rooms[7].vector);
  randomPath(rooms[7].vector,rooms[2].vector);
  randomPath(rooms[6].vector,rooms[3].vector);
  randomPath(rooms[6].vector,rooms[8].vector);
  randomPath(rooms[7].vector,rooms[8].vector);
  randomPath(rooms[0].vector,rooms[8].vector);
  randomPath(rooms[1].vector,rooms[8].vector);

  //random smaller Paths


  for(var i=0;i<randomPathAmountSlider.value();i++){
    randomPath(rooms[Math.floor(random(0,rooms.length-1))].vector,rooms[Math.floor(random(0,rooms.length-1))].vector);
  }

  //Group Points for room drawing

  for(var i=0;i<paths.length;i++){
    groupPoints(paths[i]);
  }

  //generate rectangles

  for(var i=0;i<groups.length;i++){
  minimalAreaRectangle(groups[i],5);
  }

  //generate cover
  coverGeneration();

}

function createInterface(){

  resetButton = createButton('Generate New Map');
  resetButton.position(20, 20);
  resetButton.mousePressed(reset);

  mapSizeSlider = createSlider(1,2000,800);
  mapSizeSlider.position(25,100);
  mapSizeSlider.style("width","100px");

  segmentlengthSlider = createSlider(1,60,30);
  segmentlengthSlider.position(25,150);
  segmentlengthSlider.style("width","100px");

  maxAngleSlider = createSlider(1,719,360);
  maxAngleSlider.position(25,200);
  maxAngleSlider.style("width","100px");

  noiseIncSlider = createSlider(1,49,5);
  noiseIncSlider.position(25,250);
  noiseIncSlider.style("width","100px");

  randomPathAmountSlider = createSlider(1,10,2);
  randomPathAmountSlider.position(25,300);
  randomPathAmountSlider.style("width","100px");

  roomSizeSlider = createSlider(3,25,8);
  roomSizeSlider.position(25,350);
  roomSizeSlider.style("width","100px");

  coverMaxSizeSlider = createSlider(15,120,60);
  coverMaxSizeSlider.position(25,400);
  coverMaxSizeSlider.style("width","100px");

  coverScarcitySlider = createSlider(0,200,100);
  coverScarcitySlider.position(25,450);
  coverScarcitySlider.style("width","100px");

  coverCombinationDistanceSlider = createSlider(0,200,50);
  coverCombinationDistanceSlider.position(25,500);
  coverCombinationDistanceSlider.style("width","100px");



}

function drawInterface(){

  let s;

  fill("white");
  stroke("white");
  text("Map Size", -width/2+25, -height/2+90)
  s = mapSizeSlider.value();
  text(s,-width/2+150,-height/2+115);

  text("Path Segment Length", -width/2+25, -height/2+140)
  s = segmentlengthSlider.value();
  text(s,-width/2+150,-height/2+165);

  text("Path Segment Max Angle", -width/2+25, -height/2+190)
  s = maxAngleSlider.value();
  text(s,-width/2+150,-height/2+215);

  text("Path Segment Noise Increase", -width/2+25, -height/2+240)
  s = noiseIncSlider.value();
  text(s,-width/2+150,-height/2+265);

  text("Amount of Smaller Paths", -width/2+25, -height/2+290)
  s = randomPathAmountSlider.value();
  text(s,-width/2+150,-height/2+315);

  text("Room Size", -width/2+25, -height/2+340)
  s = roomSizeSlider.value();
  text(s,-width/2+150,-height/2+365);

  text("Cover Max Size", -width/2+25, -height/2+390)
  s = coverMaxSizeSlider.value();
  text(s,-width/2+150,-height/2+415);

  text("Cover Scarcity", -width/2+25, -height/2+440)
  s = coverScarcitySlider.value();
  text(s,-width/2+150,-height/2+465);

  text("Cover Combination Distance", -width/2+25, -height/2+490)
  s = coverCombinationDistanceSlider.value();
  text(s,-width/2+150,-height/2+515);



}
