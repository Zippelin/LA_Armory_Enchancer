import { SortingOptionType } from "../types";

export function getClassIconTemplate(iconUrl: string): HTMLImageElement {
    const img = document.createElement("img");
    img.src = iconUrl;
    img.style.height = "20px";
    img.style.width = "20px";
    img.classList.add("js-injection--class-icon");
    return img;
}

export function getGearPowerTitleTemplate(): HTMLDivElement {
    const header = document.createElement("div");
    header.innerHTML = "Снаряжение:";
    header.classList.add("js-injection--gears-power-header");
    return header;
}

export function getCurrrentGearPowerTemplate(
    gearPower: string
): HTMLDivElement {
    const currentPower = document.createElement("div");
    currentPower.innerHTML = gearPower;
    currentPower.classList.add("js-injection--gears-power-values-major");
    return currentPower;
}

export function getMaxGearPowerTemplate(gearPower: string): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.classList.add("js-injection--gears-power-values-minor");
    const splitter = document.createElement("div");
    splitter.innerHTML = "/";
    splitter.classList.add("js-injection--gears-power-values-minor");
    const maxPower = document.createElement("div");
    maxPower.innerHTML = gearPower;
    maxPower.classList.add("js-injection--gears-power-values-minor");
    wrapper.appendChild(splitter);
    wrapper.appendChild(maxPower);
    return wrapper;
}

export function getGearPowerWrapperTemplate(): HTMLDivElement {
    const gearsPowerLevel = document.createElement("div");
    gearsPowerLevel.classList.add("js-injection--gears-power-wrapped");
    const loadingIndication = document.createElement("span");
    loadingIndication.innerHTML = "загружаю...";
    loadingIndication.classList.add("js-injection--gears-power-pending");
    gearsPowerLevel.appendChild(loadingIndication);
    return gearsPowerLevel;
}

export function getSortingWrapperTemplate(
    sortingOptions: SortingOptionType[],
    sortingDom: HTMLDivElement
): HTMLSpanElement {
    const wrapper = document.createElement("span");
    wrapper.classList.add("js-injection--sorter-wrapper");

    const title = document.createElement("span");
    title.classList.add("js-injection--sorter-title");
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
            buttonWrapper.classList.add("js-injection--sorter-button-active");
        } else {
            buttonWrapper.classList.add("js-injection--sorter-button");
        }
        wrapper.append(buttonWrapper);
    }
    return wrapper;
}

export function getOrderNumberTemplate(orderNumber: number): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = "[" + orderNumber.toString() + "]";
    wrapper.classList.add("js-injection--character-order");
    return wrapper;
}
