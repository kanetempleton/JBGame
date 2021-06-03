
export default class client {
    constructor(ws) {
        this.socket=ws;
    }

    sendRawPacket(x) {
         this.socket.send(x);
    }

    sendGamePacket(message) {
       this.sendRawPacket("game::"+message.length+"::"+message);
    }


}
