'use strict'


function getPrologRequest(requestString, onSuccess, onError, port) {
    let requestPort = port || 8081
    let request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
    request.onerror = onError || function () { console.log("Error waiting for response"); };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

function makeRequest(string) {
    // Get Parameter Values
    console.log("Enviei"+string);
    // Make Request
    getPrologRequest(string, handleReply);
}
//Handle the Reply
function handleReply(data) {
    console.log("Recebi"+string);
}
