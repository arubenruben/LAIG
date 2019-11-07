/**
* MyPatch
* @constructor
*/
class MyPatch extends CGFobject {
    constructor(scene,npointsU, npointsV, npartsU, npartsV, controlPointsParser=[]) {
        super(scene);
        this.scene = scene;
        this.npointsU = npointsU;
        this.npartsV = npartsV;
        this.controlPointsParser = controlPointsParser;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.object=null;

        this.initBuffers();
    }
    
    initBuffers(){

        let controlPointsAux = [];
        for(let i=0; i< this.controlPointsParser.length; i++){
            let point = [];
        }
    
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
    
        ]
        
        let surface= new CGFnurbsSurface(this.npointsU-1,this.npointsV-1,controlPointsAux);
        this.object= new CGFnurbsObject(this.scene,this.npartsU,this.npartsV,surface);
    }
    display(){
        this.object.display();
    }



}
