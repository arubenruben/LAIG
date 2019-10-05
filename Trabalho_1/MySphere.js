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
        this.normals = [];
        this.texCoords = [];

        var teta, fi, x, y, z;
        this.slices = 5;
        var increment_teta = (Math.PI / 2.0) / this.stacks;
        var increment_fi = (2 * Math.PI) / this.slices;
      
        //2*this.stacks+1
        

        for (var i = 0; i < 2*this.stacks+1; i++) {

            teta =  Math.PI/2.0 + i * increment_teta;

            for (var j = 0; j < this.slices; j++){

                fi = j * increment_fi;
                x = this.r * Math.cos(teta) * Math.cos(fi);
                y = this.r * Math.cos(teta) * Math.sin(fi);
                z = this.r * Math.sin(teta);
                if(i != 2*this.stacks){
                    this.vertices.push(x, y, z);
                    this.normals.push(x / this.r, y / this.r, z / this.r);
                }
                
                if(i == 0 ){
                    break;
                }
                else if (i==1){
                    this.indices.push(0, j, j+1);
                }
                else if(i <= 2*this.stacks - 1 && j < this.slices  -1){
                    this.indices.push(i * this.slices - (this.slices-1)+j, i * this.slices - (this.slices -1) +j+1,  (i-1) * this.slices - (this.slices-1)+j);
                    this.indices.push(i * this.slices - (this.slices-1)+j+1, (i-1) * this.slices - (this.slices -1) +j+1,  (i-1) * this.slices - (this.slices-1)+j);
                }
                else if(i == 2*this.stacks && j < this.slices  -1){
                    if(j == 0){
                        this.vertices.push(x, y, z);
                        this.normals.push(x / this.r, y / this.r, z / this.r);
                    }
                    this.indices.push(2*this.slices*this.stacks - (this.slices-1), (i-1)*this.slices -(this.slices-1) +j+1, (i-1)*this.slices -(this.slices-1) +j );
                }

                if(i == 0){

                }
                else if(i == 2*this.stacks){

                }
                else{
                
                    
                }
                /*this.texCoords1 = [
                    0, 0,
                    0, 1,
                    1, 0,
                    1, 1
                ];
                this.texCoords.push(...this.texCoords1);*/

            }
            if(i!= 0){
                if(i == 1){
                this.indices.push(0, this.slices, 1);
                }
                else if (i > 1 && i < 2*this.stacks){
                    this.indices.push(i*this.slices -(this.slices-1), (i-1)*this.slices - (this.slices-1) + this.slices-1, (i)*this.slices - (this.slices-1) + this.slices-1); 
                    this.indices.push(i * this.slices - (this.slices-1), (i-1) * this.slices - (this.slices-1), (i-1) * this.slices - (this.slices-1) + this.slices-1);
                }
                else if(i == 2*this.stacks){
                  this.indices.push(2*this.slices*this.stacks - (this.slices-1),(i-1)*this.slices -(this.slices-1), (i-1)*this.slices -(this.slices-1) +this.slices-1 );

                }

            }
        }

       /* this.vertices.push(0, 0, this.r * (-1));
        this.normals.push(0, 0,-1);*/

     


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


}