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
        this.firstTime = true;
        this.active=true;
    }
    update(t){
        //altera a posiçao das asas
        
        this.delta = t - this.previous_t;
        this.previous_t = t;
        
        if(this.active==true){

                if(this.firstTime == false){
                    this.totalTime += this.delta/1000;
                }

                
                
                console.log(this.totalTime);
                
            /*Calcula a duracao do segmento*/
            
            this.segmentTime = this.KeyFrames[this.keyFrameIndex1].instant - this.KeyFrames[this.keyFrameIndex0].instant;
            
            /*Se for 0 tenho de inicializar os paremetros da velocidade*/
            if(this.firstTime == true){
                this.firstTime = false;
                this.update_parameters(this.KeyFrames[this.keyFrameIndex0], this.KeyFrames[this.keyFrameIndex1]);
            }

            if(this.totalTime > this.segmentTime){
            
                this.totalTime = this.totalTime - this.segmentTime;
                
                if(this.keyFrameIndex1 < this.KeyFrames.length-1){
                    this.keyFrameIndex0++;
                    this.keyFrameIndex1++;
                }else{
                    this.active=false;
                }
                this.update_parameters(this.KeyFrames[this.keyFrameIndex0], this.KeyFrames[this.keyFrameIndex1]);
            }
            
            if(this.keyFrameIndex1<=this.KeyFrames.length-1&&this.active==true){
                this.updateMatrix(this.totalTime);
            }
        
        }
        
        
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
            
            this.oldPosition = frame0.translate_vec;
            
            
            
            
            this.vx=distance_x/this.segmentTime;
            this.vy=distance_y/this.segmentTime;
            this.vz=distance_z/this.segmentTime;

            this.wx=rot_x/this.segmentTime;
            this.wy=rot_y/this.segmentTime;
            this.wz=rot_z/this.segmentTime;

            this.oldRotation=frame0.rotate_vec;
        
            
    }

    updateMatrix(totalTime){
        
        let M_Translate,M_Rotate,M_Scale;
        
        let array_aux_mat4=[this.oldPosition[0]+this.vx*totalTime,this.oldPosition[1]+this.vy*totalTime,this.oldPosition[2]+this.vz*totalTime]
        M_Translate=mat4.create();
        M_Translate=mat4.translate(M_Translate,M_Translate,array_aux_mat4);
        
        
        M_Rotate=mat4.create();

        let ang_x=this.oldRotation[0]+this.wx*totalTime;
        let ang_y=this.oldRotation[1]+this.wy*totalTime;
        let ang_z=this.oldRotation[2]+this.wz*totalTime;

        M_Rotate=mat4.rotate(M_Rotate,M_Rotate,ang_x*DEGREE_TO_RAD,[1,0,0]);
        M_Rotate=mat4.rotate(M_Rotate,M_Rotate,ang_y*DEGREE_TO_RAD,[0,1,0]);
        M_Rotate=mat4.rotate(M_Rotate,M_Rotate,ang_z*DEGREE_TO_RAD,[0,0,1]);

       

        this.Ma=mat4.multiply(this.Ma,M_Rotate,M_Translate);
        


    }
    
    apply(){
        this.scene.multMatrix(this.Ma);
    }

}

