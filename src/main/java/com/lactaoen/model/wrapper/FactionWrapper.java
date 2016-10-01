package com.lactaoen.model.wrapper;

import com.lactaoen.model.Faction;

public class FactionWrapper {

    private int factionId;
    private String name;
    private String set;
    private String color;

    public FactionWrapper(Faction faction) {
        factionId = faction.getFactionId();
        name = faction.getName();
        set = faction.getSet().name().replace("_", " ");
        color = faction.getColor();
    }

    public int getFactionId() {
        return factionId;
    }

    public void setFactionId(int factionId) {
        this.factionId = factionId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSet() {
        return set;
    }

    public void setSet(String set) {
        this.set = set;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
