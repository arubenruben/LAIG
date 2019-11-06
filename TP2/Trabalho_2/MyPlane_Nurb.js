/**
* MyPlane_Nurb
* @constructor
*/
class MyPlane_Nurb extends CGFobject {
    constructor(scene,divu,divv) {
        super(scene);
        this.scene=scene;
        this.divu=divu;
        this.divv=divv;
        this.object=null;

        this.initBuffers();
    }

    initBuffers() {

        let controlPoints=
        //grau 2 em u e grau 2 em v
        [
            // u=1
            [
                [-0.5,0,0.5,1],
                [-0.5,0,-0.5,1]

            ],
            //u=2
            [
                [0.5,0,0.5,1],
                [0.5,0,-0.5,1]

            ],
    
        ];
        
        let surface= new CGFnurbsSurface(1,1,controlPoints);

        this.object=new CGFnurbsObject(this.scene,this.divu,this.divv,surface);

    }

    display(){
        this.object.display();
    }
}



