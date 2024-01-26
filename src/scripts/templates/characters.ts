import {
    INJECTOR_CHARACTER_ORDER,
    INJECTOR_CLASS_ICON,
    INJECTOR_GEARS_POWER_HEADER,
    INJECTOR_GEARS_POWER_MAJOR,
    INJECTOR_GEARS_POWER_MINOR,
    INJECTOR_GEARS_POWER_PENDING,
    INJECTOR_GEARS_POWER_WRAPPER,
    INJECTOR_SORTER_ACTIVE,
    INJECTOR_SORTER_DEFAULT,
    INJECTOR_SORTER_TITLE,
    INJECTOR_SORTER_WRAPPER,
} from "../constants/css";
import { SortingOptionType } from "../types";

export function getClassIconTemplate(iconUrl: string): HTMLImageElement {
    const img = document.createElement("img");
    img.src = iconUrl;
    img.style.height = "20px";
    img.style.width = "20px";
    img.classList.add(INJECTOR_CLASS_ICON);
    return img;
}

export function getGearPowerTitleTemplate(): HTMLDivElement {
    const header = document.createElement("div");
    header.innerHTML = "Снаряжение:";
    header.classList.add(INJECTOR_GEARS_POWER_HEADER);
    return header;
}

export function getCurrrentGearPowerTemplate(gearPower: string): HTMLDivElement {
    const currentPower = document.createElement("div");
    currentPower.innerHTML = gearPower;
    currentPower.classList.add(INJECTOR_GEARS_POWER_MAJOR);
    return currentPower;
}

export function getMaxGearPowerTemplate(gearPower: string): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.classList.add(INJECTOR_GEARS_POWER_MINOR);
    const splitter = document.createElement("div");
    splitter.innerHTML = "/";
    splitter.classList.add(INJECTOR_GEARS_POWER_MINOR);
    const maxPower = document.createElement("div");
    maxPower.innerHTML = gearPower;
    maxPower.classList.add(INJECTOR_GEARS_POWER_MINOR);
    wrapper.appendChild(splitter);
    wrapper.appendChild(maxPower);
    return wrapper;
}

export function getGearPowerWrapperTemplate(): HTMLDivElement {
    const gearsPowerLevel = document.createElement("div");
    gearsPowerLevel.classList.add(INJECTOR_GEARS_POWER_WRAPPER);
    const loadingIndication = document.createElement("span");
    loadingIndication.innerHTML = "загружаю...";
    loadingIndication.classList.add(INJECTOR_GEARS_POWER_PENDING);
    gearsPowerLevel.appendChild(loadingIndication);
    return gearsPowerLevel;
}

export function getSortingWrapperTemplate(
    sortingOptions: SortingOptionType[],
    sortingDom: HTMLDivElement
): HTMLSpanElement {
    const wrapper = document.createElement("span");
    wrapper.classList.add(INJECTOR_SORTER_WRAPPER);

    const title = document.createElement("span");
    title.classList.add(INJECTOR_SORTER_TITLE);
    title.innerHTML = "Сортировка:";
    title.style.marginRight = "10px";

    wrapper.appendChild(title);

    for (let i = 0; i < sortingOptions.length; i++) {
        const buttonWrapper = document.createElement("span");

        const button = document.createElement("button");
        button.innerHTML = sortingOptions[i].label;
        button.onclick = sortingOptions[i].callback(sortingDom);

        buttonWrapper.appendChild(button);
        if (i < sortingOptions.length) {
            buttonWrapper.style.marginRight = "10px";
        }
        if (sortingOptions[i].isCurrent) {
            buttonWrapper.classList.add(INJECTOR_SORTER_ACTIVE);
        } else {
            buttonWrapper.classList.add(INJECTOR_SORTER_DEFAULT);
        }
        wrapper.append(buttonWrapper);
    }
    return wrapper;
}

export function getOrderNumberTemplate(orderNumber: number): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = "[" + orderNumber.toString() + "]";
    wrapper.classList.add(INJECTOR_CHARACTER_ORDER);
    return wrapper;
}
