import {injectCharacterGearsPowerBulk} from "./injectors/characters"
import {injectProfile} from "./injectors/profile"

function processCharacters() {
    const serversList = document.querySelectorAll(".profile-character-list__char")
    injectCharacterGearsPowerBulk(serversList)
}

function processProfile() {
    const html = document.querySelector("html")
    if (html) {
        injectProfile(html.innerHTML)
    }
}

processCharacters()
processProfile()