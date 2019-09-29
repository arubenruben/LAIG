/**
 * MySphere
 * @constructor
 */
class MySphere extends CGFobject {
    constructor(scene, radius, stacks, slices) {
        super(scene);
        this.scene = scene;

        this.r = radius;
        this.slices = slices;
        this.stacks = stacks;
        

        this.initBuffers();
    }

    initBuffers() {
        this.semi_sphere_pos=new MySemiSphere(this.scene,this.r,this.stacks,this.slices,1);
        this.semi_sphere_neg=new MySemiSphere(this.scene,this.r,this.stacks,this.slices,-1);
    }

    display(){

        this.semi_sphere_pos.display();
        this.semi_sphere_neg.display();

    }


}


