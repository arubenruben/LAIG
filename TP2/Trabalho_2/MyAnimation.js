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
        //Tempo que dura um frame em segundos
        this.frame_time=(1/this.scene.UPDATE_PERIOD);
        this.animationDone = false;
    }
    update(t){
        //altera a posiçao das asas
        if(!this.animationDone){
        this.delta = t - this.previous_t;
        this.previous_t = t;
        
        if(this.active==true){

            if(this.firstTime == false){
                this.totalTime += this.delta/1000;
            }
            
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
                }
                else{
                    this.animationDone=true;
                }
                this.update_parameters(this.KeyFrames[this.keyFrameIndex0], this.KeyFrames[this.keyFrameIndex1]);
            }
            
            if(this.keyFrameIndex1<=this.KeyFrames.length-1){
                this.updateMatrix(this.totalTime);
            }
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
            //Save positon to use in the position equation as X0
            this.oldPosition = frame0.translate_vec;
            
            this.vx=distance_x/this.segmentTime;
            this.vy=distance_y/this.segmentTime;
            this.vz=distance_z/this.segmentTime;
            
            this.wx=rot_x/this.segmentTime;
            this.wy=rot_y/this.segmentTime;
            this.wz=rot_z/this.segmentTime;
            //Save angle to use ins the angle equation as Teta0
            this.oldRotation=frame0.rotate_vec;
            
            //R=POW(NUMBER, 1/N)

            this.scale_reason_x=Math.pow(frame1.scale_vec[0]/frame0.scale_vec[0],1/this.segmentTime);
            this.scale_reason_y=Math.pow(frame1.scale_vec[1]/frame0.scale_vec[1],1/this.segmentTime);
            this.scale_reason_z=Math.pow(frame1.scale_vec[2]/frame0.scale_vec[2],1/this.segmentTime);
            
            this.oldScale=frame0.scale_vec;

            
    }

    updateMatrix(totalTime){
        
        let Maux = mat4.create();
        if(this.animationDone){
            let lastKeyFrame = this.KeyFrames[this.keyFrameIndex1];
            mat4.translate(Maux, Maux, lastKeyFrame.translate_vec);
            mat4.rotate(Maux, Maux,  lastKeyFrame.rotate_vec[0] * DEGREE_TO_RAD, [1,0,0]);
            mat4.rotate(Maux, Maux, lastKeyFrame.rotate_vec[1] * DEGREE_TO_RAD, [1,0,0]);
            mat4.rotate(Maux, Maux, lastKeyFrame.rotate_vec[2] * DEGREE_TO_RAD, [1,0,0]);
            mat4.scale(Maux, Maux, lastKeyFrame.scale_vec); 
        }
        else
        {
            let translateParameters = [this.oldPosition[0]+this.vx*totalTime,this.oldPosition[1]+this.vy*totalTime,this.oldPosition[2]+this.vz*totalTime]
            
            let angX=this.oldRotation[0]+this.wx*totalTime;
            let angY=this.oldRotation[1]+this.wy*totalTime;
            let angZ=this.oldRotation[2]+this.wz*totalTime;
            
            let scaleX=this.oldScale[0]*Math.pow(this.scale_reason_x,totalTime);
            let scaleY=this.oldScale[1]*Math.pow(this.scale_reason_y,totalTime);
            let scaleZ=this.oldScale[2]*Math.pow(this.scale_reason_z,totalTime);

            let scaleParameters = [scaleX, scaleY, scaleZ];

            mat4.translate(Maux, Maux, translateParameters);
            mat4.rotate(Maux, Maux, angX * DEGREE_TO_RAD, [1,0,0]);
            mat4.rotate(Maux, Maux, angY * DEGREE_TO_RAD, [0,1,0]);
            mat4.rotate(Maux, Maux, angZ * DEGREE_TO_RAD, [0,0,1]);
            mat4.scale(Maux, Maux, scaleParameters); 
        }

        this.Ma = Maux;
    }
    
    apply(){
        this.scene.multMatrix(this.Ma);
    }

}

