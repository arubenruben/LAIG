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
    constructor(gameOrchestractor,Tile,removedPiece) {
        super(gameOrchestractor.scene);
        this.gameOrchestractor=gameOrchestractor;
        this.scene = gameOrchestractor.scene;
        this.storeBoard=gameOrchestractor.gameboard.matrixBoard;
        this.Tile=Tile;
        this.removedPiece=removedPiece;
    }



//TODO:Animate Piece
    animate(){






    }


}