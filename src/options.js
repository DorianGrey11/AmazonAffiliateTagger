function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        affTag: document.querySelector("#affTag").value,
        smileOpt: document.querySelector("#smileOpt").checked
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#affTag").value = result.affTag || "donating-21"; //developer's affiliate tag
        document.querySelector("#smileOpt").checked = result.smileOpt || false;    //Amazon Smile option
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.sync.get(["affTag","smileOpt"]);
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
//licensed under CC-BY-SA 2.5 (https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Options_pages$history) modified by DorianGrey11