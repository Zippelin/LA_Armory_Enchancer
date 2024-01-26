export function createDiv({
    text = "",
    classes = [],
    style = {},
}: {
    text?: string;
    classes?: Array<string>;
    style?: { [property: string]: string };
} = {}): HTMLDivElement {
    const div = createElement("div", text, classes, style) as HTMLDivElement;
    return div;
}

export function createSpan({
    text = "",
    classes = [],
    style = {},
}: {
    text?: string;
    classes?: Array<string>;
    style?: { [property: string]: string };
} = {}): HTMLSpanElement {
    const div = createElement("span", text, classes, style) as HTMLSpanElement;
    return div;
}

export function createButton({
    text = "",
    classes = [],
    style = {},
    callbacks = {},
}: {
    text?: string;
    classes?: Array<string>;
    style?: { [property: string]: string };
    callbacks?: { [callback: string]: EventListenerOrEventListenerObject };
} = {}): HTMLButtonElement {
    const button = createElement("button", text, classes, style) as HTMLButtonElement;
    for (const callback in callbacks) {
        button.addEventListener(callback, callbacks[callback]);
    }
    return button;
}

export function createImg({
    src,
    classes = [],
    style = {},
}: {
    src: string;
    classes?: Array<string>;
    style?: { [property: string]: string };
}): HTMLImageElement {
    const img = createElement("img", "", classes, style) as HTMLImageElement;
    img.src = src;
    return img;
}

function createElement(
    domType: string,
    text: string = "",
    classes: Array<string> = [],
    style: { [property: string]: string } = {}
): HTMLElement {
    const element = document.createElement(domType);
    element.classList.add(...classes);
    element.innerHTML = text ? text : "";
    setStyleForDom(element, style);
    return element;
}

function setStyleForDom(dom: HTMLElement, style: { [property: string]: string } = {}) {
    if (style) {
        for (const property in style) {
            (<any>dom.style)[property] = style[property];
        }
    }
}
