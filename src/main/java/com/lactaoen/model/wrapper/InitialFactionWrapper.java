package com.lactaoen.model.wrapper;

import java.util.List;

public class InitialFactionWrapper {

    private String factionName;
    private int factionId;
    private String set;
    private List<MinionWrapper> minions;
    private List<ActionWrapper> actions;
    private String color;

    public InitialFactionWrapper() {
    }

    public String getFactionName() {
        return factionName;
    }

    public void setFactionName(String factionName) {
        this.factionName = factionName;
    }

    public int getFactionId() {
        return factionId;
    }

    public void setFactionId(int factionId) {
        this.factionId = factionId;
    }

    public String getSet() {
        return set;
    }

    public void setSet(String set) {
        this.set = set;
    }

    public List<MinionWrapper> getMinions() {
        return minions;
    }

    public void setMinions(List<MinionWrapper> minions) {
        this.minions = minions;
    }

    public List<ActionWrapper> getActions() {
        return actions;
    }

    public void setActions(List<ActionWrapper> actions) {
        this.actions = actions;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
