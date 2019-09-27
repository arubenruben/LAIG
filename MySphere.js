/**
 * MySphere
 * @constructor
 */
class MySphere extends CGFobject {
    constructor(scene, radius, stacks, slices) {
        super(scene);
        this.scene = scene;

        var r = radius;
        this.slices = slices;
        this.stacks = stacks;


        this.initBuffers();
    }

    initBuffers() {

        this.vertices = [];
        this.indices = [];


        var lon, lat, x, y, z;

        var increment_lon = 2 * Math.PI / this.slices;
        var increment_lat = (Math.PI / 2.0) / this.stacks;


        for (var i = 0; i < this.stacks + 1; i++) {

            lat = i * increment_lat;

            for (var j = 0; j < this.slices + 1; j++) {


                lon = j * increment_lon;

                y = r * Math.cos(lat);
                z = r * Math.sin(lon) * Math.sin(lat);
                x = r * Math.cos(lon) * Math.sin(lat);
                
                if (i == 0 || i == this.stacks) {
                    //Desenhar o primeiro triangulo
                    this.vertices.push(x,y,z);
                    break;

                }else{
                    this.vertices.push(x,y,z);

                }

            }

            
            
        }




        this.texCoords1 = [
            0, 0,
            0, 1,
            1, 0,
            1, 1
        ];


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


}


