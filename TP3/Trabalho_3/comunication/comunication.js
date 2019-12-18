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
    console.log("Enviei" + string);
    let reply;
    // Make Request
    reply= getPrologRequest(string, handleReply);
    return reply;
}
//Handle the Reply
function handleReply(data) {
    let serverStatus=data.target.status;
    switch (serverStatus) {

        case 200:
            console.log('Sucess');
            return data.target.response;
        break;

        default:
            console.log('Default');
            break;
    }

    return;
}
