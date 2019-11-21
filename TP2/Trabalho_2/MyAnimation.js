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
        this.segments_array = [];
        this.Ma = mat4.create();
        this.totalTime = 0;
        this.previous_t = 0;

        this.segmentTime_active = 0;

        this.animationDone = false;
        this.firstime = true;
    }

    parse_keyframes(array_keyframes) {



        //Ando aos pares nao vamos testar o ultimos porque se nao iamos aceder a memoria que nao existe
        for (let i = 0; i < array_keyframes.length - 1; i++) {

            this.segments_array[i] = new MySegment(array_keyframes[i], array_keyframes[i + 1]);

        }



    }
    update(t) {

        this.delta = t - this.previous_t;

        this.previous_t = t;

        if (this.firstime == false) {
            this.totalTime += this.delta / 1000;
        } else {
            this.firstime = false;
        }
    }

    apply() {
        //atualizar o segmento
        if (this.animationDone == false && this.firstime == false) {

            if (this.animationDone==false&&this.segments_array[this.segmentTime_active].keyframe_posterior.instant < this.totalTime) {
                this.segmentTime_active++;
            }
            if (this.segmentTime_active == this.segments_array.length) {
                this.animationDone = true;
                this.segmentTime_active--;
            }
              
            let ratio = (this.totalTime - this.segments_array[this.segmentTime_active].keyframe_anterior.instant) / (this.segments_array[this.segmentTime_active].duracao);

            this.update_parameters(this.segments_array[this.segmentTime_active], ratio);

            }

        this.scene.multMatrix(this.Ma);
    
    }


    update_parameters(segmento, ratio) {

        let Maux = mat4.create();
        if(this.animationDone==false){

            
            let tx0 = segmento.keyframe_anterior.translate_vec[0];
            let ty0 = segmento.keyframe_anterior.translate_vec[1];
            let tz0 = segmento.keyframe_anterior.translate_vec[2];
            
            let tx1 = segmento.keyframe_posterior.translate_vec[0];
            let ty1 = segmento.keyframe_posterior.translate_vec[1];
            let tz1 = segmento.keyframe_posterior.translate_vec[2];
            
            let txfinal = tx0 + (tx1 - tx0) * ratio;
            let tyfinal = ty0 + (ty1 - ty0) * ratio;
            let tzfinal = tz0 + (tz1 - tz0) * ratio;
            
            let rx0 = segmento.keyframe_anterior.rotate_vec[0];
            let ry0 = segmento.keyframe_anterior.rotate_vec[1];
            let rz0 = segmento.keyframe_anterior.rotate_vec[2];
            
            let rx1 = segmento.keyframe_posterior.rotate_vec[0];
            let ry1 = segmento.keyframe_posterior.rotate_vec[1];
            let rz1 = segmento.keyframe_posterior.rotate_vec[2];
            
            let rxfinal = rx0 + (rx1 - rx0) * ratio;
            let ryfinal = ry0 + (ry1 - ry0) * ratio;
            let rzfinal = rz0 + (rz1 - rz0) * ratio;
            
            let translate_parameters = [txfinal, tyfinal, tzfinal];
            let scaleParameters = [1, 1, 1];
            
            mat4.translate(Maux, Maux, translate_parameters);
            
            mat4.rotate(Maux, Maux, rxfinal * DEGREE_TO_RAD, [1, 0, 0]);
            mat4.rotate(Maux, Maux, ryfinal * DEGREE_TO_RAD, [0, 1, 0]);
            mat4.rotate(Maux, Maux, rzfinal * DEGREE_TO_RAD, [0, 0, 1]);
            
            
            
            mat4.scale(Maux, Maux, scaleParameters);
            
            this.Ma = Maux;

        }else{

            mat4.translate(Maux,Maux,segmento.keyframe_posterior.translate_vec);

            mat4.rotate(Maux, Maux, segmento.keyframe_posterior.rotate_vec[0] * DEGREE_TO_RAD, [1, 0, 0]);
            mat4.rotate(Maux, Maux, segmento.keyframe_posterior.rotate_vec[1] * DEGREE_TO_RAD, [0, 1, 0]);
            mat4.rotate(Maux, Maux, segmento.keyframe_posterior.rotate_vec[2] * DEGREE_TO_RAD, [0, 0, 1]);

            mat4.scale(Maux,segmento.keyframe_posterior.scale_vec);

            this.Ma=Maux;

        }
        
    }
        
        
        
}
        
        

