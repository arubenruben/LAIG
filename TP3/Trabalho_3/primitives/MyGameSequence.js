/**
• Stores the a sequence of game moves (MyGameMove objects):
• Class MyGameSequence
• Methods:
• Add a game move
• Manage undo
• Feeds move replay
 */
class MyGameSequence extends CGFobject {
    constructor(orchestractor) {
        super(orchestractor.scene);
        this.orchestractor = orchestractor
        this.scene = orchestractor.scene;
        this.arrayGameSequence = new Array();
    }

    addGameMove(gameMove) {
        this.arrayGameSequence.push(gameMove);
    }
    undo() {

        this.orchestractor.gameStateControl.playDone = false;

        let gameMove;

        if (this.arrayGameSequence.length > 0) {
            gameMove = this.arrayGameSequence[this.arrayGameSequence.length - 1];
            this.arrayGameSequence.pop();

            if (this.orchestractor.gameStateControl.currentPlayer == 1) {
                this.orchestractor.gameStateControl.currentPlayer = 2;
            }
            else {
                this.orchestractor.gameStateControl.currentPlayer = 1;
            }

            this.installGameSequence(gameMove);

            this.orchestractor.gameStateControl.playDone = true;
            this.orchestractor.gameStateControl.nextState();
        }

    }

    gameMovie() {
        if (this.orchestractor.gameStateControl.currentState == this.orchestractor.states.GAME_OVER || this.orchestractor.gameStateControl.currentState == this.orchestractor.states.WIN_PLAYER1 || this.orchestractor.gameStateControl.currentState == this.orchestractor.states.WIN_PLAYER2) {
            //To use a simple POP, order inverted, restablished at the end
            this.orchestractor.gameStateControl.resumeState = this.orchestractor.gameStateControl.currentState;
            this.arrayGameSequence = this.arrayGameSequence.reverse();
            this.orchestractor.gameStateControl.currentState = this.orchestractor.states.MOVIE_REPLY;

            //Executa isto a cada 2seg
            let arrayVar=this.arrayGameSequence;
            let functionVar=this.installGameSequence;

            let id=window.setInterval(function(){
                if(arrayVar.length==0){
                    console.log('Aqui1');
                    window.clearInterval(id);
                }else{
                    console.log('Aqui2');
                    let gameMove = arrayVar[arrayVar.length - 1];
                    functionVar(gameMove);
                    arrayVar.pop();
                }
            },2000);
        }
        else {
            console.error('Not allowed gameMovie on this state');
        }
        //Restablish order
    }
    installGameSequence(gameMove) {

        gameMove.gameOrchestractor.gameboardSet = false;
        let scoreArray;
        let pieceToInsertNumeric;
        let pieceRemoved = gameMove.removedPiece;

        if (pieceRemoved != null) {

            if (gameMove.gameOrchestractor.gameStateControl.currentPlayer == 1) {
                scoreArray = gameMove.gameOrchestractor.gameStateControl.score_player_1;
            }
            else {
                scoreArray = gameMove.gameOrchestractor.gameStateControl.score_player_2;
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
        gameMove.gameOrchestractor.gameboard = gameMove.storeBoard;
        gameMove.gameOrchestractor.gameboardSet = true;
    }
}