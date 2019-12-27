'use strict'

class MyGameStateControler {

    constructor(orchestrator) {

        this.player1_record_moves = new Array(3);
        this.player2_record_moves = new Array(3);
        this.score_player_1 = [0,0,0];
        this.score_player_2 = [0,0,0];
        this.currentPlayer = 1;
        this.orchestratorLocal = orchestrator;
        this.pickPending = false;
        this.playDone = false;


        this.currentState = this.orchestratorLocal.states.INITIALIZING;
    }


    nextState() {

        switch (this.currentState) {

            case this.orchestratorLocal.states.INITIALIZING:

                this.currentState = this.orchestratorLocal.states.SET_THE_GAME_TYPE;

                break;

            case this.orchestratorLocal.states.SET_THE_GAME_TYPE:

                //1vs1. Nothing More to Select 
                if (this.orchestratorLocal.scene.gameType == '1vs1') {

                    this.currentState = this.orchestratorLocal.states.WAIT_PLAYER_1_MOVE;
                    //Picking avaiable
                    this.orchestratorLocal.scene.setPickEnabled(true);

                    //BOT SELECT BOT LEVEL
                }
                else if (this.orchestratorLocal.scene.gameType == 'AI vs Player') {
                    this.orchestratorLocal.scene.interface.gui.add(this.orchestratorLocal.scene, 'ai1Dificulty', this.orchestratorLocal.scene.ai1Dificulties).name('AI 1 Difficulty');
                    this.currentState = this.orchestratorLocal.states.SET_THE_AI_1_DIF;

                }
                else if (this.orchestratorLocal.scene.gameType == 'Player vs AI') {
                    this.orchestratorLocal.scene.interface.gui.add(this.orchestratorLocal.scene, 'ai2Dificulty', this.orchestratorLocal.scene.ai2Dificulties).name('AI 2 Difficulty');
                    this.currentState = this.orchestratorLocal.states.SET_THE_AI_2_DIF;

                    //BOT SELECT BOT LEVEL
                } else if (this.orchestratorLocal.scene.gameType == 'AI vs AI') {
                    this.orchestratorLocal.scene.interface.gui.add(this.orchestratorLocal.scene, 'ai1Dificulty', this.orchestratorLocal.scene.ai1Dificulties).name('AI 1 Difficulty');
                    this.currentState = this.orchestratorLocal.states.SET_THE_AI_1_DIF;
                }
                break;

            case this.orchestratorLocal.states.SET_THE_AI_1_DIF:
                //THE BOT 0 JUST CAN BE TRIGGER IN THIS SITUATIONS
                if (this.orchestratorLocal.scene.gameType == 'AI vs Player') {
                    this.orchestratorLocal.scene.setPickEnabled(true);
                    this.currentState = this.orchestratorLocal.states.WAIT_PLAYER_1_MOVE;
                }
                //BOT 
                else if (this.orchestratorLocal.scene.gameType == 'AI vs AI') {
                    this.orchestratorLocal.scene.interface.gui.add(this.orchestratorLocal.scene, 'ai2Dificulty', this.orchestratorLocal.scene.ai2Dificulties).name('AI 2 Difficulty');
                    this.currentState = this.orchestratorLocal.states.SET_THE_AI_2_DIF;
                }

                break;

            case this.orchestratorLocal.states.SET_THE_AI_2_DIF:
                //THE BOT 0 JUST CAN BE TRIGGER IN THIS SITUATIONS
                
                this.orchestratorLocal.scene.setPickEnabled(true);
                this.currentState=this.orchestratorLocal.states.WAIT_PLAYER_1_MOVE;
                
                
                /*if (this.orchestratorLocal.scene.gameType == 'Player vs AI') {
                    this.orchestratorLocal.states.WAIT_PLAYER_1_MOVE;
                }
                //BOT 
                else if (this.orchestratorLocal.scene.gameType == 'AI vs AI') {
                    

                }*/
                break;

            case this.orchestratorLocal.states.WAIT_PLAYER_1_MOVE:
                //TODO:Testar Vitoria
                this.currentPlayer=2;
                this.currentState=this.orchestratorLocal.states.WAIT_PLAYER_2_MOVE;
                break;
            case this.orchestratorLocal.states.WAIT_PLAYER_2_MOVE:
                //TODO:Testar Vitoria
                this.currentPlayer=1;
                this.currentState=this.orchestratorLocal.states.WAIT_PLAYER_1_MOVE;
                break;

            case this.orchestratorLocal.states.PICK_ACTIVE:
                this.currentState = this.orchestratorLocal.states.PICK_REPLY;
                break;

            case this.orchestratorLocal.states.PICK_REPLY:

                //Avanca para o proximo jogador
                if (this.resumeState == this.orchestratorLocal.states.WAIT_PLAYER_1_MOVE) {
                    this.currentState = this.orchestratorLocal.states.WAIT_PLAYER_2_MOVE;
                }
                else if (this.resumeState == this.orchestratorLocal.states.WAIT_PLAYER_2_MOVE) {
                    this.currentState = this.orchestratorLocal.states.WAIT_PLAYER_1_MOVE;
                }

                break;

            case this.orchestratorLocal.states.WIN:
                //DO NOTHING
                break;


        }

    }
    pickActive(obj, id) {
        this.resumeState = this.currentState;
        this.currentState = this.orchestratorLocal.states.PICK_ACTIVE;
        this.pickPending = true;
        this.pickObject = obj;
        this.pickId = id;
    }

    updateScores(pieceRemoved) {

        let indexPiece;

        if (pieceRemoved == 'red') {
            indexPiece = 0;
        } else if (pieceRemoved == 'blue') {
            indexPiece = 1;
        } else if (pieceRemoved == 'yellow') {
            indexPiece = 2;
        }

        if (this.currentPlayer == 1) {
            this.score_player_1[indexPiece]++;
            //TODO:Player Record
        } else {
            this.score_player_2[indexPiece]++;
            //TODO:Player Record
        }


    }

    handlePlayerWait(gameType) {
        
        let request = false;
        let difficulty;
        let score;

        if (gameType == 'Player vs AI' && currentPlayer == 2) {
            request = true;
            difficulty = this.orchestratorLocal.scene.ai2Dificulty;
            score = this.score_player_2;
        }
        else if (gameType == 'AI vs Player' && currentPlayer == 1) {

            request = true;
            difficulty = this.orchestratorLocal.scene.ai1Dificulty;
            score = this.score_player_1;

        }
        else if (gameType == 'AI vs AI') {

            request = true;

            if (this.currentPlayer == 1) {
                difficulty = this.orchestratorLocal.scene.ai1Dificulty;
                score = this.score_player_1;
            } else {
                difficulty = this.orchestratorLocal.scene.ai2Dificulty;
                score = this.score_player_2;
            }
        }
        else {

            if (this.playDone == false) {
                return false;
            } else {
                this.playDone = false;
                return true;
            }
        }


        if (request == true) {

            let board = this.orchestratorLocal.gameboard.matrixBoard;
            let stringRequest = this.orchestratorLocal.prolog.botRequest(board, difficulty,score);
            let handlerVAR = this.orchestratorLocal.handler;

            this.orchestratorLocal.prolog.getPrologRequest(
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

}