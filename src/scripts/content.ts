import {
    injectCharacterGearsPowerBulk,
    injectSortingButtonsBulk,
} from "./injectors/characters";
import { injectProfile } from "./injectors/profile";

function processCharacters() {
    injectCharacterGearsPowerBulk();
    injectSortingButtonsBulk();
}

function processProfile() {
    injectProfile();
}

processCharacters();
processProfile();
