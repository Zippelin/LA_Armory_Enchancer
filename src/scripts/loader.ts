import {AMORY_URL} from "./constants/urls"

export function getProfileData(profileName: string, callback: Function) {
    fetch(
        AMORY_URL + profileName
    ).then(
        (response) => {
            response.text().then((text) => {
                callback(text)
            })
            
        }
    )
}