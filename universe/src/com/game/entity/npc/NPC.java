package com.game.entity.npc;

import com.game.entity.*;
import com.game.entity.player.*;
import com.server.entity.*;
import com.Main;
import java.util.ArrayList;
import com.game.map.*;

public class NPC extends Life {

    private String name;


    private Player attackingPlayer;

    public NPC(int serverid, int npcid) {
        super(serverid,npcid+Entity.ENTITY_ID_NPC_BASE);
        name=getNPCNameForID(npcid);
        maxHealth=getMaxHealthForID(npcid);
        curHealth=maxHealth;
        maxHit=getMaxHitForID(npcid);
        attackingPlayer=null;
    }


    public void tickLife() {

    }


    public void die() {
        //TODO
    }


    /*      COMBAT METHODS      */


    public void checkAttacks() {
        if (attackingPlayer!=null) {
            if (canAttack(attackingPlayer)) {

            }
        }
    }

    public void attackPlayer(Player p) {
        attackingPlayer=p;
    }

    public boolean canAttack(Player p) {
        return true;
    }

    public void appendHit(int hit) {
        System.out.println("NPC append hit: "+hit);
    }




    public static String getNPCNameForID(int npcid) {
        return "bot";
    }
    public static int getMaxHealthForID(int npcid) {
        return 10;
    }
    public static int getMaxHitForID(int npcid) {
        return 1;
    }


}


/*

    npcid       name
    0           guy


    - click npc
    - tell server you clicked that npc
    - player targets that npc with next attack
    - on next tick player inflicts dmg on npc

 */