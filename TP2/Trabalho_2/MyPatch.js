/**
* MyPatch NURBS
* @constructor
* @param scene Reference to the scene 
* @param npointsU the number of points in the u direction
* @param npointsV the number of points in the v direction
* @param npartsU the number of parts in the u direction
* @param npartsV the number of parts in the v direction
* @param controlPointsFromParserarray holding the control points used to create the patch itself
*/
class MyPatch extends CGFobject {
    
    constructor(scene,npointsU, npointsV, npartsU, npartsV, controlPointsFromParser=[]) {
        super(scene);
        this.scene=scene;
        this.npartsU=npartsU;
        this.npartsV=npartsV;
        this.npointsU=npointsU;
        this.npointsV=npointsV;
        this.object=null;
        this.controlPointsFromParser=controlPointsFromParser;
        this.initBuffers();
    }

    /**
    * Function initBuffers creates the nurbs 
    * @function
    */
    initBuffers() {
        let controlPoints=this.generateControlPointsFormatRequired();
        let surface= new CGFnurbsSurface(this.npointsU-1,this.npointsV-1,controlPoints);
        this.object=new CGFnurbsObject(this.scene,this.npartsU,this.npartsV,surface);
    }

    /**
    * Function used to parse the control points sent from the xml parser into a determined and fixed form
    * @function
    */
    generateControlPointsFormatRequired(){
        let final_controlPoints=[];
        let iterator_control_points=0;

        for (let iteration_in_u=0;iteration_in_u<this.npointsU;iteration_in_u++){
            
            let v_array_aux=[];
                        
            for(let iteration_in_v=0;iteration_in_v<this.npointsV;iteration_in_v++){

                let coordinates=vec4.fromValues(

                    this.controlPointsFromParser[iterator_control_points][0],
                    this.controlPointsFromParser[iterator_control_points][1],
                    this.controlPointsFromParser[iterator_control_points][2],
                    1,
                );
                iterator_control_points++;
                v_array_aux.push(coordinates);
            }
            final_controlPoints.push(v_array_aux);
        }
        return final_controlPoints;
    }

    /**
    * Function used to display the patch nurbs created
    * @function
    */
    display(){
        this.object.display();
    }
}



