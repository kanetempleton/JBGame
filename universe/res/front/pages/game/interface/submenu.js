
import text from './text.js'


export default class submenu {
    constructor(id,sp,ct,mn) {
        this.menuID = id;
        this.menu = mn;
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
        //this.initButtons();
        //this.initTexts();
        this.init();
    }

    init() {
        this.initButtons();
        this.initTexts();
    }

    initButtons() {
       /* this.addButton(1,'chat icon',600,40,40,40,true);
        this.addButton(2,'controls icon',640,40,40,40,true);
        this.addButton(3,'inventory icon',680,40,40,40,true);
        this.addButton(4,'equipment icon',720,40,40,40,true);
        this.addButton(5,'stats icon',760,40,40,40,true);
        this.addButton(6,'settings icon',800,40,40,40,true);*/
    }

    initTexts() {
        this.addText(0,'Comic Sans MS','cyan',16,610,100,'Chat Interface [in progress]',true);
        this.addText(1,'Comic Sans MS','green',12,615,125,'',true);
        this.addText(2,'Comic Sans MS','white',16,615,130,'Hidden text',false);
        this.addText(3,'Papyrus','yellow',20,615,130,'Type to chat:',true);
        this.addText(4,'Comic Sans MS','black',16,615,160,'',true);
    }


    addButton(id,nom,x,y,w,h,vis) {
        if (this.numButtons>=100)
            return;
        this.buttons[this.numButtons] = new button(id,nom,x,y,w,h,this);
        this.buttons[this.numButtons++].visible = vis;
    }

    addText(txtid,font,color,size,x,y,txt,vis) {
        if (txtid>=100||txtid<0)
            return;
        this.text[txtid] = new text(font,size,color,this,x,y,txt);
        this.text[txtid].visible=vis;
        this.numTexts++;
    }

    getTextString(txtid) {
        if (txtid>=100||txtid<0)
                    return;
        var t = this.text[txtid];
        return t.txt;
    }

    showText(txtid) {
        if (txtid>=100||txtid<0)
                    return;
        this.text[txtid].visible=true;
    }
    hideText(txtid) {
        if (txtid>=100||txtid<0)
                    return;
        this.text[txtid].visible=false;
    }


    draw(ctx) {
     //   console.log('drawing submenu '+this.numTexts);
        for (var i=0; i<this.numTexts; i++) {
            var t = this.text[i];
            if (t==null)
                break;
         //   console.log('t txt '+t.txt+' at '+t.canvasX+','+t.canvasY);
            t.draw(ctx);
        }

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


    appendChatText(ch) {
        this.text[4].append(ch);
        this.menu.draw();
    }

    delChatText() {
        this.text[4].backspace();
       /* var b = '';
        for (var i=0; i<this.text[4].txt.length-1;i++)
            b = b+this.text[4].txt.charAt(i);
        this.text[4].txt=b;*/
        this.menu.draw();
    }

    keyListen(e,k,c) {
        //console.log('listn:'+k);
            if (k==13) { //enter
                    e.preventDefault();
                    console.log('enter'+this.text[4]);
                }
                else if (k==8) { //delete
                    e.preventDefault();
                    this.delChatText();
                }
                else if (k==9 && e.target == document.body) { //tab
                    e.preventDefault();
                }
                else if (k==32 || (k>40 && k<=57)||(k>=65&&k<=90)) { //enter text
                    e.preventDefault();
                    this.appendChatText(c);
                }
        }

}
