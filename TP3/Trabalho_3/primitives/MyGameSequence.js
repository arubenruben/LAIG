/**
• Stores the a sequence of game moves (MyGameMove objects):
• Class MyGameSequence
• Methods:
• Add a game move
• Manage undo
• Feeds move replay
 */
class MyGameSequence {
    constructor(orchestrator) {
        this.orchestrator = orchestrator
        this.scene = orchestrator.scene;
        this.arrayGameSequence = new Array();
    }

    addGameMove(gameMove) {
        this.arrayGameSequence.push(gameMove);
    }
    undo() {

        if(this.orchestrator.gameStateControl.currentState==this.orchestrator.states.UNDO_PROGRESS||
            this.orchestrator.gameStateControl.currentState==this.orchestrator.states.ROTATE_CAMERA||
            this.orchestrator.scene.cameraAnimation==true
            ){
                return false;
            }
            
            if(this.arrayGameSequence.length>0){
                this.orchestrator.gameStateControl.currentState=this.orchestrator.states.UNDO_PROGRESS;
                
                window.clearTimeout(this.orchestrator.cameraSeqId);
                this.orchestrator.undoPending=true;
                this.orchestrator.scene.setPickEnabled(false);
                let gameMove = this.arrayGameSequence[this.arrayGameSequence.length - 1];
                
                let animationUsed=false;
                
                if(this.orchestrator.gameStateControl.currentPlayer!=gameMove.currentPlayer){
                    animationUsed=true;
                    this.orchestrator.scene.cameraAnimation=true;
                }

                this.orchestrator.gameStateControl.currentPlayer=gameMove.currentPlayer;
                this.arrayGameSequence.pop();
                
                let functionVar=this.installGameSequence;

                if(animationUsed==true){
                    window.setTimeout(
                    functionVar(gameMove)
                    ),2000
                }
                else{
                    functionVar(gameMove)

                }
            }
    }
    installGameSequence(gameMove){
        
        let scoreArray;
        let pieceToInsertNumeric;
        let pieceRemoved = gameMove.removedPiece;

        if (gameMove.orchestrator.gameStateControl.currentPlayer == 1) {
            scoreArray = gameMove.orchestrator.gameStateControl.score_player_1;
        }
        else {
            scoreArray = gameMove.orchestrator.gameStateControl.score_player_2;
        }
        if (pieceRemoved.color == 'red') {
            pieceToInsertNumeric = 0;
        }
        else if (pieceRemoved.color == 'blue') {
            pieceToInsertNumeric = 1;
        }
        else if (pieceRemoved.color == 'yellow') {
            pieceToInsertNumeric = 2;
        }
        scoreArray[pieceToInsertNumeric]--;
        
        gameMove.orchestrator.gameboard = gameMove.storeBoard;
        gameMove.orchestrator.undoPending=false;
    }
    gameMovie() {
        if (this.orchestrator.gameStateControl.currentState == this.orchestrator.states.GAME_OVER || this.orchestrator.gameStateControl.currentState == this.orchestrator.states.WIN_PLAYER1 || this.orchestrator.gameStateControl.currentState == this.orchestrator.states.WIN_PLAYER2) {
            //To use a simple POP, order inverted, restablished at the end
            this.orchestrator.gameStateControl.resumeState = this.orchestrator.gameStateControl.currentState;
            let initialGameBoard = this.arrayGameSequence[0].storeBoard;
            this.orchestrator.gameboard = initialGameBoard;
            if (this.orchestrator.gameStateControl.currentPlayer == 2) {
                this.orchestrator.scene.cameraAnimation = true;
            }
            this.orchestrator.gameStateControl.currentPlayer = 1;
            this.orchestrator.gameStateControl.score_player_1 = [0, 0, 0];
            this.orchestrator.gameStateControl.score_player_2 = [0, 0, 0];
            this.arrayGameSequence = this.arrayGameSequence.reverse();
            this.orchestrator.gameStateControl.currentState = this.orchestrator.states.MOVIE_REPLY;
            //Executa isto a cada 2seg
            let arrayVar = this.arrayGameSequence;
            let functionVar = this.gameMovieInstallerSequence;
            let varOrchestrator = this.orchestrator;
            let id2 = window.setInterval(function () {
                if (arrayVar.length == 0) {
                    window.clearInterval(id2);
                } else {
                    varOrchestrator.scene.cameraAnimation = true;
                }
            }, 3500);

            let id = window.setInterval(function () {
                if (arrayVar.length == 0) {
                    window.clearInterval(id);
                } else {
                    let gameMove = arrayVar[arrayVar.length - 1];
                    gameMove.orchestrator.gameStateControl.currentPlayer = gameMove.currentPlayer;
                    functionVar(gameMove);
                    arrayVar.pop();
                }
            }, 3500);


        }
        else {
            console.error('Not allowed gameMovie on this state');
        }
        //Restablish order
    }

    gameMovieInstallerSequence(gameMove) {

        gameMove.orchestrator.gameboardSet = false;
        let scoreArray;
        let pieceToInsertNumeric;
        let pieceRemoved = gameMove.removedPiece;


        if (pieceRemoved != null) {

            if (gameMove.orchestrator.gameStateControl.currentPlayer == 1) {
                scoreArray = gameMove.orchestrator.gameStateControl.score_player_1;
            }
            else {
                scoreArray = gameMove.orchestrator.gameStateControl.score_player_2;
            }
            if (pieceRemoved.color == 'red') {
                pieceToInsertNumeric = 0;
            }
            else if (pieceRemoved.color == 'blue') {
                pieceToInsertNumeric = 1;
            }
            else if (pieceRemoved.color == 'yellow') {
                pieceToInsertNumeric = 2;
            }
            scoreArray[pieceToInsertNumeric]++;
        }
        gameMove.orchestrator.gameboard = gameMove.storeBoard;
        gameMove.orchestrator.gameboardSet = true;
    }

    reset() {
        this.orchestrator.gameStateControl.currentState = this.orchestrator.states.INITIALIZING;
        this.orchestrator.scene.interface = new MyInterface();
        this.orchestrator.scene.interface.reset(this.orchestrator.scene);
        this.orchestrator.scene.gameType = null;
        this.orchestrator.scene.ai1Dificulty = null;
        this.orchestrator.scene.ai2Dificulty = null;
        if (this.orchestrator.gameStateControl.currentPlayer == 2) {
            this.scene.cameraAnimation = true;
        }
        this.orchestrator.gameStateControl.currentPlayer = 1;
        this.orchestrator.currentTime = Date.now();
        this.orchestrator.gameStateControl = new MyGameStateControler(this.orchestrator);

        for (let i = 0; i < this.orchestrator.gameboard.matrixBoard.length; i++) {
            for (let j = 0; j < this.orchestrator.gameboard.matrixBoard[i].length; j++) {
                let initialPiece = this.orchestrator.initialBoardRaw[i][j];
                if (initialPiece > 0 && initialPiece < 4) {
                    this.orchestrator.gameboard.matrixBoard[i][j].piece = new MyPiece(this.orchestrator, initialPiece, this.orchestrator.gameboard.matrixBoard[i][j], j, i);
                }
            }
        }
    }
}