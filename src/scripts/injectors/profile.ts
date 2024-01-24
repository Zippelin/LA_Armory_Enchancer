import { getParsedProfileData, getElixirData } from "../parser";
import {
    getProfileEqipmentItemTemplate,
    getProfileElixirWrapperTemplate,
} from "../templates/profile";
import { ProfileEquipType, IconPathType } from "../types";
import {
    getEngraveIconPathByNameFromLib,
    getEngraveIconPathByName,
} from "../tools/url";
import { UrlSource, NegativeEngraves } from "../constants/vars";

export function injectProfile(pageHTML: string): void {
    const parsedProfile = getParsedProfileData(pageHTML);
    if (parsedProfile) {
        injectProfileEquipment(parsedProfile.Equip);
        injectEngraves(parsedProfile.Engrave);
        injectGearsElixirs(parsedProfile.Equip);
        injectGB();
    }
}

function injectProfileEquipment(equip: ProfileEquipType): void {
    for (let itemName in equip) {
        if (
            equip[itemName].Element_001.type === "ItemTitle" &&
            equip[itemName].Element_001.value.qualityValue &&
            equip[itemName].Element_001.value.qualityValue != -1
        ) {
            const domElement = document.querySelector(
                "[data-item=" + '"' + itemName + '"]'
            );
            if (domElement) {
                domElement.insertAdjacentElement(
                    "beforeend",
                    getProfileEqipmentItemTemplate(
                        equip[itemName].Element_001.value.qualityValue
                    )
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
        return document.querySelector(".swiper-wrapper");
    }
    /*
        Отключаем пагинатор Гравировок
    */
    function disableEngravesPaginator(): void {
        const container = document.querySelector(".swiper-container");
        const target = document.querySelector(".swiper-option");
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
        engraveDome.classList.add(
            "js-injection--current-profile-engrave-wrapper"
        );
        const regexEngraveLevel = /(.*)(\d+ ур.)/;
        const match = engraveText.match(regexEngraveLevel);
        if (match && match.length === 3) {
            engraveDome.getElementsByTagName("span")[0].innerHTML = match[1];

            console.log(
                NegativeEngraves.includes(match[1].trim().toLowerCase())
            );
            console.log(match[1].trim().toLowerCase());

            if (NegativeEngraves.includes(match[1].trim().toLowerCase())) {
                engraveDome.getElementsByTagName("span")[0].style.color = "red";
            }
            const levelSpan = document.createElement("span");
            levelSpan.innerText = match[2];
            levelSpan.classList.add(
                "js-injection--current-profile-engrave-level"
            );
            engraveDome.appendChild(levelSpan);
            const engraveIncoPath = getEngraveIconPath(match[1]);

            if (engraveIncoPath.urlSource != UrlSource.NONE) {
                engraveDome.getElementsByTagName("span")[0].style.fontWeight =
                    "bold !important";
                const img = document.createElement("img");
                img.src = engraveIncoPath.url;
                img.style.height = "20px";
                img.style.width = "20px";
                img.classList.add("js-injection--current-profile-engrave-icon");
                engraveDome.insertBefore(
                    img,
                    engraveDome.getElementsByTagName("span")[0]
                );
                return engraveIncoPath.urlSource;
            }
        }
        return UrlSource.NONE;
    }

    function flatterEngraveWrapper() {
        const engravesWrapper = getEngravesWrapper();
        if (engravesWrapper) {
            for (let i = 0; i < engravesWrapper.children.length; i++) {
                for (
                    let j = 0;
                    j < engravesWrapper.children[i].children.length;
                    j++
                ) {
                    let child = engravesWrapper.children[i].children[
                        j
                    ] as HTMLElement;
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

function injectGB(): void {
    const backgrounImage = document.createElement("img");
    backgrounImage.classList.add("profile-equipment__character");
    var extensionId = chrome.runtime.id;
    backgrounImage.src =
        "chrome-extension://" + extensionId + "/media/img/profile_bg.png";
    backgrounImage.classList.add("js-injection--profile-background");

    const wrapper = document.querySelector<HTMLElement>(
        ".profile-equipment__character"
    );
    if (wrapper) {
        const shadow = wrapper.children[0].cloneNode() as HTMLElement;
        const shadow2 = wrapper.children[0].cloneNode() as HTMLElement;
        const child = wrapper.children[0] as HTMLElement;
        child.style.zIndex = "2";

        shadow.classList.add("js-injection--profile-image-shadow-01");
        shadow2.classList.add("js-injection--profile-image-shadow-02");

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

        const domElement = document.querySelector(
            "[data-item=" + '"' + itemId + '"]'
        );

        if (domElement) {
            const parsedElixirData = [];
            for (let id in dataSource) {
                const parseResult = getElixirData(dataSource[id].contentStr);
                if (parseResult) {
                    parsedElixirData.push(parseResult);
                }
            }
            const style = window.getComputedStyle(domElement);
            const injectingElement =
                getProfileElixirWrapperTemplate(parsedElixirData);
            injectingElement.style.top = style.top;

            injectingElement.style.left =
                (parseInt(style.left.slice(0, -2)) + offsetX).toString() + "px";
            domElement.insertAdjacentElement("afterend", injectingElement);
        }
    }

    if (dataSource) {
        const profileEq = document.querySelector(
            ".profile-equipment__character"
        );
        if (profileEq) {
            profileEq.classList.add("profile-equipment__character-override");
        }
    }
}
