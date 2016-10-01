package com.lactaoen.model;

import java.util.List;

public class InitialGameState {

    private List<Card> player1;
    private List<Card> player2;
    private List<Card> bases;

    public InitialGameState(List<Card> player1, List<Card> player2, List<Card> bases) {
        this.player1 = player1;
        this.player2 = player2;
        this.bases = bases;
    }

    public InitialGameState() {
    }

    public List<Card> getPlayer1() {
        return player1;
    }

    public void setPlayer1(List<Card> player1) {
        this.player1 = player1;
    }

    public List<Card> getPlayer2() {
        return player2;
    }

    public void setPlayer2(List<Card> player2) {
        this.player2 = player2;
    }

    public List<Card> getBases() {
        return bases;
    }

    public void setBases(List<Card> bases) {
        this.bases = bases;
    }
}
