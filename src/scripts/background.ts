import { getCharacterData } from "./loader";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.signal === "fetchCharacterPage") {
        getCharacterData(request.charName, sendResponse);
    }

    return true;
});
