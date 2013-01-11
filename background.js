// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the letter 'g' is found in the tab's URL...
  if (tab.url.match(/.+\.dli\.ernet\..+/g)) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
    
    
    // send message to content script to refresh ui
    chrome.tabs.sendMessage(tabId, 'reload');
    
  }
};

function downloadSet(set){
    var i, pag, finalurl, tmpi;
    var opts;
    pag = Number(set.last);
    for (i = 1; i<= pag;i++){
        tmpi = '00000000' + i;
        tmpi = tmpi.substring(tmpi.length - 8);
        finalurl = set.server + set.path1 + "/PTIFF/" + tmpi + '.tif';
        opts = {
            url: finalurl,
            filename:  set.barcode+'-' + tmpi+ '.tif'
        };

        chrome.downloads.download(opts);
    }
}
function onRequest(request, sender, sendResponse) {
    downloadSet(request);
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

 
// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);


