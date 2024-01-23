import {getCharacterData} from "../loader"
import {
    getGearPowerWrapperTemplate, 
    getClassIconTemplate,
    getGearPowerTitleTemplate,
    getCurrrentGearPowerTemplate,
    getMaxGearPowerTemplate,
    getSortingWrapperTemplate,
    getOrderNumberTemplate
} from "../templates/characters"
import {
    getClassIconUrl,
    getCurrentGearsPower,
    getMaxGearsPowers,
    getOrderNumber
} from "../parser"
import {SortingOptionType} from "../types"
import {CharactersSortBy} from "../constants/vars"

/*
    Встройка ГС для списка персонажей скопом
*/
export function injectCharacterGearsPowerBulk(): void {
    const charactersPanel = document.querySelectorAll(".profile-character-list__char")
    if (charactersPanel) {
        for (let i = 0; i < charactersPanel.length; i++) {
            const server = charactersPanel[i].getElementsByTagName("button")
            for (let j = 0; j < server.length; j++) {
                injectCharaterGearsPower(
                    server[j].getElementsByTagName("span")[0].innerHTML,
                    server[j]
                    )
                injectOrderNumber(server[j], j)
            }
        }
    }
}

/*
    Встройка ГС для конкретного персонажа
*/
function injectCharaterGearsPower(
    characterName: string,
    targetDom: HTMLButtonElement    
    ): void {

        const injection = getGearPowerWrapperTemplate()
        targetDom.insertAdjacentElement('beforeend', injection)
        getCharacterData(characterName, _inject)

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

/*
    Встройка Порядкового номера
*/
function injectOrderNumber(targetDom: HTMLButtonElement, orderNumber: number): void {
    targetDom.insertAdjacentElement('beforebegin', getOrderNumberTemplate(orderNumber + 1))
}


function disableePendingIndicator(targetDom: HTMLDivElement): void {
    const pending = targetDom.getElementsByClassName('js-injection--gears-power-pending')
    if (pending) {
        targetDom.removeChild(pending[0])
    }
}

/*
    Встраиваем функцию сортировки персонажей на аккаунте
*/
export function injectSortingButtonsBulk() {

    /*
        Декоратор для установки типа сортировки и порядка
    */
    function sorterWrapper(sortByType: number, descending: number) {
        // устанавливаем цель сортировки
        function sorterSelector(sortingDom: HTMLDivElement) {
            function sortBy(source: PointerEvent) {
                // выбиракем заголовок с кнопками сортировки
                const headerWithSortButton = sortingDom.previousSibling?.previousSibling as HTMLElement
                
                // снимаем активность с ранней кнопки
                const activeButton = headerWithSortButton.querySelector('.js-injection--sorter-button-active')
                activeButton?.classList.remove('js-injection--sorter-button-active')
                activeButton?.classList.add('js-injection--sorter-button')

                // делаем активной нажатую кнопку
                const target = source.target as HTMLElement
                target.parentElement?.classList.remove('js-injection--sorter-button')
                target.parentElement?.classList.add('js-injection--sorter-button-active')

                let children = sortingDom.children
                if (children.length > 1) {

                    let sortingList = [...children]

                    if (sortByType === CharactersSortBy.GEARS_POWER) {

                        sortingList.sort((a: Element, b: Element) => {
                            
                            const gearsPowerA = a.querySelector('.js-injection--gears-power-values-major')
                            const gearsPowerB = b.querySelector('.js-injection--gears-power-values-major')
                            if (gearsPowerA && gearsPowerB) {
                                if (parseInt(gearsPowerA.innerHTML.replace(',', '')) > parseInt(gearsPowerB.innerHTML.replace(',', ''))) {
                                    return -1 * descending
                                }
                            }
                            return 1 * descending
                        })
                    }

                    if (sortByType === CharactersSortBy.CREATION) {
                        sortingList.sort((a: Element, b: Element) => {
                            
                            const gearsPowerA = a.querySelector('.js-injection--character-order')
                            const gearsPowerB = b.querySelector('.js-injection--character-order')
                            if (gearsPowerA && gearsPowerB) {
                                if (parseInt(getOrderNumber(gearsPowerA.innerHTML)) > parseInt(getOrderNumber(gearsPowerB.innerHTML))) {
                                    return -1 * descending
                                }
                            }
                            return 1 * descending
                        })
                    }

                    for (let i = 0; i < children.length; i++) {
                        sortingDom.appendChild(sortingList[i])
                    }
                }

            }
            return sortBy
        }
        return sorterSelector
    }

    const serversList = document.querySelectorAll(".profile-character-list__server")

    const sortingOptions: SortingOptionType[] = [
        {
            label: "новее",
            sortByType: CharactersSortBy.CREATION,
            callback: sorterWrapper(CharactersSortBy.CREATION, -1),
            isCurrent: true,
        },         
        {
            label: "старее",
            sortByType: CharactersSortBy.CREATION,
            callback: sorterWrapper(CharactersSortBy.CREATION, 1),
            isCurrent: false,
        },        
        {
            label: "сильнее",
            sortByType: CharactersSortBy.GEARS_POWER,
            callback: sorterWrapper(CharactersSortBy.GEARS_POWER, 1),
            isCurrent: false,
        },        
        {
            label: "слабее",
            sortByType: CharactersSortBy.GEARS_POWER,
            callback: sorterWrapper(CharactersSortBy.GEARS_POWER, -1),
            isCurrent: false,
        },
    ]

    for (let i = 0; i < serversList.length; i++) {
        // Устанавливаем какой контейнер будет сортировать
        const sortingTarget = serversList[i].nextSibling?.nextSibling as HTMLDivElement
        serversList[i].appendChild(getSortingWrapperTemplate(sortingOptions, sortingTarget))       
    }
}