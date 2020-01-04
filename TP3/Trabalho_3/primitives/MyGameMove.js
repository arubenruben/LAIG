/**
Stores a game move
• Class MyGameMove
• Has:
• Pointer to moved piece (MyPiece)
• Pointer to origin tile (MyTile)
• Pointer to destination tile (MyTile)
• Gameboard state before the move (MyGameboard representation)
• Methods:
• Animate
 */
class MyGameMove extends CGFobject {
    constructor(orchestrator, Tile, removedPiece) {
        super(orchestrator.scene);
        this.orchestrator = orchestrator;
        this.scene = orchestrator.scene;
        this.storeBoard = new MyGameBoard(orchestrator, this.orchestrator.gameboard.x1, this.orchestrator.gameboard.z1, this.orchestrator.gameboard.x2, this.orchestrator.gameboard.z2);
        this.removedPiece = removedPiece;
        this.currentPlayer = orchestrator.gameStateControl.currentPlayer;
        this.storeBoard.updateMatrixOfTiles();

        for (let i = 0; i < orchestrator.gameboard.matrixBoard.length; i++) {
            for (let j = 0; j < orchestrator.gameboard.matrixBoard[i].length; j++) {
                if (orchestrator.gameboard.matrixBoard[i][j].piece != null) {                    
                    this.storeBoard.matrixBoard[i][j].piece= null;
                    this.storeBoard.matrixBoard[i][j].piece = new MyPiece(this.orchestrator, orchestrator.gameboard.matrixBoard[i][j].piece.color, this.storeBoard.matrixBoard[i][j], j, i);
                } else {
                    this.storeBoard.matrixBoard[i][j].piece = null;
                }
            }
        }

        this.storeBoard.helperSequence();

        this.Tile = Tile;
        this.removedPiece = removedPiece;
    }
}