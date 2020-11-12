export default class text {
    constructor(f,s,st,mn,x,y,tx) {
        this.font = f;
        this.color = st;
        this.size = s;
        this.canvasX = x;
        this.canvasY = y;
        this.menu = mn;
        this.txt = tx;
        this.visible = true;
    }

    draw(ctx) {
        if (this.visible) {
            var a = ctx.fillStyle;
            var b = ctx.font;
            ctx.fillStyle = this.color;
            ctx.font = this.size+'px '+this.font;
            ctx.fillText(this.txt,this.canvasX,this.canvasY);
            ctx.fillStyle = a;
            ctx.font = b;
        }
    }

    append(txt) {
        this.txt = this.txt + txt;
    }

    backspace() {
        var d = '';
        for (var i=0;i<this.txt.length-1;i++)
            d = d+this.txt.charAt(i);
        this.txt = d;
    }


}