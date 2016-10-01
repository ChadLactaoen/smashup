package com.lactaoen.service;

import com.lactaoen.model.*;
import com.lactaoen.model.wrapper.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SmashUpService {

    private final int INITIAL_HAND_SIZE = 5;
    private final int BASE_COUNT = 3;

    private InitializerWrapper initializer;
    private Deck baseDeck;
    private Deck playerOneDeck;
    private Deck playerTwoDeck;
    private Deck playerOneDiscard;
    private Deck playerTwoDiscard;
    private Deck baseDiscard;

    public List<FactionWrapper> getAllFactions() {
        return Arrays.asList(Faction.values()).stream().map(FactionWrapper::new).collect(Collectors.toList());
    }

    public InitialGameState startGame(int f1, int f2, int f3, int f4, InitializerWrapper initializer) throws IOException {
        // "Cache" the initializer
        this.initializer = initializer;

        playerOneDiscard = new Deck();
        playerTwoDiscard = new Deck();
        baseDiscard = new Deck();

        // Set the base deck
        List<Card> baseList = new ArrayList<>();
        initializer.getBases().stream().forEach(baseList::add);
        baseDeck = new Deck(baseList);
        baseDeck.shuffle();
        List<Card> bases = baseDeck.draw(BASE_COUNT);

        // Set player 1's deck
        playerOneDeck = initializePlayerDeck(f1, f2);
        playerOneDeck.shuffle();
        List<Card> playerOneHand = playerOneDeck.draw(INITIAL_HAND_SIZE);

        // Set player 2's deck
        playerTwoDeck = initializePlayerDeck(f3, f4);
        playerTwoDeck.shuffle();
        List<Card> playerTwoHand = playerTwoDeck.draw(INITIAL_HAND_SIZE);

        return new InitialGameState(playerOneHand, playerTwoHand, bases);
    }

    public List<Card> getDeck(int playerId) {
        switch (playerId) {
            case 0:
                return baseDeck.getDeck();
            case 1:
                return playerOneDeck.getDeck();
            case 2:
                return playerTwoDeck.getDeck();
            default:
                return null;
        }
    }

    public List<Card> drawCard(int playerId) {
        // For each scenario, see if a card can be drawn from the deck
        // If not, shuffle in the discard
        switch (playerId) {
            case 0:
                if (baseDeck.getDeck().size() == 0) {
                    baseDeck.getDeck().addAll(baseDiscard.getDeck());
                    baseDiscard.getDeck().clear();
                    baseDeck.shuffle();
                }
                return baseDeck.drawOne();
            case 1:
                if (playerOneDeck.getDeck().size() == 0) {
                    playerOneDeck.getDeck().addAll(playerOneDiscard.getDeck());
                    playerOneDiscard.getDeck().clear();
                    playerOneDeck.shuffle();
                }
                return playerOneDeck.drawOne();
            case 2:
                if (playerTwoDeck.getDeck().size() == 0) {
                    playerTwoDeck.getDeck().addAll(playerTwoDiscard.getDeck());
                    playerTwoDiscard.getDeck().clear();
                    playerTwoDeck.shuffle();
                }
                return playerTwoDeck.drawOne();
            default:
                return null;
        }
    }

    public List<Card> drawCards(int playerId, int count) {
        // This method is only really called by the peek ability, and shouldn't
        // refill the deck since that's not what we want
        int trueCount = count;
        switch (playerId) {
            case 0:
                if (baseDeck.getDeck().size() < count)
                    trueCount = baseDeck.getDeck().size();
                return baseDeck.draw(trueCount);
            case 1:
                if (playerOneDeck.getDeck().size() < count)
                    trueCount = playerOneDeck.getDeck().size();
                return playerOneDeck.draw(trueCount);
            case 2:
                if (playerTwoDeck.getDeck().size() < count)
                    trueCount = playerTwoDeck.getDeck().size();
                return playerTwoDeck.draw(trueCount);
            default:
                return null;
        }
    }

    public void shuffleDeck(int playerId) {
        switch (playerId) {
            case 0:
                baseDeck.shuffle();
                break;
            case 1:
                playerOneDeck.shuffle();
                break;
            case 2:
                playerTwoDeck.shuffle();
                break;
        }
    }

    public List<Card> getDiscardPile(int playerId) {
        switch (playerId) {
            case 0:
                return baseDiscard.getDeck();
            case 1:
                return playerOneDiscard.getDeck();
            case 2:
                return playerTwoDiscard.getDeck();
            default:
                return null;
        }
    }

    public <T extends Card> void putCardToTop(int playerId, T card) {
        switch (playerId) {
            case 0:
                baseDiscard.addToTop(card);
                break;
            case 1:
                playerOneDeck.addToTop(card);
                break;
            case 2:
                playerTwoDeck.addToTop(card);
                break;
        }
    }

    public <T extends Card> void putCardToBottom(int playerId, T card) {
        switch (playerId) {
            case 0:
                baseDeck.addToBottom(card);
                break;
            case 1:
                playerOneDeck.addToBottom(card);
                break;
            case 2:
                playerTwoDeck.addToBottom(card);
                break;
        }
    }

    public <T extends Card> void returnCardAndShuffle(int playerId, T card) {
        switch (playerId) {
            case 0:
                baseDeck.addAndShuffle(card);
                break;
            case 1:
                playerOneDeck.addAndShuffle(card);
                break;
            case 2:
                playerTwoDeck.addAndShuffle(card);
                break;
        }
    }

    public <T extends Card> void sendCardToDiscard(int playerId, T card) {
        switch (playerId) {
            case 0:
                baseDiscard.addCard(card);
                break;
            case 1:
                playerOneDiscard.addCard(card);
                break;
            case 2:
                playerTwoDiscard.addCard(card);
                break;
        }
    }

    private Deck initializePlayerDeck(int factionId1, int factionId2) {
        List<InitialFactionWrapper> factions =
                initializer.getFactions().stream().filter(f -> f.getFactionId() == factionId1 || f.getFactionId() == factionId2).collect(Collectors.toList());

        List<Card> tempDeck = new ArrayList<>();

        // Iterate through the cards in each faction
        for (InitialFactionWrapper faction : factions) {
            int idCount = 1;
            String color = faction.getColor();

            // Iterate through the minions and add to a temp list
            List<MinionWrapper> minions = faction.getMinions();

            for (MinionWrapper minion : minions) {
                for (int i = 1; i <= minion.getQuantity(); i++) {
                    Minion tempMinion = new Minion(minion.getName(), minion.getDescription(), color, minion.getPower(), faction.getFactionName());
                    tempMinion.setId(faction.getFactionName().toLowerCase().replaceAll(" ", "_") + "_" + idCount++);
                    tempDeck.add(tempMinion);
                }
            }

            // Iterate through the actions and add to a temp list
            List<ActionWrapper> actions = faction.getActions();

            for (ActionWrapper action : actions) {
                for (int i = 1; i <= action.getQuantity(); i++) {
                    Action tempAction = new Action(action.getName(), action.getDescription(), faction.getFactionName(),
                            color, action.isCanBePlayedOnBase(), action.isCanBePlayedOnMinion());
                    tempAction.setId(faction.getFactionName().toLowerCase().replaceAll(" ", "_") + "_" + idCount++);
                    tempDeck.add(tempAction);
                }
            }
        }

        return new Deck(tempDeck);
    }

    public void removeCardFromDiscard(int playerId, String cardId) {
        switch (playerId) {
            case 0:
                baseDiscard.removeCard(cardId);
                break;
            case 1:
                playerOneDiscard.removeCard(cardId);
                break;
            case 2:
                playerTwoDiscard.removeCard(cardId);
                break;
        }
    }

    public void removeCardFromDeck(int playerId, String cardId) {
        switch (playerId) {
            case 0:
                baseDeck.removeCard(cardId);
                break;
            case 1:
                playerOneDeck.removeCard(cardId);
                break;
            case 2:
                playerTwoDeck.removeCard(cardId);
                break;
        }
    }
}
