'use strict'
class MyPrologInterface {

    constructor(orchestrator) {
        this.orchestrator = orchestrator;
    }


    getPrologRequest(requestString, onSuccess, onError, port) {
        let requestPort = port || 8081
        let request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    makeRequest(string) {
        // Get Parameter Values
        console.log("Enviei" + string);
        let reply;
        // Make Request
        reply = getPrologRequest(string, handleReply);
        return reply;
    }
    //Handle the Reply
    handleReply(data) {
        let serverStatus = data.target.status;
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


    sendBoardString(matrix) {

        let strReturn = new String;
        let str_index = 0;

        strReturn+= '[';

        for (let i = 0; i < matrix.length; i++) {
            strReturn += '[';

            for (let j = 0; j < matrix[i].length; j++) {

                strReturn += matrix[i][j];

                if (j < matrix[i].length - 1) {
                    strReturn += ',';
                }
            }
            strReturn += ']';
            if(i<matrix.length-1){
                strReturn += ',';
            }
        }
        strReturn += ']';

        return strReturn;




    }

}