class ImbuedProfile {
    #BASE_ARMORY_URL = "https://xn--80aubmleh.xn--p1ai/%D0%9E%D1%80%D1%83%D0%B6%D0%B5%D0%B9%D0%BD%D0%B0%D1%8F/"
    #regexMaxGearsPower = /.+<div class="level-info2__item"><span>Максимальный рейтинг<\/span><span><small>Ур.<\/small>(?<currentGearsMain>\d*,*\d+).+(?<currentGearsSecondary>.*\d\d)/
    #regexCurrentGearsPower = /.+<div class="level-info2__expedition"><span>Текущий рейтинг снаряжения<\/span><span><small>Ур.<\/small>(?<currentGearsMain>\d*,*\d+).+(?<currentGearsSecondary>.*\d\d)/
    #regexClassPathIcon = /.+<img class="profile-character-info__img" src="(?<iconPath>.+?)"/

    constructor(name, parentDom) {
        this.name = name
        this.maxGearsPower = '0'
        this.currentGearsPower = '0'
        this.iconPath = ''
        this.parentDom = parentDom
        this.injectedDom = this.#createInjectionElement()
        this.parentDom.insertAdjacentElement('beforeend', this.injectedDom)
    }

    #setAttrubuttesScopedFromText(text) {
        this.currentGearsPower = this.#getCurrentGearsPowerFromText(text)
        this.maxGearsPower = this.#getMaxGearsPowerFromtext(text)
        this.iconPath = this.#getClassIconPathFromText(text)
    }

    #getCurrentGearsPowerFromText(text) {
        const matches = text.match(this.#regexCurrentGearsPower) 
        return matches[1]
    }

    #getClassIconPathFromText(text) {
        const matches = text.match(this.#regexClassPathIcon) 
        return matches[1]
    }

    #getMaxGearsPowerFromtext(text) {
        const matches = text.match(this.#regexMaxGearsPower) 
        return matches[1]
    }
    
    inject() {
        fetch(
            this.#BASE_ARMORY_URL + this.name
        ).then(
            (response) => {
                response.text().then((text) => {
                    this.#setAttrubuttesScopedFromText(text);
                    this.#injectAttributes();
                })
                
            }
        )
    }

    #injectAttributes() {
        this.#disablePendingIndication()
        this.#injectClassIcon()
        this.#injectGearPowerHeader()
        this.#injectCurrentGearsPower()
        this.#injectMaxGearsPower()
    }

    #disablePendingIndication() {
        const pending = this.injectedDom.getElementsByClassName('js-injection--gears-power-pending')
        if (pending) {
            this.injectedDom.removeChild(pending[0])
        }
    }

    #injectClassIcon() {
        const img = document.createElement('img')
        img.src = this.iconPath
        img.style.height = '20px'
        img.style.width = '20px'
        img.classList.add("js-injection--class-icon")
        this.injectedDom.appendChild(img)
    }

    #injectGearPowerHeader() {
        const header = document.createElement('div')
        header.innerHTML = "Снаряжение:"
        header.classList.add("js-injection--gears-power-header")
        this.injectedDom.appendChild(header)
    }

    #injectCurrentGearsPower() {
        const currentPower = document.createElement('div')
        currentPower.innerHTML = this.currentGearsPower
        currentPower.classList.add("js-injection--gears-power-values-major")
        this.injectedDom.appendChild(currentPower)
    }

    #injectMaxGearsPower() {
        const splitter = document.createElement('div')
        splitter.innerHTML = '/'
        splitter.classList.add("js-injection--gears-power-values-minor")
    
        const maxPower = document.createElement('div')
        maxPower.innerHTML = this.maxGearsPower
        maxPower.classList.add("js-injection--gears-power-values-minor")
        this.injectedDom.appendChild(splitter)
        this.injectedDom.appendChild(maxPower)
    }

    /*
        Создаем шаблон для иньекции в список персонажей
    */
    #createInjectionElement() {
        const gearsPowerLevel = document.createElement('div')
        gearsPowerLevel.classList.add("js-injection--gears-power-wrapped")
        const loadingIndication = document.createElement('span')
        loadingIndication.innerHTML = 'загружаю...'
        loadingIndication.classList.add(
            "js-injection--gears-power-pending"
            )
        gearsPowerLevel.appendChild(loadingIndication)
        return gearsPowerLevel
    }
}

/*
    Всплывающее меню
*/
class Popup {
    constructor() {
        this.dom = document.createElement('div')
        this.content = document.createElement('div')
        this.content.classList.add('js-injection--popup-content')
        this.dom.classList.add('js-injection--popup-wrapper')
        this.dom.style.visibility = 'hidden'
        this.dom.appendChild(this.content)
        this.isMouseOver = false
        this.externalCallToHide = false
        this.dom.onmouseout = this.#hidePopupHadler(this.dom)
    }

    inject() {
        document.getElementById('lostark-wrapper').appendChild(this.dom)
    }


    #hidePopupHadler(popup) {
        return function() {
            popup.style.visibility = 'hidden'
            popup.children[0].removeChild(popup.children[0].children[0])
        }

    }

    showFor(domElement, content) {
        if (this.content.children.length > 0) {
            this.content.removeChild(this.content.children[0])
        }
        this.isMouseOver = true
        this.content.appendChild(content)
        const coords = domElement.getBoundingClientRect()

        this.dom.style.left = (coords.left + window.scrollX).toString() + "px"
        this.dom.style.top = ((coords.top + window.scrollY) - 32).toString() + "px"
        this.dom.style.visibility = 'visible'
    }
}


class ActiveProfile {
    #regexProfile = /.*<script type="text\/javascript">[\S\s]*Profile = (?<profileData>\{[\S\s]+\});\n<\/script>/
    #CDN_BASE_URL = 'https://static.monopoly.la.gmru.net/'

    constructor(text) {
        this.profile = this.#getProfile(text)
        this.popup = new Popup()
        this.popup.inject()
    }

    #getProfile(text) {
        const match = text.match(this.#regexProfile)
        let result = {}
        if (match) {
            result = JSON.parse(match[1])
        }
        return result
    }

    #getColorByQuality(quality) {
        switch (true) {
            case quality === 0:
                return "rgb(0, 0, 0)"
            case quality < 10:
                return "rgba(255,86,27,255)"            
            case quality < 30:
                return "rgba(255,241,13,255)"            
            case quality < 70:
                return "rgba(99,177,11,255)"       
            case quality < 90:
                return "rgba(16,205,255,255)"
            case quality < 100:
                return "rgba(181,12,255,255)"
            case quality === 100:
                return "rgba(231,105,41,255)"
        }
    }

    #getColorByElixirLevel(elixirLevel) {
        switch (true) {
            case elixirLevel === 0:
                return {
                    background: 'rgba(247,255,255,255)',
                    color: 'rgba(0,0,0,255)'
                }
            case elixirLevel === 1:
                return {
                    background: 'rgba(247,255,255,255)',
                    color: 'rgba(0,0,0,255)'
                }           
            case elixirLevel === 2:
                return {
                    background: 'rgba(0,148,209,255)',
                    color: 'rgba(255,255,255,255)'
                }         
            case elixirLevel === 3:
                return {
                    background: 'rgba(146,0,185,255)',
                    color: 'rgba(255,255,255,255)'
                }          
            case elixirLevel === 4:
                return {
                    background: 'rgba(205,112,0,255)',
                    color: 'rgba(255,255,255,255)' 
                }       
            case elixirLevel === 5:
                return {
                    background: 'rgba(194,56,0,255)',
                    color: 'rgba(255,255,255,255)'
                }
        }
    }

    /*
        Внедрение элементов для вещей
    */
    #injectEquipment() {
        if (this.profile) {
            for (let itemName in this.profile.Equip) {
                if (
                    this.profile.Equip[itemName].Element_001.type === "ItemTitle" && 
                    this.profile.Equip[itemName].Element_001.value.qualityValue &&
                    this.profile.Equip[itemName].Element_001.value.qualityValue != -1
                    ) {
                    const domElement = document.querySelector('[data-item=' + '"' + itemName + '"]' )
                    domElement.insertAdjacentElement('beforeend', this.#createCurrentProfileInjection(
                        this.profile.Equip[itemName].Element_001.value.qualityValue
                    ))
                }
            }
        }

    }

    #getLineWidthByQuality(quality) {
        const itemDefaultWidth = 41
        const calcWidth =  Math.round((quality/100) * itemDefaultWidth)
        return {
            "filled": calcWidth.toString() + "px",
            "remainder": (itemDefaultWidth - calcWidth).toString() + "px"
        }
    }

    #createCurrentProfileInjection(quality){
        
        const wrapper = document.createElement('div')
        wrapper.classList.add('js-injection--current-profile-quality-wrapper')

        const linesWidth = this.#getLineWidthByQuality(quality)
        
        const linesWrapper = document.createElement('div')
        linesWrapper.classList.add('js-injection--current-profile-quality-lines-wrapper')

        const qualityLine = document.createElement('div')
        qualityLine.style.background = this.#getColorByQuality(quality)
        qualityLine.style.width = linesWidth.filled
        qualityLine.classList.add(
            'js-injection--current-profile-quality-line', 
            )

        const qualityText = document.createElement('div')
        qualityText.classList.add('js-injection--current-profile-quality-text')
        qualityText.innerText = quality

        wrapper.appendChild(linesWrapper)
        wrapper.appendChild(qualityLine)
        wrapper.appendChild(qualityText)

        return wrapper
    }

    /*
        Забираем DOM обертки гравировок
    */
    #getEngravesWrapper() {
        return document.querySelector('.swiper-wrapper')
    }

    /*
        Отключаем пагинатор Гравировок
    */
    #disableEngravesPaginator() {
        const container = document.querySelector('.swiper-container')
        if (container) {
            container.removeChild(document.querySelector('.swiper-option'))
        }
    }

    /*
        Изменяем блок с Гравировками
    */
    #engraveItemPrettier(engraveDome) {
        let engraveText = engraveDome.getElementsByTagName('span')[0].innerHTML
        engraveDome.classList.add('js-injection--current-profile-engrave-wrapper')
        const regexEngraveLevel = /(.*)(\d+ ур.)/
        const match = engraveText.match(regexEngraveLevel)
        if (match.length === 3) {
            engraveDome.getElementsByTagName('span')[0].innerHTML = match[1]
            const levelSpan = document.createElement('span')
            levelSpan.innerText = match[2]
            levelSpan.classList.add('js-injection--current-profile-engrave-level')
            engraveDome.appendChild(levelSpan)
            const engraveIncoPath = this.#getEngraveIconPath(match[1])

            if (engraveIncoPath) {
                engraveDome.getElementsByTagName('span')[0].style = 'font-weight: bold !important'
                const img = document.createElement('img')
                img.src = engraveIncoPath
                img.style.height = '20px'
                img.style.width = '20px'
                img.classList.add('js-injection--current-profile-engrave-icon')
                engraveDome.insertBefore(img, engraveDome.getElementsByTagName('span')[0])
            }
        }
    }

    /*
        Формируем ссылку на корейскую армори
    */
    #getEngraveIconPath(engraveName) {
        for (let engrave in this.profile.Engrave) {
            if (this.profile.Engrave[engrave].Element_000.value.toLowerCase().trim() == engraveName.toLowerCase().trim()) {
                return this.#CDN_BASE_URL + this.profile.Engrave[engrave].Element_001.value.slotData.iconPath
            }
        }
        return ''
    }

    #flatterEngraveWrapper() {
        const engravesWrapper = this.#getEngravesWrapper()
        if (engravesWrapper) {
            for (let i = 0; i < engravesWrapper.children.length; i++) {
                for (let j = 0; j < engravesWrapper.children[i].children.length; j++) {
                    let child = engravesWrapper.children[i].children[j]
                    this.#engraveItemPrettier(child)
                    // Если есть иконта Енгравы, то кидаем ее в начало (сортировка)
                    if (child.getElementsByTagName('img').length > 0) {
                        engravesWrapper.children[0].insertBefore(child, engravesWrapper.children[0].children[0])
                    }
                    // Если не на 1ой странице, то перемещаем энгравы на 1ую
                    if (i > 0) {
                        // Если есть иконта Енгравы, то кидаем ее в начало (сортировка)
                        if (child.getElementsByTagName('img').length > 0) {
                            engravesWrapper.children[0].insertBefore(child, engravesWrapper.children[0].children[0])
                        } else {
                            engravesWrapper.children[0].appendChild(child)
                        }
                        j--
                    }
    
                }   
            }
        }
    }

    /*
        Внедрение элементов для элексиров
    */
    #injectGearsElixirs() {
        const offsetX = 55
        let dataSource
        for (let itemId in this.profile.Equip) {
            // Предположительно данные по элексирам могут быть только в элементах Element_007 или Element_008.
            if (
                this.profile.Equip[itemId].Element_007 && 
                this.profile.Equip[itemId].Element_007.value &&
                this.profile.Equip[itemId].Element_007.value.Element_000 &&
                this.profile.Equip[itemId].Element_007.value.Element_000.contentStr
                ) 
            {   
                dataSource = this.profile.Equip[itemId].Element_007.value.Element_000.contentStr

            } else if (
                this.profile.Equip[itemId].Element_008 && 
                this.profile.Equip[itemId].Element_008.value &&
                this.profile.Equip[itemId].Element_008.value.Element_000 &&
                this.profile.Equip[itemId].Element_008.value.Element_000.contentStr
            ) {
                dataSource = this.profile.Equip[itemId].Element_008.value.Element_000.contentStr
            } else {
                continue
            }

            const domElement = document.querySelector('[data-item=' + '"' + itemId + '"]' )
            const parsedElixirData = this.#parseElixirData(dataSource)
            const style = window.getComputedStyle(domElement)
            const injectingElement = this.#createCurrentProfileElixirInjection(parsedElixirData,)
            injectingElement.style.top = style.top

            injectingElement.style.left = (parseInt(style.left.slice(0, -2)) + offsetX).toString() + "px"
            domElement.insertAdjacentElement('afterend', injectingElement)
        }
    }

    /*
        Хендлер для всплывающего меню
    */
    #showPopupHadler(forDom, popup, content) {
        return function() {
            popup.showFor(forDom, content)
        }

    }

    /*
        Создание родительского элемента для элексиров на броне
    */
    #createCurrentProfileElixirInjection(elixirsData) {
        const wrapper = document.createElement('div')
        wrapper.classList.add('js-injection--current-profile-elixirs-wrapper')
        
        for (let i in elixirsData) {
            const content = document.createElement('div')
            content.classList.add('js-injection--current-profile-elixirs-content')

            const elixirDot = document.createElement('div')
            elixirDot.classList.add('js-injection--current-profile-elixirs-dot')
            const colors = this.#getColorByElixirLevel(parseInt(elixirsData[i].elixirLevel))

            elixirDot.style.background = colors.background
            elixirDot.style.color = colors.color
            elixirDot.innerHTML = elixirsData[i].elixirLevel
    
            content.appendChild(elixirDot)
            content.appendChild(this.#createElixirContent(elixirsData[i]))

            const spacer = document.createElement('div')
            wrapper.appendChild(content)
            wrapper.appendChild(spacer)
        }
        return wrapper
    }

    /*
        Создание строки под элексир с его описаниеи и уровнем
    */
    #createElixirContent(elixirData) {
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

    /*
        Парсим элексир и разбиваем на компоненты
    */
    #parseElixirData(elixirsProfileList) {
        const regex = /<FONT.*>(?<itemType>\[.*?\])<\/FONT>(?<exilirName>.+?)<FONT.+>(?<elixirLevel>\d+)/
        let result = []
        for (let id in elixirsProfileList) {
            const match = elixirsProfileList[id].contentStr.match(regex)
            if (match && match.length === 4) {
                result.push(
                    {
                        itemType: match.groups.itemType.trim(),
                        elixirName: match.groups.exilirName.trim(),
                        elixirLevel: match.groups.elixirLevel.trim()
                    }
                )
            }
        }
        return result
    }


    /*
        Внедрение элементов для графировок
    */
    #injectEngraves() {
        this.#flatterEngraveWrapper()
        this.#disableEngravesPaginator()
    }

    inject() {
        this.#injectEquipment()
        this.#injectEngraves()
        this.#injectGearsElixirs()
       
    }
}


function processImbuedProfile() {
    const serversList = document.querySelectorAll(".profile-character-list__char")
    let profiles = []
    if (serversList) {
        for (let serverIndex = 0; serverIndex < serversList.length; serverIndex++) {
            const buttons = serversList[serverIndex].getElementsByTagName("button")
            for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
                const profile = new ImbuedProfile(
                    buttons[buttonIndex].getElementsByTagName("span")[0].innerHTML,
                    buttons[buttonIndex]
                )
                profile.inject()
                profiles.push(
                    profile
                )
            }
        }
    }

}

function processActiveProfile() {
    const script = document.querySelector("html").innerHTML
    const activeProfile = new ActiveProfile(
        script
    )
    activeProfile.inject()
}


/*
    Запуск пайплайна
*/
processImbuedProfile()
processActiveProfile()