import {
    GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_01,
    GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_02,
    GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_LOADER,
    GS_RAITING_TABLE_CELL_ENGRAVE_WRAPPER,
    GS_RAITING_ENGRAVE_HEADER,
    GS_RAITING_DEFAULT_HEADER,
} from "../constants/css";
import { getEngraveIconPathByNameFromLib } from "../tools/url";
import { EngraveData } from "../types";
import { createTableCell, createTableColumnHeader, createDiv, createImg } from "./generator";

export function getTaitingTableHeader(text: string): HTMLElement {
    const wrapper = createTableColumnHeader({
        text: text,
        classes: [GS_RAITING_DEFAULT_HEADER, GS_RAITING_ENGRAVE_HEADER],
    });

    return wrapper;
}

export function getEngravesTableCell(): HTMLElement {
    const wrapper = createTableCell({ classes: [GS_RAITING_TABLE_CELL_ENGRAVE_WRAPPER] });

    const loading = getEngravesCellLoader();

    const engraveSlot01 = createDiv({
        classes: [GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_01],
        style: { display: "none" },
    });
    const engraveSlot02 = createDiv({
        classes: [GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_02],
        style: { display: "none" },
    });

    wrapper.appendChild(loading);
    wrapper.appendChild(engraveSlot01);
    wrapper.appendChild(engraveSlot02);
    return wrapper;
}

export function getEngravesCellLoader() {
    return createDiv({
        text: "загрузка",
        classes: [GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_LOADER],
    });
}

export function getGSListEngraveImg(engrave: EngraveData): HTMLImageElement {
    const img = createImg({
        src: getEngraveIconPathByNameFromLib(engrave.engraveName),
        style: {
            height: "20px",
            width: "20px",
            float: "left",
            marginRight: "5px",
        },
    });
    return img;
}
