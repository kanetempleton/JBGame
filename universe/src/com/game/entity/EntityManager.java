package com.game.entity;

import com.console.Console;
import com.server.entity.*;
import com.game.entity.player.*;
import java.util.HashMap;
import java.util.ArrayList;
import com.game.map.Map;

public class EntityManager {

    public static final int MAX_ENTITIES = 10000;

    private Entity[] entities;
    private HashMap<ServerConnection,Player> connectedPlayers;
    //private HashMap<Integer,ArrayList<Integer>> mappedEntities;
    private int nextEntityID;
    private int numEntities;
    private int numPlayers;

    public EntityManager() {
        entities = new Entity[MAX_ENTITIES];
        connectedPlayers = new HashMap<>();
        //mappedEntities = new HashMap<>();
        nextEntityID=0;
        numEntities=0;
        numPlayers=0;
    }

    public void addPlayer(Player P) {
        numPlayers++;
        connectedPlayers.put(P.getConnection(),P);
        System.out.println("player "+P.getUsername()+" connecting...");
        add(P);
    }
    public void removePlayer(Player P) {
        numPlayers--;
        connectedPlayers.remove(P.getConnection());
        System.out.println("player "+P.getUsername()+" disconnecting...");
        remove(P);
    }

    public void add(Entity E) {
        if (numEntities>=MAX_ENTITIES) {
            Console.output("Maximum number of entities reached.");
            return;
        }
        if (nextEntityID>=MAX_ENTITIES) {
            for (int i=0; i<MAX_ENTITIES; i++) {
                if (entities[i]==null) {
                    nextEntityID=i;
                    break;
                }
            }
        }
        E.setGameID(nextEntityID);
        entities[nextEntityID++]=E;

        numEntities++;
    }

    public void remove(Entity E) {
        if (E.getGameID()>=MAX_ENTITIES) {
            Console.output("bad entity removal");
            return;
        }
        int id = E.getGameID();
        Entity ee = entities[id];
        //ee.setExists(false);
        int code = Map.mapcode(E.getX()/50,E.getY()/50);
     /*   if (mappedEntities.containsKey(code)) {
            ArrayList<Integer> b = mappedEntities.get(code);
            if (b.contains(E.getGameID()))
                b.remove(Integer.valueOf(E.getGameID()));
        }*/
        System.out.print("Entity "+E.getGameID()+" removed.");

        if (ee.equals(E)) {
            entities[id]=null;
            numEntities--;
        }

        System.out.println("now have "+numEntities+" entities.");


    }

    public Entity get(int gameID) {
        if (gameID>=MAX_ENTITIES) {
            Console.output("bad entity access: "+gameID);
            return null;
        }
        return entities[gameID];
    }

    public int nextEntityID() {
        return nextEntityID++;
    }


    public void entityInfo() {
        Console.output("Number of active entities: "+numEntities);
    }


    public void tick() {
        int count = 0;
        for (int i=0; i<MAX_ENTITIES; i++) {
            if (count>=numEntities) {
                break;
            }
            if (entities[i]!=null) { //TODO: remove entities when they leave
                count++;
                entities[i].tickEntity();
                if (entities[i]==null) {
                    System.out.println("null for i="+i);
                    continue;
                }
                int code = Map.mapcode(entities[i].getX()/50,entities[i].getY()/50);
               /* if (mappedEntities.containsKey(code)) {
                    ArrayList<Integer> b = mappedEntities.get(code);
                    if (!b.contains(entities[i].getGameID()))
                        b.add(entities[i].getGameID());
                } else {
                    ArrayList<Integer> bucket = new ArrayList<>();
                    bucket.add(entities[i].getGameID());
                    mappedEntities.put(code,bucket);
                }*/

            }
        }
    }

    public void listEntities() {
        int count=0;
        for (int i=0; i<MAX_ENTITIES; i++) {
            if (count>=numEntities) {
                break;
            }
            if (entities[i]!=null) { //TODO: remove entities when they leave
                System.out.println(count+" entity: "+entities[i]);
                count++;
            }
        }
        System.out.println("counted "+count+" entities");
    }

 /*   public ArrayList<Integer> entitiesInMapSection(int mcode) {
        return mappedEntities.get(mcode);
    }
*/
    public Player getPlayerForConnection(ServerConnection c) {
        return connectedPlayers.get(c);
    }




}