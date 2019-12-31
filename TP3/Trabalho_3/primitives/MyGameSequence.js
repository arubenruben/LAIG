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
            this.orchestractor.gameStateControl.refreshPlayer();
            this.installGameSequence(gameMove);
            this.orchestractor.gameStateControl.playDone = true;
            this.orchestractor.gameStateControl.nextState();
        }
    }

    gameMovie() {
        if (this.orchestractor.gameStateControl.currentState == this.orchestractor.states.GAME_OVER || this.orchestractor.gameStateControl.currentState == this.orchestractor.states.WIN_PLAYER1 || this.orchestractor.gameStateControl.currentState == this.orchestractor.states.WIN_PLAYER2) {
            //To use a simple POP, order inverted, restablished at the end
            this.orchestractor.gameStateControl.resumeState = this.orchestractor.gameStateControl.currentState;
            let initialGameBoard = this.arrayGameSequence[0].storeBoard;
            this.orchestractor.gameboard = initialGameBoard;
            this.orchestractor.gameStateControl.currentPlayer = 1;
            this.orchestractor.gameStateControl.score_player_1 = [0, 0, 0];
            this.orchestractor.gameStateControl.score_player_2 = [0, 0, 0];
            this.arrayGameSequence = this.arrayGameSequence.reverse();
            this.orchestractor.gameStateControl.currentState = this.orchestractor.states.MOVIE_REPLY;
            //Executa isto a cada 2seg
            let arrayVar = this.arrayGameSequence;
            let functionVar = this.gameMovieInstallerSequence;

            let id = window.setInterval(function () {
                if (arrayVar.length == 0) {
                    window.clearInterval(id);
                } else {
                    let gameMove = arrayVar[arrayVar.length - 1];
                    gameMove.orchestractor.gameStateControl.currentPlayer = gameMove.currentPlayer;
                    functionVar(gameMove);
                    arrayVar.pop();
                }
            }, 2000);
        }
        else {
            console.error('Not allowed gameMovie on this state');
        }
        //Restablish order
    }
    installGameSequence(gameMove) {

        gameMove.orchestractor.gameboardSet = false;
        let scoreArray;
        let pieceToInsertNumeric;
        let pieceRemoved = gameMove.removedPiece;

        if (pieceRemoved != null) {
            this.orchestractor.gameStateControl.refreshPlayer();
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
        gameMove.orchestractor.gameboard = gameMove.storeBoard;
        gameMove.orchestractor.gameboardSet = true;
    }

    gameMovieInstallerSequence(gameMove) {

        gameMove.orchestractor.gameboardSet = false;
        let scoreArray;
        let pieceToInsertNumeric;
        let pieceRemoved = gameMove.removedPiece;


        if (pieceRemoved != null) {

            if (gameMove.orchestractor.gameStateControl.currentPlayer == 1) {
                scoreArray = gameMove.orchestractor.gameStateControl.score_player_1;
            }
            else {
                scoreArray = gameMove.orchestractor.gameStateControl.score_player_2;
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
        gameMove.orchestractor.gameboard = gameMove.storeBoard;
        gameMove.orchestractor.gameboardSet = true;
    }
}