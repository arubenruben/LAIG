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
        this.removedPiece=removedPiece;
        this.currentPlayer=gameOrchestractor.gameStateControl.currentPlayer;
        
        for(let i=0;i<gameOrchestractor.gameboard.matrixBoard.length;i++){
            for(let j=0;j<gameOrchestractor.gameboard.matrixBoard[i].length;j++){
                if(gameOrchestractor.gameboard.matrixBoard[i][j].piece!=null){
                    this.storeBoard.matrixBoard[i][j].piece=null;
                    this.storeBoard.matrixBoard[i][j].piece=new MyPiece(this.gameOrchestractor, gameOrchestractor.gameboard.matrixBoard[i][j].piece.color, this.storeBoard.matrixBoard[i][j], j, i);
                }else{
                    this.storeBoard.matrixBoard[i][j].piece=null;
                }
            }
        }
    
        this.Tile=Tile;
        this.removedPiece=removedPiece;
    }

//TODO:Animate Piece
    animate(){






    }


}