// Based on the code P_2_0_02.pde from
// Generative Gestaltung, ISBN: 978-3-87439-759-9

// Global var
var b = 255, p = false;
var mouseposX,mouseposY;
var buffer;
var startheight = 0;
var xresolution = 150;
var yresolution = 79;

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

  document.body.style.cursor = "none";
  p5.disableFriendlyErrors = true;

  buffer = createGraphics(width,height);
  writeBuffer();






}

function writeBuffer(){

  buffer.background(255);
  buffer.strokeWeight(0);
  buffer.stroke(0);

  for (var i=0, j=0; i<xresolution*2 || j<yresolution*2; i++, j++){
    var pointx = map(i,0,xresolution*2,0,width);

    buffer.point(pointx,startheight);

    for(var x=0; x<xresolution*2; x++){
      var pointy = map(x,0,yresolution*2,startheight,height);

      //mouse transformation
        buffer.point(pointx,pointy);



    }



}

}



function draw(){


  image(buffer,0,0);
  drawBulge(startheight,xresolution,yresolution);


}



function drawGrid(startheight,xresolution, yresolution){

  for (var i=0; i<xresolution; i++){
    var linex = map(i,0,xresolution,0,width);
    line(linex,startheight,linex,height);
}
  for (var j=0; j<yresolution; j++){
    var liney = map(j,0,yresolution,startheight,height);
    line(0,liney,width,liney);
  }



}

function drawPoints(startheight,xresolution, yresolution){

  for (var i=0, j=0; i<xresolution || j<yresolution; i++, j++){
    var pointx = map(i,0,xresolution,0,width);

    point(pointx,startheight);

    for(var x=0; x<xresolution; x++){
      var pointy = map(x,0,yresolution,startheight,height);

      //mouse transformation




        point(pointx,pointy);



    }



}

function normalizeVector(vector){

  var vectorx = vector.x;
  var vectory = vector.y;
  var norm = Math.sqrt(vectorx*vectorx+vectory*vectory);

  return createVector(vectorx/norm,vectory/norm);


}




}

function drawBulge(startheight,xresolution, yresolution){

  strokeWeight(2.5);

  translate(mouseX,mouseY);

  fill(255);
  stroke(255);
  ellipse(0,0,79);
  stroke(0);
  noFill();

  translate(-mouseX,-mouseY);


  for (var i=0, j=0; i<xresolution || j<yresolution; i++, j++){
    var pointx = map(i,0,xresolution,0,width);



    for(var x=0; x<xresolution; x++){
      var pointy = map(x,0,yresolution,startheight,height);

      //mouse transformation


      if(checkCollision(pointx,pointy)==1){

        var translatorx = pointx-mouseX;
        var translatory = pointy-mouseY;

        var translator = createVector(translatorx,translatory);
        var distance = translator.mag();

        var temp = map(distance,0,40,distance,40);

        translator = normalizeVector(translator);



        translator = translator.mult(temp);



        translatorx = translator.x;
        translatory = translator.y;



        point(mouseX+translatorx,mouseY+translatory);




      }
      else{
        //do nothing
      }




    }



}

function normalizeVector(vector){

  var vectorx = vector.x;
  var vectory = vector.y;
  var norm = Math.sqrt(vectorx*vectorx+vectory*vectory);

  return createVector(vectorx/norm,vectory/norm);


}




}

function checkCollision(colx,coly){

  mouseposX = mouseX;
  mouseposY = mouseY;

  var dx = colx - mouseposX;
  var dy = coly - mouseposY;
  var distance = dx*dx+dy*dy;

  if (distance < 40**2){
    return 1;
  }
  else{
    return 0;
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
