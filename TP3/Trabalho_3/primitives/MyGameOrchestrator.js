/**
•Class MyGameOrchestrator
• Manages the entire game:
• Load of new scenes
• Manage gameplay (game states)
• Manages undo
• Manages movie play
• Manage object selection
 */

class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        let gameOrchasterAsVar=this;

        this.piece = new MyPiece(this);
        //TODO:Pass as parameter the correct tile
        this.tile = new MyTile(this);
        //MATRIX REPRESENTING THE GAME STATUS
        this.gameState = new Array();
        this.initialBoardRaw= new Array();
        this.gameboard = new MyGameBoard(this,-2,4,4,-2,2,this.tile);
        this.piece1 = new MyPiece(this, 'blue');
        this.piece2 = new MyPiece(this, 'red');
        this.piece3 = new MyPiece(this, 'yellow');

        //Request to retrieve the InitialBoard
        getPrologRequest(
            'start',
            function(data){
                handleInitialBoard(gameOrchasterAsVar,data.target.response);
            },
            function(data) {
                handlerError(data);
            }        
        );
    
        /* this.gameSequence = new MyGameSequence(…);
        this.theme = new MyScenegraph(…);
        this.animator = new MyAnimator(…);
        this.prolog = new MyPrologInterface(…); */
    }


    update(time) {
        //   this.animator.update(time);
    }

    display() {
        /* this.theme.display();
         this.gameboard.display();
         this.animator.display();*/
        this.gameboard.display();
        

        this.scene.pushMatrix();
        this.scene.translate(1, 0, 0);
        this.piece1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1, 0, 0);
        this.piece2.display();
        this.scene.popMatrix();


        // this.piece3.display();


    }
}