//ConvexHull.js

var ctx = null;
var theCanvas = null;
window.addEventListener("load", initApp);
var LINES = 20;
var lineInterval = 0;
var gridColor = "lightblue";
var allPoints = [];
var RADIUS = 2;
var pointString = "";
var convexHull = [];
var bruteforceHullPoints = [];
var output = document.getElementById("output");
function Point(x,y) {
  this.x = x;
  this.y = y;
}
function initApp() {
  theCanvas = document.getElementById("gamescreen");
	ctx = theCanvas.getContext("2d");

	ctx.canvas.height  = 650;
	ctx.canvas.width = ctx.canvas.height;
  ctx.strokeStyle = "#000000";

	window.addEventListener("mousedown", mouseDownHandler);
	initBoard();
}
function initBoard() {
  lineInterval = Math.floor(ctx.canvas.width / LINES);
	console.log(lineInterval);
	draw();
}

function draw() {
	ctx.globalAlpha = 1;
	// fill the canvas background with white
	ctx.fillStyle="white";
	ctx.fillRect(0,0,ctx.canvas.height,ctx.canvas.width);

	// draw the blue grid background
	for (var lineCount=0;lineCount<LINES;lineCount++)
	{
		ctx.fillStyle=gridColor;
		ctx.fillRect(0,lineInterval*(lineCount+1),ctx.canvas.width,2);
		ctx.fillRect(lineInterval*(lineCount+1),0,2,ctx.canvas.width);
	}
}

function getMousePos(evt) {
  var rect = theCanvas.getBoundingClientRect();
  var currentPoint = {};
  currentPoint.x = evt.clientX - rect.left;
  currentPoint.y = evt.clientY - rect.top;
  return currentPoint;
}


function mouseDownHandler(event) {
  if (event.button == 0) {
    var currentPoint = getMousePos(event);
    if ((currentPoint.x > 650) || (currentPoint.y > 650)) {
      return;
    }
    drawPoint(currentPoint);
    console.log(currentPoint);
  }
}


function drawPoint(currentPoint) {

  ctx.beginPath();
  ctx.arc(currentPoint.x, currentPoint.y, RADIUS, 0, 2*Math.PI);
  allPoints.push(currentPoint);
  ctx.stroke();
}

function clearPoints() {
  $('#output').html("Cleared.");
  $('#content_area').html("");
  $('#inputFile').html("");
  $('#split').html("");
  $('#convexHull').html("");
  $('#timerBf').html("");
  $('#timerQuick').html("");
  $('#bruteForce').html("");
  $('#quickHull').html("");
  allPoints = [];
  bruteforceHullPoints = [];
  convexHull = [];
  ctx.strokeStyle = "#000000";

  draw();
}

function drawLine(p, p2){
  ctx.strokeStyle = "#FF0000";
	ctx.beginPath();
	ctx.moveTo(p.x,p.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.stroke();
}

var quickhull = [];
function drawLines(set) {
  for (var i = 0; i < set.length-1;i++) {
    for (var j = i+1; j < set.length; j++) {
      if (checkLine(set[i], set[j])) {
        if (arraySearch(quickhull, set[j])==false) {
          quickhull.push(set[j]);
        }
        if (arraySearch(quickhull, set[i]) == false) {
          quickhull.push(set[i]);
        }
        ctx.strokeStyle = "FF0000";
        drawLine(set[i], set[j]);
        drawPoint(set[i]);
        drawPoint(set[j]);
      }

    }
  }

}
function loadFile(element) {
  var path = document.getElementById("inputFile").value
  var fileName = path.match(/[^\/\\]+$/);
  jQuery.get(fileName, function(data) {
    pointString = data.replace('n', ' ');

    loadPoints();
  });
}

function loadPoints() {
  var i = 0;
  var j = 0;
  var tempString = "";
  var point = {};
  var x = 0;
  var y = 0;
  while(i < pointString.length-1) {
    if (pointString.charAt(i) == "(") {
      j = i+1;
      while (pointString.charAt(j)!= ")") {
        if (pointString.charAt(j) == ",") {
          x = parseInt(tempString);
          tempString = "";
        }
        else {
        tempString = tempString + pointString.charAt(j);
        }
        j++;
      }
      y = parseInt(tempString);
      point = new Point(x,y);
      drawPoint(point);
      console.log(point.x.toString + " " + point.y.toString());
      point = {};
      tempString = "";
      i = j;
    }
    i++;
  }
  stringC = allPoints.length.toString();
  $('#output').html(stringC);
}
function arraySearch(set, item) {
  for (var i = 0; i < set.length; i++) {
    if (set[i].x == item.x && set[i].y == item.y)
      return true;
  }
  return false;
}
function bruteForce() {
  var start = performance.now();
  if (allPoints === null || allPoints.length < 3) {
    console.log("Not Enough Points.");
    return;
  }
  bruteforceHullPoints = [];
  for(var i = 0; i < allPoints.length-1; i++) {
    for (var j = i+1; j < allPoints.length; j++) {
      if (checkLine(allPoints[i], allPoints[j])) {
        if (arraySearch(bruteforceHullPoints, allPoints[j])==false) {
          bruteforceHullPoints.push(allPoints[j]);
        }
        if (arraySearch(bruteforceHullPoints, allPoints[i]) == false) {
          bruteforceHullPoints.push(allPoints[i]);
        }
        drawLine(allPoints[i], allPoints[j]);
      }
    }
  }
  // drawLines(bruteforceHullPoints);
  var execution = performance.now();
  $('#bruteForce').html(printSet(bruteforceHullPoints));
  $('#timerBf').html("The Brute Force Algorithm took  " + (execution-start) + " milliseconds.");
}
function bruteForceCalculation(a,b,c,point) {
  if(point.x*a + point.y*b - c > 0){
    return 1;
  }
  if(point.x*a + point.y*b - c < 0){
    return -1;
  }
  return 0;
}
function checkLine(point1,point2) {
  var a = point2.y - point1.y;
  var b = point1.x - point2.x;
  var c = (point1.x * point2.y) - (point1.y * point2.x);
  var count = 0;
  var side = 0;
  for (var k = 0; k < allPoints.length;k++) {
    if (allPoints[k] != point1 && allPoints[k]!= point2) {
      if (count == 0) {
        side = bruteForceCalculation(a,b,c,allPoints[k]);
        if (side !=0)
          count++;
      }

      else if (side == -1 && bruteForceCalculation(a,b,c,allPoints[k]) == 1){
        return false;
      }
      else if (side == 1 && bruteForceCalculation(a,b,c,allPoints[k]) == -1) {
        return false;
      }
    }
  }
  return true;
}

function getLeft() {
  var temp = allPoints[0];
  for (var i = 1; i < allPoints.length-1;i++) {
    if (allPoints[i].x <= temp.x) {
      temp = allPoints[i];
    }
  }
  return temp;
}
function getRight() {
  var temp = allPoints[0];
  for (var i = 1; i < allPoints.length-1;i++) {
    if (allPoints[i].x >= temp.x) {
      temp = allPoints[i];
    }
  }
  return temp;
}

function printSet(set) {
  var temp = "";
  for (var i = 0; i < set.length;i++) {
    temp = temp + "(" + set[i].x.toString() + " " + set[i].y.toString() + "), ";
  }
  return temp;
}
function quickHull() {
  var start = performance.now();
  var leftMost = getLeft();
  var rightMost = getRight();
  var setAbove = [];
  var setBelow = [];
  var a = rightMost.y - leftMost.y;
  var b = leftMost.x - rightMost.x;
  var c = (leftMost.x * rightMost.y) - (leftMost.y * rightMost.x);
  for (var i = 0; i < allPoints.length;i++) {
    if (allPoints[i] == leftMost || allPoints[i] == rightMost) {
      convexHull.push(allPoints[i]);
    }
    else {
      if (bruteForceCalculation(a,b,c,allPoints[i]) == 1) {
        setAbove.push(allPoints[i]);
      }
      else if (bruteForceCalculation(a,b,c,allPoints[i]) == -1){
        setBelow.push(allPoints[i]);
      }
    }
  }

  //Begin recursing through the set
  convexHull.push(leftMost);
  convexHull.push(rightMost);

  findHull(setAbove, leftMost, rightMost);
  findHull(setBelow, rightMost, leftMost);

  drawLines(convexHull);
  $('#quickHull').html(printSet(quickhull));
  var execution = performance.now();
  $('#timerQuick').html("The Quick Hull Algorithm took: " + (execution-start) + " milliseconds.");
}

function findHull(set, p, q) {
  var s0 = [];
  var s1 = [];
  var s2 = [];
  //base case
  if (set.length == 0) {
    return;
  }
  if ( set.length == 1) {
    convexHull.push(set[0]);
    return;
  }
  var c = findFarthestPoint(set, p, q);
  convexHull.push(c);

  for (var i = 0; i < set.length;i++) {
      if (set[i] == c || set[i] == p || set[i] == q) {
      }
      else if (checkTriangle(p,c,q,set[i])){
        s0.push(set[i]);
      } else if (rightOfLine(p,c,set[i])) {
        s1.push(set[i]);
      } else if (rightOfLine(c,q,set[i])) {
        s2.push(set[i]);
      }
    }
  findHull(s1, p, c);
  findHull(s2, c, q);



}
function findFarthestPoint(set, p, q) {
  var maxDistance = 0;
  var maxPoint = p;
  for (var i = 0; i < set.length; i++) {
    var temp = distToLine(set[i], p, q);
    if (temp >= maxDistance) {
      maxDistance = temp;
      maxPoint = set[i];
    }
  }
  return maxPoint;
}
function rightOfLine(point1, point2, test) {
  var a = point2.y - point1.y;
  var b = point1.x - point2.x;
  var c = (point1.x * point2.y) - (point1.y * point2.x);
  return bruteForceCalculation(a,b,c,test);
}
function distToLine(check, p, q) {
  var ydif = q.y - p.y;
  var xdif = q.x - p.x;
  var denominator = Math.sqrt(ydif*ydif + xdif*xdif);
  var numerator = Math.abs(ydif*check.x - xdif*check.y + q.x*p.y - q.y*p.x);
  var distance = numerator/denominator;
  return distance;
}
function checkTriangle(a,b,c,p) {
  var actual = areaOfTriangle(a,b,c);
  var a1 = areaOfTriangle(a,b,p);
  var a2 = areaOfTriangle(a,p,c);
  var a3 = areaOfTriangle(p,b,c);
  return (actual == a1 + a2 + a3);
}
function areaOfTriangle(a,b,c) {
  return Math.abs((a.x*(b.y-c.y) + b.x*(c.y-a.y)+ c.x*(a.y-b.y))/2);
}
