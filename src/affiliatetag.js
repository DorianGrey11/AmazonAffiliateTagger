/*
 *     AmazonAffiliateTagger
 *     Copyright (C) 2020.  Dorian Werner
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */


/**
 * tries to get the Amazon affiliate tracking-ID  (affTag) from the browser's sync storage area.
 * Otherwise the developer's tracking-ID is used.
 *
 * @returns {Promise<string>} affTag
 */
async function getAffTag() {
    /**
     * tracking-ID of an Amazon affiliate partner.
     * @type {string}
     */
    let affTag = "donating-21"; //developer's affiliate tag

    try {
        affTag = (await browser.storage.sync.get("affTag")).affTag;
        if (!affTag) {
            affTag = "donating-21";
        }
    } catch {
        console.log("Could not sync affTag");
    }

    return Promise.resolve(affTag);
}

/**
 * tries to get the last URL from the browser's session storage area.
 * Otherwise an empty string is returned.
 *
 * @returns {Promise<string>} lastUrl
 */
async function getLastUrl() {
    /**
     * last visited Amazon URL
     * @type {string} lastUrl
     */
    let lastUrl = "";
    try {
        lastUrl = window.sessionStorage.getItem("lastUrl"); //gets the lastUrl value
    } catch {
        console.log("Could not sync lastUrl");
    }

    return Promise.resolve(lastUrl);
}

/**
 * tries to get the Amazon Smile option from the browser's session storage area.
 * Otherwise false is returned.
 *
 * @returns {Promise<boolean>} smileOpt
 */
async function getSmileOpt() {
    /**
     * Amazon Smile redirection option
     * @type {boolean} smileOpt
     */
    let smileOpt = false;

    try {
        smileOpt =  (await browser.storage.sync.get("smileOpt")).smileOpt; //gets the smileOpt checked value
        if (!smileOpt) {
            smileOpt = false;
        }
    } catch {
        console.log("Could not sync smileOpt");
    }

    return Promise.resolve(smileOpt);
}

/**
 * changes the tag parameter of an Amazon product page to the {@link getAffTag} value.
 */
function changeUrl([affTag, lastUrl, smileOpt]) {

    let activeUrl = new URL(window.location.href);
    let urlSearchParams = new URLSearchParams(activeUrl.search);


    //skips the process if the correct tag is already in place or page has been loaded before
    if (urlSearchParams.get('tag') == affTag || lastUrl == activeUrl.toString()) {
    }   //checks if requested page is a product page
    else if (activeUrl.toString().includes("/dp/") || activeUrl.toString().includes("/product/")
        || activeUrl.toString().includes("/ASIN/") || activeUrl.toString().includes("/e/")) {

        //new value of lastUrl is saved in SessionStorage
        window.sessionStorage.setItem("lastUrl", activeUrl.toString());
        // new value of "tag" is set
        urlSearchParams.set('tag', affTag);
        // change the search property of the activeUrl
        activeUrl.search = urlSearchParams.toString();
        let newUrlString = activeUrl.toString()

        if (smileOpt){
            newUrlString = newUrlString.replace("www.","smile.")
        }

        // replaces the activeUrl
        window.location.replace(newUrlString);
    }
}

Promise.all([getAffTag(), getLastUrl(), getSmileOpt()]).then(changeUrl);