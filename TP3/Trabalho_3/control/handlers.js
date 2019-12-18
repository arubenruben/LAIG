'use strict'

function handleInitialBoard(gameOrchestrator, data) {
    let localGameOrchestrator = gameOrchestrator;
    let board = String(data);
    let arrayLinesOfBoard;

    //REMOVE THE EXTREMES OF BOARD [ ]
    let stringWithoutLimits = board.substring(1, board.length - 2);
    arrayLinesOfBoard = stringWithoutLimits.split('],');

    for (let i = 0; i < arrayLinesOfBoard.length; i++) {
        arrayLinesOfBoard[i] = arrayLinesOfBoard[i].substring(1);
    }

    for (let i = 0; i < arrayLinesOfBoard.length; i++) {
        //MATRIX FIRST DEFINE ARRAY GLOBAL THEN ARRAY EACH LINE
        localGameOrchestrator.initialBoardRaw[i]=new Array();
        for (let j = 0 ; j < arrayLinesOfBoard[i].length; j++){
            if (arrayLinesOfBoard[i][j] != ',') {
                localGameOrchestrator.initialBoardRaw[i].push(Number(arrayLinesOfBoard[i][j]));
            }
        }
    }

    console.log(localGameOrchestrator.initialBoardRaw);

    return true;
}


function handlerError(message) {






}