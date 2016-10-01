/** All click events in this js file pertain to actionable events that happen during the game **/

/**
 * Makes changes to the UI when a card moves in/out of staging mode
 */
function toggleStagingUI(card) {
    var location = card.attr('location');

    // Determine whether or not to show the in play list
    if ($('#in-play-list').find('.card-panel').length > 0) {
        $('#in-play-list-wrapper').show();
    } else {
        $('#in-play-list-wrapper').hide();
    }

    if (card.attr('staging')) {
        // If the card is already in staging, reset the UI
        card.removeAttr('staging');

        turnOnModeButton();

        // If we're not it a different mode, re-show the hand list and re-add clickable-card class to in play cards
        if (!isInDifferentMode()) {
            $('#peek-panel').hide();    // If last card in peek panel was just played, hide the peek panel
            $('#hand-selection btn').attr('disabled', false);
            $('.base-panel').css('opacity', '1');
            $('.card-panel').css('opacity', '1');
            $('#hands-list').fadeIn(300);
            $('#hand-selection .card-panel').not(card).fadeIn(300);
            $('#in-play-list .card-panel').addClass('clickable-card');
            $('#tabletop .card-panel').not(card).addClass('clickable-card');
        } else {
            // Can't make in-play-list cards actionable if we're in another mode
            $('#in-play-list .card-panel').css('opacity', '0.6').removeClass('clickable-card');

            if (isInPeekMode()) {
                // Make the peeking cards clickable cards
                $('#peek-list .card-panel').addClass('clickable-card').css('opacity', '1').fadeIn(300);
            } else if (isInDiscardMode()) {
                $('#discard-list .card-panel').addClass('clickable-card').css('opacity', '1').fadeIn(300);
            } else if (isInDeckMode()) {
                $('#deck-list .card-panel').addClass('clickable-card').css('opacity', '1').fadeIn(300);
            }

            // Make other cards in play not actionable
            $('.base-panel').removeClass('clickable-base').css('opacity', '0.6');
            $('#tabletop .card-panel').removeClass('clickable-card').css('opacity', '0.6');
            $('#in-play-list .card-panel').removeClass('clickable-card').css('opacity', '0.6');
        }

        // Hide the action list
        hideActionList();

        // Remove any actionable designations in play
        $('[actionable]').attr('actionable', false);
    } else {
        // Put card into staging
        card.attr('staging', true);

        turnOffModeButton();

        // Disable the hand buttons
        $('#hand-selection btn').attr('disabled', true);

        // Make other cards in play not actionable
        $('#tabletop .card-panel').not(card).removeClass('clickable-card');
        $('#in-play-list .card-panel').not(card).removeClass('clickable-card').css('opacity', '0.6');

        // Disable any cards not in staging in the hand selection (hand, discard, deck)
        $('#hand-selection .card-panel').not(card).fadeOut(300);

        // Update the action list then show it
        determinePossibleActions(card);
        $('#action-list').fadeIn(300);

        if (card.attr('can-play-on-minion') === 'true') {   // Action on minion
            makeMinionsActionable();
        } else if (card.attr('can-play-on-base') === 'true') {  // Action on base
            makeBasesActionable();
        } else {
            if (card.attr('card-type') === 'ACTION') {  // One-time action in-play
                $('.card-panel').not(card).css('opacity', '0.6');
            } else if (location === 'play') {  //  Minion from play
                // Gets here if it's a minion in play
                $('#tabletop .card-panel').not(card).css('opacity', '0.6');
                $('#hands-list').fadeOut(300);
            } else if (location === 'hand' || location === 'peek' || location === 'discard' || location === 'deck') {
                // Minion from hand, peek, discard, or deck
                $('#tabletop .card-panel').css('opacity', '0.6');
            }
        }
    }

    // Toggle the action nav and clickable base
    if (!isInDifferentMode()) {
        toggleActionNav();
        toggleClickableBase();
    }
}

/**
 * When a card enters staging mode, we need to determine what kind of actions can be performed on it.
 */
function determinePossibleActions(card) {
    var actionList = $('#action-list');
    var cardLocation = card.attr('location');
    actionList.empty();

    // Check if this is a base card
    if (card.hasClass('base-panel')) {
        renderBaseActions();
        return;
    }

    // Check if minion. If yes, make all bases actionable
    if (card.find('.minion-power').length != 0) {
        $('.base-panel').attr('actionable', true);
        $('.base-panel').css('opacity', '1');
    }

    if (card.attr('card-type') == 'ACTION' && card.attr('can-play-on-base') == 'false'
        && card.attr('can-play-on-minion') == 'false' && card.attr('location') != 'play') {
            actionList.append('<button id="play-btn" class="btn btn-success" role="button">Play</button>');
    }

    if (cardLocation === 'play') {
        actionList.append('<button id="power-counter-btn" class="btn btn-default" role="button">Set Power Counters</button>');

        if (card.attr('card-type') === 'MINION') {
            actionList.append('<button id="transfer-btn" class="btn btn-default" role="button">Transfer Ownership</button>');
        }
    }

    if (cardLocation != 'hand') {
        actionList.append('<button id="return-btn" class="btn btn-default" role="button">Place in Owner\'s Hand</button>');
    }

    if (cardLocation != 'peek' && cardLocation != 'deck') {
        actionList.append('<button id="shuffle-deck-btn" class="btn btn-default" role="button">Shuffle into deck</button>');
    }

    if (cardLocation != 'deck') {
        actionList.append('<button id="deck-top-btn" class="btn btn-default" role="button">To top of deck</button>');
        actionList.append('<button id="deck-bottom-btn" class="btn btn-default" role="button">To bottom of deck</button>');
    }

    if (cardLocation != 'discard') {
        actionList.append('<button id="discard-btn" class="btn btn-danger" role="button">Discard</button>');
    }
}

// Adds the base actions when a base is in staging mode
function renderBaseActions() {
    var actionList = $('#action-list');
    actionList.append('<button id="base-discard-btn" class="btn btn-default" role="button">Move Cards on this Base to Discard</button>');
    actionList.append('<button id="deck-base-swap-btn" class="btn btn-default" role="button">Search Deck & Swap</button>');
    actionList.append('<button id="discard-base-swap-btn" class="btn btn-default" role="button">Discard & Replace from Discard</button>');
    actionList.append('<button id="base-discard-and-replace" class="btn btn-danger" role="button">Discard & Replace from Deck</button>');
}

function turnOnModeButton() {
    if (isInDeckMode()) {
        $('#deck-exit-btn').attr('disabled', false);
    } else if (isInDiscardMode()) {
        $('#discard-exit-btn').attr('disabled', false);
    }
}

function turnOffModeButton() {
    if (isInDeckMode()) {
        $('#deck-exit-btn').attr('disabled', true);
    } else if (isInDiscardMode()) {
        $('#discard-exit-btn').attr('disabled', true);
    }
}

/**
 * Called when the user clicks a base card in play and puts it into staging
 */
$('#tabletop').on('click', '.base-panel.clickable-base', function() {
    toggleStagingUI($(this));
});

/**
 * Called when the user clicks a card in their hand.
 */
$('#hands-list').on('click', '.card-panel', function() {
    toggleStagingUI($(this));
});

/**
 * A card in play has to be a clickable-card type in order to be clicked
 */
$('#in-play-list').on('click', '.card-panel.clickable-card', function() {
    toggleStagingUI($(this));
});

$('#peek-list').on('click', '.card-panel.clickable-card', function() {
    toggleStagingUI($(this));
});

$('#discard-list').on('click', '.card-panel.clickable-card', function() {
    toggleStagingUI($(this));
});

$('#deck-list').on('click', '.card-panel.clickable-card', function() {
    toggleStagingUI($(this));
});

/**
 * Called when the 'Discard & Replace from Deck' button is called in the action list for a base
 */
$('#action-list').on('click', '#base-discard-and-replace', function() {
    var oldBase = $('.base-panel[staging=true]');

    // Get the new base card
    $.ajax({
        url: 'smashUp/draw/0',
        method: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        success: function(newBase) {
            logHistory(
                'Sent base <strong>' + oldBase.find('.base-name').text() + '</strong> to discard and put <strong>' +
                newBase.name + '</strong> into play from top of base deck.'
            );

            var base = createBaseJSON(oldBase);
            renderBase(oldBase, newBase);
            toggleStagingUI(oldBase);

            // Send the old base card to the discard
            $.ajax({
                url: 'smashUp/discard/base',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(base),
                error: function() {
                    console.log("Error in sending base card to the discard pile.");
                }
            });
        }, error: function() {
            console.log("Error in getting new base from discard pile.");
        }
    });
});

/**
 * When the user clicks a base from the base modal, we're replacing it
 */
$('#base-modal').on('click', '.base-panel[location=discard]', function() {
    // Remove the new base from the discard pile, and add the new base into the discard pile
    var oldBase = $('.base-panel[staging]');
    var newBase = $(this);

    logHistory(
        'Sent base <strong>' + oldBase.find('.base-name').text() + '</strong> to discard and put <strong>' +
        newBase.find('.base-name').text() + '</strong> into play from the base discard.'
    );

    // Send the old base card to the discard
    $.ajax({
        url: 'smashUp/discard/base',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(createBaseJSON(oldBase)),
        success: function() {
            var newBaseId = newBase.attr('base-id');
            renderBase(oldBase, createBaseJSON(newBase));

            // Remove the new base from the discard
            $.ajax({
                url: 'smashUp/discard/0/' + newBaseId,
                method: 'DELETE',
                success: function() {
                    $('#base-modal').modal('hide');
                    toggleStagingUI(oldBase);
                },
                error: function() {
                    console.log('Error in removing base from discard.');
                }
            });
        },
        error: function() {
            console.log('Error in sending base card to the discard pile.');
        }
    });
});

/**
 * When the user clicks a base from the base modal, we're replacing it
 */
$('#base-modal').on('click', '.base-panel[location=deck]', function() {
    // Remove the new base from the deck pile, and add the new base into the deck pile
    var oldBase = $('.base-panel[staging]');
    var newBase = $(this);

    logHistory(
        'Sent base <strong>' + oldBase.find('.base-name').text() + '</strong> to deck and put <strong>' +
        newBase.find('.base-name').text() + '</strong> into play from the base deck, and shuffled deck.'
    );

    // Send the old base card to the deck
    $.ajax({
        url: 'smashUp/deck/middle/base',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(createBaseJSON(oldBase)),
        success: function() {
            var newBaseId = newBase.attr('base-id');
            renderBase(oldBase, createBaseJSON(newBase));

            // Remove the new base from the deck
            $.ajax({
                url: 'smashUp/deck/0/' + newBaseId,
                method: 'DELETE',
                success: function() {
                    $('#base-modal').modal('hide');
                    toggleStagingUI(oldBase);
                },
                error: function() {
                    console.log('Error in removing base from deck.');
                }
            });
        },
        error: function() {
            console.log('Error in sending base card to the deck pile.');
        }
    });
});

/**
 * Called when the user wants to swap a base in play for one in the discard
 */
$('#action-list').on('click', '#discard-base-swap-btn', function() {
    // Get the base discard list
    $.ajax({
        url: 'smashUp/discard/0',
        method: 'GET',
        dataType: 'json',
        success: function(bases) {

            // If the base discard is empty, this action is not available
            if (bases.length === 0) {
                alert("There are no bases in the discard.");
                return;
            }

            // Empty the current modal
            $('#base-modal .modal-body').empty();

            $.each(bases, function(index, base) {
                renderBaseInModal('discard', base);
            });
            $('#base-modal').modal();
        }
    });
});

/**
 * Called when the user wants to swap a base in play for one in the base deck
 */
$('#action-list').on('click', '#deck-base-swap-btn', function() {
    // Get the base discard list
    $.ajax({
        url: 'smashUp/deck/0',
        method: 'GET',
        dataType: 'json',
        success: function(bases) {

            var playerId = $('#switch-btn').attr('current-player');

            logHistory(
                '<strong>Player ' + playerId + '</strong> looked through the base deck.'
            );

            // If the base deck is empty, this action is not available.
            if (bases.length === 0) {
                alert("There are no bases left in the deck!");
                return;
            }

            // Empty the current modal
            $('#base-modal .modal-body').empty();

            $.each(bases, function(index, base) {
                renderBaseInModal('deck', base);
            });
            $('#base-modal').modal();
        }
    });
});

function renderBaseInModal(cardLocation, base) {
    var modal = $('#base-modal .modal-body');

    modal.append(
        '<div class="panel panel-default base-panel clickable-base" faction-name="' + base.faction + '" ' +
            'faction-color="' + base.color + '" base-id="' + base.id + '" location="' + cardLocation + '">' +
            '<div class="base-overlay"></div>' +
            '<div class="panel-body">' +
                '<div class="base-header">' +
                    '<span class="base-breakpoint">' + base.breakPoint + '</span>' +
                    '<span class="base-name">' + base.name + '</span>' +
                '</div>' +
                '<div class="base-rewards">' + base.firstPlace + '' + base.secondPlace + '' + base.thirdPlace + '</div>' +
                '<div class="base-description">' + base.description + '</div>' +
            '</div>' +
        '</div>'
    );

    var currentBase = $('#base-modal').find('.base-panel:last');

    currentBase.css('background-image', 'url("/img/' + base.faction.toLowerCase().replace(' ', '_') + '.png")');
    currentBase.css('background-color', '#' + base.color);
}