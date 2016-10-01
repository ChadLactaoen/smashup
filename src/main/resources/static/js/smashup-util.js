/** UTIL FUNCTIONS **/

/**
 * Helper function to render card and appends it to the specified location
 */
function renderCard(card, cLocation, isActionFlag, owner) {
    isActionFlag = isActionFlag || false;
    owner = owner || $('#switch-btn').attr('current-player');

    var minionPowerElement = card.cardType === 'MINION' ?
                '<span class="minion-power pull-left">' + card.power + '</span>' : '';
    var actionAttrs = card.cardType === 'ACTION' ?
                 'can-play-on-base="' + card.canBePlayedOnBase + '" can-play-on-minion="' + card.canBePlayedOnMinion + '"' : '';

    var style = '';
    if (isActionFlag) {
        var topOffset;
        var leftOffest;
        var zIndex;

        if(card.canBePlayedOnMinion) {
            var minionsBeforeLocation = cLocation.prevAll('[card-type=MINION]').length;
            var actionsOnMinion = cLocation.nextUntil('[card-type=MINION]').length;
            topOffset = (47 * minionsBeforeLocation) + (5 * (actionsOnMinion + 1));
            leftOffset = 15 + (45 * (actionsOnMinion + 1));
            zIndex = 100 - (actionsOnMinion + 1);
        } else if(card.canBePlayedOnBase) {
            var actionsOnBase = cLocation.children('[card-type=ACTION]').length;
            leftOffset = 200;
            zIndex = 100;
            topOffset = 47 * actionsOnBase;
        }

        style = ' style="position:absolute;top:' + topOffset + 'px;left:' + leftOffset + 'px;z-index:' + zIndex + '" ';
    }

    var cardLocation;

    if (cLocation.attr('id') === 'peek-list') {
        cardLocation = 'peek';
    } else if (cLocation.attr('id') === 'discard-list') {
        cardLocation = 'discard';
    } else if (cLocation.attr('id') === 'deck-list') {
        cardLocation = 'deck';
    } else if (card.canBePlayedOnBase) {
        cardLocation = cLocation.parents('.base-row').length > 0 ? 'play' : 'hand';
    } else if (card.cardType == 'ACTION' && !card.canBePlayedOnMinion) {
        cardLocation = cLocation.parents('#hands-list').length > 0 ? 'hand' : 'play';
    } else {
        cardLocation = cLocation.parents('.player-row').length > 0 ? 'play' : 'hand';
    }
    var dataPlacement = cardLocation === 'hand' ? 'right' : isActionFlag ?
                    cLocation.parent().attr('player') == '1' ? 'bottom' : 'top' : cLocation.attr('player') == '1' ? 'bottom' : 'top';
    var clickableCard = cardLocation == 'play' ? 'clickable-card' : '';

    var element = '<div class="panel panel-default card-panel ' + clickableCard +'" location="' + cardLocation+ '" data-container="body" ' +
                             'data-trigger="hover" data-toggle="popover" card-type="' + card.cardType + '" owner="' + owner + '" ' +
                             'faction-id="' + card.id+ '" card-color="' + card.color + '" faction="' + card.faction + '" ' + actionAttrs +
                             'data-placement="' + dataPlacement + '" data-content="' + card.description + '" ' + style + '>' +
                             '<div class="card-overlay"></div><div class="panel-body">'+
                               '<span class="card-name pull-right">' + card.name + '</span>' + minionPowerElement +
                             '</div>'+
                           '</div>';

    if (isActionFlag && card.canBePlayedOnMinion) {
        cLocation.after(element);
    } else {
        cLocation.append(element);
    }

    $('[faction-id=' + card.id + ']').css('background-color', '#'+card.color);
    $('[data-toggle="popover"]').popover();
}

/**
 * When a user clicks the 'Draw' button, this function renders the card to the player's hand view
 */
function addCardToHand(card, playerId) {
    var handList = $('.hand-list[player=' + playerId + ']');
    renderCard(card, handList, false, playerId);
}

/**
 * Helper function which writes a log message to the history log.
 */
function logHistory(message) {
    var timestamp = new Date().toString().split(" ")[4];
    $('#history-modal .modal-body').prepend(
        '<div><strong>' + timestamp + '</strong> - ' + message + '</div>'
    );
}

/**
 * Little helper function that determines if we are currently in staging mode
 */
function isStagingMode() {
    return $('[staging=true]').length > 0;
}

/**
 * Helper function to determine if a staging element in the UI is a minion
 */
function isMinion(card) {
    return card.find('.minion-power').length > 0;
}

/**
 * Helper function hide the action list
 */
function hideActionList() {
    var actionList = $('#action-list');
    actionList.fadeOut(300);
    actionList.empty();
}

/**
 * Helper function to make bases clickable to put into staging
 */
function toggleClickableBase() {
    if (isStagingMode()) {
        // If it gets here, it means we're in staging mode. Hide stuff here
        $('.base-panel').not('[staging=true]').removeClass('clickable-base');
    } else {
        // If we're NOT in staging mode, make the bases clickable
        $('.base-panel').addClass('clickable-base');
    }
}

/**
 * Renders a new base on the tabletop where the old base used to be
 */
function renderBase(oldBase, newBase) {
    oldBase.find('.base-breakpoint').text(newBase.breakPoint);
    oldBase.css('background-image', 'url("/img/' + newBase.faction.toLowerCase().replace(' ', '_') + '.png")');
    oldBase.css('background-color', '#' + newBase.color);
    oldBase.find('.base-name').text(newBase.name);
    oldBase.find('.base-rewards').text(newBase.firstPlace + "" + newBase.secondPlace + "" + newBase.thirdPlace);
    oldBase.find('.base-description').text(newBase.description);
    oldBase.attr('faction-name', newBase.faction);
    oldBase.attr('faction-color', newBase.color);
    oldBase.attr('base-id', newBase.id);
}

/**
 * Toggles the action nav with the exception of the history button
 */
function toggleActionNav() {
    var actionNav = $('#action-nav');
    if (actionNav.find('button.hidden').not('#history-btn').length == 0) {
        actionNav.find('button').not('#history-btn').addClass('hidden');
    } else {
        actionNav.find('button').not('#history-btn').removeClass('hidden');
    }
}

/**
 * Used to get the current card in staging
 */
function getCardInStaging() {
    return $('[staging=true]:first');
}

/**
 * Determines what sector of the tabletop a card should go to.
 * Used for when a card goes from not in play to in play. Since
 * this can only happen during a player's turn, it's safe to use
 * the current-player attribute
 */
function getTabletopSectorByBase(base, playerId) {
    var baseId = base.attr('base');
    return $('[player=' + playerId + '][base=' + baseId + ']');
}

function makeMinionsActionable() {
    var minions = $('#tabletop .card-panel[card-type=MINION]');
    minions.css('opacity', '1');
    minions.attr('actionable', true);
    $('.base-panel').css('opacity', '0.6');
}

function makeBasesActionable() {
    var bases = $('.base-panel');
    bases.css('opacity', '1');
    bases.attr('actionable', true);
    $('.card-panel').css('opacity', '0.6');
}

/**
 * Accepts an array of .card-panel elements adds them to their respective discards and removes
 * them from the view.
 */
function removeCardsFromPlay(cardList, baseInPlay) {
    // Iterate through each card in there
    for (var i = 0; i < cardList.length; i++) {
        var currentCard = cardList.eq(i);
        var playerId = currentCard.attr('owner');
        var endpoint = isMinion(currentCard) ? 'minion' : 'action';
        var json = '';

        if (currentCard.attr('card-type') === 'MINION') {
            json = createMinionJSON(currentCard);
        } else {
            json = createActionJSON(currentCard);
        }

        // move the card to discard, remove it from UI, and get out of staging mode
        $.ajax({
            url: 'smashUp/discard/' + playerId + '/' + endpoint,
            method: 'POST',
            async: false,
            contentType: 'application/json',
            data: JSON.stringify(json),
            success: function() {
                logHistory(
                    '<strong>Player ' + playerId + '</strong> discarded <strong>' +
                    currentCard.find('.card-name').text() + '</strong> from ' + baseInPlay.find('.base-name').text() + '.'
                );
                currentCard.remove();
            }
        });
    }
}

/**
 * Helper methods that determine what mode we're in
 */

function isInDifferentMode() {
    return isInPeekMode() || isInDiscardMode() || isInDeckMode();
}

function isInPeekMode() {
    return $('#peek-list .card-panel').length > 0;
}

function isInDiscardMode() {
    return $('#discard-panel').attr('mode') === 'true';
}

function isInDeckMode() {
    return $('#deck-panel').attr('mode') === 'true';
}

/**
 * Called when the user clicks a new game
 */
$('#new-game-btn').click(function() {
    if(!$('#game-panel').is(':visible') || confirm("This will end the current game. Continue?")) {
        $('#history-btn').addClass('hidden');
        $('#action-nav').find('button').not('#history-btn').addClass('hidden');
        setUpFactionList();
    }
});

/**
 * Toggle switch to decide which hand to show in the current view.
 * This also dictates the current-player attribute
 */
$('#game-panel').on('click', '#switch-btn', function() {
    if($(this).is('[disabled=disabled]')) return;

    if($(this).attr('current-player') == '1') {
        $('.hand-list[player=1]').hide();
        $('.hand-list[player=2]').fadeIn();
        $(this).attr('current-player', '2');
        $('#draw-btn').attr('current-player', '2');
    } else {
        $('.hand-list[player=2]').hide();
        $('.hand-list[player=1]').fadeIn();
        $(this).attr('current-player', '1');
        $('#draw-btn').attr('current-player', '1');
    }
});

/**
 * Event handler when the user clicks a faction flag during the game,
 * which increments the score for the respective faction
 */
$(document).on('click', '.team-flag', function() {
    var score = $(this).find('.team-score');
    var newScore = parseInt(score.text()) + 1;
    // Let's not run up the score
    if (newScore <= 30) {
        score.text(newScore);
        logHistory('Score for <strong>' + $(this).find('.team-name:first').text() + '</strong> changed to <strong>' + newScore + '</strong>.');
    }
});

/**
 * Called when the user clicks the 'Draw' button, which adds a card
 * from their deck and renders it in the hand view.
 */
$('#game-panel').on('click', '#draw-btn', function() {
    if($(this).is('[disabled=disabled]')) return;

    var playerId = $(this).attr('current-player');
    $.ajax({
        url: 'smashUp/draw/' + playerId,
        method: 'GET',
        dataType: 'json',
        success: function(card) {
            addCardToHand(card, playerId);
            logHistory('<strong>Player ' + playerId + '</strong> drew a card.');
        }
    });
});

/**
 * Takes a card and puts it to the bottom of its owner's deck
 */
$('#action-list').on('click', '#deck-bottom-btn', function() {
    var card = getCardInStaging();
    var playerId = card.attr('owner');
    var json = card.attr('card-type') == 'ACTION' ? createActionJSON(card) : createMinionJSON(card);
    var endpoint = isMinion(card) ? 'minion' : 'action';

    // move the card to bottom of deck, remove it from UI, and get out of staging mode
    $.ajax({
        url: 'smashUp/deck/bottom/' + playerId + '/' + endpoint,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json),
        success: function() {
            isFromBaseOrDeck(card);
            logHistory(
                '<strong>Player ' + playerId + '</strong> sent <strong>' + card.find('.card-name').text() +
                '</strong> from ' + card.attr('location') + ' to bottom of deck.'
            );
            card.remove();
            toggleStagingUI(card);
        }
    });
});

/**
 * Takes a card and puts it to the top of its owner's deck
 */
$('#action-list').on('click', '#deck-top-btn', function() {
    var card = getCardInStaging();
    var playerId = card.attr('owner');
    var json = card.attr('card-type') == 'ACTION' ? createActionJSON(card) : createMinionJSON(card);
    var endpoint = isMinion(card) ? 'minion' : 'action';

    // move the card to bottom of deck, remove it from UI, and get out of staging mode
    $.ajax({
        url: 'smashUp/deck/top/' + playerId + '/' + endpoint,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json),
        success: function() {
            isFromBaseOrDeck(card);
            logHistory(
                '<strong>Player ' + playerId + '</strong> sent <strong>' + card.find('.card-name').text() +
                '</strong> from ' + card.attr('location') + ' to top of deck.'
            );
            card.remove();
            toggleStagingUI(card);
        }
    });
});

/**
 * Takes a card, puts it into it's owners deck, then shuffles the deck
 */
$('#action-list').on('click', '#shuffle-deck-btn', function() {
    var card = getCardInStaging();
    var playerId = card.attr('owner');
    var json = card.attr('card-type') == 'ACTION' ? createActionJSON(card) : createMinionJSON(card);
    var endpoint = isMinion(card) ? 'minion' : 'action';

    // move the card to bottom of deck, remove it from UI, and get out of staging mode
    $.ajax({
        url: 'smashUp/deck/middle/' + playerId + '/' + endpoint,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json),
        success: function() {
            isFromBaseOrDeck(card);
            logHistory(
                '<strong>Player ' + playerId + '</strong> put <strong>' + card.find('.card-name').text() +
                '</strong> from ' + card.attr('location') + ' into deck and shuffled.'
            );
            card.remove();
            toggleStagingUI(card);
        }
    });
});

/**
 * Sets power counters for cards in play
 */
$('#action-list').on('click', '#power-counter-btn', function() {
    var card = getCardInStaging();
    var powerCount = prompt("Set the power count");

    card.find('.power-counter').remove();

    if (powerCount !== ''  && powerCount !== '0') {
        card.find('.panel-body').append('<span class="power-counter pull-left"> (+' + powerCount + ')</span>');
    } else {
        powerCount = '0';
    }

    logHistory(
        '<strong>Player ' + card.attr('owner') + '</strong> set power counters on <strong>' +
        card.find('.card-name').text() + '</strong> to ' + powerCount + '.'
    );
    toggleStagingUI(card);
});

/**
 * Transfers a minion in play to the other player
 */
$('#action-list').on('click', '#transfer-btn', function() {
    var card = getCardInStaging();
    var currentOwner = parseInt(card.parent().attr('player'));
    var currentBase = card.parent().attr('base');

    var cLocation = currentOwner === 1 ?
            $('.col-lg-4[player=2][base=' + currentBase + ']') : $('.col-lg-4[player=1][base=' + currentBase + ']');

    logHistory(
        '<strong>Player ' + (currentOwner === 1 ? '2' : '1') +
        '</strong> took control of <strong>' + card.find('.card-name').text() + '</strong>.'
    );

    var json = createMinionJSON(card);
    renderCard(json, cLocation, false, card.attr('owner'));
    card.remove();
    toggleStagingUI(card);
});

/**
 * Returns a card to its owner's hand
 */
$('#action-list').on('click', '#return-btn', function() {
    var card = getCardInStaging();
    var cLocation = card.attr('owner') == '1' ? $('.hand-list[player=1]') : $('.hand-list[player=2]');

    logHistory(
        '<strong>Player ' + card.attr('owner') + '</strong> placed <strong>' + card.find('.card-name').text() +
        '</strong> to hand from ' + card.attr('location') + '.'
    );

    var json = card.attr('card-type') == 'ACTION' ? createActionJSON(card) : createMinionJSON(card);
    isFromBaseOrDeck(card);
    renderCard(json, cLocation, false, card.attr('owner'));
    card.remove();
    toggleStagingUI(card);
});

/**
 * An action that can't be played on a base or minion will activate this click event
 * when the 'Play' button is called from the action list
 */
$('#action-list').on('click', '#play-btn', function() {
    var card = getCardInStaging();
    var playerId = card.attr('owner');
    var json = card.attr('card-type') == 'ACTION' ? createActionJSON(card) : createMinionJSON(card);

    card.remove();
    isFromBaseOrDeck(card);
    renderCard(json, $('#in-play-list'), false, playerId);
    logHistory(
        '<strong>Player ' + playerId + '</strong> played <strong>' + card.find('.card-name').text() + '</strong>.'
    );
    toggleStagingUI(card);
});


/**
 * All cards can be discarded. Get the staged card and put it to the discard.
 */
$('#action-list').on('click', '#discard-btn', function() {
    var playerId = getCardInStaging().attr('owner');
    var card = $('[staging=true]:first');
    var cardName = $('[staging=true]:first .card-name').text();
    var location = $('[staging=true]:first').attr('location');

    // Package to JSON based on what kind of card it is
    var json = isMinion(card) ? createMinionJSON(card) : createActionJSON(card);
    var endpoint = isMinion(card) ? 'minion' : 'action';

    // move the card to discard, remove it from UI, and get out of staging mode
    $.ajax({
        url: 'smashUp/discard/' + playerId + '/' + endpoint,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json),
        success: function() {
            isFromBaseOrDeck(card);
            logHistory('<strong>Player ' + playerId + '</strong> discarded <strong>' + cardName + '</strong> from ' + location + '.');
            card.remove();
            toggleStagingUI(card);
        }
    });
});

$('#action-nav').on('click', '#random-discard-btn', function() {
    var currentPlayer = $('[current-player]:first').attr('current-player');
    var handList = $('.hand-list[player=' + currentPlayer + ']').find('.card-panel');
    var index = Math.floor(Math.random() * handList.length);
    var card = handList.eq(index);
    // Package to JSON based on what kind of card it is
    var json = isMinion(card) ? createMinionJSON(card) : createActionJSON(card);
    var endpoint = isMinion(card) ? 'minion' : 'action';

    // move the card to discard, remove it from UI, and get out of staging mode
    $.ajax({
        url: 'smashUp/discard/' + currentPlayer + '/' + endpoint,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json),
        success: function() {
            logHistory('<strong>Player ' + currentPlayer + '</strong> randomly discarded <strong>' +
                card.find('.card-name').text() + '</strong> from ' + card.attr('location') + '.');
            card.remove();
        }
    });
});

/**
 * Called when an action is played to a minion when clicking on the card overlay
 */
 $('#tabletop').on('click', '.card-overlay', function() {
    var card = getCardInStaging();
    var playerId = card.attr('owner');
    var minion = $(this).parent('.card-panel');

    isFromBaseOrDeck(card);
    renderCard(createActionJSON(card), minion, true, playerId);

    if (card.attr('location') == 'play') {
        logHistory(
            '<strong>Player ' + $('#switch-btn').attr('current-player') + '</strong> transferred <strong>' + card.find('.card-name').text() +
            '</strong> from <strong>' + card.prev('[card-type=MINION]').find('.card-name').text() +
            '</strong> to <strong>' + minion.find('.card-name').text() + '</strong>'
        );
    } else {
        logHistory(
            '<strong>Player ' + playerId + '</strong> played <strong>' + card.find('.card-name').text() +
            '</strong> on <strong>' + minion.find('.card-name').text() + '</strong>'
        );
    }

    card.remove();
    toggleStagingUI(card);
 });

/**
 * Called when a card is played to a base by clicking on the base overlay
 */
$('#tabletop').on('click', '.base-overlay', function() {
    var card = getCardInStaging();
    var playerId = card.attr('owner');
    var base = $(this).parent();

    // Determine where on the tabletop to put this
    var sector = getTabletopSectorByBase(base, playerId);

    // Check if it's a minion
    if (card.find('.minion-power').length > 0) {

        // Check if it was transferred so we can display the proper log message
        if (card.parent('[base]').length > 0) {
            var oldBase = $('#base-' + card.parent('[base]').attr('base')).find('.base-name').text();

            // Don't log if it's not technically being moved, and keep in staging mode
            if (oldBase === base.find('.base-name').text()) return;

            logHistory(
                '<strong>Player ' + $('#switch-btn').attr('current-player') + '</strong> moved <strong>' + card.find('.card-name').text() + '</strong> ' +
                'from <strong>' + oldBase + '</strong> to <strong>' + base.find('.base-name').text() + '</strong>'
            );
        } else {
            logHistory(
                '<strong>Player ' + $('#switch-btn').attr('current-player') + '</strong> played <strong>' + card.find('.card-name').text() + '</strong> ' +
                'from ' + card.attr('location') + ' to <strong>' + base.find('.base-name').text() + '</strong>'
            );
        }

        // Remove the minion from the hand view and render it onto the tabletop
        card.remove();
        isFromBaseOrDeck(card);
        renderCard(createMinionJSON(card), sector, false, playerId);

        toggleStagingUI(card);
    } else {    // It's am action that can be played on a base

        // Override the sector since we're playing it in the base row
        sector = $('.base-row').children('.col-lg-3').has('#base-' + base.attr('base'));

        // Check if we're transferring
        if (card.prev('.base-panel').length > 0) {
            var oldBase = card.prev('.base-panel').find('.base-name').text();

            // Don't log if it's not technically being moved, and keep in staging mode
            if (oldBase === base.find('.base-name').text()) return;

            logHistory(
                '<strong>Player ' + $('#switch-btn').attr('current-player') + '</strong> moved <strong>' + card.find('.card-name').text() + '</strong> ' +
                'from <strong>' + oldBase + '</strong> to <strong>' + base.find('.base-name').text() + '</strong>'
            );
        } else {
            logHistory(
                '<strong>Player ' + $('#switch-btn').attr('current-player') + '</strong> played <strong>' + card.find('.card-name').text() + '</strong> ' +
                'from ' + card.attr('location') + ' to <strong>' + base.find('.base-name').text() + '</strong>'
            );
        }

        // Remove the action and render it to its new base
        card.remove();
        isFromBaseOrDeck(card);
        renderCard(createActionJSON(card), sector, true, playerId);

        toggleStagingUI(card);
    }
});

/**
 * Called when a minion or action on the tabletop is clicked
 */
$('#tabletop').on('click', '.card-panel.clickable-card', function() {
    toggleStagingUI($(this));
});

/**
 * Called when the peek button is clicked
 */
$('#peek-btn').click(function() {
    var peekCount = parseInt(prompt("How many cards to peek?"));
    var currentPlayer = $('#switch-btn').attr('current-player');

    if (!peekCount) return;

    // Hide the hand
    $('#hands-list').hide();

    $.ajax({
        url: 'smashUp/draw/' + currentPlayer + '/' + peekCount,
        method: 'GET',
        dataType: 'json',
        success: function(cards) {
            // If peek mode is on, disable all cards and don't show anything but peek
            $.each(cards, function(index, card) {
                renderCard(card, $('#peek-list'), false, currentPlayer);
            });

            logHistory('<strong>Player ' + currentPlayer + '</strong> peeked at ' + peekCount + ' card(s) from top of deck.');

            // Hide the action nav
            toggleActionNav();

            // Make the peeking cards clickable cards
            $('#peek-list .card-panel').addClass('clickable-card').css('opacity', '1');

            // Disable the hand buttons
            $('#hand-buttons btn').attr('disabled', true);

            // Make other cards in play not actionable
            $('.base-panel').removeClass('clickable-base').css('opacity', '0.6');
            $('#tabletop .card-panel').removeClass('clickable-card').css('opacity', '0.6');
            $('#in-play-list .card-panel').removeClass('clickable-card').css('opacity', '0.6');

            $('#peek-panel').show();
        }
    });
});

/**
 * Called when the deck count button is clicked
 */
$('#deck-count-btn').click(function() {
    var currentPlayer = $('#switch-btn').attr('current-player');

    $.ajax({
        url: 'smashUp/deck/count/' + currentPlayer,
        method: 'GET',
        dataType: 'json',
        success: function(count) {
            alert('Player ' + currentPlayer + ' card count: ' + count);
        }
    });
});

/**
 * Mass base discard button, which removes all cards played on a particular base
 */
$('#action-list').on('click', '#base-discard-btn', function() {
    // card will be a base
    var card = getCardInStaging();

    // get all card panels where .col-lg-4[base=card.attr('base')] as well as base row for baseable actions
    var cardsOnBase = $('.col-lg-4[base=' + card.attr('base') + '] .card-panel');
    var baseActions = card.nextAll('.card-panel');

    removeCardsFromPlay(cardsOnBase, card);
    removeCardsFromPlay(baseActions, card);

    // After all cards have been discarded, toggle staging
    toggleStagingUI(card);
});

/**
 * Get discard view
 */
$('#action-nav').on('click', '#search-discard-btn', function() {
    $('#discard-panel').attr('mode', 'true');
    var playerId = $('#switch-btn').attr('current-player');
    // Hide the hand
    $('#hands-list').hide();

    $.ajax({
        url: 'smashUp/discard/' + playerId,
        method: 'GET',
        dataType: 'json',
        success: function(cards) {
            // Render all cards into the discard list
            $.each(cards, function(index, card) {
                renderCard(card, $('#discard-list'), false, playerId);
            });

            turnOnModeButton();

            // Hide the action nav
            toggleActionNav();

            // Make the discard cards clickable cards
            $('#discard-list .card-panel').addClass('clickable-card').css('opacity', '1');

            // Make other cards in play not actionable
            $('.base-panel').removeClass('clickable-base').css('opacity', '0.6');
            $('#tabletop .card-panel').removeClass('clickable-card').css('opacity', '0.6');
            $('#in-play-list .card-panel').removeClass('clickable-card').css('opacity', '0.6');

            $('#discard-panel').show();
        }
    });
});

/**
 * Get deck view
 */
$('#action-nav').on('click', '#search-deck-btn', function() {
    $('#deck-panel').attr('mode', 'true');
    var playerId = $('#switch-btn').attr('current-player');
    // Hide the hand
    $('#hands-list').hide();

    $.ajax({
        url: 'smashUp/deck/' + playerId,
        method: 'GET',
        dataType: 'json',
        success: function(cards) {
            // Render all cards into the discard list
            $.each(cards, function(index, card) {
                renderCard(card, $('#deck-list'), false, playerId);
            });

            turnOnModeButton();

            // Hide the action nav
            toggleActionNav();

            // Make the deck cards clickable cards
            $('#deck-list .card-panel').addClass('clickable-card').css('opacity', '1');

            // Make other cards in play not actionable
            $('.base-panel').removeClass('clickable-base').css('opacity', '0.6');
            $('#tabletop .card-panel').removeClass('clickable-card').css('opacity', '0.6');
            $('#in-play-list .card-panel').removeClass('clickable-card').css('opacity', '0.6');

            $('#deck-panel').show();
            logHistory('<strong>Player ' + playerId + '</strong> looked through the deck.');
        }
    });
});

/**
 * Exit the discard view
 */
$('#discard-exit-btn').click(function() {
    if ($(this).attr('disabled') === 'disabled') return;

    $('#discard-list').empty();
    $('#discard-panel').attr('mode', 'false');
    $('#discard-panel').hide();

    // Same logic from toggleStagingUI
    $('#hand-buttons btn').attr('disabled', false);
    $('.base-panel').css('opacity', '1');
    $('.card-panel').css('opacity', '1');
    $('#hands-list').fadeIn(300);
    $('#hand-selection .card-panel').fadeIn(300);
    $('#in-play-list .card-panel').addClass('clickable-card');
    $('#tabletop .card-panel').addClass('clickable-card');
    toggleActionNav();
    toggleClickableBase();
});

/**
 * Exit the deck view
 */
$('#deck-exit-btn').click(function() {
    if ($(this).attr('disabled') === 'disabled') return;

    var playerId = $('#switch-btn').attr('current-player');

    $('#deck-list').empty();
    $('#deck-panel').attr('mode', 'false');
    $('#deck-panel').hide();

    // Same logic from toggleStagingUI
    $('#hand-buttons btn').attr('disabled', false);
    $('.base-panel').css('opacity', '1');
    $('.card-panel').css('opacity', '1');
    $('#hands-list').fadeIn(300);
    $('#hand-selection .card-panel').fadeIn(300);
    $('#in-play-list .card-panel').addClass('clickable-card');
    $('#tabletop .card-panel').addClass('clickable-card');
    toggleActionNav();
    toggleClickableBase();

    $.ajax({
        url: 'smashUp/deck/' + playerId + '/shuffle',
        method: 'GET',
        success: function() {
            logHistory('<strong>Player ' + playerId + '</strong> shuffled their deck.');
        }
    });
});

/**
 * card parameter has to be a jQuery object
 */
function isFromBaseOrDeck(card) {
    var cardLocation = card.attr('location');
    if (cardLocation === 'discard') {
        removeFromDiscard(card.attr('faction-id'), card.attr('owner'));
    } else if (cardLocation === 'deck') {
        removeFromDeck(card.attr('faction-id'), card.attr('owner'));
    }
}

/**
 * Remove the card from the backend in the deck
 */
function removeFromDeck(cardId, playerId) {
    $.ajax({
        url: '/smashUp/deck/' + playerId + '/' + cardId,
        method: 'DELETE',
        error: function() {
            console.log('Unable to remove card from deck.');
        }
    });
}

/**
 * Remove the card from the backend in the discard
 */
function removeFromDiscard(cardId, playerId) {
    $.ajax({
        url: '/smashUp/discard/' + playerId + '/' + cardId,
        method: 'DELETE',
        error: function() {
            console.log('Unable to remove card from deck.');
        }
    });
}