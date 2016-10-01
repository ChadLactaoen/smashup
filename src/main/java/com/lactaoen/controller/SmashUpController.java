package com.lactaoen.controller;

import com.lactaoen.model.*;
import com.lactaoen.model.wrapper.FactionWrapper;
import com.lactaoen.model.wrapper.InitializerWrapper;
import com.lactaoen.service.SmashUpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/smashUp")
public class SmashUpController {

    @Autowired
    private SmashUpService smashUpService;

    /**      Game endpoints      **/

    @RequestMapping(value = "/factions", method = RequestMethod.GET)
    public List<FactionWrapper> getAllFactions() {
        return smashUpService.getAllFactions();
    }

    @RequestMapping(value = "/game/p1/{f1}/{f2}/p2/{f3}/{f4}", method = RequestMethod.POST)
    public InitialGameState startGame(@PathVariable("f1") int f1, @PathVariable("f2") int f2,
                                      @PathVariable("f3") int f3, @PathVariable("f4") int f4,
                                      @RequestBody InitializerWrapper initializer) throws IOException {
        return smashUpService.startGame(f1, f2, f3, f4, initializer);
    }

    /**      Deck endpoints      **/

    @RequestMapping(value = "/deck/{playerId}", method = RequestMethod.GET)
    public List<Card> getDeck(@PathVariable("playerId") int playerId) {
        List<Card> deck = smashUpService.getDeck(playerId);
        List<Card> reverseDeck = new ArrayList<>();
        for (int i = deck.size() - 1; i >= 0; i--) {
            reverseDeck.add(deck.get(i));
        }
        return reverseDeck;
    }

    @RequestMapping(value = "/deck/{playerId}/shuffle", method = RequestMethod.GET)
    public void shuffleDeck(@PathVariable("playerId") int playerId) {
        smashUpService.shuffleDeck(playerId);
    }

    @RequestMapping(value = "/deck/count/{playerId}", method = RequestMethod.GET)
    public Integer getDeckCount(@PathVariable("playerId") int playerId) {
        return smashUpService.getDeck(playerId).size();
    }

    @RequestMapping(value = "/draw/{playerId}", method = RequestMethod.GET)
    public Card drawCard(@PathVariable("playerId") int playerId) {
        return smashUpService.drawCard(playerId).get(0);
    }

    @RequestMapping(value = "/draw/{playerId}/{count}", method = RequestMethod.GET)
    public List<Card> drawCards(@PathVariable("playerId") int playerId, @PathVariable("count") int count) {
        return smashUpService.drawCards(playerId, count);
    }

    @RequestMapping(value = "/deck/top/{playerId}/action", method = RequestMethod.POST)
    public void putCardToTop(@PathVariable("playerId") int playerId, @RequestBody Action card) {
        smashUpService.putCardToTop(playerId, card);
    }

    @RequestMapping(value = "/deck/top/{playerId}/minion", method = RequestMethod.POST)
    public void putCardToTop(@PathVariable("playerId") int playerId, @RequestBody Minion card) {
        smashUpService.putCardToTop(playerId, card);
    }

    @RequestMapping(value = "/deck/top/base", method = RequestMethod.POST)
    public void putCardToTop(@PathVariable("playerId") int playerId, @RequestBody Base card) {
        smashUpService.putCardToTop(playerId, card);
    }

    @RequestMapping(value = "/deck/bottom/{playerId}/action", method = RequestMethod.POST)
    public void putCardToBottom(@PathVariable("playerId") int playerId, @RequestBody Action card) {
        smashUpService.putCardToBottom(playerId, card);
    }

    @RequestMapping(value = "/deck/bottom/{playerId}/minion", method = RequestMethod.POST)
    public void putCardToBottom(@PathVariable("playerId") int playerId, @RequestBody Minion card) {
        smashUpService.putCardToBottom(playerId, card);
    }

    @RequestMapping(value = "/deck/bottom/base", method = RequestMethod.POST)
    public void putCardToBottom(@PathVariable("playerId") int playerId, @RequestBody Base card) {
        smashUpService.putCardToBottom(playerId, card);
    }

    @RequestMapping(value = "/deck/middle/{playerId}/action", method = RequestMethod.POST)
    public void returnCardAndShuffle(@PathVariable("playerId") int playerId, @RequestBody Action card) {
        smashUpService.returnCardAndShuffle(playerId, card);
    }

    @RequestMapping(value = "/deck/middle/{playerId}/minion", method = RequestMethod.POST)
    public void returnCardAndShuffle(@PathVariable("playerId") int playerId, @RequestBody Minion card) {
        smashUpService.returnCardAndShuffle(playerId, card);
    }

    @RequestMapping(value = "/deck/middle/base", method = RequestMethod.POST)
    public void returnCardAndShuffle(@RequestBody Base card) {
        smashUpService.returnCardAndShuffle(0, card);
    }

    /**      Discard endpoints      **/

    @RequestMapping(value = "/discard/{playerId}", method = RequestMethod.GET)
    public List<Card> getDiscardPile(@PathVariable("playerId") int playerId) {
        return smashUpService.getDiscardPile(playerId);
    }

    @RequestMapping(value = "/discard/{playerId}/action", method = RequestMethod.POST)
    public void sendCardToDiscard(@PathVariable("playerId") int playerId, @RequestBody Action card) {
        smashUpService.sendCardToDiscard(playerId, card);
    }

    @RequestMapping(value = "/discard/{playerId}/minion", method = RequestMethod.POST)
    public void sendCardToDiscard(@PathVariable("playerId") int playerId, @RequestBody Minion card) {
        smashUpService.sendCardToDiscard(playerId, card);
    }

    @RequestMapping(value = "/discard/base", method = RequestMethod.POST)
    public void sendCardToDiscard(@RequestBody Base card) {
        smashUpService.sendCardToDiscard(0, card);
    }

    @RequestMapping(value = "/discard/{playerId}/{cardId}", method = RequestMethod.DELETE)
    public void removeCardFromDiscard(@PathVariable("playerId") int playerId, @PathVariable("cardId") String cardId) {
        smashUpService.removeCardFromDiscard(playerId, cardId);
    }

    @RequestMapping(value = "/deck/{playerId}/{cardId}", method = RequestMethod.DELETE)
    public void removeCardFromDeck(@PathVariable("playerId") int playerId, @PathVariable("cardId") String cardId) {
        smashUpService.removeCardFromDeck(playerId, cardId);
    }
}
