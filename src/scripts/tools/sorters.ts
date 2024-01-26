import {
    INJECTOR_CHARACTER_ORDER,
    INJECTOR_GEARS_POWER_MAJOR,
    INJECTOR_SORTER_ACTIVE,
    INJECTOR_SORTER_DEFAULT,
} from "../constants/css";
import { CharactersSortBy } from "../constants/vars";
import { getOrderNumber } from "../parser";

/*
    Декоратор для установки типа сортировки и порядка для списка персонажей
*/
export function sorterCharsListDecorator(sortByType: number, descending: number) {
    // устанавливаем цель сортировки
    function sorterSelector(sortingDom: HTMLDivElement) {
        function sortBy(source: PointerEvent) {
            // выбираем заголовок с кнопками сортировки
            const headerWithSortButton = sortingDom.previousSibling?.previousSibling as HTMLElement;

            // снимаем активность с ранней кнопки
            const activeButton = headerWithSortButton.querySelector(
                ".".concat(INJECTOR_SORTER_ACTIVE)
            );
            activeButton?.classList.remove(INJECTOR_SORTER_ACTIVE);
            activeButton?.classList.add(INJECTOR_SORTER_DEFAULT);

            // делаем активной нажатую кнопку
            const target = source.target as HTMLElement;
            target.parentElement?.classList.remove(INJECTOR_SORTER_DEFAULT);
            target.parentElement?.classList.add(INJECTOR_SORTER_ACTIVE);

            let children = sortingDom.children;
            if (children.length > 1) {
                let sortingList = [...children];

                if (sortByType === CharactersSortBy.GEARS_POWER) {
                    sortingList.sort((a: Element, b: Element) => {
                        const gearsPowerA = a.querySelector(".".concat(INJECTOR_GEARS_POWER_MAJOR));
                        const gearsPowerB = b.querySelector(".".concat(INJECTOR_GEARS_POWER_MAJOR));
                        if (gearsPowerA && gearsPowerB) {
                            if (
                                parseInt(gearsPowerA.innerHTML.replace(",", "")) >
                                parseInt(gearsPowerB.innerHTML.replace(",", ""))
                            ) {
                                return -1 * descending;
                            }
                        }
                        return 1 * descending;
                    });
                }

                if (sortByType === CharactersSortBy.CREATION) {
                    sortingList.sort((a: Element, b: Element) => {
                        const gearsPowerA = a.querySelector(".".concat(INJECTOR_CHARACTER_ORDER));
                        const gearsPowerB = b.querySelector(".".concat(INJECTOR_CHARACTER_ORDER));
                        if (gearsPowerA && gearsPowerB) {
                            if (
                                parseInt(getOrderNumber(gearsPowerA.innerHTML)) >
                                parseInt(getOrderNumber(gearsPowerB.innerHTML))
                            ) {
                                return -1 * descending;
                            }
                        }
                        return 1 * descending;
                    });
                }

                for (let i = 0; i < children.length; i++) {
                    sortingDom.appendChild(sortingList[i]);
                }
            }
        }
        return sortBy;
    }
    return sorterSelector;
}
