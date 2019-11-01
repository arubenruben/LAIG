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
        this.Ma = mat4.create();
        this.totalTime = 0;
        this.segmentTime = 0;
        this.keyFrameIndex0 = 0;
        this.keyFrameIndex1 = 1;
    }
    update(t){
        //altera a posiçao das asas
        
        this.lastTime = this.lastTime || 0.0;
        this.deltaTime = t - this.lastTime || 0.0;
        this.lastTime = t;
    
        this.deltaTime = this.deltaTime/1000; //in seconds
        this.totalTime += this.deltaTime;
        
        /*Calcula a duracao do segmento*/
        
        this.segmentTime = this.KeyFrames[this.keyFrameIndex1].instant - this.KeyFrames[this.keyFrameIndex0].instant;

        /*Se for 0 tenho de inicializar os paremetros da velocidade*/
        if(this.keyFrameIndex0==0){
            this.update_parameters(this.KeyFrames[this.keyFrameIndex0], this.KeyFrames[this.keyFrameIndex1]);
        }

        if(this.totalTime > this.segmentTime){
           
            this.totalTime = this.totalTime - this.segmentTime;
            
            if(this.keyFrameIndex1<this.KeyFrames.length-1){
                this.keyFrameIndex0++;
                this.keyFrameIndex1++;
            }
            this.update_parameters(this.KeyFrames[this.keyFrameIndex0], this.KeyFrames[this.keyFrameIndex1]);
        }
        
        this.executionPercentage = this.totalTime / this.segmentTime;
        this.updateMatrix(this.executionPercentage);
        
        
        
       
    }

    update_parameters(frame0,frame1){
        
        let distance_x=frame1.translate_vec[0]-frame0.translate_vec[0]; 
        let distance_y=frame1.translate_vec[1]-frame0.translate_vec[1]; 
        let distance_z=frame1.translate_vec[2]-frame0.translate_vec[2]; 

        let rot_x=frame1.rotate_vec[0]-frame0.rotate_vec[0]; 
        let rot_y=frame1.rotate_vec[1]-frame0.rotate_vec[1]; 
        let rot_z=frame1.rotate_vec[2]-frame0.rotate_vec[2]; 

        let scale_x=frame1.scale_vec[0]-frame0.scale_vec[0]; 
        let scale_y=frame1.scale_vec[1]-frame0.scale_vec[1]; 
        let scale_z=frame1.scale_vec[2]-frame0.scale_vec[2]; 
        
        

        this.vx=distance_x/this.segmentTime;
        this.vy=distance_y/this.segmentTime;
        this.vz=distance_z/this.segmentTime;

    }

    updateMatrix(executionPercentage){
        
        let M_Translate,M_Rotate,M_Scale;
        let array_aux_mat4=[this.vx*executionPercentage,this.vy*executionPercentage,this.vz*executionPercentage]
        M_Translate=mat4.create();
        M_Translate=mat4.translate(M_Translate,M_Translate,array_aux_mat4);

        this.Ma=M_Translate;
        

    }
    
    apply(){
        this.scene.multMatrix(this.Ma);
    }

}

