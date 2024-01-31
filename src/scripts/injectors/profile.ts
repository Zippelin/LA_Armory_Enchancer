import { getParsedProfileData, getElixirData } from "../parser";

import {
    getProfileEqipmentItemTemplate,
    getProfileElixirWrapperTemplate,
} from "../templates/profile";

import { ProfileEquipType, IconPathType } from "../types";

import {
    getEngraveIconPathByNameFromLib,
    getEngraveIconPathByName,
    getExtensionResourceUrl,
} from "../tools/url";

import { UrlSource, NegativeEngraves, ExtensionResourceType } from "../constants/vars";

import { HTML_TAG } from "../constants/css";

import {
    ENGRAVES_WRAPPER,
    ENGRAVES_OPTIONS,
    ENGRAVES_CONTAINER,
    PROFILE_EQUIPMENT_WRAPPER,
    INJECTOR_ENGRAVE_WRAPPER,
    INJECTOR_ENGRAVE_LEVEL,
    INJECTOR_ENGRAVE_ICON,
    INJECTOR_PROFILE_BG,
    INJECTOR_PROFILE_BG_SHADOW_01,
    INJECTOR_PROFILE_BG_SHADOW_02,
    INJECTOR_PROFILE_EQUIPMEN,
} from "../constants/css";
import { createImg, createSpan } from "../templates/generator";

export function injectProfile(): void {
    const pageHTML: string | undefined = document.querySelector(HTML_TAG)?.innerHTML;
    if (pageHTML) {
        const parsedProfile = getParsedProfileData(pageHTML);
        if (parsedProfile) {
            injectProfileEquipment(parsedProfile.Equip);
            injectEngraves(parsedProfile.Engrave);
            injectGearsElixirs(parsedProfile.Equip);
            injectBG();
        }
    }
}

function injectProfileEquipment(equip: ProfileEquipType): void {
    for (let itemName in equip) {
        if (
            equip[itemName].Element_001.type === "ItemTitle" &&
            equip[itemName].Element_001.value.qualityValue &&
            equip[itemName].Element_001.value.qualityValue != -1
        ) {
            const domElement = document.querySelector("[data-item=" + '"' + itemName + '"]');
            if (domElement) {
                domElement.insertAdjacentElement(
                    "beforeend",
                    getProfileEqipmentItemTemplate(equip[itemName].Element_001.value.qualityValue)
                );
            }
        }
    }
}

function injectEngraves(engraves: any): void {
    /*
        Забираем DOM обертки гравировок
    */
    function getEngravesWrapper(): HTMLDivElement | null {
        return document.querySelector(".".concat(ENGRAVES_WRAPPER));
    }
    /*
        Отключаем пагинатор Гравировок
    */
    function disableEngravesPaginator(): void {
        const container = document.querySelector(".".concat(ENGRAVES_CONTAINER));
        const target = document.querySelector(".".concat(ENGRAVES_OPTIONS));
        if (container && target) {
            container.removeChild(target);
        }
    }
    /*
        Формируем ссылку на корейскую армори
    */
    function getEngraveIconPath(engraveName: string): IconPathType {
        for (let engrave in engraves) {
            if (
                engraves[engrave].Element_000.value.toLowerCase().trim() ==
                engraveName.toLowerCase().trim()
            ) {
                return {
                    urlSource: UrlSource.JSON,
                    url: getEngraveIconPathByName(
                        engraves[engrave].Element_001.value.slotData.iconPath
                    ),
                };
            }
        }
        const libIconPath = getEngraveIconPathByNameFromLib(engraveName);
        if (libIconPath) {
            return {
                urlSource: UrlSource.LIB,
                url: libIconPath,
            };
        }
        return {
            urlSource: UrlSource.NONE,
            url: "",
        };
    }
    /*
        Изменяем блок с Гравировками
    */
    function engraveItemPrettier(engraveDome: HTMLElement): UrlSource {
        let engraveText = engraveDome.getElementsByTagName("span")[0].innerHTML;
        engraveDome.classList.add(INJECTOR_ENGRAVE_WRAPPER);
        const regexEngraveLevel = /(.*)(\d+ ур.)/;
        const match = engraveText.match(regexEngraveLevel);
        if (match && match.length === 3) {
            engraveDome.getElementsByTagName("span")[0].innerHTML = match[1];

            if (NegativeEngraves.includes(match[1].trim().toLowerCase())) {
                engraveDome.getElementsByTagName("span")[0].style.color = "red";
            }
            const levelSpan = createSpan({
                text: match[2],
                classes: [INJECTOR_ENGRAVE_LEVEL],
            });
            engraveDome.appendChild(levelSpan);
            const engraveIncoPath = getEngraveIconPath(match[1]);

            if (engraveIncoPath.urlSource != UrlSource.NONE) {
                engraveDome.getElementsByTagName("span")[0].style.fontWeight = "bold !important";
                const img = createImg({
                    src: engraveIncoPath.url,
                    classes: [INJECTOR_ENGRAVE_ICON],
                    style: {
                        height: "20px",
                        width: "20px",
                    },
                });
                engraveDome.insertBefore(img, engraveDome.getElementsByTagName("span")[0]);
                return engraveIncoPath.urlSource;
            }
        }
        return UrlSource.NONE;
    }

    function flatterEngraveWrapper() {
        const engravesWrapper = getEngravesWrapper();
        if (engravesWrapper) {
            for (let i = 0; i < engravesWrapper.children.length; i++) {
                for (let j = 0; j < engravesWrapper.children[i].children.length; j++) {
                    let child = engravesWrapper.children[i].children[j] as HTMLElement;
                    const iconSource = engraveItemPrettier(child);

                    // Если источник Гравировки профиль, то помещаем в начало (сортировка)
                    if (iconSource === UrlSource.JSON) {
                        engravesWrapper.children[0].insertBefore(
                            child,
                            engravesWrapper.children[0].children[0]
                        );
                    }
                    // Если не на 1ой странице, то перемещаем энгравы на 1ую
                    if (i > 0) {
                        // Если источник Гравировки профиль, то помещаем в начало (сортировка)
                        if (iconSource === UrlSource.JSON) {
                            engravesWrapper.children[0].insertBefore(
                                child,
                                engravesWrapper.children[0].children[0]
                            );
                        } else {
                            engravesWrapper.children[0].appendChild(child);
                        }
                        j--;
                    }
                }
            }
        }
    }

    flatterEngraveWrapper();
    disableEngravesPaginator();
}

function injectBG(): void {
    const backgrounImage = createImg({
        src: getExtensionResourceUrl(ExtensionResourceType.ProfileBackground),
        classes: [PROFILE_EQUIPMENT_WRAPPER, INJECTOR_PROFILE_BG],
    });

    const wrapper = document.querySelector<HTMLElement>(".".concat(PROFILE_EQUIPMENT_WRAPPER));
    if (wrapper) {
        const shadow = wrapper.children[0].cloneNode() as HTMLElement;
        const shadow2 = wrapper.children[0].cloneNode() as HTMLElement;
        const child = wrapper.children[0] as HTMLElement;
        child.style.zIndex = "2";

        shadow.classList.add(INJECTOR_PROFILE_BG_SHADOW_01);
        shadow2.classList.add(INJECTOR_PROFILE_BG_SHADOW_02);

        wrapper.appendChild(backgrounImage);
        wrapper.appendChild(shadow);
        wrapper.appendChild(shadow2);
    }
}

/*
    Внедрение элементов для элексиров
*/
function injectGearsElixirs(equip: ProfileEquipType) {
    const offsetX = 55;
    let dataSource;
    for (let itemId in equip) {
        // Предположительно данные по элексирам могут быть только в элементах Element_007 или Element_008.
        if (
            equip[itemId].Element_007 &&
            equip[itemId].Element_007.value &&
            equip[itemId].Element_007.value.Element_000 &&
            equip[itemId].Element_007.value.Element_000.contentStr
        ) {
            dataSource = equip[itemId].Element_007.value.Element_000.contentStr;
        } else if (
            equip[itemId].Element_008 &&
            equip[itemId].Element_008.value &&
            equip[itemId].Element_008.value.Element_000 &&
            equip[itemId].Element_008.value.Element_000.contentStr
        ) {
            dataSource = equip[itemId].Element_008.value.Element_000.contentStr;
        } else {
            continue;
        }

        const domElement = document.querySelector("[data-item=" + '"' + itemId + '"]');

        if (domElement) {
            const parsedElixirData = [];
            for (let id in dataSource) {
                const parseResult = getElixirData(dataSource[id].contentStr);
                if (parseResult) {
                    parsedElixirData.push(parseResult);
                }
            }
            const style = window.getComputedStyle(domElement);
            const injectingElement = getProfileElixirWrapperTemplate(parsedElixirData);
            injectingElement.style.top = style.top;

            injectingElement.style.left =
                (parseInt(style.left.slice(0, -2)) + offsetX).toString() + "px";
            domElement.insertAdjacentElement("afterend", injectingElement);
        }
    }

    if (dataSource) {
        const profileEq = document.querySelector(".".concat(PROFILE_EQUIPMENT_WRAPPER));
        if (profileEq) {
            profileEq.classList.add(INJECTOR_PROFILE_EQUIPMEN);
        }
    }
}
