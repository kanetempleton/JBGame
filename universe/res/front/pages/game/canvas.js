import gamemap from './map.js'

export default class gamecanvas {
    constructor(sp,cc,p) {
    this.sprites=sp;
    this.ctx = cc;
    this.plr=p;
    this.loaded=1;
    this.map=new gamemap(sp,cc,p);

    this.width_tiles=15;
    this.height_tiles=15;

    this.onscreen_players = [];
    for (var i=0;i<this.width_tiles*this.height_tiles; i++) {
        this.onscreen_players[i]=0;
    }
      /*  this.plr = null;
        this.playerLoaded = 0;
        this.activeMenu = 0;
        this.sprites = sp;

        //components
        this.buttons = [];
        this.text = [];
        this.numButtons=0;
        this.numTexts = 0;
        this.listeningText=-1;
        this.menus = [];
        this.ctx = cc;
        for (var i=0; i<100; i++) {
            this.buttons[i] = null;
        }
        for (var i=0; i<500; i++) {
            this.text[i]=null;
        }
        for (var i=0; i<6; i++) {
            this.menus[i]=null;
        }
        this.menus[0] = new submenu(1,0,sp,this);

        //this.buttons[0] = new button(0,'player',600,40,40,40,this);
        this.initButtons();
        this.initTexts();*/

    }



    drawMap() {
        this.map.paint();
    }

    drawItems() {
    }
    drawNPCs() {
    }
    drawObjects() {
    }
    drawYourPlayer() {
        this.sprites.drawScaledSpriteAt('player',280,280,40,40);
    }
    drawOtherPlayers() {
    }

    drawPlayers() {
       // this.drawOtherPlayers();
        this.drawYourPlayer();
    }

    drawEntities() {
       // this.drawItems();
       // this.drawNPCs();
       // this.drawObjects();
        this.drawPlayers();
        //drawProjectiles();
    }



    drawGame() {
        this.drawMap();
        this.drawEntities();
    }

    drawUserInterface() {
        //draw the menus and shit here
    }

    paint() {
        if (this.loaded) {
        this.drawGame();
       // this.drawUserInterface();
       }
    }

   // initButtons() {
     //   this.addButton(1,'chat icon',600,40,40,40,true);
        /*this.addButton(2,'controls icon',640,40,40,40,true);
        this.addButton(3,'inventory icon',680,40,40,40,true);
        this.addButton(4,'equipment icon',720,40,40,40,true);
        this.addButton(5,'stats icon',760,40,40,40,true);
        this.addButton(6,'settings icon',800,40,40,40,true);*/
  //      this.addButton(7,'logout button',800,0,40,40,true);
 //   }

    initTexts() {
      //  this.addText('Comic Sans MS','black',16,660,80,'Testing chat');

    }


   /* addButton(id,nom,x,y,w,h,vis) {
        if (this.numButtons>=100)
            return;
        this.buttons[this.numButtons] = new button(id,nom,x,y,w,h,this);
        this.buttons[this.numButtons++].visible = vis;
    }

    addText(font,color,size,x,y,txt) {
        if (this.numTexts>=100)
            return;
        this.text[this.numTexts] = new text(font,size,color,this,x,y,txt);
    }


    draw() {
        this.drawTopPanel(this.ctx);
        this.drawMenuButtons(this.ctx);
        this.drawActiveSubmenu(this.ctx);
    }

    drawTopPanel(ctx) {
        if (this.playerLoaded==0)
            return;
        ctx.fillStyle = 'gray';
        ctx.fillRect(600,0,860,600);
        ctx.font = '13px Comic Sans MS';
        ctx.fillStyle = 'black';
        ctx.fontWeight = 400;
        ctx.fillText(this.plr.username+"",605,15); //8,670
        ctx.fillText("x: "+this.plr.absX,745,15); //63060 //530,16
        ctx.fillText("y: "+this.plr.absY,745,30); //530,32
    }

    drawMenuButtons(ctx) {
        ctx.strokeRect(600,40,40,40);
        ctx.strokeRect(640,40,40,40);
        ctx.strokeRect(680,40,40,40);
        ctx.strokeRect(720,40,40,40);
        ctx.strokeRect(760,40,40,40);
        ctx.strokeRect(800,40,40,40);

        if (this.activeMenu>0) {
            ctx.fillStyle = 'black';
            ctx.globalAlpha = 0.2;
            ctx.fillRect(560+(this.activeMenu)*40,40,40,40);
            ctx.globalAlpha = 1.0;
        }
        for (var i=0; i<this.numButtons; i++) {
            var b =this.buttons[i];
            if (b!=null)
                b.draw(ctx);
        }

    }


    drawActiveSubmenu(ctx) {
       // console.log('try draw for active '+this.activeMenu);
        switch (this.activeMenu) {
            case 1:
             //   console.log('draw chat menu plz');
                var chatmenu = this.menus[0];
                chatmenu.draw(ctx);
                break;
        }
    }

    switchToMenu(m) {
        switch (m) {
            case 1: //chat
               // this.addText('Comic Sans MS','black',16,660,80,'Testing chat');
                break;
        }
    }



    flagReady(p) {
        this.plr = p;
        this.playerLoaded=1;
    }

    getSprite(sname) {
        return this.sprites.getSprite(sname);
    }

    click(x,y) {
        for (var i=0;i<100;i++) {
            var b = this.buttons[i];
            if (b==null)
                break;
            if (b.click(x,y)!=null) {
            if (b.buttonID >= 1 && b.buttonID <= 6)
                            if (this.activeMenu==b.buttonID)
                                this.activeMenu = 0;
                            else
                                this.activeMenu = b.buttonID;
                         //   console.log('activemenu:'+this.activeMenu);

        }
        }
    }

    keyListen(e,k,c) {

        if (this.activeMenu==1) {
            this.menus[0].keyListen(e,k,c);
        }
        this.draw();
    }*/


}
