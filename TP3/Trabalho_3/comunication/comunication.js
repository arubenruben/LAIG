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


    moveRequest(JSMatrix, coordX, coordY) {

        let stringRequest = new String;
        let numericBoardJS = this.buildNumericBoard(JSMatrix);
        let stringMatrix = this.NumericBoardToString(numericBoardJS);
        stringRequest = "executemove(" + stringMatrix + "," + coordX + "," + coordY + ")";
        return stringRequest;
    }
    
    botRequest(JSMatrix,dificulty,score){
        
        let stringRequest = new String;
        let numericBoardJS = this.buildNumericBoard(JSMatrix);
        let stringMatrix = this.NumericBoardToString(numericBoardJS);
        let scoreArrayString=this.scoreArrayToSting(score);

        stringRequest = "botMove(" + stringMatrix + "," + dificulty + "," + scoreArrayString + ")";
        return stringRequest;
    }

    buildNumericBoard(JSmatrix) {
        let arrayNumeric = new Array();

        for (let i = 0; i < JSmatrix.length; i++) {
            arrayNumeric[i] = new Array();

            for (let j = 0; j < JSmatrix[i].length; j++) {
                let piece = JSmatrix[i][j].piece;
                let pieceToInsertNumeric = -1;

                if (piece != null) {
                    if (piece.color == 'red') {
                        pieceToInsertNumeric = 1;
                    } else if (piece.color == 'blue') {
                        pieceToInsertNumeric = 2;
                    } else if (piece.color == 'yellow') {
                        pieceToInsertNumeric = 3;
                    } else if (piece.color == 4) {
                        pieceToInsertNumeric = 0;
                    } else {
                        console.error('ERROR IN THE BOARD ABORT');
                    }
                } else {
                    pieceToInsertNumeric = 0;
                }
                arrayNumeric[i][j] = pieceToInsertNumeric;
            }
        }

        return arrayNumeric;
    }

    /*JS MATRIX TO PROLOG SYNTAX*/
    NumericBoardToString(matrix) {

        let strReturn = new String;
        strReturn += '[';
        for (let i = 0; i < matrix.length; i++) {
            strReturn += '[';
            for (let j = 0; j < matrix[i].length; j++) {
                strReturn += matrix[i][j];
                if (j < matrix[i].length - 1) {
                    strReturn += ',';
                }
            }
            strReturn += ']';
            if (i < matrix.length - 1) {
                strReturn += ',';
            }
        }
        strReturn += ']';

        return strReturn;
    }

    scoreArrayToSting(score) {

        let strReturn = new String;
        strReturn = '[';

        for (let i = 0; i < score.length; i++) {
            strReturn += score[i];

            if (i < score.length - 1) {
                strReturn += ',';
            }
        }
        strReturn += ']';

        return strReturn;
    }

}