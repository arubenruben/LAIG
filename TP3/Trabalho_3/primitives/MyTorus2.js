/**
 * MyTorus
 * @constructor
 * @param radius_inner the inner radius of the torus
 * @param radius_outter the outter radius of the torus
 * @param slices the number of slices of the torus
 * @param loops the number of loops of the torus
 */
class MyTorus2 extends CGFobject {
    constructor(scene, radius_inner, radius_outter, slices, loops) {
        super(scene);
        this.scene = scene;
        this.radius_inner = radius_inner;
        this.radius_outter = radius_outter;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    /**
     * Fuction used to update the texcoords of a torus when a texture is applied
     * @function
     * @param ls lenght_s of the texture, found in the xml when declaring a texture for a certain component
     * @param lt lenght_t of the texture, found in the xml when declaring a texture for a certain component
     */
    updatetexCoords(ls, lt) {

        this.texCoords = [];
        for (let i = 0; i <= this.loops; i++) {
            for (let j = 0; j <= this.slices; j++) {
                this.texCoords.push(i * ls / this.loops, j * lt / this.slices);
            }
        }
        this.updateTexCoordsGLBuffers();


    }

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let incremeto_teta = (2 * Math.PI) / this.slices;
        let incremento_fi = (Math.PI / 2) / this.loops;
        let teta = 0;
        let fi = 0;
        let x, y, z, nx, ny, nz;

        //Desenha origem duplicada por causa dos texcoords
        for (let i = 0; i <= this.loops; i++) {

            fi = i * incremento_fi;

            for (let j = 0; j <= this.slices; j++) {

                teta = j * incremeto_teta;

                z = this.radius_inner * Math.sin(teta);
                y = (this.radius_outter + this.radius_inner * Math.cos(teta)) * Math.sin(fi);
                x = (this.radius_outter + this.radius_inner * Math.cos(teta)) * Math.cos(fi);

                nx = Math.cos(teta) * Math.cos(fi);
                ny = Math.cos(teta) * Math.sin(fi);
                nz = Math.sin(teta);

                this.vertices.push(x, y, z);

                this.normals.push(nx, ny, nz);

                this.texCoords.push(i / this.loops, j / this.slices);
                if (i < this.loops || (i == this.slices && j < this.slices - 1)) {
                    this.indices.push(i * this.slices + j, (i + 1) * this.slices + j + 1, i * this.slices + j + 1);
                    this.indices.push(i * this.slices + j + 1, (i + 1) * this.slices + j + 1, (i + 1) * this.slices + j + 1 + 1);

                }


            }

        }



        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();

    }



}