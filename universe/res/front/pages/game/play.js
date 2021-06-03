
//var wsUri = "ws://127.0.0.1:42069/ws";
//var wsUri = "ws://kanetempleton.space:42069/ws";

function trylogin() {

const URL=''

	const sendme={
	    packet:2,
		payload:'playgame',
		end:0
	}
	document.getElementById("msgText").innerHTML = "Waiting for reply...";
	
$.ajax({
        url: URL,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: sendme,
        success: function(result) {
            // Do something with the result
            console.log(result)

            if (result == 'retry') {
                trylogin();
            }
            else if (result == 'existingplayer') {
                document.getElementById("msgText").innerHTML = "Login succeeded.";
                testWebSocket();
                playbutton.innerHTML = "Exit Game";
            }
            else if (result == 'notloggedin') {
                document.getElementById("msgText").innerHTML = 'You are not logged in. Please <a href="../login/login.html">log in</a> to play the game.';
            }
            else {
                document.getElementById("msgText").innerHTML = "Bad response code from server. Could not log in.";
            }
        }
    });
}

function trylogout() {
    sendGamePacket("logoutgame");
    document.getElementById("msgText").innerHTML = "Waiting for server response...";
}
/*
var playbutton = document.getElementById("gameDoor");
playbutton.addEventListener ("click", function() {
    if (playbutton.innerHTML == "Exit Game") {
       // websocket.close();
        trylogout();
       // playbutton.innerHTML = "Enter Game";
    } else {
        trylogin();
    }
});*/

var output;
var state=0;


import menu from './menu.js'
import player from './player.js'
import gamecanvas from './canvas.js'

var sideMenu;
var yourPlayer;
var gamewindow;
var client;

function init2() {
    SpriteSheet = new spritestore(ctx,100);
    sideMenu = new menu(SpriteSheet,ctx);
}

function init()
{
    init2();
   /* for (var i=0;i<50;i++)
        cmap.push([]);
    var k=0;
    for (var i=0;i<50;i++) {
        for (var j=0; j<50; j++) {
            map1[k]=1;
            map2[k]=2;
            map3[k]=3;
            map4[k]=4;
            k++;
        }
    }*/
    //constructMap();
    drawLoginScreen();
    //testWebSocket();
}

var connected=0;
var relX_offset = 0;
var relY_offset = 0;
var posz = 0;
var otherx = [];
var othery = [];
var otherz = [];
var otherid = [];
var othername = [];
var otheri = 0;
var map = [];
var map1 = [];
var map2 = [];
var map3 = [];
var map4 = [];
var map1_section = 0;
var map2_section = 0;
var map3_section = 0;
var map4_section = 0;
var cmap = [];
var usrName = "";

var loginScreenDim = [600,600];
var tileSizePx = 40;
var gameTilesDim = [15,15];
var sidePanelWidth = 500;


var activeSideInterface = 0;


function clearEntityData() {
   /* otherx = [];
    othery = [];
    otherz = [];
    otherid = [];
    othername = [];
    otheri = 0;*/
    console.log("clearing data now");
    for (var i=0; i<otheri; i++) {
        otherx[i]=-1;
        othery[i]=-1;
        otherz[i]=-1;
        otherid[i]=-1;
        othername[i]=-1;
    }
    otheri=0;
}

var websocket;

function initiateConnection()
{
try {
    if (connected==0) {
        connected=1;
        websocket = new WebSocket(wsUri);
        websocket.onopen = function(evt) { onOpen(evt) };
        websocket.onclose = function(evt) { onClose(evt) };
        websocket.onmessage = function(evt) { onMessage(evt) };
        websocket.onerror = function(evt) { onError(evt) };
    }
    } catch (err) {
        console.log(err);
        console.log("CANNOT CONNECT");
    }
}
var opened = 0;

  function onOpen(evt)
  {
    //document.getElementById("msgText").innerHTML = "CONNECTED";
    opened = 1;
    sendGamePacket("join:"+usrAppend+"&"+passAppend);
    usrName=usrAppend;
    passAppend="";
    //drawLoginScreen();
    //canvasTesting();
    //send("fetch:kane");
  }

  function onClose(evt)
  {
   // document.getElementById("msgText").innerHTML = "DISCONNECTED";
    connected=0;
    waitingForReply=false;
    if (statusText == "Waiting for server response..." && opened==1)
        statusText = "You have been disconnected.";
    else if (statusText == "Waiting for server response..." && opened==0)
        statusText = "Error connecting to server.";
    opened=0;
    canvas.width=600;
    canvas.height=600;
    state=0;
    loginButtonStatus = "Play Game";
    drawLoginScreen();
  }

  function onMessage(evt)
  {
    waitingForReply=false;
    console.log(evt.data);
    //document.getElementById("msgText").innerHTML = document.getElementById("msgText").innerHTML+"<br/>received: "+evt.data+"";
    var payload = evt.data;
    if (state==0) { //login screen actions
        if (payload == "needregister") {
            statusText = "Register this account to play.";
            loginButtonStatus = "Play Game";
            waitingForReply=false;
            drawLoginScreen();
        }
        else if (payload == "invalidpw") {
            statusText = "Invalid password.";
            loginButtonStatus = "Play Game";
            waitingForReply=false;
            drawLoginScreen();
        }
        else if (payload.startsWith("hereyouare:")) { //BEGIN GAMEPLAY NOW
            waitingForReply=false;
            var posx = payload.split(":")[1].split(",")[0];
            var posy = payload.split(":")[1].split(",")[1];
            posz = payload.split(":")[1].split(",")[2];
            yourPlayer = new player(usrName,posx,posy,posz,websocket);
            sideMenu.flagReady(yourPlayer);
            gamewindow = new gamecanvas(SpriteSheet,ctx,yourPlayer);
            if (imgloaded[0])
                gamewindow.map.setMapSheet(cache_mapsheet);
            console.log("coords are "+yourPlayer.absX+","+yourPlayer.absY+","+posz);
            var relx = gamewindow.map.relativeCoords(posx,posy)[0];
            var rely = gamewindow.map.relativeCoords(posx,posy)[1];
            gamewindow.map.checkLoginMaps(relx,rely);

            state=1;
            canvas.width = 840; //740
            canvas.height = 600; //680
            ctx.clearRect(0, 0, 600, 600);
            //drawSomeImage();
            paintgame();
        }


    }
    else if (state==1) { //game screen actions
        if (payload == "pingfromserver") {
                sendPong("iamalive");
        }
        else if (payload.startsWith("fillmap:")) {
            waitingForReply=false;
            var msec = payload.split(":")[1].split(";")[0];
            var mcodefill = payload.split(":")[1].split(";")[1];
            var mdat = payload.split(";")[2].split(" ");
            var ccmap = [];
            console.log("attempting fillmap on: "+msec+":"+mcodefill);
            gamewindow.map.fillMap(parseInt(msec),mcodefill,mdat);
           /* for (var i=0; i<mdat.length; i++) {
                //console.log("mdat["+i+"]="+mdat[i]);
                ccmap[i%50]=mdat[i];
                if (i/50==0 && i>0)
                    cmap.push(ccmap);
                //cmap[i/50][i%50]=mdat[i];
                map1[i]=mdat[i];
            }*/
            gamewindow.map.constructMap();
            if (imgloaded[0]==1&&imgloaded[1]==1&&imgloaded[2]==1)
                paintgame();
                else
                drawSomeImage();


        }
        else if (payload.startsWith("updatepos:")) {
            var tposx = payload.split(":")[1].split(",")[0];
            var tposy = payload.split(":")[1].split(",")[1];
            var tposz = payload.split(":")[1].split(",")[2];
            var dx = tposx - yourPlayer.absX;
            var dy = tposy - yourPlayer.absY;
            var dz = tposz-posz;
            var xx = tposx;
            var yy = tposy;
            posz = tposz;
            yourPlayer.updatePos(xx,yy,posz);
            console.log("checkmaps("+dx+","+dy+")");
            gamewindow.map.checkMaps(dx,dy);
          //  drawSomeImage();
            paintgame();
        }
     //   hereisplayer:0:113,820,0
        else if (payload.startsWith("hereisplayer:")) {
           var plrid = payload.split(":")[1];
            var plrx = payload.split(":")[2].split(",")[0];


            var plry = payload.split(":")[2].split(",")[1];
            var plrz = payload.split(":")[2].split(",")[2];
           // console.log("logloglog"+plrid+","+plrx+","+plry+","+plrz);

            for (var i=0; i<otheri; i++) {
                if (otherid[i]==plrid) {
                    if (plrx==-2 || plry==-2 || plrz==-2) {
                        otherid[i]=-1;
                        otherx[i]=-1;
                        othery[i]=-1;
                        otherz[i]=-1;
                        othername[i]="";
                    }
                    otherx[i]=plrx;
                    othery[i]=plry;
                    otherz[i]=plrz;
                    paintgame();
                    return;
                }
            }
            otherid[otheri]=plrid;
            otherx[otheri]=plrx;
            othery[otheri]=plry;
            otherz[otheri]=plrz;
            otheri++;
            paintgame();
        }
    }
  }

  function onError(evt)
  {
   // writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
  }

  function send(message)
  {
    websocket.send(message);
    console.log("sent: <"+message+"> len: "+message.length);
    //document.getElementById("msgText").innerHTML = document.getElementById("msgText").innerHTML+"<br/>sent: "+message+"";
  }

  function sendPong(msg) {
    send("pong::"+msg);
  }

  function sendGamePacket(message) {
    send("game::"+message.length+"::"+message);
  }







//game stuff
//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


var imgloaded = [0,0,0,0]; //map, logoutbutton, player
var cache_logoutbutton;
var cache_mapsheet;
var cache_plrimg;
var cache_plr2img;


function drawCanvas() {
    gamewindow.paint();
}



function paintgame() {
    if (imgloaded[0]==1 && imgloaded[1]==1 && imgloaded[2]==1 && imgloaded[3]==1) {
        ctx.fillStyle = 'silver';

        //draw side menu bar
        sideMenu.draw(ctx);

        // draw the entire game canvas
        drawCanvas();

        //draw player
       // SpriteSheet.drawScaledSpriteAt('player',280,280,40,40);

        //draw your relative coordinates
       ctx.fillStyle = 'black';
       ctx.fontWeight = 400;
       var relXX = gamewindow.map.relativeCoords(yourPlayer.absX,yourPlayer.absY)[0];
       var relYY = gamewindow.map.relativeCoords(yourPlayer.absX,yourPlayer.absY)[1];
        ctx.fillText(relXX+","+relYY,650,10); //8,670*/

        //draw other players
              if (otheri>0) {
              for (var i=0; i<otheri; i++) {
                if (otherid[i]!=-1) {
                    var xdif = otherx[i]-yourPlayer.absX;
                    var ydif = othery[i]-yourPlayer.absY;
                    if (xdif < 7 && xdif > -7 && ydif < 7 && ydif > -7) {
                        ctx.drawImage(cache_plr2img,0,0,64,64,280+xdif*40,280+ydif*40,40,40);
                    }
                }
              }
              }

              /*ctx.font = '13px Comic Sans MS';
              ctx.fillStyle = 'black';
              ctx.fontWeight = 400;
              ctx.fillText(username+"",635,20); //8,670*/



    }
}

import spritestore from './spritestore.js'

var SpriteSheet;

function drawSomeImage() {

    SpriteSheet.initSprites();

    var mapimg = new Image();   // Create new img element
    var sidepanel = new Image();
    var chatbox = new Image();
     var logoutbutton = new Image();
   // var plr = new Image();
   imgloaded[2]=1;
    var plr2 = new Image();

    logoutbutton.addEventListener('load', function() {
        imgloaded[1]=1;
        cache_logoutbutton = logoutbutton;
        paintgame();
        },false);
      /*  plr.addEventListener('load', function() {
                imgloaded[2]=1;
                cache_plrimg=plr;
                paintgame();
                },false);*/
                plr2.addEventListener('load', function() {
                                imgloaded[3]=1;
                                cache_plr2img=plr2;
                                paintgame();
                                },false);

//                paintgame();
/*
      // execute drawImage statements here
      //drawMap(img,spriteSheet(),map);
      //ctx.drawImage(sidepanel,520,0);
      //ctx.drawImage(chatbox,0,520);
      ctx.fillStyle = 'silver';
      //ctx.fillRect(0,520,740,680);
      ctx.fillRect(520,0,740,600)
      //ctx.drawImage(plr,0,0,64,64,240,240,40,40);
      ctx.drawImage(logoutbutton,700,0);
      drawMap(mapimg,spriteSheet(),map);
      ctx.drawImage(plr,0,0,64,64,280,280,40,40);

      ctx.font = '13px Comic Sans MS';
      ctx.fillStyle = 'black';
      ctx.fontWeight = 400;
      ctx.fillText(username+"",635,20); //8,670

      ctx.fillText("x: "+yourPlayer.absX,630,60); //63060 //530,16
      ctx.fillText("y: "+yourPlayer.absY,630,76); //530,32
      ctx.fillText("z: "+posz,630,92);

    //  ctx.fillRect(0,650,740,1); //black line above chat
     // ctx.beginPath();
     // ctx.moveTo(0, 640);
     // ctx.lineTo(740, 640);
     // ctx.fill();*/
    //}, false);
    mapimg.addEventListener('load', function() {
                            imgloaded[0]=1;
                            cache_mapsheet=mapimg;
                            paintgame();
                            gamewindow.map.setMapSheet(mapimg);
                            },false);

    mapimg.src = '../../sprites/map/standardtiles.png'; // Set source path
    //sidepanel.src = '../../sprites/interface/menubar.png';
    //plr.src = '../../sprites/entity/player.png';
    plr2.src = '../../sprites/entity/player2.png';

    logoutbutton.src = '../../sprites/interface/logoutbutton.png';
    //chatbox.src = '../../sprites/interface/chatbox.png';


}

//ss arg never used
//m arg never used

function drawSprite(img, ss, name, x, y) {

    var p = spriteOffset(ss,name);
    //console.log("drawSprite: "+x+","+y+" offset = "+p[0]+","+p[1]+"; ");
    ctx.drawImage(img,p[0]*64,p[1]*64,64,64,x,y,40,40);
}

function drawSpriteSimple(img, id, x, y) {
    //console.log("drawSprite: "+x+","+y+" offset = "+p[0]+","+p[1]+"; ");
    ctx.drawImage(img,parseInt(id%3)*64,parseInt(id/3)*64,64,64,x,y,40,40);
}

function spriteOffset(ss,spriteID) {
    var p = [0,0];
    for (var i=0; i<ss.length; i++) {
        if (ss[i]==spriteID) {
            var b = parseInt(i/3);
            var c = parseInt(i%3);
            p = [b,c];
        }
    }
    return p;
}


var initLogin = 0;
function initLoginScreen() {
        initLogin=1;
        var img = new Image();   // Create new img element
            var img2 = new Image();
            var img3 = new Image();
            img.addEventListener('load', function() {
                loadLogins(img,0);
            }, false);
            img2.addEventListener('load', function() {
               loadLogins(img2,1);
            }, false);
            img3.addEventListener('load', function() {
                loadLogins(img3,2);
            }, false);


            img.src = "../../sprites/interface/loginbox.png"


            img2.src = "../../sprites/interface/button_blue.png"
            img3.src = '../../sprites/backgrounds/04op.png'; // Set source path
}


function drawLoginScreen() {
    if (state==1) {
        state=0;
        clearEntityData();
        canvas.width=600;
        canvas.height=600;
    }
    if (initLogin==0)
        initLoginScreen();
    else
        paintLogScreen();

}

var logbox = 0;
var butn = 0;
var backg = 0;

var cache_loginBox;
var cache_loginButton;
var cache_background;

function loadLogins(imgz, code) {


    if (code==0) {
        cache_loginBox=imgz;
        logbox=1;
    }
    else if (code==1) {
        cache_loginButton=imgz;
        butn=1;
    }
    else if (code==2) {
        cache_background=imgz;
        backg=1;
    }
    if (logbox==1 && butn==1 && backg==1) {
            paintLogScreen();
    }
}

function paintLogScreen() {

// execute drawImage statements here

      //ctx.drawImage(img3,175,200);
      //ctx.drawImage(img2, 150,175);
      ctx.drawImage(cache_background, 0, 0,720, 720, 0, 0, 600, 600);
      ctx.drawImage(cache_loginBox, 170,130);
      if (!waitingForReply)
        ctx.drawImage(cache_loginButton,0,0,120,60,loginButtonDim[0],loginButtonDim[1],loginButtonDim[2],loginButtonDim[3]);

        ctx.font = '13px Noteworthy';
        ctx.fillStyle = 'yellow';
        ctx.fontWeight = 400;
        ctx.fillText(statusText,245,215);
//ctx.strokeText('Planet $wag', 200, 95);
      //ctx.drawImage(img3,330,250);
      ctx.font = '48px serif';
      ctx.strokeStyle = 'white';
      ctx.strokeText('<title>', 245, 75);
      ctx.font = '14px Comic Sans MS';
      ctx.fillStyle = 'lime';
      ctx.fillText(loginButtonStatus, loginButtonDim[0]+loginButtonDim[2]/3-9, loginButtonDim[1]+loginButtonDim[3]/2+5);
      ctx.font = '14px Andale Mono';
      ctx.fillStyle = 'blue';
      if (inputField==0) {
        ctx.fillText('Username: '+usrAppend+'_', 180, 160);
        ctx.fillText('Password: '+passStars+'', 180, 180);
      } else {
        ctx.fillText('Username: '+usrAppend+'', 180, 160);
        ctx.fillText('Password: '+passStars+'_', 180, 180);
      }
      ctx.font = '11px Courier New';
      ctx.fontWeight='bold';
            ctx.fillStyle = 'white';
            ctx.fillText('* switch text fields with \'enter\' or \'tab\'', 175, 300);
          //  ctx.fillText('between username/password fields', 180, 300);
     // drawMap(img,spriteSheet(),mapData());
}


canvas.addEventListener('mousedown', e => {
  var x = e.offsetX;
  var y = e.offsetY;
  console.log("clicked at "+x+","+y);
   if (state==0) { //login state
        if (inBounds(x,y,loginButtonDim[0],loginButtonDim[1],loginButtonDim[2],loginButtonDim[3])) {
            submitLogin();
        }
    } else { //game state
        if (inBounds(x,y,logoutButtonDim[0],logoutButtonDim[1],logoutButtonDim[2],logoutButtonDim[3])) {
            submitLogout();
        }
        sideMenu.click(x,y);

        paintgame();
    }
});

window.addEventListener( "keyup", e => {
    var k = e.keyCode;
 //   console.log("outttttttt:"+k);
    if (state==1) {
        if (k>=37 && k<=40) { //arrow keys
            if (k==37)
                sendGamePacket("keyup:left");
            if (k==38)
                sendGamePacket("keyup:up");
            if (k==39)
                sendGamePacket("keyup:right");
            if (k==40)
                sendGamePacket("keyup:down");
        }
    }
});

window.addEventListener( "keydown", e => {
    var k = e.keyCode;
    var c = String.fromCharCode(k).toLowerCase();
   // console.log("key pressed: "+e.keyCode+" "+c);

    if (k>=37 && k<=40) { //arrow keys
        e.preventDefault();
        if (state==1) {
            if (k==37)
                sendGamePacket("key:left");
            if (k==38)
                sendGamePacket("key:up");
            if (k==39)
                sendGamePacket("key:right");
            if (k==40)
                sendGamePacket("key:down");
        }
    }

    if (state==1) {
        //game key stuff
        sideMenu.keyListen(e,k,c);
        return;
    }

    if (k==13) { //enter
        if (inputField==0) {
            inputField=1;
        } else {
            inputField = 0;
        }
        drawLoginScreen();
    }
    else if (k==8) { //delete
        if (inputField==0) {
            if (usrAppend.length==0)
                return;
            usrAppend = usrAppend.substring(0,usrAppend.length-1);
          //  console.log("user="+usrAppend);
        } else {
            if (passAppend.length==0)
                return;
            passAppend = passAppend.substring(0,passAppend.length-1);
            passStars = passStars.substring(0,passStars.length-1);
        }
        drawLoginScreen();
    }
    else if (k==9 && e.target == document.body) { //tab
        e.preventDefault();
        if (inputField==0) {
            inputField=1;
        } else {
            inputField = 0;
        }
        drawLoginScreen();
    }
    else if (k==32 && e.target == document.body) { //space
        e.preventDefault();
        appendChar(c);
        drawLoginScreen();
    }
    else if ((k>40 && k<=57)||(k>=65&&k<=90)) { //enter text
        appendChar(c);
        drawLoginScreen();
    }

}, true);

var usrAppend = "";
var passAppend = "";
var passStars = "";
var inputField = 0;
var loginButtonDim = [245,230,140,50];
var logoutButtonDim = [800,0,840,40];
var loginButtonStatus = "Play Game"
var waitingForReply = false;
var statusText = "";

//keyboard input functions
function appendChar(c) {
    if (waitingForReply)
        return;
    if (state==0) {
        if (inputField==0) {
            if (usrAppend.length>=14)
                return;
            usrAppend+=c;
        } else {
            if (passAppend.length>=20)
                return;
            passAppend+=c;
            passStars+='*';
        }
    }
}

function inBounds(x,y,xOf,yOf,w,h) {
    return (x>=xOf && y>=yOf && x<= xOf+w && y<= yOf+h);
}


function submitLogin() {
    if (!waitingForReply) {
        if (passAppend==""||usrAppend=="") {
            statusText = "Enter a username and password."
            drawLoginScreen();
            return;
        }
        waitingForReply=true;
        statusText = "Waiting for server response...";
        loginButtonStatus = "";
        initiateConnection();
        //passAppend = "";
        passStars = "";
        drawLoginScreen();
        setTimeout(function(){
            if (waitingForReply) {
                console.log("give up");
                loginButtonStatus = "Play Game"
                statusText = "Connection Timeout; no reply";
                sendGamePacket("logoutgame");
                waitingForReply=false;
                drawLoginScreen();
            }
        }, 10000);
    }
}

function submitLogout() {
    sendGamePacket("logoutgame");
    waitingForReply=false;
    statusText = "";
    loginButtonStatus = "Play Game";
    drawLoginScreen();
}

//111,801 = 11,1    11-6+j, 1-6+i
/*function tileAt(cX, cY) {
    if (cX<0 || cY<0 || cX>=50 || cY>=50)
        return 8;
    if (50*cX+cY < 0 || 50*cX+cY >= 2500)
        return 8;
    return map[50*cX + cY];
}*/
//tileAt(25,3): map[2500+3] = map[2503]

window.addEventListener("load", init, false);
