/**
 * MyAnimation
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyAnimation {
    constructor(scene) {
        this.scene = scene;

        //  Array to hold all the segments of the animation, each one of them constituted by 2 sucessive keyframes
        this.segments_array = [];

        this.Ma = mat4.create();

        //  var to hold the total time since the scene started
        this.totalTime = 0;

        // var to hold the previous time the function update was called, used to calculate the delta time
        this.previous_t = 0;

        // var to hold the delta time, time bettween calls to the function update, used to calculate total time
        this.delta = 0;

        //  Var to guarantee that in last iteration paramenters are updated in any situation
        this.unique = false;

        // var to represent the current active segment in the animation
        this.segmentTime_active = 0;

        // var to tell if the animation is done or not
        this.animationDone = false;

        // var used to tell if it is the first time the function update is being called or not
        this.firstime = true;
    }

    /**
     *Function used to parse the keyframes into segments of a animation, used in the Myscenegraph.js when processing the xml
        part corresponding to a certain animation
    * @param array_keyframes - array of keyframes of an animation 
    */
    parse_keyframes(array_keyframes) {
        for (let i = 0; i < array_keyframes.length - 1; i++) {
            this.segments_array[i] = new MySegment(array_keyframes[i], array_keyframes[i + 1]);
        }
    }

    /**
     *Function update, used to update the total time and the parameters used in transformation happening in a certain segment
     * @param t - current time since epoch 
     */
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

    /**
    *Function to apply the corresponding Matrix of animation, determines if the active segment has changed 
     updates parameters, detects if the animation has come to an end or not, builds the matrix of animation
    with the update parameters
   */
    apply() {

        // Tests if the animation is complete or not
        if (!this.animationDone) {

            // tests if the current segment needs to be incremented or not
            if (this.segments_array[this.segmentTime_active].keyframe_posterior.instant < this.totalTime) {
                this.segmentTime_active++

                    // if the current segment is equal to the size of the array of segments means the animation has come to an end
                    if (this.segmentTime_active == this.segments_array.length) {
                        this.animationDone = true;
                        this.segmentTime_active--;
                        if (this.scene.orchestrator.pieceAnimation) {
                            this.scene.orchestrator.pieceAnimation = false;
                            //this.scene.orchestrator.gameboard.matrixBoard[this.scene.orchestrator.pieceAnimationIndexI][this.scene.orchestrator.pieceAnimationIndexJ].piece = null;
                            this.scene.orchestrator.gameStateControl.updateScores();
                        }
                    }

                    // if the animation has not come to an end updates parameters
                    else {
                        this.update_parameters(this.segments_array[this.segmentTime_active])
                    }

            }

            // Tests if the function update has only been called one time, doing this because we need at least 2 
            // iterations to calculate the delta time , in the first iteration the delta time is a huge number - seconds
            // since epoch
            if (this.firstime == false) {

                // calculates the ratio of completion for  the current active segment
                this.ratio = (this.totalTime - this.segments_array[this.segmentTime_active].keyframe_anterior.instant) / (this.segments_array[this.segmentTime_active].duracao);
                this.build_matrix(this.segments_array[this.segmentTime_active])
            }

        }
        // if the animation is done we need to build the matrix one last time in order to put the object in the correct place
        else if (this.unique == false) {
            this.unique = true
            this.build_matrix(this.segments_array[this.segmentTime_active])
        }

        // applying the animation matrix 
        this.scene.multMatrix(this.Ma);
    }



    /**
     *Function to build the animation matrix using the current segment and the ratio of completion of that segment
     *@param segmento current active segment
     */
    build_matrix(segmento) {

        // Creates a matrix 4x4
        let Maux = mat4.create(this.ratio);

        // Tests if it is the first time the function update has been called and if the animation is done or not
        if (this.firstime == false && this.animationDone == false) {

            // Translation transformation calculation
            let tx = segmento.keyframe_anterior.translate_vec[0] + this.translate_parameters[0] * this.ratio
            let ty = segmento.keyframe_anterior.translate_vec[1] + this.translate_parameters[1] * this.ratio
            let tz = segmento.keyframe_anterior.translate_vec[2] + this.translate_parameters[2] * this.ratio

            let array_aux = [tx, ty, tz]

            mat4.translate(Maux, Maux, array_aux);


            // Rotation transformation calculation
            mat4.rotate(Maux, Maux, (segmento.keyframe_anterior.rotate_vec[0] + (this.rotate_parameters[0] * this.ratio)) * DEGREE_TO_RAD, [1, 0, 0])
            mat4.rotate(Maux, Maux, (segmento.keyframe_anterior.rotate_vec[1] + (this.rotate_parameters[1] * this.ratio)) * DEGREE_TO_RAD, [0, 1, 0])
            mat4.rotate(Maux, Maux, (segmento.keyframe_anterior.rotate_vec[2] + (this.rotate_parameters[2] * this.ratio)) * DEGREE_TO_RAD, [0, 0, 1])

            // Scale transformation calculation
            let sx = segmento.keyframe_anterior.scale_vec[0] * Math.pow(this.scaleParameters[0], this.ratio * segmento.duracao)
            let sy = segmento.keyframe_anterior.scale_vec[1] * Math.pow(this.scaleParameters[1], this.ratio * segmento.duracao)
            let sz = segmento.keyframe_anterior.scale_vec[2] * Math.pow(this.scaleParameters[2], this.ratio * segmento.duracao)

            array_aux = [sx, sy, sz]
            mat4.scale(Maux, Maux, array_aux)

            this.Ma = Maux
        }

        // if it is the last iteration it forces the ratio of the completion to be 1
        else if (this.animationDone == true) {

            // Translation transformation calculation
            let tx = segmento.keyframe_anterior.translate_vec[0] + this.translate_parameters[0]
            let ty = segmento.keyframe_anterior.translate_vec[1] + this.translate_parameters[1]
            let tz = segmento.keyframe_anterior.translate_vec[2] + this.translate_parameters[2]

            let array_aux = [tx, ty, tz]

            mat4.translate(Maux, Maux, array_aux);

            // Rotation transformation calculation
            mat4.rotate(Maux, Maux, (segmento.keyframe_anterior.rotate_vec[0] + (this.rotate_parameters[0])) * DEGREE_TO_RAD, [1, 0, 0])
            mat4.rotate(Maux, Maux, (segmento.keyframe_anterior.rotate_vec[1] + (this.rotate_parameters[1])) * DEGREE_TO_RAD, [0, 1, 0])
            mat4.rotate(Maux, Maux, (segmento.keyframe_anterior.rotate_vec[2] + (this.rotate_parameters[2])) * DEGREE_TO_RAD, [0, 0, 1])

            // Scale transformation calculation
            let sx = segmento.keyframe_anterior.scale_vec[0] * Math.pow(this.scaleParameters[0], segmento.duracao)
            let sy = segmento.keyframe_anterior.scale_vec[1] * Math.pow(this.scaleParameters[1], segmento.duracao)
            let sz = segmento.keyframe_anterior.scale_vec[2] * Math.pow(this.scaleParameters[2], segmento.duracao)

            array_aux = [sx, sy, sz]
            mat4.scale(Maux, Maux, array_aux)

            this.Ma = Maux

        }
    }

    /**
     * Function to update the current parameters used to calculate the animation matrix 
     *@param segmento current active segment
     */
    update_parameters(segmento) {

        // Test if the animation is done or not
        if (this.animationDone == false) {

            // Updates the parameters for the translation
            let tx0 = segmento.keyframe_anterior.translate_vec[0]
            let ty0 = segmento.keyframe_anterior.translate_vec[1]
            let tz0 = segmento.keyframe_anterior.translate_vec[2]

            let tx1 = segmento.keyframe_posterior.translate_vec[0]
            let ty1 = segmento.keyframe_posterior.translate_vec[1]
            let tz1 = segmento.keyframe_posterior.translate_vec[2]

            let txfinal = tx1 - tx0
            let tyfinal = ty1 - ty0
            let tzfinal = tz1 - tz0

            // Updates the parameters for the rotation
            let rx0 = segmento.keyframe_anterior.rotate_vec[0]
            let ry0 = segmento.keyframe_anterior.rotate_vec[1]
            let rz0 = segmento.keyframe_anterior.rotate_vec[2]

            let rx1 = segmento.keyframe_posterior.rotate_vec[0]
            let ry1 = segmento.keyframe_posterior.rotate_vec[1]
            let rz1 = segmento.keyframe_posterior.rotate_vec[2]

            let rxfinal = rx1 - rx0
            let ryfinal = ry1 - ry0
            let rzfinal = rz1 - rz0

            // Updates the parameters for the escalation
            let sx = Math.pow((segmento.keyframe_posterior.scale_vec[0] / segmento.keyframe_anterior.scale_vec[0]), 1 / segmento.duracao)
            let sy = Math.pow((segmento.keyframe_posterior.scale_vec[1] / segmento.keyframe_anterior.scale_vec[1]), 1 / segmento.duracao)
            let sz = Math.pow((segmento.keyframe_posterior.scale_vec[2] / segmento.keyframe_anterior.scale_vec[2]), 1 / segmento.duracao)

            this.translate_parameters = [txfinal, tyfinal, tzfinal]
            this.rotate_parameters = [rxfinal, ryfinal, rzfinal]

            this.scaleParameters = [sx, sy, sz]
        }
    }
}