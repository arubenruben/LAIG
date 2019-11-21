/**
 * MySegment
 * @constructor
 */


class MySegment{

    constructor(keyframe_anterior,keyframe_posterior){
        this.keyframe_anterior=keyframe_anterior;
        this.keyframe_posterior=keyframe_posterior;
        this.duracao=this.keyframe_posterior.instant-this.keyframe_anterior.instant;
    }

}