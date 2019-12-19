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

        //TODO:Pass as parameter the correct tile
        this.tile = new MyTile(this);
        this.piece = new MyPiece(this);
        //TODO:COMPLETAR OS STATES
        this.states = {
            INITIALIZING: 0,
            SET_THE_GAME_TYPE: 1,
            SET_THE_AI_0_DIF: 2,
            SET_THE_AI_1_DIF: 3,
            WAIT_PLAYER_1_MOVE: 4,
            WAIT_PLAYER_2_MOVE: 5,

            //WIN MUST BE THE LAST BECUASE OF NEXT STATE:
            WIN: 9
        };

        //TODO:VER ONDE COLOCAR O ARRAY COM O ESTADO DO JOGO
        this.gameStateControl = new MyGameStateControler(this);

        //MATRIX REPRESENTING THE GAME STATUS
        this.initialBoardRaw = new Array();
        this.gameState = new Array();
        this.gameboardSet = false;

        this.piece1 = new MyPiece(this, 'blue');
        this.piece2 = new MyPiece(this, 'red');
        this.piece3 = new MyPiece(this, 'yellow');
        this.prolog = new MyPrologInterface(this);
        this.handler=new handlerPrologReplys(this);
        this.activePlayer = 0;

        //Request to retrieve the InitialBoard
        let handlerVAR=this.handler;
        
        this.prolog.getPrologRequest(
            'start',
            function (data) {
                handlerVAR.handleInitialBoard(data.target.response);
            },
            function (data) {
                handlerVAR.handlerError(data.target.response);
        });

        //RELEASE THE memory.
        //this.initialBoardRaw=[];

        /* this.gameSequence = new MyGameSequence(…);
        this.theme = new MyScenegraph(…);
        this.animator = new MyAnimator(…);
        */
    }

    buildInitialBoard() {
        this.gameboard = new MyGameBoard(this, -2, 4, 4, -2, 2, this.tile);
        this.gameboardSet=true;
    }

    orchestrate(){

        switch(this.gameStateControl.currentState){

            case this.states.INITIALIZING:
                
                if(this.gameboardSet==true){
                    this.gameStateControl.nextState();
                }

            break;

            case this.states.SET_THE_GAME_TYPE:
                //TODO:CREATE HTML TO APPEAR A BOX IN THE TOP DECENT
                //alert('Inserir o game type');

                if(this.scene.gameType!=null&&this.scene.gameType>=0&&this.scene.gameType<3){
                    //console.log('Aqui');
                    this.gameStateControl.nextState();
                }
                
            break;

            case this.SET_THE_AI_0_DIF:


            break;

            case this.SET_THE_AI_1_DIF:
                

            break;

            case WAIT_PLAYER_1_MOVE:


            break;
        
            
        }









    }


    update(time) {
        //   this.animator.update(time);
    }

    display() {

        if (this.gameboardSet==true) {

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
}