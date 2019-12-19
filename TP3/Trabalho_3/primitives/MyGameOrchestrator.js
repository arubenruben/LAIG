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


        this.gameboard = new MyGameBoard(scene, -2, 4, 4, -2, 2);
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



        // this.piece3.display();


    }
}