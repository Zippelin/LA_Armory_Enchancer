import { text } from "body-parser";
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
import { createButton, createDiv, createImg, createSpan } from "./generator";

export function getClassIconTemplate(iconUrl: string): HTMLImageElement {
    return createImg({
        src: iconUrl,
        classes: [INJECTOR_CLASS_ICON],
        style: {
            height: "20px",
            width: "20px",
        },
    });
}

export function getGearPowerTitleTemplate(): HTMLDivElement {
    return createDiv({ text: "Снаряжение:", classes: [INJECTOR_GEARS_POWER_HEADER] });
}

export function getCurrrentGearPowerTemplate(gearPower: string): HTMLDivElement {
    return createDiv({ text: gearPower, classes: [INJECTOR_GEARS_POWER_MAJOR] });
}

export function getMaxGearPowerTemplate(gearPower: string): HTMLDivElement {
    const wrapper = createDiv({ classes: [INJECTOR_GEARS_POWER_MINOR] });
    const splitter = createDiv({ text: "/", classes: [INJECTOR_GEARS_POWER_MINOR] });
    const maxPower = createDiv({ text: gearPower, classes: [INJECTOR_GEARS_POWER_MINOR] });
    wrapper.appendChild(splitter);
    wrapper.appendChild(maxPower);
    return wrapper;
}

export function getGearPowerWrapperTemplate(): HTMLDivElement {
    const gearsPowerLevel = createDiv({ classes: [INJECTOR_GEARS_POWER_WRAPPER] });
    const loadingIndication = createSpan({
        text: "загружаю...",
        classes: [INJECTOR_GEARS_POWER_PENDING],
    });
    gearsPowerLevel.appendChild(loadingIndication);
    return gearsPowerLevel;
}

export function getSortingWrapperTemplate(
    sortingOptions: SortingOptionType[],
    sortingDom: HTMLDivElement
): HTMLSpanElement {
    const wrapper = createSpan({ classes: [INJECTOR_SORTER_WRAPPER] });
    const title = createSpan({
        text: "Сортировка:",
        classes: [INJECTOR_SORTER_TITLE],
        style: { marginRight: "10px" },
    });
    wrapper.appendChild(title);

    for (let i = 0; i < sortingOptions.length; i++) {
        const buttonWrapper = createSpan();

        const button = createButton({
            text: sortingOptions[i].label,
            callbacks: { click: sortingOptions[i].callback(sortingDom) },
        });

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
    return createDiv({
        text: "[" + orderNumber.toString() + "]",
        classes: [INJECTOR_CHARACTER_ORDER],
    });
}
