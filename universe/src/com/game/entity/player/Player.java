package com.game.entity.player;

import com.game.entity.*;
import com.server.entity.*;
import com.Main;
import java.util.ArrayList;
import com.game.map.*;

public class Player extends Entity {

    private String username;
    private ServerConnection connection;

    public Player(ServerConnection c, String name) {
        super();
        setIsPlayer(true);
        this.connection=c;
        this.username = name;
    }

    public void tick() {

        if (this.connection.getSocket().isClosed()) {
            Main.game().entityManager().removePlayer(this);
            return;
        }

       // System.out.println("player tick from "+this);

        int code = Map.mapcode(getX()/50,getY()/50);
       // ArrayList<Integer> entities = Main.launcher.game().entityManager().entitiesInMapSection(code);
        /*if (entities!=null) {
            for (int x : entities) {
              //  System.out.println("processing an entity id: "+x);
                Entity e = Main.launcher.game().entityManager().get(x);
                if (e==null) {
                    System.out.println("null for x="+x);
                    continue;
                }
                if (e.isPlayer() && e.getGameID()!=this.getGameID()) {
                    this.connection.sendMessage("hereisplayer:"+e.getGameID()+":" + e.getX() + "," + e.getY() + "," + e.getZ() + "");
                }
            }
        }*/

        try {
            if (updateRequired()) {
                System.out.println("gameID,entityID="+getGameID()+","+getEntityID());
                this.connection.sendMessage("updatepos:" + getX() + "," + getY() + "," + getZ() + "");
                setUpdateRequired(false);
            }
        } catch (Exception e) {
            System.out.println("e print stack trace ok ok ok ok ok ok ok ");
        }

            //something else
        //System.out.println("Player " + username + " at " + this.position().toString());
    }



    public static final int START_X = 110;
    public static final int START_Y = 815;
    public static final int START_Z = 0;

    /* initNewPlayer(p):
        set the player's info to default starting character
     */
    public static void initNewPlayer(Player p) {
        p.setCoordinates(START_X,START_Y,START_Z);
    }

    public String getUsername() {
        return username;
    }

    public ServerConnection getConnection() {
        return connection;
    }

    public String databaseSaveString() {
        String s = "";
        s+="x="+getX()+", y="+getY()+", z="+getZ()+"";
        return s;
    }

    public static final String databaseLoadString = "x,y,z";

    public void loadFromDatabaseResponse(String r) {
        System.out.println("loading from "+r);
        String[] argz = r.split(",");
        for (String a: argz) {
            String[] d = a.split("=");
            if (d.length==2) {
                if (d[0].equals("x"))
                    setX(Integer.parseInt(d[1]));
                if (d[0].equals("y"))
                    setY(Integer.parseInt(d[1]));
                if (d[0].equals("z"))
                    setZ(Integer.parseInt(d[1]));
            }
        }
        System.out.println("loaded: "+getX()+","+getY()+","+getZ());
    }



}