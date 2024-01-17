import {SOME_TEGEX} from "./constants/regex.js"

chrome.runtime.onMessage.addListener((message, sender, responser) => {
    responser()
    console.log(message, sender, responser, SOME_TEGEX);
    message.dom.style.backdround = '#fff'
    
})