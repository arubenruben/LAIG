'use strict'

class MyGameStateControler {

    constructor(orchestrator) {

        this.score_player_1 = [0, 0, 0];
        this.score_player_2 = [0, 0, 0];
        this.currentPlayer = 1;
        this.orchestrator = orchestrator;
        this.pickPending = false;
        this.playDone = true;
        this.playPending = false;
        this.stateTime = Date.now();
        this.currentState = this.orchestrator.states.INITIALIZING;
        //TODO:Ver Piece Removed
        this.pieceRemoved = null;
    }
    nextState() {

        switch (this.currentState) {
            case this.orchestrator.states.INITIALIZING:
                this.currentState = this.orchestrator.states.SET_THE_GAME_TYPE;
                break;
            case this.orchestrator.states.SET_THE_GAME_TYPE:

                //1vs1. Nothing More to Select 
                if (this.orchestrator.scene.gameType == '1vs1') {
                    //TODO:Improve this solution
                    this.playDone = false;
                    this.stateTime = Date.now();
                    this.currentState = this.orchestrator.states.WAIT_PLAYER_1_MOVE;
                    //Picking avaiable
                    this.orchestrator.scene.setPickEnabled(true);
                    //BOT SELECT BOT LEVEL
                } else if (this.orchestrator.scene.gameType == 'AI vs Player') {
                    this.orchestrator.scene.interface.gui.add(this.orchestrator.scene, 'ai1Dificulty', this.orchestrator.scene.ai1Dificulties).name('AI 1 Difficulty');
                    this.currentState = this.orchestrator.states.SET_THE_AI_1_DIF;

                } else if (this.orchestrator.scene.gameType == 'Player vs AI') {
                    this.orchestrator.scene.interface.gui.add(this.orchestrator.scene, 'ai2Dificulty', this.orchestrator.scene.ai2Dificulties).name('AI 2 Difficulty');
                    this.currentState = this.orchestrator.states.SET_THE_AI_2_DIF;

                    //BOT SELECT BOT LEVEL
                } else if (this.orchestrator.scene.gameType == 'AI vs AI') {
                    this.orchestrator.scene.interface.gui.add(this.orchestrator.scene, 'ai1Dificulty', this.orchestrator.scene.ai1Dificulties).name('AI 1 Difficulty');
                    this.currentState = this.orchestrator.states.SET_THE_AI_1_DIF;
                }
                break;

            case this.orchestrator.states.SET_THE_AI_1_DIF:
                //THE BOT 0 JUST CAN BE TRIGGER IN THIS SITUATIONS
                if (this.orchestrator.scene.gameType == 'AI vs Player') {
                    this.currentState = this.orchestrator.states.WAIT_BOT_1_MOVE;
                    return;
                }
                //BOT 
                else if (this.orchestrator.scene.gameType == 'AI vs AI') {
                    this.orchestrator.scene.interface.gui.add(this.orchestrator.scene, 'ai2Dificulty', this.orchestrator.scene.ai2Dificulties).name('AI 2 Difficulty');
                    this.currentState = this.orchestrator.states.SET_THE_AI_2_DIF;
                }

                break;

            case this.orchestrator.states.SET_THE_AI_2_DIF:
                //THE BOT 0 JUST CAN BE TRIGGER IN THIS SITUATIONS
                if (this.orchestrator.scene.gameType == 'Player vs AI') {
                    //TODO:Improve this solution
                    this.playDone = false;
                    this.orchestrator.scene.setPickEnabled(true);
                    this.stateTime = Date.now();
                    this.currentState = this.orchestrator.states.WAIT_PLAYER_1_MOVE;
                } else if (this.orchestrator.scene.gameType == 'AI vs AI') {
                    this.currentState = this.orchestrator.states.WAIT_BOT_1_MOVE;
                }
                break;

            case this.orchestrator.states.WAIT_PLAYER_1_MOVE:

                this.orchestrator.scene.setPickEnabled(false);

                if (!this.orchestrator.pieceAnimation) {

                    this.orchestrator.scene.cameraAnimationDone = false;
                    this.currentState = this.orchestrator.states.ROTATING_CAMERA;
                    let orchestratorVar=this.orchestrator;
                    window.setTimeout(function () {
                        orchestratorVar.scene.cameraAnimation = true;
                    }, 2000);
                } else {
                    this.currentState = this.orchestrator.states.ANIMATING_PIECE;
                }
                break;


            case this.orchestrator.states.WAIT_PLAYER_2_MOVE:

                this.orchestrator.scene.setPickEnabled(false);
                
                if (!this.orchestrator.pieceAnimation) {
                    this.orchestrator.scene.cameraAnimationDone = false;
                    this.currentState = this.orchestrator.states.ROTATING_CAMERA;
                    let orchestratorVar=this.orchestrator;
                    window.setTimeout(function () {
                        orchestratorVar.scene.cameraAnimation = true;
                    }, 2000);
                } else {
                    this.currentState = this.orchestrator.states.ANIMATING_PIECE;
                }
                break;

            case this.orchestrator.states.WAIT_BOT_1_MOVE:
                this.orchestrator.scene.setPickEnabled(false);

                if (!this.orchestrator.pieceAnimation) {
                    this.orchestrator.scene.cameraAnimationDone = false;
                    this.currentState = this.orchestrator.states.ROTATING_CAMERA;
                    let orchestratorVar=this.orchestrator;
                    window.setTimeout(function () {
                        orchestratorVar.scene.cameraAnimation = true;
                    }, 2000);
                } else if (this.orchestrator.pieceAnimation) {
                    this.currentState = this.orchestrator.states.ANIMATING_PIECE;
                }
                break;

            case this.orchestrator.states.WAIT_BOT_2_MOVE:
                this.orchestrator.scene.setPickEnabled(false);
                if (!this.orchestrator.pieceAnimation) {
                    this.orchestrator.scene.cameraAnimationDone = false;
                    this.currentState = this.orchestrator.states.ROTATING_CAMERA;
                    let orchestratorVar=this.orchestrator;
                    window.setTimeout(function () {
                        orchestratorVar.scene.cameraAnimation = true;
                    }, 2000);
                }else if (this.orchestrator.pieceAnimation) {
                    this.currentState = this.orchestrator.states.ANIMATING_PIECE;
                }
                break;
            
            case this.orchestrator.states.ANIMATING_PIECE:
                this.orchestrator.scene.cameraAnimationDone=false;
                this.orchestrator.scene.cameraAnimation = true;
                this.currentState = this.orchestrator.states.ROTATING_CAMERA;
            break;

            case this.orchestrator.states.PICK_ACTIVE:
                this.currentState = this.orchestrator.states.PICK_REPLY;
                break;

            case this.orchestrator.states.PICK_REPLY:
                //TODO:Avanca para o proximo jogador
                this.currentState = this.resumeState;
                break;

            case this.orchestrator.states.ROTATING_CAMERA:

                if (this.currentPlayer == 1) {
                    if (this.orchestrator.scene.gameType == 'AI vs Player') {
                        this.orchestrator.scene.setPickEnabled(true);
                        this.currentState = this.orchestrator.states.WAIT_PLAYER_2_MOVE;
                    } else if (this.orchestrator.scene.gameType == 'Player vs AI') {
                        this.orchestrator.scene.setPickEnabled(false);
                        this.currentState = this.orchestrator.states.WAIT_BOT_2_MOVE;
                    } else if (this.orchestrator.scene.gameType == 'AI vs AI') {
                        this.orchestrator.scene.setPickEnabled(false);
                        this.currentState = this.orchestrator.states.WAIT_BOT_2_MOVE;
                    } else if (this.orchestrator.scene.gameType == '1vs1') {
                        this.orchestrator.scene.setPickEnabled(true);
                        this.currentState = this.orchestrator.states.WAIT_PLAYER_2_MOVE;
                    }
                } else if (this.currentPlayer == 2) {
                    if (this.orchestrator.scene.gameType == 'AI vs Player') {
                        this.orchestrator.scene.setPickEnabled(false);
                        this.currentState = this.orchestrator.states.WAIT_BOT_1_MOVE;
                    } else if (this.orchestrator.scene.gameType == 'Player vs AI') {
                        this.orchestrator.scene.setPickEnabled(true);
                        this.currentState = this.orchestrator.states.WAIT_PLAYER_1_MOVE;
                    } else if (this.orchestrator.scene.gameType == 'AI vs AI') {
                        this.orchestrator.scene.setPickEnabled(false);
                        this.currentState = this.orchestrator.states.WAIT_BOT_1_MOVE;
                    } else if (this.orchestrator.scene.gameType == '1vs1') {
                        this.orchestrator.scene.setPickEnabled(true);
                        this.currentState = this.orchestrator.states.WAIT_PLAYER_1_MOVE;
                    }
                }
                this.stateTime = Date.now();
                this.refreshPlayer();
                break;

            case this.orchestrator.states.UNDO_PROGRESS:

                if (this.currentPlayer == 1) {
                    if (this.orchestrator.scene.gameType == 'AI vs Player') {
                        this.currentState = this.orchestrator.states.WAIT_BOT_1_MOVE;
                    } else if (this.orchestrator.scene.gameType == 'Player vs AI') {
                        this.currentState = this.orchestrator.states.WAIT_PLAYER_1_MOVE;
                    } else if (this.orchestrator.scene.gameType == 'AI vs AI') {
                        this.currentState = this.orchestrator.states.WAIT_BOT_1_MOVE;
                    } else if (this.orchestrator.scene.gameType == '1vs1') {
                        this.currentState = this.orchestrator.states.WAIT_PLAYER_1_MOVE;
                    }
                } else if (this.currentPlayer == 2) {
                    if (this.orchestrator.scene.gameType == 'AI vs Player') {
                        this.currentState = this.orchestrator.states.WAIT_PLAYER_2_MOVE;
                    } else if (this.orchestrator.scene.gameType == 'Player vs AI') {
                        this.currentState = this.orchestrator.states.WAIT_BOT_2_MOVE;
                    } else if (this.orchestrator.scene.gameType == 'AI vs AI') {
                        this.currentState = this.orchestrator.states.WAIT_BOT_2_MOVE;
                    } else if (this.orchestrator.scene.gameType == '1vs1') {
                        this.currentState = this.orchestrator.states.WAIT_PLAYER_2_MOVE;
                    }
                }

                if (this.orchestrator.scene.gameType == 'Player vs AI' && this.orchestrator.gameStateControl.currentPlayer == 2 ||
                    this.orchestrator.scene.gameType == 'AI vs Player' && this.orchestrator.gameStateControl.currentPlayer == 1 || this.orchestrator.scene.gameType == 'AI vs AI'
                ) {
                    let orchestratorVar = this.orchestrator;
                    window.setTimeout(function () {
                        orchestratorVar.gameStateControl.playDone = true;
                        orchestratorVar.scene.setPickEnabled(false);
                    }, 5000)
                } else {
                    this.orchestrator.gameStateControl.playDone = false;
                    this.orchestrator.scene.setPickEnabled(true);
                }
                this.stateTime = Date.now();

                break;
            case this.orchestrator.states.WIN_PLAYER1:
                //TODO:MENU VITORIA
                break;

            case this.orchestrator.states.WIN_PLAYER2:
                //TODO:MENU VITORIA
                break;
        }
    }
    pickActive(obj, id) {
        this.resumeState = this.currentState;
        this.currentState = this.orchestrator.states.PICK_ACTIVE;
        this.pickPending = true;
        this.pickObject = obj;
        this.pickId = id;
    }
    updateScores() {

        let indexPiece;

        if (this.orchestrator.pieceRemoved.color == 'red') {
            indexPiece = 0;
        } else if (this.orchestrator.pieceRemoved.color == 'blue') {
            indexPiece = 1;
        } else if (this.orchestrator.pieceRemoved.color == 'yellow') {
            indexPiece = 2;
        }
        if (this.currentPlayer == 1) {
            this.score_player_1[indexPiece]++;
        } else {
            this.score_player_2[indexPiece]++;
        }
        this.checkVitory();
    }


    handleBotWait(gameType) {

        let request = false;
        let difficulty;
        let score;

        if (this.orchestrator.currentState == this.orchestrator.states.UNDO_PROGRESS||this.orchestrator.currentState == this.orchestrator.states.ANIMATING_PIECE) {
            return false;
        }

        if (this.orchestrator.undoPending == false && this.playPending == false && this.playDone == true && this.orchestrator.scene.cameraAnimation == false&&this.orchestrator.pieceAnimation==false&&this.orchestrator.requestAtive==false) {

            if (gameType == 'Player vs AI' && this.currentPlayer == 2) {
                request = true;
                difficulty = this.orchestrator.scene.ai2Dificulty;
                score = this.score_player_2;
            } else if (gameType == 'AI vs Player' && this.currentPlayer == 1) {
                request = true;
                difficulty = this.orchestrator.scene.ai1Dificulty;
                score = this.score_player_1;
            } else if (gameType == 'AI vs AI') {
                request = true;
                if (this.currentPlayer == 1) {
                    difficulty = this.orchestrator.scene.ai1Dificulty;
                    score = this.score_player_1;
                } else {
                    difficulty = this.orchestrator.scene.ai2Dificulty;
                    score = this.score_player_2;
                }
            }
            if (request == true) {
                this.playDone = false;
                this.playPending = true;
                this.orchestrator.scene.setPickEnabled(false);
                let board = this.orchestrator.gameboard.matrixBoard;
                let stringRequest = this.orchestrator.prolog.botRequest(board, difficulty, score);
                let handlerVAR = this.orchestrator.handler;
                this.orchestrator.requestAtive = true;
                this.orchestrator.prolog.getPrologRequest(
                    stringRequest,
                    function (data) {
                        handlerVAR.handleBotMove(data.target.response);
                    },
                    function (data) {
                        handlerVAR.handlerError(data.target.response, obj, id);
                    });

                return true;
            }
        }

        return false;
    }

    handlePlayerWait(gameType) {

        if (this.pickPending == true || this.playDone == false || this.orchestrator.scene.cameraAnimation == true || this.pickPending == true||this.orchestrator.pieceAnimation==true||this.orchestrator.requestAtive==true) {
            return false;
        }
        if (this.orchestrator.currentState == this.orchestrator.states.UNDO_PROGRESS) {
            return false;
        }
        if (gameType == '1vs1') {

            if (this.playDone == true && this.pickPending == false) {
                this.playDone = false;
                return true;
            }
            return false;
        } else {
            if (this.playDone == true && this.pickPending == false) {
                return true;
            }
            return false;
        }
    }
    checkVitory() {
        let scoreArrayToTest;
        let winState;

        if (this.currentPlayer == 1) {
            scoreArrayToTest = this.score_player_1;
            winState = this.orchestrator.states.WIN_PLAYER1;
        } else {
            scoreArrayToTest = this.score_player_2;
            winState = this.orchestrator.states.WIN_PLAYER2;
        }
        for (let i = 0; i < scoreArrayToTest.length; i++) {
            if (scoreArrayToTest[i] < 5)
                return false;
        }
        this.currentState = winState;
    }

    refreshPlayer() {

        if (this.currentPlayer == 1) {
            this.currentPlayer = 2;
        } else if (this.currentPlayer == 2) {
            this.currentPlayer = 1;
        }
    }
}