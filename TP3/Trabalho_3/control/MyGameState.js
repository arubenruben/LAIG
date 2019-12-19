'use strict'

class MyGameStateControler {

    constructor(orchestrator) {

        this.player1_record_moves = new Array(3)
        this.player2_record_moves = new Array(3)
        this.score_player_1 = 0
        this.score_player_2 = 0
        this.currentPlayer=1;
        this.orchestratorLocal=orchestrator;
        

        this.currentState=this.orchestratorLocal.states.INITIALIZING;
    }


    nextState(){

        switch(this.currentState){

            case this.orchestratorLocal.states.INITIALIZING:
                
                this.currentState=this.orchestratorLocal.states.SET_THE_GAME_TYPE;

            break;

            case this.orchestratorLocal.states.SET_THE_GAME_TYPE:

                //1vs1. Nothing More to Select 
                if(this.orchestratorLocal.scene.this.gameType==0){

                    this.currentState=this.orchestratorLocal.states.WAIT_PLAYER_1_MOVE;

                    //BOT SELECT BOT LEVEL
                }else if(this.orchestratorLocal.scene.this.gameType==1){

                    this.currentState=this.orchestratorLocal.states.SET_THE_AI_1_DIF;

                    //BOT SELECT BOT LEVEL
                }else if(this.orchestratorLocal.scene.this.gameType==2){

                    this.currentState=this.orchestratorLocal.states.SET_THE_AI_0_DIF;
                    
                    //BOTH BOTS SELECT BOT LEVEL
                }else if(this.orchestratorLocal.scene.this.gameType==3){
                    
                    this.currentState=this.orchestratorLocal.states.SET_THE_AI_0_DIF;
                }
                break;
            
            case this.orchestratorLocal.states.SET_THE_AI_0_DIF:
                //THE BOT 0 JUST CAN BE TRIGGER IN THIS SITUATIONS
                if(this.orchestratorLocal.scene.this.gameType=='AI vs Player'){



                }
                //BOT 
                else if(this.orchestratorLocal.scene.this.gameType=='AI vs AI')

            break;


            case this.orchestratorLocal.states.WIN:
                //DO NOTHING
            break;

        }

    }







}