/**
 * MyKeyFrameAnimation
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyKeyFrameAnimation extends MyAnimation {
	constructor(scene,instant) {
		super(scene);
         
        this.instant=instant;
        this.translate_vec=[];
        this.rotate_vec=[];
        this.scale_vec=[];
    
    }
}
