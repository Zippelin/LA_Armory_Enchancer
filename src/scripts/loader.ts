import { getArmoryCharacterUrl } from "./tools/url";

export function getCharacterData(characterName: string, callback: Function) {
    fetch(getArmoryCharacterUrl(characterName)).then((response) => {
        response.text().then((text) => {
            callback(text);
        });
    });
}
