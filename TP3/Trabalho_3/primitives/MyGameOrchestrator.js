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

        //TODO:COMPLETAR OS STATES
        this.states = {
            INITIALIZING: 0,
            SET_THE_GAME_TYPE: 1,
            SET_THE_AI_0_DIF: 2,
            SET_THE_AI_1_DIF: 3,
            WAIT_PLAYER_1_MOVE: 4,
            WAIT_PLAYER_2_MOVE: 5,
            PICK_ACTIVE: 6,
            PICK_REPLY: 7,

            //WIN MUST BE THE LAST BECUASE OF NEXT STATE:
            WIN: 9
        };
        this.gameStateControl = new MyGameStateControler(this);
        this.initialBoardRaw = new Array();
        this.gameboardSet = false;
        this.prolog = new MyPrologInterface(this);
        this.handler = new handlerPrologReplys(this);
        let handlerVAR = this.handler;
        this.prolog.getPrologRequest(
            'start',
            function (data) {
                handlerVAR.handleInitialBoard(data.target.response);
            },
            function (data) {
                handlerVAR.handlerError(data.target.response);
            });
        /* this.gameSequence = new MyGameSequence(…);
        this.theme = new MyScenegraph(…);
        this.animator = new MyAnimator(…);
        */
    }

    buildInitialBoard() {
        this.gameboard = new MyGameBoard(this, -2, 4, 4, -2, 2);
        this.gameboardSet = true;
    }
    updateBoard(incomingArray) {
        this.gameboardSet = false;

        for (let i = 0; i < this.gameboard.matrixBoard.length; i++) {

            for (let j = 0; j < this.gameboard.matrixBoard[i].length; j++) {
                //Se existir uma peca e que vale a pena retirar

                if (this.gameboard.matrixBoard[i][j].piece != null) {
                    if (incomingArray[i][j] == 0) {
                        this.gameboard.matrixBoard[i][j].piece = null;
                    }
                }
            }

        }
        this.gameboardSet = true;
    }

    orchestrate() {

        switch (this.gameStateControl.currentState) {

            case this.states.INITIALIZING:

                if (this.gameboardSet == true) {
                    this.gameStateControl.nextState();
                }

                break;

            case this.states.SET_THE_GAME_TYPE:
                //TODO:CREATE HTML TO APPEAR A BOX IN THE TOP DECENT
                //alert('Inserir o game type');

                if (this.scene.gameType != null && this.scene.gameType >= 0 && this.scene.gameType < 3) {
                    //console.log('Aqui');
                    this.gameStateControl.nextState();
                }

                break;

            case this.states.SET_THE_AI_0_DIF:


                break;

            case this.states.SET_THE_AI_1_DIF:


                break;

            case this.states.WAIT_PLAYER_1_MOVE:


                break;

            case this.states.PICK_ACTIVE:

                let obj = this.gameStateControl.pickObject;

                let id = this.gameStateControl.pickId;
                let x = obj.piece.x;
                let y = obj.piece.y;
                let gameboardToPrologRaw = this.gameboard.matrixBoard;
                let stringRequest = this.prolog.moveRequest(gameboardToPrologRaw, x, y);
                let handlerVAR = this.handler;
                console.log(stringRequest);
                this.prolog.getPrologRequest(
                    stringRequest,
                    function (data) {
                        handlerVAR.handleMove(data.target.response);
                    },
                    function (data) {
                        handlerVAR.handlerError(data.target.response);
                    });

                this.gameStateControl.nextState();

                break;

            case this.states.PICK_REPLY:
                if (this.gameStateControl.pickPending == false) {
                    this.gameStateControl.nextState();
                }

                break;

        }

    }

    managePick(mode, results) {
        if (mode == false && this.gameStateControl.pickPending == false)
            if (results != null && results.length > 0) { // any results?
                for (var i = 0; i < results.length; i++) {
                    var obj = this.scene.pickResults[i][0]; // get object from result
                    if (obj) { // exists?
                        var uniqueId = this.scene.pickResults[i][1] // get id
                        this.onObjectSelected(obj, uniqueId);
                    }
                }
                // clear results
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
    }

    onObjectSelected(obj, id) {

        if (obj instanceof MyTile) {

            let piece = obj.piece;

            if (piece != null)
                this.gameStateControl.pickActive(obj, id);

        }

        else {




        }

    }


    update(time) {
        //   this.animator.update(time);
    }

    display() {

        if (this.gameboardSet == true) {

            /* this.theme.display();
            this.gameboard.display();
            this.animator.display();*/
            this.gameboard.display();



            // this.piece3.display();

        }

    }
}