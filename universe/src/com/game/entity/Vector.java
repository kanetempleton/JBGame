package com.game.entity;


public class Vector {

    private int x,y,z;

    public Vector() {
        x=0;
        y=0;
        z=0;
    }

    public void setData(int x, int y, int z) {
        this.x=x;
        this.y=y;
        this.z=z;
    }
    public int x() {return x;}
    public int y() {return y;}
    public int z() {return z;}
    public void setX(int a) {x=a;}
    public void setY(int a) {y=a;}
    public void setZ(int a) {z=a;}

    public void add(Vector V) {
        this.x+=V.x();
        this.y+=V.y();
        this.z+=V.z();
    }

    public void multiply(int c) {
        this.x*=c;
        this.y*=c;
        this.z*=c;
    }

    @Override
    public String toString() {
        return "<"+x+","+y+","+z+">";
    }

    public Vector duplicate() {
        Vector q = new Vector();
        q.setData(this.x,this.y,this.z);
        return q;
    }

    public boolean equals(Vector v) {
        return (this.x==v.x && this.y==v.y && this.z==v.z);
    }




}