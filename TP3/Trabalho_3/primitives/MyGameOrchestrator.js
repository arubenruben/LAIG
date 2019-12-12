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

        this.piece = new MyPiece(this);
        //TODO:Pass as parameter the correct tile
        this.tile = new MyTile(this);
        this.gameboard = new MyGameBoard(this,-2,4,4,-2,2,this.tile);
        this.piece1 = new MyPiece(this, 'blue');
        this.piece2 = new MyPiece(this, 'red');
        this.piece3 = new MyPiece(this, 'yellow');


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