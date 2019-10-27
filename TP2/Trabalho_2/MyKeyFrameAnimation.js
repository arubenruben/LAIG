/**
 * MyKeyFrameAnimation
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyKeyFrameAnimation extends CGFobject {
	constructor(scene) {
		super(scene);
        this.initBuffers();
        
        this.instant=-1;
        this.translate_vec=[];
        this.rotate_vec=[];
        this.scale_vec=[];


       
    }
    update(t){
       
    }
    
    apply(t){


    }

}

