package com.lactaoen.model;

public class Minion extends Card {

    private int power;
    private String faction;

    public Minion() {
    }

    public Minion(String name, String description, String color, int power, String faction) {
        this.name = name;
        this.description = description;
        this.color = color;
        this.cardType = CardType.MINION;
        this.power = power;
        this.faction = faction;
    }

    public int getPower() {
        return power;
    }

    public void setPower(int power) {
        this.power = power;
    }

    public String getFaction() {
        return faction;
    }

    public void setFaction(String faction) {
        this.faction = faction;
    }

    @Override
    public String toString() {
        return "Minion{" +
                "power=" + power +
                ", faction='" + faction + '\'' +
                '}';
    }
}
