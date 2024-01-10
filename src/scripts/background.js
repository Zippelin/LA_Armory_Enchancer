chrome.tabs.onActivated.addListener(
    function(info) {
        chrome.tabs.get(info.tabId, function(change) {
            const regex = /https:\/\/лостарк.рф\/Оружейная\/.+/
            console.log(change);
            if (change.url == undefined) {
            }
            else if (change.url.match(regex)) {
                chrome.action.setIcon({
                    path: {
                        "16": "media/icons/16.png",
                        "32": "media/icons/32.png",
                        "48": "media/icons/48.png",
                        "128": "media/icons/128.png"
                    },
                    tabId: info.tabId
                });
            } else {
                chrome.action.setIcon({
                    path: {
                        "16": "media/icons/16-off.png",
                        "32": "media/icons/32-off.png",
                        "48": "media/icons/48-off.png",
                        "128": "media/icons/128-off.png"
                    },
                    tabId: info.tabId
                });
            }
        })
    }
)