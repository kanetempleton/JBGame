export default class sprite {
    constructor(n,imgpath,storage) {
        this.name = n;
        this.loaded = false;
        this.image_src=imgpath;
        this.image = new Image();
        this.image.addEventListener('load',function() {
            storage.flagSpriteLoaded(n);
            console.log('sprite '+this.src+' loaded.');
        },false);
        this.image.addEventListener('error',function() {

                    console.log('sprite '+this.src+' error.');
                },false);
        this.image.src = this.image_src;
        this.image.onerror = function() {
            console.log("TITTIES!");
        };
    }

    draw(ctx,x,y) {
        if (this.loaded) {
            ctx.drawImage(this.image,x,y);
           // console.log('sprite '+this.name+' is trying to draw at ('+x+','+y+')');
        }
    }

    drawCustomDim(ctx,x,y,w,h) {
        if (this.loaded) {
            ctx.drawImage(this.image,0,0,this.image.width,this.image.height,x,y,w,h);
          //  console.log('sprite '+this.name+' is trying to draw at ('+x+','+y+')');
        }
    }

    load(x) {
        console.log('sprite '+this.name+' successfully loaded.');
        this.loaded=true;
    }
}
