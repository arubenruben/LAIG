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
        

        var lon, lat, x, y, z;

        var increment_lon = 2 * Math.PI / this.slices;
        var increment_lat = (Math.PI / 2.0) / this.stacks;


        for (var i = 0; i <= 2*this.stacks+2; i++) {

            lat = i * increment_lat;

            for (var j = 0; j <= this.slices; j++) {


                lon = j * increment_lon;

                z = this.r * Math.cos(lat);
                y = this.r * Math.sin(lon) * Math.sin(lat);
                x = this.r * Math.cos(lon) * Math.sin(lat);
                
                this.vertices.push(x,y,z);
                

                
                if(i!=0){
                    this.indices.push((i-1)*this.slices+j,i*this.slices+j+1,i*this.slices+j);
                    this.indices.push((i-1)*this.slices+j,(i-1)*this.slices+j+1,i*this.slices+j+1);
                }
                    
                this.texCoords1 = [
                    0, 0,
                    0, 1,
                    1, 0,
                    1, 1
                ];

                this.texCoords.push(...this.texCoords1);
            }
            
            
            
        }

        

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


}


