
class MyTimeBoard extends CGFobject {
    
    constructor(orchestrator,distanceBetweenBoards=1,scaleFactor=1){
        super(orchestrator.scene);
        this.scene=this.scene;
        this.orchestrator=orchestrator;
        this.number0 = this.orchestrator.imagesAssets.number0;
        this.number1 = this.orchestrator.imagesAssets.number1;
        this.number2 = this.orchestrator.imagesAssets.number2;
        this.number3 = this.orchestrator.imagesAssets.number3;
        this.number4 = this.orchestrator.imagesAssets.number4;
        this.number5 = this.orchestrator.imagesAssets.number5;
        this.number6 = this.orchestrator.imagesAssets.number6;
        this.number7 = this.orchestrator.imagesAssets.number7;
        this.number8 = this.orchestrator.imagesAssets.number8;
        this.number9 = this.orchestrator.imagesAssets.number9;
        this.doisPontos=this.orchestrator.imagesAssets.doisPontos;
        this.currentTime=0;
        this.white = new CGFappearance(this.scene);
        this.white.setShininess(200);
        this.white.setAmbient(1, 1, 1, 1);
        this.white.setDiffuse(1, 1, 1, 1);
        this.white.setSpecular(1, 1, 1, 1);
        this.distanceBetweenBoards=distanceBetweenBoards;
        this.scaleFactor=scaleFactor;

        this.plane=new MyPlane(this.scene,5,5);

    }

    parseTime(){
        //NOTICE THE NEGATION
        let arrayTime=[0,0,0];
        
        if(!(this.orchestrator.gameStateControl.currentState>this.orchestrator.states.SET_THE_AI_2_DIF&&this.orchestrator.gameStateControl.currentState<this.orchestrator.states.GAME_OVER)){
            
            let time=this.orchestrator.gameStateControl.stateTime+timeForPlay-this.currentTime;
            //from ms to s
            time/=1000;
            time=Math.round(time);

            arrayTime[0]=Math.floor(time/60);
            let seconds=time%60;
            let secondsStr=seconds.toString();

            if(secondsStr.length==1){
                arrayTime[1]=0;
            }else{
                arrayTime[1]=Number(secondsStr[1]);
            }
            arrayTime[2]=Number(secondsStr[0]);

            console.log(arrayTime);
        }
        return arrayTime;


    }

    update(currentTime){
        this.currentTime=currentTime;
    }

    display(){
        //[0]=Minute [1] Dezenas segundos [2] unidades segundos
        let arrayTime=parseTime()
        //this.white.setTexture(this.light_wood);
    }

}