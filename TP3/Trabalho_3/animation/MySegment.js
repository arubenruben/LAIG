/**
 * MySegment represent a segment of an animation
 * @constructor
 * @param keyframe_anterior element of the tpye MyKeyframeAnimation, represent the begin keyframe
 * @param keyframe_posterior element of the tpye MyKeyframeAnimation, represent the end keyframe
 */
class MySegment {
    constructor(keyframe_anterior, keyframe_posterior) {
        this.keyframe_anterior = keyframe_anterior;
        this.keyframe_posterior = keyframe_posterior;
        this.duracao = this.keyframe_posterior.instant - this.keyframe_anterior.instant;
    }

}