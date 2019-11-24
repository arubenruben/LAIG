/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate of the left lower point of the rectangle
 * @param y1 - y coordinate of the left lower point of the rectangle
 * @param x2 - x coordinate of the right upper point of the rectangle
 * @param y2 - y coordinate of the right upper point of the rectangle
 */
class MyRectangle extends CGFobject {
	constructor(scene, id, x1, y1, x2, y2) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		
		this.initBuffers();
	}
	
	 /**
    * Fuction used to update the texcoords of a rectangle when a texture is applied
    * @function
    * @param ls lenght_s of the texture, found in the xml when declaring a texture for a certain component
    * @param lt lenght_t of the texture, found in the xml when declaring a texture for a certain component
    */
	updatetexCoords(ls, lt){
		
		this.length = this.x2 - this.x1;
		this.height = this.y2 - this.y1;
		var tex_u = this.length / ls;
		var tex_v = this.height / lt;
		this.texCoords = [
			0, tex_v,
			tex_u, tex_v,
			0,0,
			tex_u ,0,
		];

		this.updateTexCoordsGLBuffers();

	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0		//3
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2,
			2,1,0,
			2,3,1
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [
			0,1,
			1,1,
			0,0,
			1,0
		];
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}


}

