/**
* MyPlane
* @constructor
*/
class MyPlane extends CGFobject {
    constructor(scene, npartsU, npartsV) {
        super(scene);
        this.scene = scene;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.object=null;
        this.initBuffers();
    }
    
    initBuffers(){
        let controlPoints=
        //grau 1 em u e grau 1 em v
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
        this.object= new CGFnurbsObject(this.scene,this.npartsU,this.npartsV,surface);
    }
    display(){
        this.object.display();
    }

}
    