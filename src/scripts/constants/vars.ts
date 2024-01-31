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

export const ClassesEngraves: Array<string> = [
    "абсолютный контроль",
    "баланс элементов",
    "безрассудство",
    "бледная луна",
    "бомбардировка",
    "ва-банк",
    "весенний рассвет",
    "воля палача",
    "воплощение силы",
    "вторая модель",
    "герой-одиночка",
    "голос луны",
    "гравитационное сжатие",
    "жажда",
    "избранный путь",
    "император",
    "императрица",
    "исцеляющая вера",
    "кантата доблести",
    "кибер-солдат",
    "круговорот светил",
    "ликующий дух",
    "мастер-фехтовальщик",
    "медитация",
    "миротворец",
    "мудрость энвиссы",
    "наследие «генезиса»",
    "обострённые чувства",
    "осознанный диссонанс",
    "остаточная энергия",
    "отстрел",
    "перерождение",
    "пистолеты и пули",
    "повелитель бури",
    "полнолуние",
    "последний полет",
    "превосходство светил",
    "рвение защитника",
    "сезон дождей",
    "стабильная гравитация",
    "твердая воля",
    "темная сторона",
    "технология ардетайна",
    "тёмное безрассудство",
    "узы судьбы",
    "универсал",
    "хищница",
    "чародейская гениальность",
    "четвертая чакра",
    "экстаз",
];

export const PAGE_CHECK_TIMEOUT = 50;
