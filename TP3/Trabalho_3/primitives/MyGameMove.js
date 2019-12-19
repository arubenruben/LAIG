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
    constructor(gameOrchestractor,originalTile,destinationTile,movedPiece) {
        super(gameOrchestractor.scene);
        this.scene = gameOrchestractor.scene;
        this.storeBoard=gameOrchestractor.gameboard;
        this.originalTile=originalTile;
        this.destinationTile=destinationTile;
        this.movedPiece=movedPiece;
    }



//TODO:Animate Piece
    animate(){






    }


}