/**
 * MyKeyFrameAnimation
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyAnimation extends CGFobject {
	constructor(scene) {
		super(scene);
        this.initBuffers();
       
    }
    update(t){
        //altera a posiçao das asas
        this.rotate_wings = Math.sin(t)*Math.PI/4 ;
    }
    
    apply(t){


    }

}

