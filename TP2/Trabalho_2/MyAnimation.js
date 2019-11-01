/**
 * MyAnimation
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyAnimation extends CGFobject {
    
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.initBuffers();
        this.KeyFrames=[];
        this.Ma = 0;
        this.totalTime = 0;
        this.segmentTime = 0;
        this.keyFrameIndex0 = 0;
        this.keyFrameIndex1 = 1;
    }
    update(t){
        //altera a posiçao das asas
        
        this.lastTime = this.lastTime || 0.0;
        this.deltaTime = currTime - this.lastTime || 0.0;
        this.lastTime = currTime;
    
        this.deltaTime = this.deltaTime/1000; //in seconds
        this.total_time += this.deltaTime
        
        this.segmentTime = this.KeyFrames[this.keyFrameIndex1] - this.KeyFrames[this.keyFrameIndex0];

        if(this.total_time > this.segmentTime){
            this.totalTime = this.total_time - this.segmentTime;
            this.keyFrameIndex0++;
            this.keyFrameIndex1++;
        }

        this.executionPercentage = this.totalTime / this.segmentTime;
        this.updateMa(this.KeyFrames[this.keyFrameIndex0], this.KeyFrames[this.keyFrameIndex1], this.executionPercentage);
       
    }

    updateMa(keyFrame1, keyFrame2, executionPercentage){
        



    }
    
    apply(){
        this.scene.multMatrix(this.Ma);
    }

}

