/**
 * MySemiSphere
 * @constructor
 */
class MySemiSphere extends CGFobject {
    constructor(scene, radius, stacks, slices, pos_ou_neg_z) {
        super(scene);
        this.scene = scene;

        this.r = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.pos_neg = pos_ou_neg_z;

        this.initBuffers();
    }

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var teta, fi, x, y, z;

        var increment_teta = (Math.PI / 2.0) / this.stacks;
        var increment_fi = (2 * Math.PI) / this.slices;



        for (var i = 0; i < this.stacks; i++) {

            teta = i * increment_teta;

            for (var j = 0; j < this.slices; j++) {

                fi = j * increment_fi;

                x = this.r * Math.cos(teta) * Math.cos(fi);
                y = this.r * Math.cos(teta) * Math.sin(fi);
                z = this.r * Math.sin(teta);

                this.vertices.push(x, y, z);
                



                /*Em cima so desenha um triangulo*/

                //Ate la desenha retangulos

                if (i < this.stacks-1&&j<this.slices-1) {
                    this.indices.push(i*this.stacks+j,i*this.stacks+j+1,(i+1)*this.stacks+j);
                    
                    this.indices.push((i+1)*this.stacks+j,i*this.stacks+j+1,(i+1)*this.stacks+j+1);
                }

                this.normals.push(x / this.r, y / this.r, z / this.r);
                this.texCoords1 = [
                    0, 0,
                    0, 1,
                    1, 0,
                    1, 1
                ];
                this.texCoords.push(...this.texCoords1);

            }
                if(i<this.stacks-1){
                    j--;
                    this.indices.push(i*this.stacks+j,i*this.stacks,(i+1)*this.stacks+j);
                    this.indices.push((i+1)*this.stacks+j,i*this.stacks,(i+1)*this.stacks);
                }
                
        }


        // for (var i = 0; i <= this.stacks + 1; i++) {

        //     teta = i * increment_teta;

        //     for (var j = 0; j <= this.slices; j++) {

        //         fi = j * increment_fi;

        //         x = this.r * Math.cos(teta) * Math.cos(fi);
        //         y = this.r * Math.cos(teta) * Math.sin(fi);
        //         z = -this.r * Math.sin(teta);

        //         this.vertices.push(x, y, z);

        //         //Na primeira iteracao nao iremos desenhar   

        //         if (i <= this.stacks) {
        //             this.indices.push(i * this.stacks + j, (i + 1) * this.stacks + j + 1, i * this.stacks + j + 1);
        //             this.indices.push((i + 1) * this.stacks + j, (i + 1) * this.stacks + j + 1, i * this.stacks + j);
        //         }

        //         this.normals.push(x / this.r, y / this.r, z / this.r);
        //         this.texCoords1 = [
        //             0, 0,
        //             0, 1,
        //             1, 0,
        //             1, 1
        //         ];
        //         this.texCoords.push(...this.texCoords1);

        //     }

        // }






        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


}


