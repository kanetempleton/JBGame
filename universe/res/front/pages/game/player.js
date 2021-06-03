import client from './client.js'

export default class player {
    constructor(name,x,y,z,ws) {
        this.username = name;
        this.absX = x;
        this.absY = y;
        this.absZ = z;
        this.connection = new client(ws);
    }

    updatePos(x,y,z) {
        this.absX = x;
        this.absY = y;
        this.absZ = z;
    }

    setX(x) {this.absX=x;}
    setY(y) {this.absY=y;}
    setZ(z) {this.absZ=z;}
    getX() {return this.absX;}
    getY() {return this.absY;}
    getZ() {return this.absZ;}
    username() {return this.username;}

    draw(ctx,plrImg) {
        ctx.drawImage(plrImg,0,0,64,64,280,280,40,40);
    }


}
