import { getCharacterData } from "../loader";

import {
    getGearPowerWrapperTemplate,
    getClassIconTemplate,
    getGearPowerTitleTemplate,
    getCurrrentGearPowerTemplate,
    getMaxGearPowerTemplate,
    getSortingWrapperTemplate,
    getOrderNumberTemplate,
} from "../templates/characters";

import { getClassIconUrl, getCurrentGearsPower, getMaxGearsPowers } from "../parser";

import { SortingOptions } from "../constants/vars";

import {
    CHARACTERS_PANEL_CLASS,
    CHARACTERS_SERVERS_CLASS,
    INJECTOR_GEARS_POWER_PENDING,
} from "../constants/css";

/*
    Встройка ГС для списка персонажей скопом
*/
export function injectCharacterGearsPowerBulk(): void {
    const charactersPanel = document.querySelectorAll(".".concat(CHARACTERS_PANEL_CLASS));
    if (charactersPanel) {
        for (let i = 0; i < charactersPanel.length; i++) {
            const server = charactersPanel[i].getElementsByTagName("button");
            for (let j = 0; j < server.length; j++) {
                injectCharaterGearsPower(
                    server[j].getElementsByTagName("span")[0].innerHTML,
                    server[j]
                );
                injectOrderNumber(server[j], j);
            }
        }
    }
}

/*
    Встройка ГС для конкретного персонажа
*/
function injectCharaterGearsPower(characterName: string, targetDom: HTMLButtonElement): void {
    const injection = getGearPowerWrapperTemplate();
    targetDom.insertAdjacentElement("beforeend", injection);
    getCharacterData(characterName, _inject);

    function _inject(text: string) {
        disableePendingIndicator(injection);

        injection.appendChild(getClassIconTemplate(getClassIconUrl(text)));
        injection.appendChild(getGearPowerTitleTemplate());
        injection.appendChild(getCurrrentGearPowerTemplate(getCurrentGearsPower(text)));
        injection.appendChild(getMaxGearPowerTemplate(getMaxGearsPowers(text)));
    }
}

/*
    Встройка Порядкового номера
*/
function injectOrderNumber(targetDom: HTMLButtonElement, orderNumber: number): void {
    targetDom.insertAdjacentElement("beforebegin", getOrderNumberTemplate(orderNumber + 1));
}

function disableePendingIndicator(targetDom: HTMLDivElement): void {
    const pending = targetDom.getElementsByClassName(INJECTOR_GEARS_POWER_PENDING);
    if (pending) {
        targetDom.removeChild(pending[0]);
    }
}

/*
    Встраиваем функцию сортировки персонажей на аккаунте
*/
export function injectSortingButtonsBulk() {
    const serversList = document.querySelectorAll(".".concat(CHARACTERS_SERVERS_CLASS));

    for (let i = 0; i < serversList.length; i++) {
        // Устанавливаем какой контейнер будет сортировать
        const sortingTarget = serversList[i].nextSibling?.nextSibling as HTMLDivElement;
        serversList[i].appendChild(getSortingWrapperTemplate(SortingOptions, sortingTarget));
    }
}
