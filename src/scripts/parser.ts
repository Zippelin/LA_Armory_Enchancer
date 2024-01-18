import {
    CURRENT_GEAR_POWER, 
    MAX_GEAR_POWER, 
    CLASS_ICON_URL, 
    SCRIPT_PROFILE, 
    ELIXIR_DATA
} from "./constants/regex"


export function getCurrentGearsPower(text: string): string {
    const result = text.match(CURRENT_GEAR_POWER)
    if (result) {
        return result[1]
    }
    return ""
}

export function getMaxGearsPowers(text: string): string {
    const result = text.match(MAX_GEAR_POWER)
    if (result) {
        return result[1]
    }
    return ""
}

export function getClassIconUrl(text: string): string {
    const result = text.match(CLASS_ICON_URL)
    if (result) {
        return result[1]
    }
    return ""
}

export function getProfileData(text: string): any {
    const match = text.match(SCRIPT_PROFILE)
    let result = {}
    if (match) {
        result = JSON.parse(match[1])
    }
    return result
}

export function getElixirData(text: string): any {
    const match = text.match(ELIXIR_DATA)
    let result = {}
    if (match && match.groups && match.length === 4) {
        return  {
            itemType: match.groups.itemType.trim(),
            elixirName: match.groups.exilirName.trim(),
            elixirLevel: match.groups.elixirLevel.trim()
        }
    }
    return null
}