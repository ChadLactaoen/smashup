
/**
 * Sets up the faction list on new game set up.
 */
function setUpFactionList() {

    // Hide the current game if any and fade in the selection screen
    $('#confirm-screen, #game-panel').hide();
    $('#fro').fadeIn();

    var img = $('.player-select img');
    img.removeAttr('faction-name');
    img.removeAttr('faction-id');
    img.attr('src', 'img/placeholder.png');
    img.next().remove();

    $('.faction-row').remove();

    // Make a call to get a list of all factions and populate
    $.ajax({
        url: 'smashUp/factions',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            $.each(data, function(i){
                var fro = $('#fro');
                var row = $('.faction-row:last');
                var imgPath = 'img/' + data[i].name.replace(' ', '_').toLowerCase() + '.png';

                if (i % 6 == 0) {
                    fro.append('<div class="row faction-row"></div>');
                    row = $('.faction-row:last');
                }
                row.append('<div class="col-lg-2 col-md-4"><div class="panel panel-default faction faction-panel" ' +
                            'faction-id="' + data[i].factionId + '" faction-name="' + data[i].name +
                            '" faction-color="' + data[i].color + '"><div class="panel-body"><h3 class="no-margin">' +
                            '<img src="' + imgPath + '" width="50" height="50"/> ' +
                            data[i].name +
                            '</h3></div></div></div>');
            });
        }
    });
}

/**
 * Fades in the 'Start Game' button after factions have been decided
 */
function createConfirmationScreen() {
    $('#confirm-screen').empty();
    $('#confirm-screen').append('<button id="start-game-btn" type="button" class="btn btn-lg btn-success" style="display:hidden">Start Game</button>');
    setTimeout(function() {
        $('#confirm-screen').fadeIn(800);
    }, 200);
}

/**
 * Called when a user selects a faction from the faction select screen
 */
$(document).on('click', '.faction', function() {
    if ($('img[src="img/placeholder.png"]').length == 0) {
        return;
    }
    var factionName = $(this).attr('faction-name');
    var factionId = $(this).attr('faction-id');
    var factionImgPath = $(this).find('img').first().attr('src');
    var factionSelect = $('img[src="img/placeholder.png"]').first();
    var factionColor = $(this).attr('faction-color');

    factionSelect.attr('src', factionImgPath);
    factionSelect.attr('faction-id', factionId);
    factionSelect.attr('faction-name', factionName);
    factionSelect.attr('faction-color', factionColor);
    factionSelect.after('<h4 style="display:inline-block">' + factionName + '</h4>');

    $(this).removeClass('faction');
    $(this).addClass('selected-faction');

    if ($('img[src="img/placeholder.png"]').length == 0) {
        $('.faction-row').fadeOut();
        createConfirmationScreen();
    }
});