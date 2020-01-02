
class MyTimeBoard extends CGFobject {

    constructor(orchestrator, distanceBetweenBoards = 1, scaleFactor = 1) {
        super(orchestrator.scene);
        this.scene = this.scene;
        this.orchestrator = orchestrator;
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
        this.doisPontos = this.orchestrator.imagesAssets.doisPontos;
        this.currentTime = 0;
        this.white = new CGFappearance(this.scene);
        this.white.setShininess(200);
        this.white.setAmbient(1, 1, 1, 1);
        this.white.setDiffuse(1, 1, 1, 1);
        this.white.setSpecular(1, 1, 1, 1);
        this.distanceBetweenBoards = distanceBetweenBoards;
        this.scaleFactor = scaleFactor;
        //[0]=Minute [1] Dezenas segundos [2] unidades segundos
        this.arrayTime = [0, 0, 0];

        this.plane = new MyPlane(this.scene, 5, 5);

    }

    parseTime() {
        //NOTICE THE NEGATION
        let arrayTime = [0, 0, 0];

        let time = this.orchestrator.gameStateControl.stateTime + timeForPlay - this.currentTime;

        if (time > 0) {

            //from ms to s
            time = time / 1000;
            time = Math.round(time);
            let minutes = Math.floor(time / 60);
            arrayTime[0] = minutes;
            time -= minutes * 60;
            let seconds = time % 60;
            seconds = seconds.toString();

            if (seconds.length == 1) {
                arrayTime[1] = 0;
                arrayTime[2] = Number(seconds[0]);
            } else {
                arrayTime[2] = Number(seconds[1]);
                arrayTime[1] = Number(seconds[0]);
            }
        }else if(this.orchestrator.gameStateControl.pickPending==false&&
            (this.orchestrator.scene.gameType=='1vs1'||
            this.orchestrator.scene.gameType=='Player vs AI' && this.orchestrator.gameStateControl.currentPlayer==1||
            this.orchestrator.scene.gameType=='AI vs Player' && this.orchestrator.gameStateControl.currentPlayer==2)
            ){
        }
        return arrayTime;
    }

    numberTexture(number) {
        switch (number) {
            case 0:
                return this.number0;
            case 1:
                return this.number1;
            case 2:
                return this.number2;
            case 3:
                return this.number3;
            case 4:
                return this.number4;
            case 5:
                return this.number5;
            case 6:
                return this.number6;
            case 7:
                return this.number7;
            case 8:
                return this.number8;
            case 9:
                return this.number9;
            default:
                return this.number0;
        }

    }

    update(currentTime) {
        if (this.orchestrator.gameStateControl.playPending == true) {
            this.arrayTime = [0, 0, 0];
        }
        else if (this.orchestrator.gameStateControl.currentState > this.orchestrator.states.SET_THE_AI_2_DIF && this.orchestrator.gameStateControl.currentState < this.orchestrator.states.GAME_OVER) {
            this.currentTime = currentTime;
            //[0]=Minute [1] Dezenas segundos [2] unidades segundos
            this.arrayTime = this.parseTime();
        }
    }

    display() {

        this.scene.pushMatrix();
        this.scene.translate(0, 3, 0);
        this.scene.rotate(Math.PI / 2.0, 1, 0, 0);
        this.scene.rotate(-Math.PI / 2.0, 0, 0, 1);
        this.scene.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);
        this.white.setTexture(this.numberTexture(this.arrayTime[0]));
        this.white.apply();
        this.plane.display();

        this.scene.pushMatrix();
        //this.scene.translate(10,0,0);
        this.scene.translate(this.distanceBetweenBoards, 0, 0);
        this.white.setTexture(this.doisPontos);
        this.white.apply();
        this.plane.display();

        this.scene.pushMatrix();
        this.scene.translate(this.distanceBetweenBoards, 0, 0);
        this.white.setTexture(this.numberTexture(this.arrayTime[1]));
        this.white.apply();
        this.plane.display();

        this.scene.pushMatrix();
        this.scene.translate(this.distanceBetweenBoards, 0, 0);
        this.white.setTexture(this.numberTexture(this.arrayTime[2]));
        this.white.apply();
        this.plane.display();
        this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.popMatrix();
        this.scene.popMatrix();

    }

}