'use strict'

const failMessage='FAIL';

class handlerPrologReplys {
    
    constructor(orchestrator){
        this.gameOrchestrator=orchestrator;
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
            this.gameOrchestrator.initialBoardRaw[i] = new Array();
            for (let j = 0; j < arrayLinesOfBoard[i].length; j++) {
                if (arrayLinesOfBoard[i][j] != ',') {
                    this.gameOrchestrator.initialBoardRaw[i].push(Number(arrayLinesOfBoard[i][j]));
                }
            }
        }
        this.gameOrchestrator.buildInitialBoard();
    }

    handleMove(data,obj,id){
        
        let auxArray=new Array();

        if(data!=failMessage){

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

            this.gameOrchestrator.updateBoard(auxArray,obj,id);
        }    
        this.gameOrchestrator.gameStateControl.pickPending=false;
    }

    handleBotMove(data){
        
        let auxArray=new Array();

        if(data!=failMessage){

            this.gameOrchestrator.updateBoard(auxArray,obj,id);
        }    
        this.gameOrchestrator.gameStateControl.pickPending=false;
    }

    handlerError(message) {
        return false;
    }

}