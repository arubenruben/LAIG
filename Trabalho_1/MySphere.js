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
    
    updatetexCoords(ls, lt){
        
        this.texCoords = [];
        
        for (var i = 0; i <= this.stacks; i++) {
            for (var j = 0; j <= this.slices; j++) {
                this.texCoords.push(j * ls / this.slices, i * lt / this.stacks);
            }
        }
        this.updateTexCoordsGLBuffers();
    }

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var teta, fi, x, y, z;
        var increment_teta = Math.PI / this.stacks;
        var increment_fi = (2 * Math.PI) / this.slices;



        //Repete vertices na origem por causa das textcoords terem continuidade
        for (var i = 0; i <= this.stacks; i++) {

            teta = (Math.PI / 2) - i * increment_teta;

            for (var j = 0; j <= this.slices; j++) {

                fi = j * increment_fi;
                x = this.r * Math.cos(teta) * Math.cos(fi);
                y = this.r * Math.cos(teta) * Math.sin(fi);
                z = this.r * Math.sin(teta);

                this.vertices.push(x, y, z);
                this.normals.push(x / this.r, y / this.r, z / this.r);
                this.texCoords.push(j / this.slices, i / this.stacks);

            }




        }


        for (let i = 0; i < this.stacks; ++i) {
            let cima = i * (this.slices + 1);
            let baixo = cima + this.slices + 1;


            for (let j = 0; j < this.slices; ++j, ++cima, ++baixo) {

                if (i != 0) {
                    this.indices.push(cima, baixo, cima + 1);
                }

                if(i != (this.stacks-1))
                {
                    this.indices.push(cima + 1);
                    this.indices.push(baixo);
                    this.indices.push(baixo + 1);
                }

            }
        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

}