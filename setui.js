console.log('started running extension');


// subscribe to messages from background script
chrome.extension.onMessage.addListener(function(message, sender) {

    if (message==="reload"){
        // updateUI(document);
    }
});



function parseUrl(url){
    var reserv =/https?:\/\/[^\/]+/g;
    var srv;
    if(url && typeof (url) === "string" && url.indexOf('?') !== -1) {
        srv = url.match(reserv);
    var q = url.split('?')[1];
        
        var fragment, o = {};
        if(srv[0]) {
            o.server = srv[0];
        } else {
            o.server = window.location.match(reserv)[0];
        }
        
        var p = q.split('&');
        for (var i = 0, l = p.length; i< l; i++){
            fragment = p[i].split('=');
            o[fragment[0]] = fragment[1];
        }
        
        return o;
    } else {
        return {};
    }
}

function updateUI (doc){

//    var frames = doc.getElementsByTagName('frame');
    var i, l, b;
/*
    for (i = 0, l=frames.length; i<l; i++) {
        frames[i].addEventListener('DOMFrameContentLoaded', function(){
            updateUI(document);
        }, false);
        frames[i].addEventListener('DOMContentLoaded', function(){
            updateUI(document);
        }, false);
        updateUI(frames[i].contentDocument);
    }
*/    
    var links = doc.getElementsByTagName('a');
    var forms = doc.getElementsByTagName('form');
    
    for (i = 0, l=forms.length; i<l; i++) {
        forms[i].addEventListener('submit', function() {
            updateUI(document);
        }, false);
    }
    
    
    var books = Array.prototype.filter.call(links, function(arel){
        // return arel.getElementsByTagName('font').length > 0;
        return (arel.innerText.match('Click')) && (arel.href.match('http'));
    });
    
    for(i = 0, l = books.length; i<l; i++){
        b = doc.createElement("button");
        b.innerHTML = 'D';
        attachEvt(b, books[i].href);
        books[i].parentNode.insertBefore(b, books[i]);
    }
}

function downloadSet(set){
    var i, pag, finalurl, tmpi, errc = 0;
    var opts;
    pag = Number(set.last);
    for (i = 1; i<= pag;i++){
        if (errc > (pag/10)){
            break;  
        }
        tmpi = '00000000' + i;
        tmpi = tmpi.substring(tmpi.length - 8);
        finalurl = set.server + set.path1 + "/PTIFF/" + tmpi + '.tif';
        opts = {
            url: finalurl,
            filename:  set.barcode +'-' + tmpi+ '.tif'
        };
        //chrome.downloads.download(opts);
        //jQuery.ajax(finalurl,{type: "GET", async: false}).error(function(){errc++;});

    }
}

function attachEvt(el, url){
    el.addEventListener("click", function( event ) {
        var filesetinfo = parseUrl(url);
        console.log(filesetinfo);
//        downloadSet(filesetinfo);
        chrome.extension.sendRequest(filesetinfo);
      }, false);
}

updateUI(document);


