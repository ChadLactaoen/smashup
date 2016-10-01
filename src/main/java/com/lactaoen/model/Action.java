package com.lactaoen.model;

public class Action extends Card {

    private String faction;
    private boolean canBePlayedOnBase;
    private boolean canBePlayedOnMinion;

    public Action() {
    }

    public Action(String name, String description, String faction, String color, boolean canBePlayedOnBase, boolean canBePlayedOnMinion) {
        this.name = name;
        this.description = description;
        this.color = color;
        this.cardType = CardType.ACTION;
        this.faction = faction;
        this.canBePlayedOnBase = canBePlayedOnBase;
        this.canBePlayedOnMinion = canBePlayedOnMinion;
    }

    public String getFaction() {
        return faction;
    }

    public void setFaction(String faction) {
        this.faction = faction;
    }

    public boolean isCanBePlayedOnBase() {
        return canBePlayedOnBase;
    }

    public void setCanBePlayedOnBase(boolean canBePlayedOnBase) {
        this.canBePlayedOnBase = canBePlayedOnBase;
    }

    public boolean isCanBePlayedOnMinion() {
        return canBePlayedOnMinion;
    }

    public void setCanBePlayedOnMinion(boolean canBePlayedOnMinion) {
        this.canBePlayedOnMinion = canBePlayedOnMinion;
    }
}
