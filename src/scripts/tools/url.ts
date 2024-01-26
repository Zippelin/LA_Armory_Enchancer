import { ENGRAVES_ICONS, CDN_URL, AMORY_URL } from "../constants/urls";
import { EngraveIconPathType } from "../types";
import { ExtensionResourceType } from "../constants/vars";

export function getEngraveIconPathByNameFromLib(engraveName: string): string {
    const findedIndex: number = ENGRAVES_ICONS.findIndex(
        (element: EngraveIconPathType) =>
            element.engrageName.trim().toLowerCase() == engraveName.trim().toLowerCase()
    );
    if (findedIndex >= 0) {
        const cdnIconPath =
            "efui_iconatlas/" +
            ENGRAVES_ICONS[findedIndex].iconName.split("_")[0] +
            "/" +
            ENGRAVES_ICONS[findedIndex].iconName;
        return CDN_URL + cdnIconPath;
    }
    return "";
}

export function getEngraveIconPathByName(engraveName: string): string {
    return CDN_URL + engraveName;
}

export function getArmoryCharacterUrl(characterName: string): string {
    return AMORY_URL + characterName;
}

function getExtensionUrl(): string {
    return "chrome-extension://" + chrome.runtime.id + "/";
}

export function getExtensionResourceUrl(resourceType: ExtensionResourceType): string {
    switch (resourceType) {
        case ExtensionResourceType.ProfileBackground:
            return getExtensionUrl() + "media/img/profile_bg.png";
    }
}
