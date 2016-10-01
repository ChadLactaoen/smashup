/**
 * Converts a Base element into a json object
 */
function createBaseJSON(base) {

    return {
        id: base.attr('base-id'),
        name: base.find('.base-name').text(),
        description: base.find('.base-description').text(),
        breakPoint: parseInt(base.find('.base-breakpoint').text()),
        firstPlace: parseInt(base.find('.base-rewards').text().charAt(0)),
        secondPlace: parseInt(base.find('.base-rewards').text().charAt(1)),
        thirdPlace: parseInt(base.find('.base-rewards').text().charAt(2)),
        color: base.attr('faction-color'),
        faction: base.attr('faction-name'),
        cardType: "BASE"
    };
}

/**
 * Converts a Minion element (card-panel) into a json object
 */
function createMinionJSON(minion) {

    return {
        id: minion.attr('faction-id'),
        name: minion.find('.card-name').text(),
        power: parseInt(minion.find('.minion-power').text()),
        description: minion.attr('data-content'),
        faction: minion.attr('faction'),
        color: minion.attr('card-color'),
        cardType: "MINION"
    };
}

/**
 * Converts an Action element (card-panel) into a json object
 */
function createActionJSON(action) {

    return {
        id: action.attr('faction-id'),
        name: action.find('.card-name').text(),
        description: action.attr('data-content'),
        faction: action.attr('faction'),
        color: action.attr('card-color'),
        canBePlayedOnBase: action.attr('can-play-on-base') === 'true',
        canBePlayedOnMinion: action.attr('can-play-on-minion') === 'true',
        cardType: "ACTION"
    };
}