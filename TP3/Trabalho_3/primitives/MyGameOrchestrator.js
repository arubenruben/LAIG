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
const timeForPlay = 30 * 1000;

class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;
        this.orchestrator = this;

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
            //WIN MUST BE THE LAST BECUASE OF NEXT STATE:
            ROTATING_CAMERA: 10,
            ANIMATING_PIECE: 12,
            UNDO_PROGRESS: 13,
            GAME_OVER: 14,
            MOVIE_REPLY: 15,
            WIN_PLAYER1: 16,
            WIN_PLAYER2: 17
        };
        this.gameStateControl = new MyGameStateControler(this);
        this.initialBoardRaw = new Array();
        this.gameboardSet = false;
        this.prolog = new MyPrologInterface(this);
        this.handler = new handlerPrologReplys(this);
        this.imagesAssets = new MyImageStorage(this);
        this.timeBoard = new MyTimeBoard(this);


        let handlerVAR = this.handler;
        this.currentTime = Date.now()
        this.cameraSeqId = null;
        /*
        this.theme = new MyScenegraph(…);
        this.animator = new MyAnimator(…);
        */
        this.requestAtive = true;
        this.undoPending = false;
        this.prolog.getPrologRequest(
            'start',
            function (data) {
                handlerVAR.handleInitialBoard(data.target.response);
            },
            function (data) {
                handlerVAR.handlerError(data.target.response);
            });
        this.gameSequence = new MyGameSequence(this);
        this.gameboard = null;


        this.pieceAnimation = false;
        this.pieceAnimationIndexI = null;
        this.pieceAnimationIndexJ = null;
        this.prologResponseReceived = false;
    }

    buildInitialBoard() {
        this.gameboardSet = true;
        this.gameboard.updateMatrixOfTiles();
        this.player1_stash = new MyAuxiliarBoard(this, this.gameboard.x1, this.gameboard.z1, this.gameboard.x2, this.gameboard.z2, this.gameboard.tiles_width, this.gameboard.tiles_height, 1);
        this.player2_stash = new MyAuxiliarBoard(this, this.gameboard.x1, this.gameboard.z1, this.gameboard.x2, this.gameboard.z2, this.gameboard.tiles_width, this.gameboard.tiles_height, 2);
    }
    updateBoard(incomingArray, obj, id) {
        this.gameboardSet = false;

        for (let i = 0; i < this.gameboard.matrixBoard.length; i++) {
            for (let j = 0; j < this.gameboard.matrixBoard[i].length; j++) {
                //Se existir uma peca e que vale a pena retirar
                if (this.gameboard.matrixBoard[i][j].piece != null) {
                    if (incomingArray[i][j] == 0) {
                        this.pieceRemoved = this.gameboard.matrixBoard[i][j].piece;
                        let newGameMove = new MyGameMove(this.orchestrator, obj, this.pieceRemoved)
                        this.orchestrator.gameSequence.addGameMove(newGameMove);
                        this.orchestrator.pieceAnimation = true;
                        this.orchestrator.pieceAnimationIndexI = i;
                        this.orchestrator.pieceAnimationIndexJ = j;
                    }
                }
            }
        }
        //TODO:TIREI UM UPDATE SCORES DAQUI DETETAR GAMEOVER E EXEQUIVEL AINDA ????
        
        this.gameStateControl.playDone = true;
        this.gameboardSet = true;
        this.orchestrator.currentState == this.orchestrator.states.UNDO_PROGRESS
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
            this.pieceRemoved = this.gameboard.matrixBoard[coordY][coordX].piece;
            this.orchestrator.prologResponseReceived = true;
            this.orchestrator.pieceAnimation = true;
            this.orchestrator.pieceAnimationIndexI = coordY;
            this.orchestrator.pieceAnimationIndexJ = coordX;
            this.gameStateControl.checkVitory();
        }

        this.gameboardSet = true;

        if (this.scene.gameType == 'Player vs AI' && this.gameStateControl.currentPlayer == 2 ||
            this.scene.gameType == 'AI vs Player' && this.gameStateControl.currentPlayer == 1
        ) {
            this.gameStateControl.playDone = false;
        } else {
            this.gameStateControl.playDone = true;
        }

        this.gameStateControl.playPending = false;
    }

    orchestrate() {

        switch (this.gameStateControl.currentState) {

            case this.states.INITIALIZING:
                if (this.gameboardSet == true) {
                    this.gameStateControl.nextState();
                }
                break;

            case this.states.SET_THE_GAME_TYPE:
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

                if (this.gameStateControl.handlePlayerWait(this.scene.gameType) == true) {
                    this.gameStateControl.nextState();
                }
                break;

            case this.states.WAIT_PLAYER_2_MOVE:

                if (this.gameStateControl.handlePlayerWait(this.scene.gameType) == true) {
                    this.gameStateControl.nextState();
                }
                break;
            case this.states.WAIT_BOT_1_MOVE:

                /*TODO:TRATAR if (this.gameStateControl.handleBotWait(this.scene.gameType) == true) {
                */
                if (this.gameStateControl.handleBotWait(this.scene.gameType) == true) {
                    this.prologResponseReceived = false;
                    this.gameStateControl.nextState();
                }
                break;


            case this.states.WAIT_BOT_2_MOVE:
                /*TODO:TRATAR if (this.gameStateControl.handleBotWait(this.scene.gameType) == true) {
                    */
                if (this.gameStateControl.handleBotWait(this.scene.gameType) == true) {
                    this.gameStateControl.nextState();
                }
                break;
            case this.states.ANIMATING_PIECE:
                if (!this.pieceAnimation) {
                    console.log('Next animation');
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
                this.requestAtive = true;
                this.prolog.getPrologRequest(
                    stringRequest,
                    function (data) {
                        handlerVAR.handleMove(data.target.response, obj, id);
                    },
                    function (data) {
                        handlerVAR.handlerError(data.target.response, obj, id);
                    });

                this.gameStateControl.nextState();

                break;

            case this.states.PICK_REPLY:
                if (this.gameStateControl.pickPending == false) {
                    this.gameStateControl.nextState();
                }
                break;

            case this.states.UNDO_PROGRESS:
                if (this.undoPending == false && this.orchestrator.scene.cameraAnimation == false) {
                    this.gameStateControl.nextState();
                }
                break;

            case this.states.ROTATING_CAMERA:
                if (this.scene.cameraAnimationDone) {
                    this.scene.cameraAnimationDone = false;
                    console.log('Camera next');
                    this.gameStateControl.nextState();
                }
                break;
            case this.states.GAME_OVER:

                //TODO:Disable Picking.
                //TODO: GameoverMenu;
                console.log('Game Over');
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
        if (this.pieceAnimation && this.pieceAnimationIndexI != null && this.pieceAnimationIndexJ != null) {
            if (this.orchestrator.gameStateControl.currentPlayer == 1) {
                this.gameboard.matrixBoard[this.pieceAnimationIndexI][this.pieceAnimationIndexJ].piece.animation.update(currentTime);
            } else if (this.orchestrator.gameStateControl.currentPlayer == 2) {
                this.gameboard.matrixBoard[this.pieceAnimationIndexI][this.pieceAnimationIndexJ].piece.animation2.update(currentTime);
            }
        }
    }
}