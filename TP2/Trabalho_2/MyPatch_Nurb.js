/**
* MyPatch_Nurb
* @constructor
*/
class MyPatch_Nurb extends CGFobject {
    
    constructor(scene,divu,divv,degreeu,degreev,controlPointsFromParser) {
        super(scene);
        this.scene=scene;
        this.divu=divu;
        this.divv=divv;
        this.degreeu=degreeu;
        this.degreev=degreev;
        this.object=null;
        this.controlPointsFromParser=controlPointsFromParser;

        this.initBuffers();
    }

    initBuffers() {

        //TODO:confirmar se o n pecas e o correto
        /*
        if(this.controlPointsFromParser.length*(this.controlPointsFromParser[0].length)!=(this.degreeu+1)*(this.degreev+1)){

            console.error('Numero de pontos nao bate certo');

        }

        */



        
        let controlPoints=this.generateControlPointsFormatRequired();
        
        let surface= new CGFnurbsSurface(this.degreeu,this.degreev,controlPoints);

        this.object=new CGFnurbsObject(this.scene,this.divu,this.divv,surface);

    }


    generateControlPointsFormatRequired(){
        let final_controlPoints=[];

        let iterator_control_points=0;

        
        
        for (let iteration_in_u=0;iteration_in_u<this.degreeu+1;iteration_in_u++){
            
            let v_array_aux=[];
                        
            for(let iteration_in_v=0;iteration_in_v<this.degreev+1;iteration_in_v++){

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



    display(){
        this.object.display();
    }
}



