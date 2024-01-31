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
} from "../constants/css";
import { GS_RAITING } from "../constants/urls";
import { PAGE_CHECK_TIMEOUT } from "../constants/vars";
import {
    getEngravesCellLoader,
    getEngravesTableCell,
    getGSListEngraveImg,
    getTaitingTableHeader,
} from "../templates/gsraiting";
import { getClassEngraves, getEgravesList } from "../parser";
import { createDiv } from "../templates/generator";

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
            _injectPaginatorEvent();
        } else {
            delayInjectOnClassChange();
        }
    }, PAGE_CHECK_TIMEOUT);
}

function getCharactersListWrapper(): HTMLTableElement | null {
    return document.querySelector(".".concat(CHARACTERS_RAITING_TABLE));
}

function _injectCharactersRaitingBulk(table: HTMLTableElement): void {
    _injectTable(table);
    _injectPaginatorEvent();
    _injectSubClassButtonEvent();
    _injectClassButtonEvent();
}

function _injectTable(table: HTMLTableElement): void {
    _injectTableHeader(table);
    _injectTableBody(table);
}

function _injectTableHeader(table: HTMLTableElement): void {
    if (!table.getElementsByClassName(GS_RAITING_ENGRAVE_HEADER)[0]) {
        const headers = table
            ?.getElementsByTagName("thead")[0]
            .getElementsByTagName("tr")[0] as HTMLTableRowElement;
        headers.insertBefore(
            getTaitingTableHeader("Классовые гравировки"),
            headers.childNodes[headers.childNodes.length - 1]
        );
    }
}

function _injectTableBody(table: HTMLTableElement): void {
    const body = table?.getElementsByTagName("tbody")[0];

    for (let i: number = 0; i < body.children.length; i++) {
        const characterName = getCharacterNameFromRow(body.children[i].children[1]);
        let engravesWrapper = body.children[i].getElementsByClassName(
            GS_RAITING_TABLE_CELL_ENGRAVE_WRAPPER
        )[0] as HTMLElement;
        if (engravesWrapper) {
            (<any>engravesWrapper.children[0]).style.display = "none";
            (<any>engravesWrapper.children[1]).style.display = "none";

            engravesWrapper.insertBefore(getEngravesCellLoader(), engravesWrapper.children[0]);
        } else {
            engravesWrapper = getEngravesTableCell();
            body.children[i].insertBefore(
                engravesWrapper,
                body.children[i].children[body.children[i].children.length - 1]
            );
        }

        chrome.runtime.sendMessage(
            { signal: "fetchCharacterPage", charName: characterName },
            _injectWrapper(engravesWrapper, characterName)
        );
    }

    function _injectWrapper(dom: HTMLElement, characterName: string) {
        function _inject(text: string) {
            const curretName = dom.parentNode?.children[1];
            /*
                Проверяем соответсвие реального имени персонажа и того, для которого был выполнен fetch запрос.
                Может такое быть, что быстр опереключая пагинатор fetch от предыдущего персонажа еще не сработал
                Тогда, когда он вернет данные они могут пренаджелать не тому персонажу.
            */
            if (curretName) {
                if (getCharacterNameFromRow(curretName) === characterName) {
                    const engraves = getEgravesList(text);
                    const engravesList = getClassEngraves(engraves);
                    const loader = dom.getElementsByClassName(
                        GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_LOADER
                    )[0];
                    if (loader) {
                        dom.removeChild(loader);
                    }

                    const engraveSlot01 = dom.getElementsByClassName(
                        GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_01
                    )[0] as HTMLElement;
                    const engraveSlot02 = dom.getElementsByClassName(
                        GS_RAITING_TABLE_CELL_ENGRAVE_SLOT_02
                    )[0] as HTMLElement;

                    if (engravesList.length >= 1) {
                        engraveSlot01.innerHTML = engravesList[0]?.engraveName;
                        engraveSlot01.style.display = "block";
                        engraveSlot01.appendChild(getGSListEngraveImg(engravesList[0]));
                    }
                    if (engravesList.length == 2) {
                        engraveSlot02.innerHTML = engravesList[1]?.engraveName;
                        engraveSlot02.style.display = "block";
                        engraveSlot02.appendChild(getGSListEngraveImg(engravesList[1]));
                    }
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

function _injectPaginatorEvent() {
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
    console.log("injecting subclass btns");

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
