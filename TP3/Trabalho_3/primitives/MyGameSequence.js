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
        
        this.orchestractor.gameStateControl.playDone=false;
        
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

            this.orchestractor.gameStateControl.playDone=true;
            //TODO:Ver se isto e suficiente
            this.orchestractor.gameStateControl.nextState();

        }

    }
    installGameSequence(gameMove){

        this.orchestractor.gameboardSet = false;
        let scoreArray;
        let pieceToInsertNumeric;
        let pieceRemoved=gameMove.removedPiece;

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
        this.orchestractor.gameboard=gameMove.storeBoard;
        this.orchestractor.gameboardSet = true;
    }
}