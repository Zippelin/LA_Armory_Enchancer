import { ProgressBarData } from "../types";
import { getColorByQuality, getColorByElixirLevel } from "../constants/colors";
import {
    INJECTOR_PROFILE_ELIXIR_CONTENT,
    INJECTOR_PROFILE_ELIXIR_DOT,
    INJECTOR_PROFILE_ELIXIR_WRAPPER,
    INJECTOR_PROFILE_QUALITY_NUMBER,
    INJECTOR_PROFILE_QUALITY_PROGRESS,
    INJECTOR_PROFILE_QUALITY_PROGRESS_WRAPPER,
    INJECTOR_PROFILE_QUALITY_WRAPPER,
} from "../constants/css";
import { createDiv, createSpan } from "./generator";

export function getProfileEqipmentItemTemplate(quality: number): HTMLDivElement {
    function _getProgressBar(_quality: number): ProgressBarData {
        const itemDefaultWidth = 41;
        const calcWidth = Math.round((_quality / 100) * itemDefaultWidth);
        return {
            filled: calcWidth.toString() + "px",
            remainder: (itemDefaultWidth - calcWidth).toString() + "px",
        };
    }

    const wrapper = createDiv({ classes: [INJECTOR_PROFILE_QUALITY_WRAPPER] });

    const linesWidth = _getProgressBar(quality);

    const linesWrapper = createDiv({ classes: [INJECTOR_PROFILE_QUALITY_PROGRESS_WRAPPER] });

    const qualityLine = createDiv({
        classes: [INJECTOR_PROFILE_QUALITY_PROGRESS],
        style: {
            background: getColorByQuality(quality),
            width: linesWidth.filled,
        },
    });

    const qualityText = createDiv({
        text: quality.toString(),
        classes: [INJECTOR_PROFILE_QUALITY_NUMBER],
    });

    wrapper.appendChild(linesWrapper);
    wrapper.appendChild(qualityLine);
    wrapper.appendChild(qualityText);

    return wrapper;
}

/*
    Создание родительского элемента для элексиров на броне
*/
export function getProfileElixirWrapperTemplate(elixirsData: any): HTMLDivElement {
    /*
        Создание строки под элексир с его описаниеи и уровнем
    */
    function createElixirContent(elixirData: any): HTMLDivElement {
        const wrapper = createDiv({ classes: [INJECTOR_PROFILE_ELIXIR_CONTENT] });

        const content = createDiv();

        const elixirName = createSpan({
            text: elixirData.elixirName,
            style: {
                color: "#fff",
                marginRight: "5px",
            },
        });

        content.appendChild(elixirName);

        wrapper.appendChild(content);
        return wrapper;
    }

    const wrapper = createDiv({ classes: [INJECTOR_PROFILE_ELIXIR_WRAPPER] });

    for (let i in elixirsData) {
        const colors = getColorByElixirLevel(parseInt(elixirsData[i].elixirLevel));

        const content = createDiv({ classes: [INJECTOR_PROFILE_ELIXIR_CONTENT] });

        const elixirDot = createDiv({
            text: elixirsData[i].elixirLevel,
            classes: [INJECTOR_PROFILE_ELIXIR_DOT],
            style: {
                background: colors.background,
                color: colors.color,
            },
        });

        content.appendChild(elixirDot);
        content.appendChild(createElixirContent(elixirsData[i]));

        const spacer = createDiv();
        wrapper.appendChild(content);
        wrapper.appendChild(spacer);
    }
    return wrapper;
}
