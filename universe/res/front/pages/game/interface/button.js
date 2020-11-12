export default class button {
    constructor(id,sprNm,x,y,w,h,mn) {
        this.buttonID = id;
        this.spriteName = sprNm;
        this.canvasX = x;
        this.canvasY = y;
        this.width = w;
        this.height = h;
        this.menu = mn;
        this.visible = true;
    }

    draw(ctx) {
        if (this.visible && this.spriteName!=null && this.spriteName!='null') {
            var s = this.menu.sprites.getSprite(this.spriteName);
            s.drawCustomDim(ctx,this.canvasX,this.canvasY,this.width,this.height);
        }
    }

    click(x,y) {
        if (x>=this.canvasX && y>=this.canvasY && x<=this.canvasX+this.width && y<=this.canvasY+this.height) {
            if (this.visible) {
                console.log('clicked button '+this.buttonID);
                return this;
            }
        }
        return null;
    }
}