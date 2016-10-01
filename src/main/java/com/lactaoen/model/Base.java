package com.lactaoen.model;

public class Base extends Card {

    private int breakPoint;
    private int firstPlace;
    private int secondPlace;
    private int thirdPlace;
    private String color;
    private String faction;

    public Base() {
    }

    public Base(String name, String description, int breakPoint, int firstPlace, int secondPlace, int thirdPlace, String color, String faction) {
        this.name = name;
        this.description = description;
        this.cardType = CardType.BASE;
        this.breakPoint = breakPoint;
        this.firstPlace = firstPlace;
        this.secondPlace = secondPlace;
        this.thirdPlace = thirdPlace;
        this.color = color;
        this.faction = faction;
    }

    public int getBreakPoint() {
        return breakPoint;
    }

    public void setBreakPoint(int breakPoint) {
        this.breakPoint = breakPoint;
    }

    public int getFirstPlace() {
        return firstPlace;
    }

    public void setFirstPlace(int firstPlace) {
        this.firstPlace = firstPlace;
    }

    public int getSecondPlace() {
        return secondPlace;
    }

    public void setSecondPlace(int secondPlace) {
        this.secondPlace = secondPlace;
    }

    public int getThirdPlace() {
        return thirdPlace;
    }

    public void setThirdPlace(int thirdPlace) {
        this.thirdPlace = thirdPlace;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getFaction() {
        return faction;
    }

    public void setFaction(String faction) {
        this.faction = faction;
    }
}
