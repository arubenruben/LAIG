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
        if (this.orchestractor.gameStateControl.currentState == this.orchestractor.states.GAME_OVER || this.orchestractor.gameStateControl.currentState == WIN_PLAYER1 || this.orchestractor.gameStateControl.currentState == WIN_PLAYER2) {
            //To use a simple POP, order inverted, restablished at the end
            this.arrayGameSequence.reverse();
            while (this.arrayGameSequence.length > 0) {
                //TODO: Executa isto a cada 2seg
                let gameMovie = this.arrayGameSequence[this.arrayGameSequence.length - 1];
                this.installGameSequence(gameMovie);
                this.arrayGameSequence.pop();
            }
        }
        else {
            console.error('Not allowed gameMovie on this state');
        }
        //Restablish order
        this.arrayGameSequence.reverse();
    }
    installGameSequence(gameMove) {

        this.orchestractor.gameboardSet = false;
        let scoreArray;
        let pieceToInsertNumeric;
        let pieceRemoved = gameMove.removedPiece;

        if (pieceRemoved != null) {

            if (this.orchestractor.gameStateControl.currentPlayer == 1) {
                scoreArray = this.orchestractor.gameStateControl.score_player_1;
            }
            else {
                scoreArray = this.orchestractor.gameStateControl.score_player_2;
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
        this.orchestractor.gameboard = gameMove.storeBoard;
        this.orchestractor.gameboardSet = true;
    }
}