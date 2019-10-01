/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
    constructor(scene, radius_inner, radius_outter, stacks, loops) {
        super(scene);
        this.scene = scene;
        this.radius_inner = radius_inner;
        this.radius_outter = radius_outter;
        this.stacks = stacks;
        this.loops = loops;

        this.initBuffers();
    }

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        //this.normals = [];
        this.texCoords = [];

        let incremeto_teta=this.stacks/2.0;
        let incremento_fi=this.loops/2.0;
        let teta=0;
        let fi=0;
        let x,y,z;


        for(let i=0;i<this.loops;i++){
            
            fi=i*incremento_fi;

            for(let j=0;j<this.stacks;j++){
            
                teta=j*incremeto_teta;

                z=this.radius_inner*Math.sin(teta);
                y=(this.radius_outter+this.radius_inner*Math.cos(teta))*Math.sin(fi);
                x=(this.radius_outter+this.radius_inner*Math.cos(teta))*Math.cos(fi)


                this.vertices.push(x,y,z);

                
                
                
            }
           
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    }



}


