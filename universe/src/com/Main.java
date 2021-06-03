package com;

import com.server.*;
import com.server.entity.ServerConnection;
import com.server.protocol.*;

import com.game.*;





public class Main {

    public static Launcher launcher;
    public static Engine game;

    public static void main(String[] args) {
        System.out.println("main'd");
        launcher = new Launcher();
        launcher.addDatabaseManager();
        launcher.addLoginHandler();
        launcher.addCareTaker(18000000);
        launcher.addHTTPServer(80);
        //launcher.getHTTPServer(80).addRoute("gamedev","pages/gamedev/index.html");
        launcher.addHTTPServer(8069);
        launcher.addHTTPServer("res/front/apiweb/",8070);
        launcher.addTCPServer(43594);
        //launcher.addWebSocketServer(42069);
        Server wss = new Server(new WebSocket(42069) {
            public void processCustomMessage(ServerConnection c, String m) {
               game.getPacketHandler().handleNetworkPacket(c,m.length(),m);
            }
        });
        launcher.loadThread(wss);
        game = new Engine();
        launcher.loadThread(game);
        launcher.startThreads();
        ((HTTP)launcher.getHTTPServer(80).getAPI()).addRoute("/gamedev","pages/gamedev/index.html");
       // ((HTTP)launcher.getHTTPServer(80).getAPI()).addRoute("/devstyle.css","pages/gamedev/devstyle.css");
    }

    public static Engine game() {return game;}


}