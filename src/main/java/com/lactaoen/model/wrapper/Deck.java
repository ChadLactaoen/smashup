package com.lactaoen.model.wrapper;

import com.lactaoen.model.Card;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

public class Deck {

    private List<Card> deck;

    public Deck() {
        deck = new ArrayList<>();
    }

    public Deck(List<Card> deck) {
        this.deck = deck;
    }

    public List<Card> getDeck() {
        return deck;
    }

    public void setDeck(List<Card> deck) {
        this.deck = deck;
    }

    public void shuffle() {
        Collections.shuffle(deck);
    }

    public List<Card> drawOne() {
        return draw(1);
    }

    public List<Card> draw(int quantity) {
        List<Card> drawList = new ArrayList<>();
        for (int i = 1; i <= quantity; i++) {
            drawList.add(deck.get(deck.size() - 1));
            deck.remove(deck.size() - 1);
        }
        return drawList;
    }

    public void addToTop(Card card) {
        addCard(card);
    }

    public void addToBottom(Card card) {
        deck.add(0, card);
    }

    public void addAndShuffle(Card card) {
        deck.add(card);
        shuffle();
    }

    public void addCard(Card card) {
        deck.add(card);
    }

    public void removeCard(String id) {
        deck.removeIf(c -> c.getId().equals(id));
    }
}
