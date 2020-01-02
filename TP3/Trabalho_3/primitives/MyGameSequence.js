/**
• Stores the a sequence of game moves (MyGameMove objects):
• Class MyGameSequence
• Methods:
• Add a game move
• Manage undo
• Feeds move replay
 */
class MyGameSequence extends CGFobject {
    constructor(orchestrator) {
        super(orchestrator.scene);
        this.orchestrator = orchestrator
        this.scene = orchestrator.scene;
        this.arrayGameSequence = new Array();
    }

    addGameMove(gameMove) {
        this.arrayGameSequence.push(gameMove);
    }
    undo() {
        if(this.orchestrator.gameStateControl.currentState>this.orchestrator.states.SET_THE_AI_2_DIF&&this.orchestrator.gameStateControl.currentState<this.orchestrator.states.PICK_ACTIVE){

            this.orchestrator.gameStateControl.playDone = false;
            let gameMove;
            
            if (this.arrayGameSequence.length > 0) {
                gameMove = this.arrayGameSequence[this.arrayGameSequence.length - 1];
                this.arrayGameSequence.pop();
                this.orchestrator.gameStateControl.refreshPlayer();
                this.installGameSequence(gameMove);
                this.orchestrator.gameStateControl.playDone = true;
                this.orchestrator.gameStateControl.nextState();
            }
        }else{
            console.log(this.orchestrator.gameStateControl.currentState);
            console.error('Cannot use undo in this state');
        }
    }

    gameMovie() {
        if (this.orchestrator.gameStateControl.currentState == this.orchestrator.states.GAME_OVER || this.orchestrator.gameStateControl.currentState == this.orchestrator.states.WIN_PLAYER1 || this.orchestrator.gameStateControl.currentState == this.orchestrator.states.WIN_PLAYER2) {
            //To use a simple POP, order inverted, restablished at the end
            this.orchestrator.gameStateControl.resumeState = this.orchestrator.gameStateControl.currentState;
            let initialGameBoard = this.arrayGameSequence[0].storeBoard;
            this.orchestrator.gameboard = initialGameBoard;
            if(this.orchestrator.gameStateControl.currentPlayer==2){
                this.orchestrator.scene.cameraAnimation=true;
            }
            this.orchestrator.gameStateControl.currentPlayer = 1;
            this.orchestrator.gameStateControl.score_player_1 = [0, 0, 0];
            this.orchestrator.gameStateControl.score_player_2 = [0, 0, 0];
            this.arrayGameSequence = this.arrayGameSequence.reverse();
            this.orchestrator.gameStateControl.currentState = this.orchestrator.states.MOVIE_REPLY;
            //Executa isto a cada 2seg
            let arrayVar = this.arrayGameSequence;
            let functionVar = this.gameMovieInstallerSequence;
            let varOrchestrator=this.orchestrator;
            let id2 = window.setInterval(function () {
                if (arrayVar.length == 0) {
                    window.clearInterval(id2);
                } else {
                    varOrchestrator.scene.cameraAnimation=true;
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
    installGameSequence(gameMove) {

        this.orchestrator.scene.cameraAnimation=true;
        gameMove.orchestrator.gameboardSet = false;
        let scoreArray;
        let pieceToInsertNumeric;
        let pieceRemoved = gameMove.removedPiece;
        
        window.clearTimeout(this.orchestrator.cameraSeqId);

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

            
            scoreArray[pieceToInsertNumeric]--;
        }
        gameMove.orchestrator.gameboard = gameMove.storeBoard;
        gameMove.orchestrator.gameboardSet = true;
        
        if (this.orchestrator.scene.gameType == 'Player vs AI' && this.orchestrator.gameStateControl.currentPlayer == 2 ||
            this.orchestrator.scene.gameType == 'AI vs Player' && this.orchestrator.gameStateControl.currentPlayer == 1
        ) {
            this.orchestrator.gameStateControl.playDone = false;
            this.orchestrator.scene.setPickEnabled(true);
        } else {
            this.orchestrator.gameStateControl.playDone = true;
            this.orchestrator.scene.setPickEnabled(false);
        }
        this.orchestrator.gameStateControl.currentState=this.orchestrator.states.ROTATING_CAMERA;
        let orchestratorVar=this.orchestrator;
        window.setTimeout(function () {
            orchestratorVar.scene.cameraAnimation = true;
        }, 2000);
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
}