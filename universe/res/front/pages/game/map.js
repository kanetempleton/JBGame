/*
        drawMap():

*/


import button from './interface/button.js'
import text from './interface/text.js'
import submenu from './interface/submenu.js'

export default class gamemap {
    constructor(sp,cc,p) {
        this.sprites=sp;
        this.ctx = cc;
        this.plr=p;
        this.mapsheet = null;
        this.map = []; //main map container
        this.map1 = []; //map subsection 1 (nw)
        this.map2 = []; //map sub 2 (ne)
        this.map3 = []; //map sub 3 (sw)
        this.map4 = []; //map sub 4 (se)
        this.map1_section = 0; //section numbers
        this.map2_section = 0;
        this.map3_section = 0;
        this.map4_section = 0;
        this.MAP_REQUEST_DISTANCE = 15;
                this.MAP_SHIFT_DISTANCE = 15;
                this.CAMERA_BOX_SIZE = 15;
        this.cmap = [];
        for (var i=0;i<50;i++)
                this.cmap.push([]);
            var k=0;
            for (var i=0;i<50;i++) {
                for (var j=0; j<50; j++) {
                    this.map1[k]=1;
                    this.map2[k]=2;
                    this.map3[k]=3;
                    this.map4[k]=4;
                    k++;
                }
            }
            this.constructMap();
            //drawLoginScreen();
    }

    visibleTiles(x,y) {
        //var relX = x%100;
        //var relY = y%100;
        var relX = this.relativeCoords(x,y)[0];
        var relY = this.relativeCoords(x,y)[1];
        var tiles = [];
        var k=0;
        for (var i=0; i<15; i++) {
            for (var j=0; j<15; j++) {
                tiles[k]=this.tileAt(relX-7+j,relY-7+i);
                k++;
            }
        }
        return tiles;
    }

    paintgame() {
        this.paint();
        console.log("FILLER MESSAGE FOR PAINTGAME");
    }

    //constructMap():   Map1 + ... + Map4 --> Map
    //  combine data from 4 map subsections
    //  into single map array
    constructMap() {
        var k=0;
        var j=0;
        var ii=0;
        var jj=0;

        for (var i=0; i<10000; i++) {
            if (i<5000) {
                if (i%100 < 50)
                    this.map[i]=this.map1[j++];
                else
                    this.map[i]=this.map3[k++];
            } else {
                if (i%100<50)
                    this.map[i]=this.map2[ii++];
                else
                    this.map[i]=this.map4[jj++];
            }
        }
    }

    //fillMap(mapno, mapsection, mdat):
    //  mapno: [1,4] map subsection to fill
    //  mapsection: server map section id
    //  mdat: data to fill map with
    fillMap(mapno, mapsection, mdat) {
        switch (mapno) {
            case 1:
                for (var i=0; i<mdat.length; i++) {
                    this.map1[i]=mdat[i]
                    this.map1_section=mapsection;
                }
                break;
            case 2:
                for (var i=0; i<mdat.length; i++) {
                    this.map2[i]=mdat[i]
                    this.map2_section=mapsection;
                }
                break;
            case 3:
                for (var i=0; i<mdat.length; i++) {
                    this.map3[i]=mdat[i]
                    this.map3_section=mapsection;
                }
                break;
            case 4:
                for (var i=0; i<mdat.length; i++) {
                    this.map4[i]=mdat[i]
                    this.map4_section=mapsection;
                }
                break;
        }
        this.constructMap();
        this.paintgame();
    }


    //requestMap(mapno, mapx, mapy):
    //  mapno: [1,4] which subsection you are requesting data for
    //  mapx,y: coordinates within the map subsection you are requesting

    //  -> sends a request to server for map data of a certain section
     requestMap(mapno, mapx, mapy) {
        console.log("[!!!!!!!!!!!!!!!!!!!!!]request:map;"+mapno+";"+mapx+";"+mapy+";;"+this.plr.absX+","+this.plr.absY+"");
        var mc = this.mapcode(mapx,mapy);
        var flag = 0;
        switch (mapno) {
            case 1:
                if (this.map1_section!=mc) {
                    flag=1;
                }
                break;
            case 2:
                if (this.map2_section!=mc) {
                    flag=1;
                }
                break;
            case 3:
                if (this.map3_section!=mc) {
                    flag=1;
                }
                break;
            case 4:
                if (this.map4_section!=mc) {
                    flag=1;
                }
                break;
        }
        if (flag==1) {
            //sendGamePacket("request:map;"+mapno+";"+mapx+";"+mapy);
            // TODO: SEND GAME PACKETS??
            this.plr.connection.sendGamePacket("request:map;"+mapno+";"+mapx+";"+mapy);
        }
    }

    checkMaps(dx,dy) {
       // var relX = (this.plr.absX+relX_offset)%100;
       // var relY = (this.plr.absY+relY_offset)%100;
        var relX = this.relativeCoords(this.plr.absX,this.plr.absY)[0];
            var relY = this.relativeCoords(this.plr.absX,this.plr.absY)[1];

        if (dx==0 && dy==0)
            return;
        console.log("checking MAPS");
        var thisisalwayszero = 0; //modern problems require coronavirus
        if (thisisalwayszero==0) { //only moving in x-direction; left or right
            if (dx>0) { //moving right
                if (relX < 50 && relX >= (50-this.MAP_REQUEST_DISTANCE)) {
                   // requestMap(2*(parseInt(relY/50)+1),this.plr.absX+50,this.plr.absY); //load map 2 from 1 or 4 from 3.. or load both?
                   if (relY < 50) {
                        this.requestMap(2,parseInt(this.plr.absX)+50,parseInt(this.plr.absY));
                        this.requestMap(4,parseInt(this.plr.absX)+50,parseInt(this.plr.absY)+50);
                   } else {
                        this.requestMap(2,parseInt(this.plr.absX)+50,parseInt(this.plr.absY)-50);
                        this.requestMap(4,parseInt(this.plr.absX)+50,parseInt(this.plr.absY));
                   }
                }
                else if (relX >= (100-this.MAP_REQUEST_DISTANCE)) {
                    //shift map left
                    this.shiftMap('left');
                }
            } else if (dx<0) { //moving left
                if (relX >= 50 && relX < (50+this.MAP_REQUEST_DISTANCE)) {
                   // requestMap(2*parseInt(relY/50)+1,this.plr.absX-50,this.plr.absY); //load map 1 from 2 or 3 from 4 nah do both
                   if (relY < 50) {
                       this.requestMap(1,parseInt(this.plr.absX)-50,parseInt(this.plr.absY));
                       this.requestMap(3,parseInt(this.plr.absX)-50,parseInt(this.plr.absY)+50);
                   } else {
                       this.requestMap(1,parseInt(this.plr.absX)-50,parseInt(this.plr.absY)-50);
                       this.requestMap(3,parseInt(this.plr.absX)-50,parseInt(this.plr.absY));
                   }
                }
                else if (relX <= this.MAP_REQUEST_DISTANCE) {
                    //shift map right
                    this.shiftMap('right');
                }
            }
        }
        /*else*/ if (thisisalwayszero==0) { //only moving in y-direction; up or down
            if (dy>0) { //moving down
                if (relY < 50 && relY >= (50-this.MAP_REQUEST_DISTANCE)) {
                    //request bottom map(s)
                    if (relX < 50) {
                        this.requestMap(3,parseInt(this.plr.absX),parseInt(this.plr.absY)+50);
                        this.requestMap(4,parseInt(this.plr.absX)+50,parseInt(this.plr.absY)+50);
                    } else {
                        this.requestMap(3,parseInt(this.plr.absX)-50,parseInt(this.plr.absY)+50);
                        this.requestMap(4,parseInt(this.plr.absX),parseInt(this.plr.absY)+50);
                    }
                }
                else if (relY >= (100-this.MAP_REQUEST_DISTANCE)) {
                    //shift map up
                    this.shiftMap('up');
                }
            } else if (dy<0) { //moving up
                if (relY >= 50 && relY < (50+this.MAP_REQUEST_DISTANCE)) {
                    if (relX < 50) {
                        this.requestMap(1,parseInt(this.plr.absX),parseInt(this.plr.absY)-50);
                        this.requestMap(2,parseInt(this.plr.absX)+50,parseInt(this.plr.absY)-50);
                    } else {
                        this.requestMap(1,parseInt(this.plr.absX)-50,parseInt(this.plr.absY)-50);
                        this.requestMap(2,parseInt(this.plr.absX),parseInt(this.plr.absY)-50);
                    }
                }
                else if (relY < this.MAP_REQUEST_DISTANCE) {
                    this.shiftMap('down');
                }
            }
        }
    }


    shiftMap(dir) {
        /*var relX = (this.plr.absX+relX_offset)%100;
        var relY = (this.plr.absY+relY_offset)%100;*/
        var relX = this.relativeCoords(this.plr.absX,this.plr.absY)[0];
        var relY = this.relativeCoords(this.plr.absX,this.plr.absY)[1];

        if (dir == 'right') {
            if (relX>=50) {
                console.log("illegal right shift!");
                return;
            }
            this.fillMap(2,this.map1_section,this.map1);
            this.fillMap(4,this.map3_section,this.map3);
           // relX_offset = 50 - relX_offset;
            if (relY < 50) {
                this.requestMap(1,parseInt(this.plr.absX)-50,parseInt(this.plr.absY));
                this.requestMap(3,parseInt(this.plr.absX)-50,parseInt(this.plr.absY)+50);
            } else {
                this.requestMap(1,parseInt(this.plr.absX)-50,parseInt(this.plr.absY)-50);
                this.requestMap(3,parseInt(this.plr.absX)-50,parseInt(this.plr.absY));
            }
        }
        else if (dir == 'left') {
            if (relX<50) {
                console.log("illegal left shift!");
                return;
            }
            this.fillMap(1,this.map2_section,this.map2);
            this.fillMap(3,this.map4_section,this.map4);
         //   relX_offset = -50 - relX_offset; //i haz bad feels about this
            if (relY < 50) {
                this.requestMap(2,parseInt(this.plr.absX)+50,parseInt(this.plr.absY));
                this.requestMap(4,parseInt(this.plr.absX)+50,parseInt(this.plr.absY+50));
            } else {
                this.requestMap(2,parseInt(this.plr.absX)+50,parseInt(this.plr.absY)-50);
                this.requestMap(4,parseInt(this.plr.absX)+50,parseInt(this.plr.absY));
            }
        }
        else if (dir == 'down') {
            if (relY >= 50) {
                console.log("illegal down shift!");
                return;
            }
            this.fillMap(3,this.map1_section,this.map1);
            this.fillMap(4,this.map2_section,this.map2);
       //     relY_offset = 50 - relY_offset;
            if (relX < 50) { //maybe re-compute these relX/relY variables b4 checking? figure it out
                this.requestMap(1,parseInt(this.plr.absX),parseInt(this.plr.absY)-50);
                this.requestMap(2,parseInt(this.plr.absX)+50,parseInt(this.plr.absY)-50);
            } else {
                this.requestMap(1,parseInt(this.plr.absX)-50,parseInt(this.plr.absY)-50);
                this.requestMap(2,parseInt(this.plr.absX),parseInt(this.plr.absY)-50);
            }

        }
        else if (dir == 'up') {
            if (relY < 50) {
                console.log("illegal up shift!");
                return;
            }
            this.fillMap(1,this.map3_section,this.map3);
            this.fillMap(2,this.map4_section,this.map4);
       //     relY_offset = -50 - relY_offset;
            if (relX < 50) {
                this.requestMap(3,parseInt(this.plr.absX),parseInt(this.plr.absY)+50);
                this.requestMap(4,parseInt(this.plr.absX)+50,parseInt(this.plr.absY)+50);
            } else {
                this.requestMap(3,parseInt(this.plr.absX)-50,parseInt(this.plr.absY)+50);
                this.requestMap(4,parseInt(this.plr.absX),parseInt(this.plr.absY)+50);
            }
        }
        this.paintgame();
    }

    checkLoginMaps(rx,ry) {
        if (rx < this.MAP_REQUEST_DISTANCE) {
            this.shiftMap('right');
            console.log("loginrequestmapright");
        }
        if (ry < this.MAP_REQUEST_DISTANCE) {
            this.shiftMap('down');
            console.log("loginrequestmapdown");
        }
        if (rx >= 50-this.MAP_REQUEST_DISTANCE) {
            this.requestMap(2,parseInt(this.plr.absX)+50,parseInt(this.plr.absY));
            console.log("loginrequestmap2");
           // requestMap(3,parseInt(this.plr.absX)-50,parseInt(this.plr.absY)+50);
            //shiftMap('left');
        }
        if (ry >= 50-this.MAP_REQUEST_DISTANCE) {
              //  requestMap(2,parseInt(this.plr.absX)+50,parseInt(this.plr.absY));
                this.requestMap(3,parseInt(this.plr.absX),parseInt(this.plr.absY)+50);
                console.log("loginrequestmap3");
                //shiftMap('left');
        }
        if (ry >= 50-this.MAP_REQUEST_DISTANCE && rx >= 50-this.MAP_REQUEST_DISTANCE) {
                  //  requestMap(2,parseInt(this.plr.absX)+50,parseInt(this.plr.absY));
                  //requestMap(2,parseInt(this.plr.absX)+50,parseInt(this.plr.absY));
                    this.requestMap(4,parseInt(this.plr.absX)+50,parseInt(this.plr.absY)+50);
                    //shiftMap('left');
                    console.log("loginrequestmap4");
        }
    }


    //drawSpriteSimple:
    //  img: some image
    //  id: sprite id to draw
    //  x,y: relative coords??
    drawSpriteSimple(img, id, x, y) {
        if (img!=null)
            this.ctx.drawImage(img,parseInt(id%3)*64,parseInt(id/3)*64,64,64,x,y,40,40);
            else
            this.ctx.fillRect(x,y,40,40);
    }

    setMapSheet(img) {
        this.mapsheet = img;
    }

    drawMap() {
        var k=0;
        var f = 0;
        var img = this.mapsheet;

        for (var i=0; i<15; i++) {
            for (var j=0; j<15; j++) {
                //draw each visible tile
                this.drawSpriteSimple(img,this.visibleTiles(this.plr.absX,this.plr.absY)[k],j*40,i*40);
                k++;
            }
        }
    }



    paint() {
        this.drawMap();
    }

    //relativeCoords(absx,absy): abs position -> local map position
    relativeCoords(absx, absy) { //server coords [10000x10000] --> client coords [100x100]
        var s = this.sectionCoords(absx,absy);
       // console.log("section coords:"+s[0]+","+s[1]);
        var m = this.mapcode(absx,absy);
      //  console.log("mapcode: "+m);
        var n = this.sectionForMapCode(m);
        if (n==-1) {

        }
     //   console.log("section: "+n);
        var L = this.CAMERA_BOX_SIZE;
        if (n%2==0)
            s[0]=s[0]+50;
        if (n>2)
            s[1]=s[1]+50;
        return s;
    }



    mapcode(absx,absy) {
        var x_div50 = parseInt(absx/50);
        var y_div50 = parseInt(absy/50);
        return 100000000 + x_div50*10000 + y_div50;
    }

    sectionCoords(absx,absy) {
        var p = [0,0];
        p[0] = absx%50;
        p[1] = absy%50;
        return p;
    }

    sectionForMapCode(mapcode) {
        if (this.map1_section==mapcode)
            return 1;
        if (this.map2_section==mapcode)
            return 2;
        if (this.map3_section==mapcode)
            return 3;
        if (this.map4_section==mapcode)
            return 4;
        return -1;
    }



    mapcodeForSection(sectionNum) {
        switch (sectionNum) {
            case 1:
                return this.map1_section;
            case 2:
                return this.map2_section;
            case 3:
                return this.map3_section;
            case 4:
                return this.map4_section;
        }
        return -1;
    }


    //absoluteCoords(relx,rely): local map pos --> server map pos
    absoluteCoords(relx,rely) {
        var s = this.sectionForRelativeCoords(relx,rely);
        var mc = this.mapcodeForSection(s);
        var p = this.sectionStartPos(mc);
        p[0] = p[0] + relx%50;
        p[1] = p[1] + rely%50;
        return p;
    }


    //sectionStartPos(mcode):
    //  mcode: mapcode
    // --> returns coords of most NW tile in a map section
    sectionStartPos(mcode) {
        var a = parseInt(mcode/10000) - 10000;
        var b = mcode-100000000 - a*10000;
        var p = [a*50,b*50];
        return p;
        //100020016; a=2, b=16
        /* mcode/10000 = 10002 - 10000 = 2
         =>     a = parseInt(m/10000) - 10000       (100020016/10000-10000) = 2.0016
                b = m-100000000 - a*10000           100020016-100000000-(((100020016/10000-10000)-.0016))*10000  = 16
                */
    }

    //TODO: doc
    tileAt(cX, cY) {
        if (cX<0 || cY<0 || cX>=100 || cY>=100)
            return 8;
        if (100*cX+cY < 0 || 100*cX+cY >= 10000)
            return 8;
        return this.map[100*cX + cY];
    }



    //TODO: doc
    absoluteFromScreenCoords(scrX,scrY) {
        //btwn 0 and 14, your screen pos = (7,7)
        // (7,7) - scr(x,y)
       // var p = [this.plr.absX - scrX, this.plr.absY - scrY];
       var r = this.relativeCoords(this.plr.absX,this.plr.absY);
       //TODO
    }



    sectionForRelativeCoords(rX,rY) {
        if (rX<50 && rY<50)
            return 1;
        if (rx>=50&&rY<50)
            return 2;
        if (rx<50&&rY>=50)
            return 3;
        if (rx>=50&&rY>=50)
            return 4;
    }


}
