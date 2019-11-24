/**
* MyCylinder cylinder not using nurbs
* @constructor
* @param scene scene 
* @param slices the number of slices of cylinder
* @param the number of the stacks of a cylinder
* @param height height of the cylinder
* @param radiustop the radius on the top of the cylinder, may not be the same as the bottom one
* @param radiusbottom the radius on the bottom of the cylinder, may not be the same as the top one
*/
class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks, height, radiustop, radiusbottom) {
        super(scene);
        this.slices = slices;
        this.height = height;
        this.stacks = stacks;
        this.radiustop = radiustop;
        this.radiusbottom = radiusbottom;
        this.initBuffers();
    }

    /**
    * Fuction used to update the texcoords of a cylinder when a texture is applied
    * @function
    * @param ls lenght_s of the texture, found in the xml when declaring a texture for a certain component
    * @param lt lenght_t of the texture, found in the xml when declaring a texture for a certain component
    */
    updatetexCoords(ls, lt) {

        this.texture_parameter_s = ls / this.slices;
        this.texture_parameter_t = lt / this.stacks;

        this.texCoords = [];
        for (let i = 0; i <= this.stacks; i++) {
            for (let j = 0; j <= this.slices; j++) {
                this.texCoords.push(j * this.texture_parameter_s, (this.stacks - i) * this.texture_parameter_t);
            }
        }
        this.updateTexCoordsGLBuffers();

    }

     /**
    * Fuction initbuffers
    * @function
    */
    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let delta_r = (this.radiusbottom - this.radiustop) / this.stacks;
        let var_teta = 2 * Math.PI / this.slices;
        let var_height = this.height / this.stacks;
        let x = 0, y = 0, z = 0;
        this.texture_parameter_t = 1.0 / this.slices;
        this.texture_parameter_s = 1.0 / this.stacks;

        let cos_value;
        let sin_value;

        for (let i = 0; i <= this.stacks; i++) {

            let radius = this.radiusbottom - i * delta_r;

            for (let j = 0; j <= this.slices; j++) {

                z = var_height * i;
                cos_value = Math.cos(j * var_teta);
                x = radius * cos_value;
                sin_value = Math.sin(j * var_teta);
                y = radius * sin_value;
                this.vertices.push(x, y, z);

                if (i != this.stacks && j != this.slices) {
                    this.indices.push(i * (this.slices + 1) + j, i * (this.slices + 1) + j + 1, (i + 1) * (this.slices + 1) + j);
                    this.indices.push(i * (this.slices + 1) + j + 1, (i + 1) * (this.slices + 1) + j + 1, (i + 1) * (this.slices + 1) + j);
                }

                this.texCoords.push(j * this.texture_parameter_s, (this.stacks - i) * this.texture_parameter_t);
                this.normals.push(cos_value, sin_value, 0);
            }
        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


}
