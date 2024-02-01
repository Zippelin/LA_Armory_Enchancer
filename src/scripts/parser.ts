import {
    CURRENT_GEAR_POWER,
    MAX_GEAR_POWER,
    CLASS_ICON_URL,
    SCRIPT_PROFILE,
    ELIXIR_DATA,
    ENGRAVES_DATA,
    STATS_DATA,
} from "./constants/regex";
import { ClassesEngraves } from "./constants/vars";
import { ElixirDataType, GSRaitingCellDataType, ProfileType } from "./types";

export function getCurrentGearsPower(text: string): string {
    const result = text.match(CURRENT_GEAR_POWER);
    if (result) {
        return result[1];
    }
    return "";
}

export function getMaxGearsPowers(text: string): string {
    const result = text.match(MAX_GEAR_POWER);
    if (result) {
        return result[1];
    }
    return "";
}

export function getClassIconUrl(text: string): string {
    const result = text.match(CLASS_ICON_URL);
    if (result) {
        return result[1];
    }
    return "";
}

export function getParsedProfileData(text: string): ProfileType | null {
    const match = text.match(SCRIPT_PROFILE);
    let result = null;
    if (match) {
        result = JSON.parse(match[1]);
    }
    return result;
}

export function getElixirData(text: string): ElixirDataType | null {
    const match = text.match(ELIXIR_DATA);
    if (match && match.groups && match.length === 4) {
        return {
            itemType: match.groups.itemType.trim(),
            elixirName: match.groups.exilirName.trim(),
            elixirLevel: match.groups.elixirLevel.trim(),
        };
    }
    return null;
}

export function getOrderNumber(text: string): string {
    const match = text.match(/\d+/);
    if (match) {
        return match[0];
    }
    return "0";
}

export function getEgravesList(text: string): Array<GSRaitingCellDataType> {
    const result: Array<GSRaitingCellDataType> = Array.from(text.matchAll(ENGRAVES_DATA), (x) => [
        x[1],
        x[2],
    ]).map((val) => {
        return {
            name: val[0].trim(),
            value: val[1].trim(),
            icon: val[0].trim(),
        };
    });

    return result;
}

export function getClassEngraves(
    engravesList: Array<GSRaitingCellDataType>
): Array<GSRaitingCellDataType> {
    return engravesList.filter((val) => {
        if (ClassesEngraves.includes(val.name.toLocaleLowerCase())) {
            return val;
        }
    });
}

export function getMainStatsList(text: string): Array<GSRaitingCellDataType> {
    const result = Array.from(text.matchAll(STATS_DATA), (x) => [x[1], x[2]]).map((val) => {
        return {
            name: val[0].trim(),
            value: val[1].trim(),
            icon: "",
        };
    });
    result.sort((a, b) => {
        if (parseInt(a.value) > parseInt(b.value)) {
            return -1;
        } else {
            return 1;
        }
    });
    return result.slice(0, 2);
}
