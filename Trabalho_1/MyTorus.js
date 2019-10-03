/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
    constructor(scene, radius_inner, radius_outter, slices, loops) {
        super(scene);
        this.scene = scene;
        this.radius_inner = radius_inner;
        this.radius_outter = radius_outter;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
     //   this.texCoords = [];

        let incremeto_teta=(2*Math.PI)/this.slices;
        let incremento_fi=(2*Math.PI)/this.loops;
        let teta=0;
        let fi=0;
        let x,y,z, nx, ny, nz;


        for(let i=0;i<=this.loops+1;i++){
            
            
            for(let j=0;j<this.slices;j++){
                
                fi=i*incremento_fi;
                teta=j*incremeto_teta;

                z=this.radius_inner*Math.sin(teta);
                y=(this.radius_outter+this.radius_inner*Math.cos(teta))*Math.sin(fi);
                x=(this.radius_outter+this.radius_inner*Math.cos(teta))*Math.cos(fi);

                nx = Math.cos(teta)*Math.cos(fi);
                ny = Math.cos(teta)*Math.sin(fi);
                nz = Math.sin(teta);

                this.vertices.push(x,y,z);
            
                //Retificar
                this.normals.push(nx, ny, nz);
                
                if(i<this.loops){
                    this.indices.push(i*this.loops+j,(i+1)*this.loops+j,i*this.loops+j+1);
                    this.indices.push(i*this.loops+j+1,(i+1)*this.loops+j,(i+1)*this.loops+j+1);
                }
                    
            
            }

            //break;
        
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    }



}

