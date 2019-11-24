/**
* MyPlane NURBS lays on xz plane
* @constructor
* @param scene Reference to the scene 
* @param npartsU the number of parts in the u direction
* @param npartsV the number of parts in the v direction
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
    
    /**
    * Function initBuffers creates the nurbs 
    * @function
    */
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
    
    /**
    * Function used to display the patch nurbs created
    * @function
    */
    display(){
        this.object.display();
    }

}
    