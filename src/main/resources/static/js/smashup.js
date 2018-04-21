/* Initial setup */
setUpFactionList();
$('#in-play-list-wrapper').hide();
$('#peek-panel').hide();
$('#deck-panel').hide();
$('#discard-panel').hide();

/**
 * Once the game is confirmed, it will set up the game play
 */
$('#confirm-screen').on('click', '#start-game-btn', function() {
    // Remove all cards from the last game
    $('.card-panel').remove();
    // Reset current player
    $('#draw-btn, #switch-btn').attr('current-player', 1);
    $('#in-play-list-wrapper').hide();
    $('#peek-panel').hide();
    $('#deck-panel').hide();
    $('#discard-panel').hide();

    // Get information on what factions were selected
    var factionIds = [];
    var factionColors = [];
    var factionUrls = [];
    var factionNames = [];
    $('.player-select img').each(function() {
        factionIds.push($(this).attr('faction-id'));
        factionColors.push($(this).attr('faction-color'));
        factionUrls.push($(this).attr('src'));
        factionNames.push($(this).attr('faction-name'));
    });

    // Makes the initial call to set up the decks for the game
    $.ajax({
        url: 'smashUp/game/p1/' + factionIds[0] + '/' + factionIds[1] + '/p2/' + factionIds[2] + '/' + factionIds[3],
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(INITIALIZER),
        success: function(data) {
            setBases(data.bases);
            setHands(data.player1, data.player2);
            setFactionFlags(factionColors, factionUrls, factionNames);
        }, error: function() {
            console.log("Error in initializing game.");
        }
    });

    $('#game-panel .player-row:first').css('min-height', '350px');

    $(this).fadeOut();
    $('#fro').fadeOut();
    $('#game-panel').fadeIn(800);
    $('#history-modal .modal-body').empty();
    logHistory('Game started.');
    toggleActionNav();
    $('#history-btn').removeClass('hidden');
});

/**
 * Renders the faction flags used for scoring
 */
function setFactionFlags(factionColors, factionUrls, factionNames) {
    var team1 = $('#team-1');
    var team2 = $('#team-2');

    team1.css('background-image', 'url(' + factionUrls[0] + '), url(' + factionUrls[1]+ '), linear-gradient(90deg, #' + factionColors[0] + ' 50%, #' + factionColors[1] + ' 50%)');
    team2.css('background-image', 'url(' + factionUrls[2] + '), url(' + factionUrls[3]+ '), linear-gradient(90deg, #' + factionColors[2] + ' 50%, #' + factionColors[3] + ' 50%)');
    team1.css('background-repeat', 'no-repeat, no-repeat, no-repeat');
    team2.css('background-repeat', 'no-repeat, no-repeat, no-repeat');
    team1.css('background-size', '80px 80px, 80px 80px, 100%');
    team2.css('background-size', '80px 80px, 80px 80px, 100%');
    team1.css('background-position', 'left bottom, right bottom, left');
    team2.css('background-position', 'left bottom, right bottom, left');

    $('.team-name:first').text(factionNames[0] + " & " + factionNames[1]);
    $('.team-name:last').text(factionNames[2] + " & " + factionNames[3]);
    $('.team-score').text('0');
}

/*
 * Initializes game play with the first three bases and renders them to the table
 */
function setBases(bases) {
    /* Initialize bases */
    $('#base-1 .base-breakpoint').text(bases[0].breakPoint);
    $('#base-2 .base-breakpoint').text(bases[1].breakPoint);
    $('#base-3 .base-breakpoint').text(bases[2].breakPoint);

    $('#base-1').css('background-image', 'url("/img/' + bases[0].faction.toLowerCase().replace(' ', '_') + '.png")');
    $('#base-2').css('background-image', 'url("/img/' + bases[1].faction.toLowerCase().replace(' ', '_') + '.png")');
    $('#base-3').css('background-image', 'url("/img/' + bases[2].faction.toLowerCase().replace(' ', '_') + '.png")');

    $('#base-1').attr('faction-name', bases[0].faction);
    $('#base-2').attr('faction-name', bases[1].faction);
    $('#base-3').attr('faction-name', bases[2].faction);

    $('#base-1').attr('faction-color', bases[0].color);
    $('#base-2').attr('faction-color', bases[1].color);
    $('#base-3').attr('faction-color', bases[2].color);

    $('#base-1').attr('base-id', bases[0].id);
    $('#base-2').attr('base-id', bases[1].id);
    $('#base-3').attr('base-id', bases[2].id);

    $('#base-1').css('background-color', '#' + bases[0].color);
    $('#base-2').css('background-color', '#' + bases[1].color);
    $('#base-3').css('background-color', '#' + bases[2].color);

    $('#base-1 .base-name').text(bases[0].name);
    $('#base-2 .base-name').text(bases[1].name);
    $('#base-3 .base-name').text(bases[2].name);

    $('#base-1 .base-rewards').text(bases[0].firstPlace + "" + bases[0].secondPlace + "" + bases[0].thirdPlace);
    $('#base-2 .base-rewards').text(bases[1].firstPlace + "" + bases[1].secondPlace + "" + bases[1].thirdPlace);
    $('#base-3 .base-rewards').text(bases[2].firstPlace + "" + bases[2].secondPlace + "" + bases[2].thirdPlace);

    $('#base-1 .base-description').text(bases[0].description);
    $('#base-2 .base-description').text(bases[1].description);
    $('#base-3 .base-description').text(bases[2].description);
}

/**
 * Initializes hands at the start of the game for both players.
  */
function setHands(player1, player2) {
    var handList = $('.hand-list[player=1]');
    handList.empty();

    for (var i = 0; i < player1.length; i++) {
        renderCard(player1[i], handList, false, 1);
    }
    handList.fadeIn();

    var handList = $('.hand-list[player=2]');
    handList.hide();
    handList.empty();

    for (var i = 0; i < player2.length; i++) {
        renderCard(player2[i], handList, false, 2);
    }

    $('[data-toggle="popover"]').popover();
}

