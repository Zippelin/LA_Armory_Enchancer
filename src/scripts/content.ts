import { injectCharacterGearsPowerBulk, injectSortingButtonsBulk } from "./injectors/characters";
import { injectCharactersRaitingBulk } from "./injectors/gsraiting";
import { injectProfile } from "./injectors/profile";

function processCharacters() {
    injectCharacterGearsPowerBulk();
    injectSortingButtonsBulk();
}

function processProfile() {
    injectProfile();
}

function processGSRaiting() {
    injectCharactersRaitingBulk();
}

processCharacters();
processProfile();
processGSRaiting();
