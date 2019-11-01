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
        this.total_time = 0;
        this.previous_t=0;
        this.delta = 0;
        this.previous_t = 0;
        this.active_frame=0;
    }
    update(t){
        //altera a posiçao das asas
        
        if(this.active_frame>=this.KeyFrames.length){
           console.log("Cheguei ao fim dos active frames para o component");
        }else{
            
            if(t>this.KeyFrames[this.active_frame].instant){

                this.active_frame++;
            }
            
            this.delta = t - this.previous_t;
            this.previous_t = t;
            
        }


       
    }
    
    apply(t){


    }

}

