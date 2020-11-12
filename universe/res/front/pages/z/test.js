//import axios from 'axios';

function trylogin() {

const URL=''

	const un = document.getElementById("enterUsername").value;
	const pw = document.getElementById("enterPassword").value;

	const sendme={
	    packet:1,
		username:un,
		password:pw,
		end:0
	}
	document.getElementById("msgText").innerHTML = "Waiting for reply...";
$.ajax({
        url: URL,
        type: 'PUT',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: sendme,
        success: function(result) {
            // Do something with the result
            console.log(result)

            if (result == 'retry') {
                trylogin();
            }
            else if (result == 'loginsuccess') {
                document.getElementById("msgText").innerHTML = "Login succeeded.";
            }
            else if (result == 'logininvalid') {
                document.getElementById("msgText").innerHTML = "Invalid password.";
            }
            else if (result == 'loginsilly') {
                document.getElementById("msgText").innerHTML = "You really shouldn't be seeing this...";
            }
            else if (result == 'logindne') {
                document.getElementById("msgText").innerHTML = "No user with that username exists. Try <a href='register.html'>registering.</a>";
            }
            else {
                document.getElementById("msgText").innerHTML = "Bad response code from server. Could not log in.";
            }
        }
    });
}



var wsUri = "ws://kanetempleton.space:8080/ws"; //"wss://echo.websocket.org/"; or "ws://localhost:80/ws"
var output;

function init()
{
    testWebSocket();
}

function testWebSocket()
{
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
}

  function onOpen(evt)
  {
    document.getElementById("msgText").innerHTML = "CONNECTED";
    send("fetch:kane");
  }

  function onClose(evt)
  {
    document.getElementById("msgText").innerHTML = "DISCONNECTED";
  }

  function onMessage(evt)
  {
    console.log(evt.data);
    document.getElementById("msgText").innerHTML = document.getElementById("msgText").innerHTML+"<br/>received: "+evt.data+"";
    if (evt.data.startsWith("coords:")) {
        document.getElementById("coordinates").innerHTML = evt.data.split(":")[1];
    }
   // writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
    //websocket.close();
  }

  function onError(evt)
  {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
  }

  function send(message)
  {
    websocket.send("game::"+message);
    document.getElementById("msgText").innerHTML = document.getElementById("msgText").innerHTML+"<br/>sent: "+message+"";
  }

  var rightbutton = document.getElementById("rightButton");
  rightbutton.addEventListener ("click", function() {
      send("keypress:right")
  });
    var leftbutton = document.getElementById("leftButton");
    leftbutton.addEventListener ("click", function() {
        send("keypress:left")
    });
      var downbutton = document.getElementById("downButton");
      downbutton.addEventListener ("click", function() {
          send("keypress:down")
      });
        var upbutton = document.getElementById("upButton");
        upbutton.addEventListener ("click", function() {
            send("keypress:up")
        });



const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function canvasTesting() {
if (canvas.getContext) {
  // drawing code here
  draw();
} else {
  // canvas-unsupported code here
}
}


//fillStyle = rgb(r,g,b) or rgba(r,g,b,a)
//fillRect(posX,posY,wd,ht)
//strokeRect(posX,posY,wd,ht): outlined rect
//clearRect(x,y,w,h): make transparent

function draw() {
//drawPrettySquares();
drawSomeImage();
drawSomeText();
}

function drawOverlappingSquares() {
ctx.fillStyle = 'rgb(200, 0, 0)';
        ctx.fillRect(10, 10, 50, 50);

        ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
        ctx.fillRect(30, 30, 50, 50);
}

function drawTriangle() {
ctx.beginPath();
            ctx.moveTo(75, 50);
            ctx.lineTo(100, 75);
            ctx.lineTo(100, 25);
            ctx.fill();
}

function drawFace() {
ctx.beginPath();
    ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
    ctx.moveTo(110, 75);
    ctx.arc(75, 75, 35, 0, Math.PI, false);  // Mouth (clockwise)
    ctx.moveTo(65, 65);
    ctx.arc(60, 65, 5, 0, Math.PI * 2, true);  // Left eye
    ctx.moveTo(95, 65);
    ctx.arc(90, 65, 5, 0, Math.PI * 2, true);  // Right eye
    ctx.stroke();
}

function drawTrianglesWithLines() {
// Filled triangle
    ctx.beginPath();
    ctx.moveTo(25, 25);
    ctx.lineTo(105, 25);
    ctx.lineTo(25, 105);
    ctx.fill();

    // Stroked triangle
    ctx.beginPath();
    ctx.moveTo(125, 125);
    ctx.lineTo(125, 45);
    ctx.lineTo(45, 125);
    ctx.closePath();
    ctx.stroke();
}

function drawSavedShapes() {
var rectangle = new Path2D();
    rectangle.rect(10, 10, 50, 50);

    var circle = new Path2D();
    circle.moveTo(125, 35);
    circle.arc(100, 35, 25, 0, 2 * Math.PI);

    ctx.stroke(rectangle);
    ctx.fill(circle);
}

function drawPrettySquares() {
for (var i = 0; i < 6; i++) {
    for (var j = 0; j < 6; j++) {
      ctx.fillStyle = 'rgb(' + Math.floor(255 - 42.5 * i) + ', ' +
                       Math.floor(255 - 42.5 * j) + ', 0)';
      ctx.fillRect(j * 25, i * 25, 25, 25);
    }
  }
}

function drawPrettyOutlinedCircles() {
for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 6; j++) {
        ctx.strokeStyle = 'rgb(0, ' + Math.floor(255 - 42.5 * i) + ', ' +
                         Math.floor(255 - 42.5 * j) + ')';
        ctx.beginPath();
        ctx.arc(12.5 + j * 25, 12.5 + i * 25, 10, 0, Math.PI * 2, true);
        ctx.stroke();
      }
    }
}

function drawPrettyRectangularBars() {
// Draw background
  ctx.fillStyle = 'rgb(255, 221, 0)';
  ctx.fillRect(0, 0, 150, 37.5);
  ctx.fillStyle = 'rgb(102, 204, 0)';
  ctx.fillRect(0, 37.5, 150, 37.5);
  ctx.fillStyle = 'rgb(0, 153, 255)';
  ctx.fillRect(0, 75, 150, 37.5);
  ctx.fillStyle = 'rgb(255, 51, 0)';
  ctx.fillRect(0, 112.5, 150, 37.5);

  // Draw semi transparent rectangles
  for (var i = 0; i < 10; i++) {
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (i + 1) / 10 + ')';
    for (var j = 0; j < 4; j++) {
      ctx.fillRect(5 + i * 14, 5 + j * 37.5, 14, 27.5);
    }
  }
}


function drawLinesWithVaryingWidths() {
for (var i = 0; i < 10; i++) {
    ctx.lineWidth = 1 + i;
    ctx.beginPath();
    ctx.moveTo(5 + i * 14, 5);
    ctx.lineTo(5 + i * 14, 140);
    ctx.stroke();
  }
}

function drawGradients() {
// Create gradients
  var lingrad = ctx.createLinearGradient(0, 0, 0, 150);
  lingrad.addColorStop(0, '#00ABEB');
  lingrad.addColorStop(0.5, '#fff');
  lingrad.addColorStop(0.5, '#26C000');
  lingrad.addColorStop(1, '#fff');

  var lingrad2 = ctx.createLinearGradient(0, 50, 0, 95);
  lingrad2.addColorStop(0.5, '#000');
  lingrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');

  // assign gradients to fill and stroke styles
  ctx.fillStyle = lingrad;
  ctx.strokeStyle = lingrad2;

  // draw shapes
  ctx.fillRect(10, 10, 130, 130);
  ctx.strokeRect(50, 50, 50, 50);
}

function drawImagePattern() {
// create new image object to use as pattern
  var img = new Image();
  img.src = 'https://mdn.mozillademos.org/files/222/Canvas_createpattern.png';
  img.onload = function() {

    // create pattern
    var ptrn = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = ptrn;
    ctx.fillRect(0, 0, 150, 150);

  }
}

function drawSomeText() {
ctx.font = '48px serif';
  ctx.fillText('Hello world', 110, 150);
    ctx.strokeText('Hello world', 110, 200);
//    var text = ctx.measureText('foo'); // TextMetrics object
 //  console.log("text.width="+text.width); // 16;
}

//drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
// draw image at (sx,sy) with dimensions (sWidth,sHeight) onto canvas at (dx,dy) with dimensions (dWidth,dHeight)
function drawSomeImage() {
var img = new Image();   // Create new img element
img.addEventListener('load', function() {
  // execute drawImage statements here
  //ctx.drawImage(img, 10, 10);
  drawMap(img,spriteSheet(),mapData());
}, false);
img.src = '../../sprites/map/standardtiles.png'; // Set source path
}


function drawMap(img, ss, m) {
    var k=0;
    var f = 0;
    for (var i=0; i<15; i++) {
        for (var j=0; j<15; j++) {
            drawSprite(img,ss,nameForID(m[k]),j*40,i*40);
            k++;
        }
    }
}

function drawSprite(img, ss, name, x, y) {

    var p = spriteOffset(ss,name);
    console.log("drawSprite: "+x+","+y+" offset = "+p[0]+","+p[1]+"; ");
    ctx.drawImage(img,p[0]*64,p[1]*64,64,64,x,y,40,40);
}

function spriteOffset(ss,name) {
    var p = [0,0];
    for (var i=0; i<ss.length; i++) {
        if (ss[i]==name) {
            var b = parseInt(i/3);
            var c = parseInt(i%3)
            p = [b,c];
        }
    }
    return p;
}

function spriteSheet() {
    var s = ["grass","sand","dirt",
            "dark_grass","ocean_water","stream_water",
            "light_grass","swamp_water","planks"];
   return s;
}

function nameForID(x) {
    switch (x) {
        case 0:
            return "grass";
        case 1:
            return "sand";
        case 2:
            return "dirt";
        case 3:
            return "dark_grass";
        case 4:
            return "ocean_water";
        case 5:
            return "stream_water";
        case 6:
            return "light_grass";
        case 7:
            return "swamp_water";
        case 8:
            return "planks";
    }
    return "null";
}

function mapData() {
    var m = [   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    return m;
}


function drawLoginScreen() {
    var img = new Image();   // Create new img element
    img.addEventListener('load', function() {
      // execute drawImage statements here
      ctx.drawImage(img, 0, 0,720, 720, 0, 0, 600, 600);
     // drawMap(img,spriteSheet(),mapData());
    }, false);
    img.src = '../../sprites/backgrounds/04op.png'; // Set source path
}

canvas.addEventListener('mousedown', e => {
  x = e.offsetX;
  y = e.offsetY;
  console.log("clicked at "+x+","+y);
});

window.addEventListener("load", init, false);