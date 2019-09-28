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

        this.vertices = [];
        this.indices = [];
        this.texCoords=[];
        this.normals=[];
        

        var teta, fi, x, y, z;

        var increment_teta = (Math.PI/2.0) / this.stacks;
        var increment_fi=(2*Math.PI)/this.slices;


        for (var i = 0; i <= 2*this.stacks; i++) {

            teta = i * increment_teta;

            for (var j = 0; j <= this.slices; j++) {


                fi = j * increment_fi;

                z = this.r * Math.sin(teta);
                y = this.r * Math.cos(teta) * Math.sin(fi);
                x = this.r * Math.cos(teta) * Math.cos(fi);
                
                this.vertices.push(x,y,z);
                this.vertices.push(x,y,-z);
                

                
                if(i!=0){
                     this.indices.push((i-1)*this.slices+j,i*this.slices+j+2,i*this.slices+j);
                     //this.indices.push((i-1)*this.slices+j,(i-1)*this.slices+j+1,i*this.slices+j+1);
                }
                    
                this.texCoords1 = [
                    0, 0,
                    0, 1,
                    1, 0,
                    1, 1
                ];

                this.normals.push(x/this.r,y/this.r,z/this.r);

                this.texCoords.push(...this.texCoords1);
            }
            
            
            
        }

        

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


}


