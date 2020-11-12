package com.game.net;

import com.db.*;
import com.server.entity.*;
import com.game.entity.player.*;
import com.game.entity.*;
import com.game.*;
import com.Main;
import com.game.map.Map;
import java.util.ArrayList;

public class PacketHandler extends DatabaseUtility {

    private Engine game;

    public PacketHandler(Engine e) {
        game=e;
    }

    public void handleNetworkPacket(ServerConnection c, int len, String s2) {
        //s = "keypress:down"
        String[] ssplit = s2.split("::");
        if (ssplit.length!=3) {
            System.out.println("game packet processing error for "+s2);
            return;
        }
        s2 = ssplit[2];
        len = s2.length();
        String s = s2.substring(0,len);
        System.out.println("HANDLE NETWORK PACKET LENGTH "+len+" : "+s);
        if (s.equals("fetch:kane")) {
            System.out.println("login");
            new ServerQuery(this,c,"select x,y,z from players where username='kane';") {
                public void done() {
                    c.sendMessage("coords:"+getResponse());
                }
            };
            c.getServer().sendMessage(c,"okay");
        }
        String[] S = s.split(":");
        if (s.equals("logoutgame")) {

            c.getServer().sendMessage(c,"goodbye");

            Player x = game.entityManager().getPlayerForConnection(c);
            int code = Map.mapcode(x.getX()/50,x.getY()/50);
           // ArrayList<Integer> entities = Main.launcher.game().entityManager().entitiesInMapSection(code);
           /* if (entities!=null) {
                for (int xq : entities) {
                    Entity e = Main.launcher.game().entityManager().get(xq);
                    if (e==null)
                        continue;
                    if (e.isPlayer() && e.getGameID()!=x.getGameID()) {
                        Player xxx = (Player)e;
                        xxx.getConnection().sendMessage("hereisplayer:"+x.getGameID()+":-2,-2,-2");
                    }
                }
            }*/
            game.controller().savePlayerToDatabase(x);
            game.entityManager().removePlayer(x);
            System.out.println("removed "+x+" from the game.");
            c.disconnect();
        }
        if (S.length==2 && S[0].equals("join")) {
            String u = S[1].split("&")[0];
            String p = S[1].split("&")[1];
            attemptLogin(c,u,p);
        }
        if (s.startsWith("key:")) {
            switch (s.split(":")[1]) {
                case "right":
                    Player p = game.entityManager().getPlayerForConnection(c);
                //    p.setX(p.getX()+1);
                    p.velocity().setX(1);
                    break;
                case "left":
                    p = game.entityManager().getPlayerForConnection(c);
                  //  p.setX(p.getX()-1);
                    p.velocity().setX(-1);
                    break;
                case "up":
                    p = game.entityManager().getPlayerForConnection(c);
                    //p.setY(p.getY()-1);
                    p.velocity().setY(-1);
                    break;
                case "down":
                    p = game.entityManager().getPlayerForConnection(c);
                   // p.setY(p.getY()+1);
                    p.velocity().setY(1);
                    break;
            }
        }
        else if (s.startsWith("keyup:")) {
            switch (s.split(":")[1]) {
                case "right":
                    Player p = game.entityManager().getPlayerForConnection(c);
           //         p.setX(p.getX()+1);
                      p.velocity().setX(0);
                    break;
                case "left":
                    //movePlayer(c,"x",-1);
                    p = game.entityManager().getPlayerForConnection(c);
                 //   p.setX(p.getX()-1);
                      p.velocity().setX(0);
                    // game.getEntityManager().getPlayerForConnection(c).velocity().setX(game.getEntityManager().getPlayerForConnection(c).velocity().x()-1);
                    break;
                case "up":
                    //movePlayer(c,"y",1);
                    p = game.entityManager().getPlayerForConnection(c);
                 //   p.setY(p.getY()-1);
                      p.velocity().setY(0);
                    break;
                case "down":
                    p = game.entityManager().getPlayerForConnection(c);
                 //   p.setY(p.getY()+1);
                     p.velocity().setY(0);
                    // game.getEntityManager().getPlayerForConnection(c).velocity().setY(game.getEntityManager().getPlayerForConnection(c).velocity().y()+1);
                    // game.getEntityManager().getPlayerForConnection(c).velocity().setY(1);
                    //movePlayer(c,"y",-1);
                    break;
            }
        }
        else if (s.startsWith("request:")) { //requesting data

            String[] scom = s.split(":");
            if (scom.length ==2) {
                String[] dats = scom[1].split(";");
                if (dats.length>0) {
                    String reqWhat = dats[0];
                    if (reqWhat.equals("map")) {
                        if (dats.length == 4) {
                            int localMapNumber = Integer.parseInt(dats[1]);
                            int mapX = Integer.parseInt(dats[2]);
                            int mapY = Integer.parseInt(dats[3]);
                            int secNum = Map.mapcode(mapX/50,mapY/50);
                            game.map().mapDump(c,localMapNumber,secNum);
                        }
                    }
                }
            }

        }

    }

    public void attemptLogin(ServerConnection c, String user, String pass) {

        new ServerQuery(this,c,"select COUNT(username) from users where username='"+user+"'") {
            public void done() {
                String resp = getResponse();
                if (resp.split("=")[1].equals("0")) {
                    System.out.println("user doesn't exist; register");
                    c.sendMessage("needregister");
                    c.disconnect();
                } else { //user exists; check password
                    new ServerQuery(this,c,"select password from users where username='"+user+"'") {
                        public void done() {
                            byte[] k = (new String("jjf8943hr203hfao")).getBytes();//block size = 16
                            byte[] IV = (new String("1234567890abcdef")).getBytes();//
                            String cat = ""+(new String(IV))+"";
                            String crp = Main.launcher.cryptography().bytesToHex(Main.launcher.cryptography().cbcEncrypt(pass.getBytes(),k,IV));
                            if (getResponse().split("=")[1].equals(cat+crp)) { //password ok; check player info
                                new ServerQuery(this,c,"select COUNT(username) from players where username='"+user+"'") {
                                    public void done() {
                                        if (getResponse().split("=")[1].equals("0")) {
                                            System.out.println("player doesn't exist; create new character");
                                            game.controller().loginNewPlayer(c,user);
                                        } else { //player exists; load info
                                            game.controller().loginPlayer(c,user);
                                        }
                                    }
                                };
                            } else {
                                System.out.println("invalid password; game login rejected");
                                c.sendMessage("invalidpw");
                                c.disconnect();
                            }
                        }
                    };
                }
            }
        };
    }

    public void movePlayer(ServerConnection c,String coord,int amount) {

        new ServerQuery(this,c,"select "+coord+" from players where username='kane';") {
            public void done() {
                int x = Integer.parseInt(getResponse().split("=")[1].split("]")[0]);
                System.out.println(coord+"=:"+x);
                new ServerQuery(this,c,"update players set "+coord+"="+(x+amount)+" where username='kane';") {
                    public void done() {
                        new ServerQuery(this,c,"select x,y,z from players where username='kane';") {
                            public void done() {
                                c.sendMessage("coords:"+getResponse());
                            }
                        };
                    }
                };

            }
        };
    }

    public void serverAction(ServerQuery q) {
        switch (q.type()) {
            case 3:
                System.out.println("res="+q.getResponse());
                break;
        }
    }

    /*public void movePlayer(int xi, int amt) {
        if (xi==0) {
            int nx =
        }
    }
*/


}