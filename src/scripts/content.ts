import {injectCharacterGearsPowerBulk, injectSortingButtonsBulk} from "./injectors/characters"
import {injectProfile} from "./injectors/profile"

function processCharacters() {
    injectCharacterGearsPowerBulk()
    injectSortingButtonsBulk()
}

function processProfile() {
    const html = document.querySelector("html")
    if (html) {
        injectProfile(html.innerHTML)
    }
}

processCharacters()
processProfile()