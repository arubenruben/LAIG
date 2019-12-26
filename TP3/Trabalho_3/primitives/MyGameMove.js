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
    constructor(gameOrchestractor,Tile,movedPiece) {
        super(gameOrchestractor.scene);
        this.gameOrchestractor=gameOrchestractor;
        this.scene = gameOrchestractor.scene;
        this.storeBoard=gameOrchestractor.gameboard;
        this.Tile=Tile;
        this.movedPiece=movedPiece;
    }



//TODO:Animate Piece
    animate(){






    }


}