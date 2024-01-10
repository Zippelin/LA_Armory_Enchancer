const BASE_ARMORY_URL = "https://xn--80aubmleh.xn--p1ai/%D0%9E%D1%80%D1%83%D0%B6%D0%B5%D0%B9%D0%BD%D0%B0%D1%8F/"


class Profile {
    #BASE_ARMORY_URL = "https://xn--80aubmleh.xn--p1ai/%D0%9E%D1%80%D1%83%D0%B6%D0%B5%D0%B9%D0%BD%D0%B0%D1%8F/"
    #regexMaxGearsPower = /.+<div class="level-info2__item"><span>Максимальный рейтинг<\/span><span><small>Ур.<\/small>(?<currentGearsMain>\d*,*\d+).+(?<currentGearsSecondary>.*\d\d)/
    #regexCurrentGearsPower = /.+<div class="level-info2__expedition"><span>Текущий рейтинг снаряжения<\/span><span><small>Ур.<\/small>(?<currentGearsMain>\d*,*\d+).+(?<currentGearsSecondary>.*\d\d)/
    #regexClassPathIcon = /.+<img class="profile-character-info__img" src="(?<iconPath>.+?)"/

    constructor(name, parentDom, injectedDom) {
        this.name = name
        this.maxGearsPower = '0'
        this.currentGearsPower = '0'
        this.iconPath = ''
        this.parentDom = parentDom
        this.injectedDom = injectedDom
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
    
    queryProfile() {
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
        header.innerHTML = "Снаряжение"
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
}



function processProfile() {
    const serversList = document.querySelectorAll(".profile-character-list__char")
    let profiles = []
    if (serversList) {
        for (let serverIndex = 0; serverIndex < serversList.length; serverIndex++) {
            const buttons = serversList[serverIndex].getElementsByTagName("button")
            for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++) {
                const profile = new Profile(
                    buttons[buttonIndex].getElementsByTagName("span")[0].innerHTML,
                    buttons[buttonIndex],
                    createInjectionElement()
                )
                profile.queryProfile()
                profiles.push(
                    profile
                )
            }
        }
    }

}

/*
    Создаем шаблон для иньекции в список персонажей
*/
function createInjectionElement() {
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

processProfile()