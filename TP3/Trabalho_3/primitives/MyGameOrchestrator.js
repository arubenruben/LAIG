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
            //WIN MUST BE THE LAST BECUASE OF NEXT STATE:
            /*TODO:TRATAR
            ROTATING_CAMERA: 10,
            UNDO_PROGRESS: 11,
            GAME_OVER: 12,
            MOVIE_REPLY: 13,
            WIN_PLAYER1: 14,
            WIN_PLAYER2: 15
            */
            ROTATING_CAMERA: 12,
            WIN_PLAYER1: 13,
            WIN_PLAYER2: 14,
            ANIMATING_PIECE: 15,
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
        // if (this.gameboard == null) {
        //     console.log('erro');
        // }
        // this.gameboard.updateMatrix();

        this.player1_stash = new MyAuxiliarBoard(this, this.gameboard.x1, this.gameboard.z1, this.gameboard.x2, this.gameboard.z2, this.gameboard.tiles_width, this.gameboard.tiles_height, 1);
        this.player2_stash = new MyAuxiliarBoard(this, this.gameboard.x1, this.gameboard.z1, this.gameboard.x2, this.gameboard.z2, this.gameboard.tiles_width, this.gameboard.tiles_height, 2);
    }
    updateBoard(incomingArray, obj, id) {
        this.gameboardSet = false;
        /*TODO:TRATAR
        let pieceRemoved = null;
        */
        for (let i = 0; i < this.gameboard.matrixBoard.length; i++) {
            for (let j = 0; j < this.gameboard.matrixBoard[i].length; j++) {
                //Se existir uma peca e que vale a pena retirar
                if (this.gameboard.matrixBoard[i][j].piece != null) {
                    if (incomingArray[i][j] == 0) {
                        this.pieceRemoved = this.gameboard.matrixBoard[i][j].piece;
                        let newGameMove = new MyGameMove(this.orchestrator, obj, this.pieceRemoved)
                        this.orchestrator.gameSequence.addGameMove(newGameMove);
                        /*TODO:TRATAR
                        this.orchestrator.pieceAnimation = true;
                        */
                        this.orchestrator.pieceAnimationIndexI = i;
                        this.orchestrator.pieceAnimationIndexJ = j;
                        //this.gameboard.matrixBoard[i][j].piece = null;
                    } else {
                        let newGameMove = new MyGameMove(this.orchestrator, obj, null)
                        this.orchestrator.gameSequence.addGameMove(newGameMove);
                    }
                }
            }
        }
        /*
        this.gameStateControl.updateScores(pieceRemoved);
        if (this.gameStateControl.currentState < this.states.GAME_OVER) {
            */

        // faço apenas quando a animação acabar e não aqui

        //this.gameStateControl.updateScores(pieceRemoved);

            let orchestratorVar = this.orchestrator;
            this.cameraSeqId = window.setTimeout(function () {
                orchestratorVar.scene.cameraAnimation = true;
            }, 2000);
        /*}*/
        this.gameStateControl.playDone = true;
        this.gameboardSet = true;
        this.gameStateControl.playPending = false;
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
        
        if (this.gameStateControl.currentState < this.states.GAME_OVER) {
    
            let orchestratorVar = this.orchestrator;
            this.cameraSeqId = window.setTimeout(function () {
                orchestratorVar.scene.cameraAnimation = true;
            }, 2000);
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
                this.mutex = true;
                if (this.gameStateControl.handleBotWait(this.scene.gameType) == true && this.prologResponseReceived) {
                    this.prologResponseReceived = false;
                    this.gameStateControl.nextState();
                }
                break;

            case this.states.ANIMATING_PIECE:
                this.mutex = true;
                if (!this.pieceAnimation) {
                    this.gameStateControl.nextState();
                }
                break;



            case this.states.WAIT_BOT_2_MOVE:
                /*TODO:TRATAR if (this.gameStateControl.handleBotWait(this.scene.gameType) == true) {
                */
                this.mutex = true;
                if (this.gameStateControl.handleBotWait(this.scene.gameType) == true && this.prologResponseReceived) {
                    this.prologResponseReceived = false;
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

    /*TODO:TRATAR display() {
        if (this.gameboardSet == true) {
            /* this.theme.display();
            this.animator.display();*/
            /*
            this.gameboard.display();
            if ((this.orchestrator.scene.gameType == '1vs1' ||
                this.orchestrator.scene.gameType == 'Player vs AI' && this.orchestrator.gameStateControl.currentPlayer == 1 ||
                this.orchestrator.scene.gameType == 'AI vs Player' && this.orchestrator.gameStateControl.currentPlayer == 2)
            ) {
                this.timeBoard.display();
            }
            this.player1_stash.display();
            this.player2_stash.display();
        */
        if (this.pieceAnimation && this.pieceAnimationIndexI != null && this.pieceAnimationIndexJ != null) {
            if (this.orchestrator.gameStateControl.currentPlayer == 1) {
                this.gameboard.matrixBoard[this.pieceAnimationIndexI][this.pieceAnimationIndexJ].piece.animation.update(currentTime);
            } else if (this.orchestrator.gameStateControl.currentPlayer == 2) {
                this.gameboard.matrixBoard[this.pieceAnimationIndexI][this.pieceAnimationIndexJ].piece.animation2.update(currentTime);
            }
        }
    }
}