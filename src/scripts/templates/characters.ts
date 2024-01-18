export function getClassIconTemplate(iconUrl: string): HTMLImageElement {
    const img = document.createElement('img')
    img.src = iconUrl
    img.style.height = '20px'
    img.style.width = '20px'
    img.classList.add("js-injection--class-icon")
    return img
}

export function getGearPowerTitleTemplate(): HTMLDivElement {
    const header = document.createElement('div')
    header.innerHTML = "Снаряжение:"
    header.classList.add("js-injection--gears-power-header")
    return header
}

export function getCurrrentGearPowerTemplate(gearPower: string): HTMLDivElement {
    const currentPower = document.createElement('div')
    currentPower.innerHTML = gearPower
    currentPower.classList.add("js-injection--gears-power-values-major")
    return currentPower
}

export function getMaxGearPowerTemplate(gearPower: string): HTMLDivElement {
    const wrapper = document.createElement('div')
    wrapper.classList.add('js-injection--gears-power-values-minor')
    const splitter = document.createElement('div')
    splitter.innerHTML = '/'
    splitter.classList.add("js-injection--gears-power-values-minor")
    const maxPower = document.createElement('div')
    maxPower.innerHTML = gearPower
    maxPower.classList.add("js-injection--gears-power-values-minor")
    wrapper.appendChild(splitter)
    wrapper.appendChild(maxPower)
    return wrapper
}

export function getGearPowerWrapperTemplate(): HTMLDivElement {
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