import {AMORY_URL} from "./constants/urls"
import {getAmroyCharaccterUrl} from "./tools/url"

export function getCharacterData(characterName: string, callback: Function) {
    fetch(
        getAmroyCharaccterUrl(characterName)
    ).then(
        (response) => {
            response.text().then((text) => {
                callback(text)
            })
            
        }
    )
}