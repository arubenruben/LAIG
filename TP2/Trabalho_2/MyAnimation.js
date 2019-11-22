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

    //Ando aos pares nao vamos testar o ultimos porque se nao iamos aceder a memoria que nao existe
    
    parse_keyframes(array_keyframes) {
        for (let i = 0; i < array_keyframes.length - 1; i++) {
            this.segments_array[i] = new MySegment(array_keyframes[i], array_keyframes[i + 1]);
        }
    }
    
    update(t) {

        this.delta = t - this.previous_t;
        this.previous_t = t;

        if (this.firstime == false) {
            this.totalTime += this.delta / 1000
        } else {
            this.firstime = false;
            this.update_parameters(this.segments_array[this.segmentTime_active])
        }
    }

    //atualizar o segmento
    apply() {

        if (!this.animationDone) {

            if (this.segments_array[this.segmentTime_active].keyframe_posterior.instant < this.totalTime) {
                this.segmentTime_active++
                
                if (this.segmentTime_active == this.segments_array.length) {
                    this.animationDone = true;
                    this.segmentTime_active--;
                }else{
                    this.update_parameters(this.segments_array[this.segmentTime_active])
                }
                
            }
            if (this.firstime == false) {
                this.ratio = (this.totalTime - this.segments_array[this.segmentTime_active].keyframe_anterior.instant) / (this.segments_array[this.segmentTime_active].duracao);
                this.build_matrix(this.segments_array[this.segmentTime_active])
            }
        }
        this.scene.multMatrix(this.Ma);
    }

    build_matrix(segmento){
        
        let Maux = mat4.create(this.ratio);

        if(this.firstime==false&&this.animationDone==false){
    
            let tx=segmento.keyframe_anterior.translate_vec[0]+this.translate_parameters[0]*this.ratio
            let ty=segmento.keyframe_anterior.translate_vec[1]+this.translate_parameters[1]*this.ratio
            let tz=segmento.keyframe_anterior.translate_vec[2]+this.translate_parameters[2]*this.ratio
            
            let array_aux=[tx,ty,tz]
    
            mat4.translate(Maux, Maux, array_aux);
    
            mat4.rotate(Maux, Maux, (segmento.keyframe_anterior.rotate_vec[0]+(this.rotate_parameters[0]* this.ratio)) * DEGREE_TO_RAD, [1, 0, 0])
            mat4.rotate(Maux, Maux, (segmento.keyframe_anterior.rotate_vec[1]+(this.rotate_parameters[1]* this.ratio)) * DEGREE_TO_RAD, [0, 1, 0])
            mat4.rotate(Maux, Maux, (segmento.keyframe_anterior.rotate_vec[2]+(this.rotate_parameters[2]* this.ratio)) * DEGREE_TO_RAD, [0, 0, 1])
            
            let sx=segmento.keyframe_anterior.scale_vec[0]*Math.pow(this.scaleParameters[0],this.ratio*segmento.duracao)
            let sy=segmento.keyframe_anterior.scale_vec[1]*Math.pow(this.scaleParameters[1],this.ratio*segmento.duracao)
            let sz=segmento.keyframe_anterior.scale_vec[2]*Math.pow(this.scaleParameters[2],this.ratio*segmento.duracao)

            array_aux=[sx,sy,sz]
            mat4.scale(Maux, Maux, array_aux)
    
            this.Ma=Maux
        }
        //Forca a ultima iteracao da animaca a ser igual ao keyframe 0
        else if(this.animationDone==true){
            
            let array_aux=[segmento.keyframe_posterior.translate_vec[0],segmento.keyframe_posterior.translate_vec[1],segmento.keyframe_posterior.translate_vec[2]]
            
            mat4.translate(Maux,Maux,array_aux)

            mat4.rotate(Maux, Maux, segmento.keyframe_posterior.rotate_vec[0] * DEGREE_TO_RAD, [1, 0, 0])
            mat4.rotate(Maux, Maux, segmento.keyframe_posterior.rotate_vec[1] * DEGREE_TO_RAD, [0, 1, 0])
            mat4.rotate(Maux, Maux, segmento.keyframe_posterior.rotate_vec[2] * DEGREE_TO_RAD, [0, 0, 1])
    
            mat4.scale(Maux, Maux, this.scaleParameters)

        }
    }

    update_parameters(segmento) {

        if (this.animationDone == false) {

            let tx0 = segmento.keyframe_anterior.translate_vec[0]
            let ty0 = segmento.keyframe_anterior.translate_vec[1]
            let tz0 = segmento.keyframe_anterior.translate_vec[2]

            let tx1 = segmento.keyframe_posterior.translate_vec[0]
            let ty1 = segmento.keyframe_posterior.translate_vec[1]
            let tz1 = segmento.keyframe_posterior.translate_vec[2]

            let txfinal =tx1 - tx0
            let tyfinal =ty1 - ty0
            let tzfinal =tz1 - tz0

            let rx0 = segmento.keyframe_anterior.rotate_vec[0]
            let ry0 = segmento.keyframe_anterior.rotate_vec[1]
            let rz0 = segmento.keyframe_anterior.rotate_vec[2]

            let rx1 = segmento.keyframe_posterior.rotate_vec[0]
            let ry1 = segmento.keyframe_posterior.rotate_vec[1]
            let rz1 = segmento.keyframe_posterior.rotate_vec[2]

            let rxfinal =rx1-rx0
            let ryfinal =ry1-ry0
            let rzfinal =rz1-rz0


            let sx=Math.pow((segmento.keyframe_posterior.scale_vec[0]/segmento.keyframe_anterior.scale_vec[0]),1/segmento.duracao)
            let sy=Math.pow((segmento.keyframe_posterior.scale_vec[1]/segmento.keyframe_anterior.scale_vec[1]),1/segmento.duracao)
            let sz=Math.pow((segmento.keyframe_posterior.scale_vec[2]/segmento.keyframe_anterior.scale_vec[2]),1/segmento.duracao)

            this.translate_parameters = [txfinal, tyfinal, tzfinal]
            this.rotate_parameters=[rxfinal,ryfinal,rzfinal]

            this.scaleParameters = [sx, sy, sz]
        }
    }
}