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
        this.KeyFrames;
        this.Ma = 0;
        this.total_time = 0;
        this.previous_t;
        this.delta = 0;
        this.previous_t = 0;
        this.firstTime = true;
    }
    update(t, component){
        //altera a posiçao das asas
        this.delta = t - this.previous_t;
        this.previous_t = t;
        if(this.firstTime == false){
            this.total_time += this.delta/1000;
        }
        
        if(this.firstTime == true){
            this.firstTime = false;
        }

        for (var key in this.keyFrames){
           
        }
    }
    
    apply(t, key){


    }

}

