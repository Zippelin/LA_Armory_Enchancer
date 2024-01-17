chrome.runtime.sendMessage('gogogLA', (response) => {
    console.log({command: 'lala', dom: document.querySelector('.profile-equipment__character')}, response);
    
})