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

        this.piece = new MyPiece(scene);

        /* this.gameSequence = new MyGameSequence(…);
         this.animator = new MyAnimator(…);
         this.gameboard = new MyGameboard(…);
         this.theme = new MyScenegraph(…);
         this.prolog = new MyPrologInterface(…); */
    }


    update(time) {
        //   this.animator.update(time);
    }

    display() {
        /* this.theme.display();
         this.gameboard.display();
         this.animator.display();*/

        this.piece.display();
    }

}