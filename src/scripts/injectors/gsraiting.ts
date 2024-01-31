import {
    CHARACTERS_RAITING_TABLE,
    GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_01,
    GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_02,
    GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_LOADER,
    GS_RAITING_TABLE_CELL_ENGRAVE_WRAPPER,
    GS_RAITING_PAGINATOR_BUTTON,
    GS_RAITING_ENGRAVE_HEADER,
    GS_RAITING_SUBCLASS_BUTTON_WRAPPER,
    GS_RAITING_SUBTABS_WRAPPER,
    GS_RAITING_PAGINATOR_ARROWS,
    GS_RAITING_MAINTABS_WRAPPER,
    GS_RAITING_STATS_HEADER,
    GS_RAITING_TABLE_CELL_STATS_WRAPPER,
    GS_RAITING_TABLE_CELL_STAT_SLOT_01,
    GS_RAITING_TABLE_CELL_STAT_SLOT_02,
    GS_RAITING_TABLE_CELL_STATS_SLOT_LOADER,
    CHARACTERS_RAITING_WRAPPER,
} from "../constants/css";
import { GS_RAITING } from "../constants/urls";
import { GsListCellType, PAGE_CHECK_TIMEOUT } from "../constants/vars";
import {
    getEngravesCellLoader,
    getEngravesTableCell,
    getGSListEngraveImg,
    getStatLine,
    getStatsCellLoader,
    getStatsTableCell,
    getTaitingTableHeader,
} from "../templates/gsraiting";
import { getClassEngraves, getEgravesList, getMainStatsList } from "../parser";
import { createDiv } from "../templates/generator";
import { StatDataType } from "../types";

export function injectCharactersRaitingBulk(): void {
    if (window.location.toString().startsWith(GS_RAITING)) {
        delayInject();
    }
}

/*
    Т.к загружается весь список целиком (1000 записей)Ю бенз пагинации - сайт грузится достаточно долго.
    Ставим таймаут, который вызывает себя рекурсино, пока не появится нужный DOM
*/
function delayInject(): void {
    setTimeout(() => {
        const selectedTable = getCharactersListWrapper();
        if (selectedTable) {
            _injectCharactersRaitingBulk(selectedTable);
        } else {
            delayInject();
        }
    }, PAGE_CHECK_TIMEOUT);
}

function delayInjectOnSubCalssChange(): void {
    setTimeout(() => {
        const selectedTable = getCharactersListWrapper();
        if (selectedTable) {
            _injectTable(selectedTable);
            _injectPaginatorButtons();
        } else {
            delayInjectOnSubCalssChange();
        }
    }, PAGE_CHECK_TIMEOUT);
}

function delayInjectOnClassChange(): void {
    setTimeout(() => {
        const selectedTable = getCharactersListWrapper();
        if (selectedTable) {
            _injectTable(selectedTable);
            _injectSubClassButtonEvent();
            _injectPaginatorButtons();
        } else {
            delayInjectOnClassChange();
        }
    }, PAGE_CHECK_TIMEOUT);
}

function getCharactersListWrapper(): HTMLTableElement | null {
    const wrapper = document.querySelector(".".concat(CHARACTERS_RAITING_WRAPPER));
    if (wrapper) {
        // Ищем таблицуу с рейтинговыми персонажами, а не личную
        const table = wrapper.querySelector(".".concat(CHARACTERS_RAITING_TABLE)) as HTMLElement;
        if (table && table.parentElement?.classList.contains(CHARACTERS_RAITING_WRAPPER)) {
            return table as HTMLTableElement;
        }
    }
    return null;
}

function _injectCharactersRaitingBulk(table: HTMLTableElement): void {
    _injectTable(table);
    _injectPaginatorButtons();
    _injectSubClassButtonEvent();
    _injectClassButtonEvent();
}

function _injectTable(table: HTMLTableElement): void {
    _injectTableHeader(table);
    _injectTableBody(table);
}

function _injectTableHeader(table: HTMLTableElement): void {
    _injectTableHeaderEngrave(table);
    _injectTableHeaderStats(table);
}

function _injectTableHeaderEngrave(table: HTMLTableElement): void {
    _tableHeaderInjector(table, "Классовые гравировки", GS_RAITING_ENGRAVE_HEADER);
}

function _injectTableHeaderStats(table: HTMLTableElement): void {
    _tableHeaderInjector(table, "Основа", GS_RAITING_STATS_HEADER);
}

function _tableHeaderInjector(table: HTMLTableElement, text: string, css: string) {
    if (!table.getElementsByClassName(css)[0]) {
        const headers = table
            ?.getElementsByTagName("thead")[0]
            .getElementsByTagName("tr")[0] as HTMLTableRowElement;
        headers.insertBefore(
            getTaitingTableHeader(text),
            headers.childNodes[headers.childNodes.length - 1]
        );
    }
}

function _injectTableBody(table: HTMLTableElement): void {
    function getOrCreateAndGetCellWrapper(
        tableRow: Element,
        cellCss: string,
        columnPosition: number,
        templateFunc: Function,
        teplateLoaderFunc: Function
    ): HTMLElement {
        let cellWrapper = tableRow.getElementsByClassName(cellCss)[0] as HTMLElement;
        if (cellWrapper) {
            (<any>cellWrapper.children[0]).style.display = "none";
            (<any>cellWrapper.children[1]).style.display = "none";
            cellWrapper.children[0].innerHTML = "";
            cellWrapper.children[1].innerHTML = "";

            cellWrapper.insertBefore(teplateLoaderFunc(), cellWrapper.children[0]);
        } else {
            cellWrapper = templateFunc();
            tableRow.insertBefore(cellWrapper, tableRow.children[columnPosition]);
        }
        return cellWrapper;
    }

    const body = table?.getElementsByTagName("tbody")[0];

    for (let i: number = 0; i < body.children.length; i++) {
        const characterName = getCharacterNameFromRow(body.children[i].children[1]);

        const statsWrapper = getOrCreateAndGetCellWrapper(
            body.children[i],
            GS_RAITING_TABLE_CELL_STATS_WRAPPER,
            body.children[i].children.length - 1,
            getStatsTableCell,
            getStatsCellLoader
        );

        const engravesWrapper = getOrCreateAndGetCellWrapper(
            body.children[i],
            GS_RAITING_TABLE_CELL_ENGRAVE_WRAPPER,
            body.children[i].children.length - 2,
            getEngravesTableCell,
            getEngravesCellLoader
        );

        chrome.runtime.sendMessage(
            { signal: "fetchCharacterPage", charName: characterName },
            _injectWrapper(engravesWrapper, statsWrapper, characterName)
        );
    }

    function _injectWrapper(engraveDom: HTMLElement, statsDom: HTMLElement, characterName: string) {
        function _inject(text: string) {
            function _injectBasicDom(
                characterRawPage: string,
                basicDom: HTMLElement,
                loaderCss: string,
                slot01Css: string,
                slot02Css: string,
                cellType: GsListCellType
            ) {
                let slotsData: Array<string | StatDataType> = [];
                if (cellType === GsListCellType.ENGRAVE) {
                    const engraves = getEgravesList(characterRawPage);
                    slotsData = getClassEngraves(engraves).map((x) => x.engraveName);
                }
                if (cellType === GsListCellType.STATS) {
                    slotsData = getMainStatsList(characterRawPage);
                }

                const loader = basicDom.getElementsByClassName(loaderCss)[0];
                if (loader) {
                    basicDom.removeChild(loader);
                }

                const slot01 = basicDom.getElementsByClassName(slot01Css)[0] as HTMLElement;
                const slot02 = basicDom.getElementsByClassName(slot02Css)[0] as HTMLElement;

                if (slotsData.length >= 1) {
                    if (cellType === GsListCellType.ENGRAVE) {
                        slot01.innerHTML = slotsData[0] as string;
                    }
                    if (cellType === GsListCellType.STATS) {
                        slot01.appendChild(getStatLine(slotsData[0] as StatDataType));
                    }
                    slot01.style.display = "block";
                    if (cellType === GsListCellType.ENGRAVE) {
                        slot01.appendChild(getGSListEngraveImg(slotsData[0] as string));
                    }
                }
                if (slotsData.length == 2) {
                    if (cellType === GsListCellType.ENGRAVE) {
                        slot02.innerHTML = slotsData[1] as string;
                    }
                    if (cellType === GsListCellType.STATS) {
                        slot02.appendChild(getStatLine(slotsData[1] as StatDataType));
                    }

                    slot02.style.display = "block";
                    if (cellType === GsListCellType.ENGRAVE) {
                        slot02.appendChild(getGSListEngraveImg(slotsData[1] as string));
                    }
                }
            }

            const curretName = engraveDom.parentNode?.children[1];
            /*
                Проверяем соответсвие реального имени персонажа и того, для которого был выполнен fetch запрос.
                Может такое быть, что быстр опереключая пагинатор fetch от предыдущего персонажа еще не сработал
                Тогда, когда он вернет данные они могут пренаджелать не тому персонажу.
            */
            if (curretName) {
                if (getCharacterNameFromRow(curretName) === characterName) {
                    // Добавляем гравировки
                    _injectBasicDom(
                        text,
                        engraveDom,
                        GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_LOADER,
                        GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_01,
                        GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_02,
                        GsListCellType.ENGRAVE
                    );
                    // Добавляем статы
                    _injectBasicDom(
                        text,
                        statsDom,
                        GS_RAITING_TABLE_CELL_STATS_SLOT_LOADER,
                        GS_RAITING_TABLE_CELL_STAT_SLOT_01,
                        GS_RAITING_TABLE_CELL_STAT_SLOT_02,
                        GsListCellType.STATS
                    );
                }
            }
        }
        return _inject;
    }
}

function _injectUpdateTableBody() {
    const selectedTable = getCharactersListWrapper();
    if (selectedTable) {
        _injectTableBody(selectedTable);
    }
}

function _injectPaginatorButtons() {
    const paginatorButtons = document.getElementsByClassName(GS_RAITING_PAGINATOR_BUTTON);
    for (let i = 0; i < paginatorButtons.length; i++) {
        paginatorButtons[i].addEventListener("click", _injectUpdateTableBody);
    }
    const paginatorArrows = document.getElementsByClassName(GS_RAITING_PAGINATOR_ARROWS);
    for (let i = 0; i < paginatorArrows.length; i++) {
        paginatorArrows[i].addEventListener("click", _injectUpdateTableBody);
    }
}

function _injectClassButtonEvent() {
    const subclassButtons = document
        .getElementsByClassName(GS_RAITING_MAINTABS_WRAPPER)[0]
        .getElementsByClassName(GS_RAITING_SUBTABS_WRAPPER)[0] as HTMLElement;
    if (subclassButtons) {
        for (let i = 0; i < subclassButtons.children.length; i++) {
            subclassButtons.children[i].addEventListener("click", function () {
                delayInjectOnClassChange();
            });
        }
    }
}

function _injectSubClassButtonEvent() {
    const classButtons = document
        .getElementsByClassName(GS_RAITING_SUBCLASS_BUTTON_WRAPPER)[0]
        .getElementsByClassName(GS_RAITING_SUBTABS_WRAPPER)[0] as HTMLElement;
    if (classButtons) {
        for (let i = 0; i < classButtons.children.length; i++) {
            classButtons.children[i].addEventListener("click", function () {
                delayInjectOnSubCalssChange();
            });
        }
    }
}

function getCharacterNameFromRow(row: Element): string {
    return row.getElementsByTagName("a")[0].innerHTML;
}
