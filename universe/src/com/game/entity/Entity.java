package com.game.entity;

import com.game.map.Map;

public abstract class Entity {

    private int gameID;
    private int entityID;
    private Vector pos;
    private Vector pos_prev;
    private Vector vel;
    private Vector accel;
    private boolean noclip;
    private boolean needsUpdate;
    private boolean isPlayer;

    public Entity() {
        gameID=-1;
        entityID=-1;
        pos = new Vector();
        pos_prev = new Vector();
        vel = new Vector();
        accel = new Vector();
        noclip=false;
        needsUpdate=false;
        isPlayer=false;
    }


    public boolean equals(Entity E) {
        return (this.gameID==E.gameID);
    }

    public void setGameID(int id) {gameID=id;}
    public void setEntityID(int id) {entityID=id;}
    public void setCoordinates(int x, int y, int z) {
        pos.setData(x,y,z);
    }
    public int getGameID() {return gameID;}
    public int getEntityID() {return entityID;}
    public int getX() {return pos.x();}
    public int getY() {return pos.y();}
    public int getZ() {return pos.z();}
    public void setX(int x) {
        if (x<Map.MAP_BOUND_DIM[0] || x > Map.MAP_BOUND_DIM[2]) {
            if (noclip)
                pos.setData(x, pos.y(), pos.z());
        } else {
            pos.setData(x, pos.y(), pos.z());
        }
    }
    public void setY(int y) {
        if (y<Map.MAP_BOUND_DIM[1] || y > Map.MAP_BOUND_DIM[3]) {
            if (noclip)
                pos.setData(pos.x(),y,pos.z());
        } else {
            pos.setData(pos.x(),y,pos.z());
        }
    }
    public void setZ(int z) {pos.setData(pos.x(),pos.y(),z);}
    public boolean noclip(){return noclip;}
    public void setnoclip(boolean c){noclip=c;}

    public Vector position() {return pos;}
    public Vector velocity() {return vel;}
    public Vector acceleration() {return accel;}

    public void tickEntity() {
        vel.add(accel);
        Vector p = pos.duplicate();
        p.add(vel);
        if (p.x()< Map.MAP_BOUND_DIM[0] || p.x() > Map.MAP_BOUND_DIM[2]
            ||p.y() <Map.MAP_BOUND_DIM[1] || p.y() > Map.MAP_BOUND_DIM[3]) {
            if (noclip) {
                if (!p.equals(pos)) {
                    pos.add(vel);
                    needsUpdate=true;
                }
             //   pos.add(vel);
            }
        } else {
            if (!p.equals(pos)) {
                pos.add(vel);
                needsUpdate=true;
            }
            //pos.add(vel);
        }


        //pos.add(vel);
        tick();
    }

    public void setUpdateRequired(boolean b) {needsUpdate=b;}
    public boolean updateRequired() {return needsUpdate;}
    public boolean isPlayer(){return isPlayer;}
    public void setIsPlayer(boolean b) {isPlayer=b;}

    @Override
    public String toString() {
        return "Entity ["+gameID+","+entityID+"] at "+pos;
    }

    public abstract void tick();

}