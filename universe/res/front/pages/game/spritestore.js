import sprite from './sprite.js'

export default class spritestore {
    constructor(ccttxx,maxsprites) {
        this.ctx = ccttxx;
        this.max_sprites = maxsprites;
        this.sprites = [];
        this.names = [];
        for (var i=0; i<maxsprites; i++) {
            this.sprites[i] = null;
            this.names[i] = 'null';
        }
        this.stored_sprites = 0;
    }

    initSprites() {
        this.createSprite('player','../../sprites/entity/player.png');
        this.createSprite('chat icon','../../sprites/interface/menu/chaticon.png');
        this.createSprite('controls icon','../../sprites/interface/menu/controlsicon.png');
        this.createSprite('inventory icon','../../sprites/interface/menu/inventoryicon.png');
        this.createSprite('equipment icon','../../sprites/interface/menu/equipmenticon.png');
        this.createSprite('stats icon','../../sprites/interface/menu/statsicon.png');
        this.createSprite('settings icon','../../sprites/interface/menu/settingsicon.png');
        this.createSprite('logout button','../../sprites/interface/logoutbutton.png');
    }


    createSprite(nom,imgsrc) {
        var sp = new sprite(nom,imgsrc,this);
        console.log('created sprite '+sp.name+' loaded: '+sp.loaded);
        this.addSprite(sp);
    }

    addSprite(s) {
        if (this.stored_sprites >= this.max_sprites) {
            console.log("can't hold any more sprites.");
            return;
        }
        if (this.getSprite(s.name)!=null) {
            console.log("sprite with this name has already been stored.");
            return;
        }
        this.sprites[this.stored_sprites] = s;
        this.stored_sprites++;
    }

    getSprite(sname) {
        for (var i=0; i<this.stored_sprites; i++) {
            if (this.sprites[i].name == sname)
                return this.sprites[i];
        }
        return null;
    }

    allSpritesLoaded() {
        for (var i=0; i<this.stored_sprites; i++) {
            if (this.sprites[i].loaded == false)
                return false;
        }
        return true;
    }


    drawSpriteAt(name,x,y) {
        var s = this.getSprite(name);
        s.draw(this.ctx,x,y);
    }

    drawScaledSpriteAt(name,x,y,newW,newH) {
        var s = this.getSprite(name);
        s.drawCustomDim(this.ctx,x,y,newW,newH);
    }

    spriteIsLoaded(sname) {
        var s = this.getSprite(sname);
        return s.loaded;
    }

    flagSpriteLoaded(sname) {
        var s = this.getSprite(sname);
        s.loaded = true;
        console.log('sprite flag for '+s.image.src+'.');
    }

}
