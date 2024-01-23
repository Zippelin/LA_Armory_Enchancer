import {ProgressBarData} from "../types"
import {getColorByQuality, getColorByElixirLevel} from "../constants/colors"

export function getProfileEqipmentItemTemplate(quality: number): HTMLDivElement {

    function _getProgressBar(_quality: number): ProgressBarData {
        const itemDefaultWidth = 41
        const calcWidth =  Math.round((_quality/100) * itemDefaultWidth)
        return {
            "filled": calcWidth.toString() + "px",
            "remainder": (itemDefaultWidth - calcWidth).toString() + "px"
        }
    }
            
    const wrapper = document.createElement('div')
    wrapper.classList.add('js-injection--current-profile-quality-wrapper')

    const linesWidth = _getProgressBar(quality)
    
    const linesWrapper = document.createElement('div')
    linesWrapper.classList.add('js-injection--current-profile-quality-lines-wrapper')

    const qualityLine = document.createElement('div')
    qualityLine.style.background = getColorByQuality(quality)
    qualityLine.style.width = linesWidth.filled
    qualityLine.classList.add(
        'js-injection--current-profile-quality-line', 
        )

    const qualityText = document.createElement('div')
    qualityText.classList.add('js-injection--current-profile-quality-text')
    qualityText.innerText = quality.toString()

    wrapper.appendChild(linesWrapper)
    wrapper.appendChild(qualityLine)
    wrapper.appendChild(qualityText)

    return wrapper
}


/*
    Создание родительского элемента для элексиров на броне
*/
export function getProfileElixirWrapperTemplate(elixirsData: any): HTMLDivElement {
    /*
        Создание строки под элексир с его описаниеи и уровнем
    */
    function createElixirContent(elixirData: any): HTMLDivElement {
            const wrapper = document.createElement('div')
            wrapper.classList.add('js-injection--current-profile-elixirs-content')
    
            const content = document.createElement('div')
    
            const elixirName = document.createElement('span')
            elixirName.innerHTML = elixirData.elixirName
            elixirName.style.color="#fff"      
            elixirName.style.marginRight = '5px'     
    
            content.appendChild(elixirName)
    
            wrapper.appendChild(content)
            return wrapper
        }


    const wrapper = document.createElement('div')
    wrapper.classList.add('js-injection--current-profile-elixirs-wrapper')
    
    for (let i in elixirsData) {
        const content = document.createElement('div')
        content.classList.add('js-injection--current-profile-elixirs-content')

        const elixirDot = document.createElement('div')
        elixirDot.classList.add('js-injection--current-profile-elixirs-dot')
        const colors = getColorByElixirLevel(parseInt(elixirsData[i].elixirLevel))

        elixirDot.style.background = colors.background
        elixirDot.style.color = colors.color
        elixirDot.innerHTML = elixirsData[i].elixirLevel

        content.appendChild(elixirDot)
        content.appendChild(createElixirContent(elixirsData[i]))

        const spacer = document.createElement('div')
        wrapper.appendChild(content)
        wrapper.appendChild(spacer)
    }
    return wrapper
}