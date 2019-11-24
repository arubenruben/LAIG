/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param ponto1 - One of the three points that make a triangle
 * @param ponto2 - One of the three points that make a triangle
 * @param ponto3 - One of the three points that make a triangle
 */
class MyTriangle extends CGFobject {
	constructor(scene, ponto1 = [], ponto2 = [], ponto3 = []) {
		super(scene);
		this.ponto1 = ponto1;
		this.ponto2 = ponto2;
		this.ponto3 = ponto3;
		this.initBuffers();
		
		

	}

	/**
	 * In case we want to update the points of a triangle
	 * @function
	 * @param ponto1 - One of the three points that make a triangle
	 * @param ponto2 - One of the three points that make a triangle
	 * @param ponto3 - One of the three points that make a triangle
	*/
	update_points(ponto1 = [], ponto2 = [], ponto3 = []){
		this.ponto1 = ponto1;
		this.ponto2 = ponto2;
		this.ponto3 = ponto3;
		this.initBuffers();
	}


	    
     /**
    * Fuction used to update the texcoords of a Triangle when a texture is applied
    * @function
    * @param ls lenght_s of the texture, found in the xml when declaring a texture for a certain component
    * @param lt lenght_t of the texture, found in the xml when declaring a texture for a certain component
    */
	updatetexCoords(ls , lt){
		
		this.texCoords = [
			0,0,
			this.a/ls,0,
			(this.c * this.alpha_cos) / ls, (this.c * this.alpha_sin)/lt,
		];
		this.updateTexCoordsGLBuffers();
	}

	/**
    * Fuction used to calculate the norm of a vector
    * @function
    * @param vector array to hold the values of a vector [x, y, z]
    */
	norma(vetor = []){
		var norma = Math.sqrt(Math.pow(vetor[0],2)+ Math.pow(vetor[1],2) + Math.pow(vetor[2],2));
		return norma;
	}

	initBuffers() {
		this.normals = [];
		this.vertices = [
			this.ponto1[0], this.ponto1[1], this.ponto1[2],
			this.ponto2[0], this.ponto2[1], this.ponto2[2],
			this.ponto3[0], this.ponto3[1], this.ponto3[2],
		];
		
		
		this.vetor1_2 = [this.ponto2[0]-this.ponto1[0],this.ponto2[1]-this.ponto1[1], this.ponto2[2]-this.ponto1[2]];
		this.a = this.norma(this.vetor1_2);

		this.vetor1_3 = [this.ponto3[0]-this.ponto1[0],this.ponto3[1]-this.ponto1[1], this.ponto3[2]-this.ponto1[2]];
		this.c = this.norma(this.vetor1_3);

		this.vetor2_3 = [this.ponto3[0]-this.ponto2[0],this.ponto3[1]-this.ponto2[1], this.ponto3[2]-this.ponto2[2]];
		this.b = this.norma(this.vetor2_3);

		this.alpha_cos = (Math.pow(this.a,2) - Math.pow(this.b, 2) + Math.pow(this.c, 2)) / (2*this.a*this.c);
		this.alpha_sin = Math.sqrt(1- Math.pow(this.alpha_cos,2));
		this.vetor_normal = [this.vetor1_2[1] * this.vetor1_3[2] - this.vetor1_2[2] * this.vetor1_3[1], (this.vetor1_2[2] * this.vetor1_3[0] - this.vetor1_2[0] * this.vetor1_3[2]) , this.vetor1_2[0] * this.vetor1_3[1] - this.vetor1_2[1] * this.vetor1_2[0]];
		this.vetor_normal_norma = this.norma(this.vetor_normal);
		this.vetor_normal_normalizado = [this.vetor_normal[0]/this.vetor_normal_norma , this.vetor_normal[1]/this.vetor_normal_norma , this.vetor_normal[2]/this.vetor_normal_norma];
		
		//this.vetor_normal_norma = Math.sqrt(Math.pow(this.vetor_normal_normalizado[0],2)+ Math.pow(this.vetor_normal_normalizado[1],2) + Math.pow(this.vetor_normal_normalizado[2],2));
		this.vetor_inverso = -1 * this.vetor_normal;
	
		//Counter-clockwise reference of vertices*/
		this.indices = [
			0, 1, 2,
		];
		
		this.normals.push(...this.vetor_normal);
		this.normals.push(...this.vetor_normal);
		this.normals.push(...this.vetor_normal);

		this.texCoords = [
			0,0,
			1,0,
			0.5,1
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
	

}

