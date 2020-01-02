'use strict'

const failMessage = 'FAIL';
const gameOverMessage = 'GAME OVER';

class handlerPrologReplys {

    constructor(orchestrator) {
        this.orchestrator = orchestrator;
    }

    handleInitialBoard(data) {
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
            this.orchestrator.initialBoardRaw[i] = new Array();
            for (let j = 0; j < arrayLinesOfBoard[i].length; j++) {
                if (arrayLinesOfBoard[i][j] != ',') {
                    this.orchestrator.initialBoardRaw[i].push(Number(arrayLinesOfBoard[i][j]));
                }
            }
        }
        this.orchestrator.buildInitialBoard();
    }

    handleMove(data, obj, id) {

        let auxArray = new Array();

        if (data == gameOverMessage) {
            this.orchestrator.gameStateControl.currentState = this.orchestrator.states.GAME_OVER;
        }
        else if (data != failMessage) {

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
                auxArray[i] = new Array();
                for (let j = 0; j < arrayLinesOfBoard[i].length; j++) {
                    if (arrayLinesOfBoard[i][j] != ',') {
                        auxArray[i].push(Number(arrayLinesOfBoard[i][j]));
                    }
                }
            }

            this.orchestrator.updateBoard(auxArray, obj, id);
        } else {
            if (this.orchestrator.scene.gameType == 'Player vs AI' && this.orchestrator.gameStateControl.currentPlayer == 1 ||
                this.orchestrator.scene.gameType == 'AI vs Player' && this.orchestrator.gameStateControl.currentPlayer == 2
            ) {
                this.orchestrator.scene.setPickEnabled(false);
            } else {
                this.orchestrator.scene.setPickEnabled(true);
            }
            let orchestratorVar = this.orchestrator;
            window.setTimeout(function () {
                orchestratorVar.scene.cameraAnimation = true;
            }, 2000);
            
            this.orchestrator.gameStateControl.playDone = true;
        }
        this.orchestrator.gameStateControl.pickPending = false;
    }

    handleBotMove(data) {

        let str = data.toString();

        if (data == gameOverMessage) {
            this.orchestrator.gameStateControl.currentState = this.orchestrator.states.GAME_OVER;
        }
        else if (data != failMessage) {
            let index = str.indexOf(',');
            let x = Number(str.slice(1, index));
            let y = Number(str.slice(index + 1, str.length - 1));

            this.orchestrator.updateBoardBotMove(x, y);
        }

    }

    handlerError(message) {
        return false;
    }

}