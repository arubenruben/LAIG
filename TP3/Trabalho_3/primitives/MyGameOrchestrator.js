/**
•Class MyGameOrchestrator
• Manages the entire game:
• Load of new scenes
• Manage gameplay (game states)
• Manages undo
• Manages movie play
• Manage object selection
 */

//30 Mil segundos
const timeForPlay = 75 * 1000;

class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.orchestrator = this;

        //TODO:COMPLETAR OS STATES
        this.states = {
            INITIALIZING: 0,
            SET_THE_GAME_TYPE: 1,
            SET_THE_AI_1_DIF: 2,
            SET_THE_AI_2_DIF: 3,
            WAIT_PLAYER_1_MOVE: 4,
            WAIT_PLAYER_2_MOVE: 5,
            WAIT_BOT_1_MOVE: 6,
            WAIT_BOT_2_MOVE: 7,
            PICK_ACTIVE: 8,
            PICK_REPLY: 9,
            GAME_OVER: 10,
            MOVIE_REPLY: 11,
            //WIN MUST BE THE LAST BECUASE OF NEXT STATE:
            ROTATING_CAMERA: 12,
            WIN_PLAYER1: 13,
            WIN_PLAYER2: 14,

        };
        this.gameStateControl = new MyGameStateControler(this);
        this.initialBoardRaw = new Array();
        this.gameboardSet = false;
        this.prolog = new MyPrologInterface(this);
        this.handler = new handlerPrologReplys(this);
        this.imagesAssets = new MyImageStorage(this);
        this.timeBoard = new MyTimeBoard(this);


        let handlerVAR = this.handler;
        this.currentTime = Date.now();
        this.mutex = true;
        /*
        this.theme = new MyScenegraph(…);
        this.animator = new MyAnimator(…);
        */
        this.prolog.getPrologRequest(
            'start',
            function(data) {
                handlerVAR.handleInitialBoard(data.target.response);
            },
            function(data) {
                handlerVAR.handlerError(data.target.response);
            });
        this.gameSequence = new MyGameSequence(this);
        this.gameboard = null;
    }

    buildInitialBoard() {
        this.gameboardSet = true;
        this.gameboard.updateMatrixOfTiles();
        // if (this.gameboard == null) {
        //     console.log('erro');
        // }
        // this.gameboard.updateMatrix();

        this.player1_stash = new MyAuxiliarBoard(this, this.gameboard.x1, this.gameboard.z1, this.gameboard.x2, this.gameboard.z2, this.gameboard.tiles_width, this.gameboard.tiles_height, 1);
        this.player2_stash = new MyAuxiliarBoard(this, this.gameboard.x1, this.gameboard.z1, this.gameboard.x2, this.gameboard.z2, this.gameboard.tiles_width, this.gameboard.tiles_height, 2);
    }
    updateBoard(incomingArray, obj, id) {
        this.gameboardSet = false;
        let pieceRemoved = null;

        for (let i = 0; i < this.gameboard.matrixBoard.length; i++) {
            for (let j = 0; j < this.gameboard.matrixBoard[i].length; j++) {
                //Se existir uma peca e que vale a pena retirar
                if (this.gameboard.matrixBoard[i][j].piece != null) {
                    if (incomingArray[i][j] == 0) {
                        pieceRemoved = this.gameboard.matrixBoard[i][j].piece;
                        let newGameMove = new MyGameMove(this.orchestrator, obj, pieceRemoved)
                        this.orchestrator.gameSequence.addGameMove(newGameMove);
                        this.gameboard.matrixBoard[i][j].piece = null;
                    } else {
                        let newGameMove = new MyGameMove(this.orchestrator, obj, null)
                        this.orchestrator.gameSequence.addGameMove(newGameMove);
                    }
                }
            }
        }

        this.gameStateControl.updateScores(pieceRemoved);

        this.gameboardSet = true;
        this.gameStateControl.playPending = false;
        this.gameStateControl.playDone = true;
    }

    updateBoardBotMove(coordX, coordY) {
        /*DESFAZER PROTOCOLO*/
        let invalidPlay = false;

        if (coordX < 0 && coordY < 0) {
            coordX++;
            coordY++;
            coordX = -coordX;
            coordY = -coordY;
            invalidPlay = true;
        }
        this.gameboardSet = false;


        if (invalidPlay == false) {
            let newGameMove = new MyGameMove(this.orchestrator, this.gameboard.matrixBoard[coordY][coordX], this.gameboard.matrixBoard[coordY][coordX].piece);
            this.orchestrator.gameSequence.addGameMove(newGameMove);
            this.gameStateControl.updateScores(this.gameboard.matrixBoard[coordY][coordX].piece);
            this.gameboard.matrixBoard[coordY][coordX].piece = null;
            this.gameStateControl.checkVitory();
        } else {
            let newGameMove = new MyGameMove(this.orchestrator, this.gameboard.matrixBoard[coordY][coordX], null);
            this.orchestrator.gameSequence.addGameMove(newGameMove);
        }
        this.gameboardSet = true;

        if (this.scene.gameType != 'AI vs AI')
            this.scene.setPickEnabled(true);

        this.gameStateControl.playPending = false;
        this.gameStateControl.playDone = true;
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

                if (this.scene.gameType != null && (this.scene.gameType == 'AI vs Player' || this.scene.gameType == '1vs1' || this.scene.gameType == 'AI vs AI' || this.scene.gameType == 'Player vs AI')) {
                    this.gameStateControl.nextState();
                }
                break;

            case this.states.SET_THE_AI_1_DIF:
                if (this.scene.ai1Dificulty != null) {
                    this.gameStateControl.nextState();
                }

                break;

            case this.states.SET_THE_AI_2_DIF:
                if (this.scene.ai2Dificulty != null) {
                    this.gameStateControl.nextState();
                }
                break;

            case this.states.WAIT_PLAYER_1_MOVE:
                this.mutex = true;
                if (this.gameStateControl.handlePlayerWait(this.scene.gameType) == true) {
                    this.startCountingTime = true;
                    this.gameStateControl.nextState();
                }
                break;

            case this.states.WAIT_PLAYER_2_MOVE:
                this.mutex = true;
                if (this.gameStateControl.handlePlayerWait(this.scene.gameType) == true) {
                    this.gameStateControl.nextState();
                }
                break;
            case this.states.WAIT_BOT_1_MOVE:
                this.mutex = true;
                if (this.gameStateControl.handleBotWait(this.scene.gameType) == true) {
                    this.gameStateControl.nextState();
                }
                break;


            case this.states.WAIT_BOT_2_MOVE:
                this.mutex = true;
                if (this.gameStateControl.handleBotWait(this.scene.gameType) == true) {
                    this.gameStateControl.nextState();
                }
                break;

            case this.states.PICK_ACTIVE:

                let obj = this.gameStateControl.pickObject;
                let id = this.gameStateControl.pickId;
                let x = obj.piece.x;
                let y = obj.piece.y;
                let gameboardToPrologRaw = this.gameboard.matrixBoard;
                let stringRequest = this.prolog.moveRequest(gameboardToPrologRaw, x, y);
                let handlerVAR = this.handler;

                this.prolog.getPrologRequest(
                    stringRequest,
                    function(data) {
                        handlerVAR.handleMove(data.target.response, obj, id);
                    },
                    function(data) {
                        handlerVAR.handlerError(data.target.response, obj, id);
                    });

                this.gameStateControl.nextState();

                break;

            case this.states.PICK_REPLY:
                if (this.gameStateControl.pickPending == false) {
                    this.gameStateControl.nextState();
                }
                break;

            case this.states.GAME_OVER:

                //TODO:Disable Picking.
                //TODO: GameoverMenu;
                console.log('Game Over');
                break;

            case this.states.ROTATING_CAMERA:
                if (this.scene.cameraAnimationDone) {
                    this.scene.cameraAnimationDone = false;
                    this.gameStateControl.nextState();
                }

                break;
            case this.states.WIN_PLAYER1:
                //TODO:Disable Picking.
                //TODO: Win Menu;
                console.log('Player 1 Won');
                break;

            case this.states.WIN_PLAYER2:
                //TODO:Disable Picking.
                //TODO: Win Menu;
                console.log('Player 2 Won');
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
    }

    update(currentTime) {
        this.currentTime = currentTime;
        this.timeBoard.update(currentTime);
    }

    display() {
        if (this.gameboardSet == true) {
            /* this.theme.display();
            this.animator.display();*/
            this.timeBoard.display();
            this.player1_stash.display();
            this.player2_stash.display();
            // this.piece3.display();
        }

    }
}