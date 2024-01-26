import { SortingOptionType } from "../types";
import { sorterCharsListDecorator } from "../tools/sorters";

export enum UrlSource {
    JSON = 0,
    LIB = 1,
    NONE = 3,
}

export enum CharactersSortBy {
    CREATION = 0,
    GEARS_POWER = 1,
}

export const NegativeEngraves: Array<string> = ["медлительность", "износ", "миролюбие", "ржавчина"];

export const SortingOptions: SortingOptionType[] = [
    {
        label: "новые",
        sortByType: CharactersSortBy.CREATION,
        callback: sorterCharsListDecorator(CharactersSortBy.CREATION, -1),
        isCurrent: true,
    },
    {
        label: "старые",
        sortByType: CharactersSortBy.CREATION,
        callback: sorterCharsListDecorator(CharactersSortBy.CREATION, 1),
        isCurrent: false,
    },
    {
        label: "сильные",
        sortByType: CharactersSortBy.GEARS_POWER,
        callback: sorterCharsListDecorator(CharactersSortBy.GEARS_POWER, 1),
        isCurrent: false,
    },
    {
        label: "слабые",
        sortByType: CharactersSortBy.GEARS_POWER,
        callback: sorterCharsListDecorator(CharactersSortBy.GEARS_POWER, -1),
        isCurrent: false,
    },
];

export enum ExtensionResourceType {
    ProfileBackground = 0,
}
