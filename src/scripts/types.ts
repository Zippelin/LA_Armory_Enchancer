import { UrlSource, CharactersSortBy } from "./constants/vars";

export interface ProgressBarData {
    filled: string;
    remainder: string;
}

export interface ElixirColorStyle {
    background: string;
    color: string;
}

export interface ElixirDataType {
    itemType: string;
    elixirName: string;
    elixirLevel: string;
}

export interface ProfileType {
    Equip: ProfileEquipType;
    Engrave: {};
}

export interface ProfileEquipType {
    [itemCode: string]: {
        Element_001: {
            type: string;
            value: {
                qualityValue: number;
            };
        };
        Element_007: {
            value: {
                Element_000: {
                    contentStr: {
                        [Element_000: string]: {
                            contentStr: string;
                        };
                    };
                    topStr: string;
                };
            };
        };
        Element_008: {
            value: {
                Element_000: {
                    contentStr: {
                        [Element_000: string]: {
                            contentStr: string;
                        };
                    };
                    topStr: string;
                };
            };
        };
        Element_009: {
            value: {
                Element_000: {
                    contentStr: {
                        [Element_000: string]: {
                            contentStr: string;
                        };
                    };
                    topStr: string;
                };
            };
        };
    };
}

export interface EngraveIconPathType {
    iconName: string;
    engrageName: string;
}

export interface IconPathType {
    urlSource: UrlSource;
    url: string;
}

export interface SortingOptionType {
    label: string;
    sortByType: CharactersSortBy;
    callback: Function;
    isCurrent: boolean;
}

export interface GSRaitingCellDataType {
    name: string;
    value: string;
    icon: string;
}
