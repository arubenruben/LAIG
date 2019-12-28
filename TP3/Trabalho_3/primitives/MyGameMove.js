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
        this.storeBoard=new MyGameBoard(gameOrchestractor,this.gameOrchestractor.gameboard.x1,this.gameOrchestractor.gameboard.z1,this.gameOrchestractor.gameboard.x2,this.gameOrchestractor.gameboard.z2);

        for(let i=0;i<gameOrchestractor.gameboard.matrixBoard.length;i++){
            for(let j=0;j<gameOrchestractor.gameboard.matrixBoard[i].length;j++){
                console.log(gameOrchestractor.gameboard.matrixBoard[i][j].piece);
                this.storeBoard.matrixBoard[i][j].piece=new MyPiece(this.gameOrchestractor, gameOrchestractor.gameboard.matrixBoard[i][j].piece, this.storeBoard.matrixBoard[i][j], j, i);
            }
        }
    
        this.Tile=Tile;
        this.removedPiece=removedPiece;
    }

//TODO:Animate Piece
    animate(){






    }


}