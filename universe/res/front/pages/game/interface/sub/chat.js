
export default class chat {
    constructor(sp) {
        this.plr = null;
        this.playerLoaded = 0;
        this.activeMenu = 0;
        this.sprites = sp;

        //components
        this.buttons = [];
        this.text = [];
        this.numButtons=0;
        this.numTexts = 0;
        for (var i=0; i<100; i++) {
            this.buttons[i] = null;
        }
        for (var i=0; i<500; i++) {
            this.text[i]=null;
        }
        //this.buttons[0] = new button(0,'player',600,40,40,40,this);
        this.initButtons();
        this.initTexts();
    }

    initButtons() {
        this.addButton(1,'chat icon',600,40,40,40,true);
        this.addButton(2,'controls icon',640,40,40,40,true);
        this.addButton(3,'inventory icon',680,40,40,40,true);
        this.addButton(4,'equipment icon',720,40,40,40,true);
        this.addButton(5,'stats icon',760,40,40,40,true);
        this.addButton(6,'settings icon',800,40,40,40,true);
    }

    initTexts() {
        this.addText('Comic Sans MS','black',16,660,80,'Testing chat');

    }


    addButton(id,nom,x,y,w,h,vis) {
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


    draw(ctx) {
        this.drawTopPanel(ctx);
        this.drawMenuButtons(ctx);
        this.drawActiveSubmenu(ctx);
    }

    drawTopPanel(ctx) {
        if (this.playerLoaded==0)
            return;
        ctx.fillRect(520,0,860,600);
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
        switch (this.activeMenu) {
            case 1:
                break;
        }
    }

    switchToMenu(m) {
        switch (m) {
            case 1: //chat
                this.addText('Comic Sans MS','black',16,660,80,'Testing chat');
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
                          //  console.log('activemenu:'+this.activeMenu);

        }
        }
    }




}
