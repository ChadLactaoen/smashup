package com.lactaoen.model.wrapper;

public class ActionWrapper {

    private String name;
    private String description;
    private boolean canBePlayedOnBase;
    private boolean canBePlayedOnMinion;
    private int quantity;

    public ActionWrapper() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
