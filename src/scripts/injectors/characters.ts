import { text } from "body-parser"
import {getProfileData} from "../loader"
import {
    getGearPowerWrapperTemplate, 
    getClassIconTemplate,
    getGearPowerTitleTemplate,
    getCurrrentGearPowerTemplate,
    getMaxGearPowerTemplate
} from "../templates/characters"
import {
    getClassIconUrl,
    getCurrentGearsPower,
    getMaxGearsPowers
} from "../parser"

export function injectCharacterGearsPowerBulk(charactersPanel: NodeListOf<Element>): void {
    const serversList = document.querySelectorAll(".profile-character-list__char")
    if (charactersPanel) {
        for (let i=0; i < charactersPanel.length; i++) {
            const server = serversList[i].getElementsByTagName("button")
            for (let j = 0; j < server.length; j++) {
                injectCharaterGearsPower(
                    server[j].getElementsByTagName("span")[0].innerHTML,
                    server[j]
                    )
            }
        }
    }
}

function injectCharaterGearsPower(
    characterName: string,
    targetDom: HTMLButtonElement    
    ): void {

        const injection = getGearPowerWrapperTemplate()
        targetDom.insertAdjacentElement('beforeend', injection)
        getProfileData(characterName, _inject)

    function _inject(text: string) {
        disableePendingIndicator(injection)
        
        injection.appendChild(
            getClassIconTemplate(getClassIconUrl(text))
            )
        injection.appendChild(
            getGearPowerTitleTemplate()
        )        
        injection.appendChild(
            getCurrrentGearPowerTemplate(
                getCurrentGearsPower(text)
            )
        )        
        injection.appendChild(
            getMaxGearPowerTemplate(
                getMaxGearsPowers(text)
            )
        )
    }
}


function disableePendingIndicator(targetDom: HTMLDivElement): void {
    const pending = targetDom.getElementsByClassName('js-injection--gears-power-pending')
    if (pending) {
        targetDom.removeChild(pending[0])
    }
}