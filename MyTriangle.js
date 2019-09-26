/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
	constructor(scene, ponto1 = [], ponto2 = [], ponto3 = []) {
		super(scene);
		this.ponto1 = ponto1;
		this.ponto2 = ponto2;
		this.ponto3 = ponto3;
		this.initBuffers();
		
		

	}
	update_points(ponto1 = [], ponto2 = [], ponto3 = []){
		this.ponto1 = ponto1;
		this.ponto2 = ponto2;
		this.ponto3 = ponto3;
		this.initBuffers();
	}
	initBuffers() {
		this.normals = [];
		this.vertices = [
			this.ponto1[0], this.ponto1[1], this.ponto1[2],
			this.ponto2[0], this.ponto2[1], this.ponto2[2],
			this.ponto3[0], this.ponto3[1], this.ponto3[2],
		];

		this.vetor1_2 = [this.ponto2[0]-this.ponto1[0],this.ponto2[1]-this.ponto1[1], this.ponto2[2]-this.ponto1[2]];
		this.vetor1_3 = [this.ponto3[0]-this.ponto1[0],this.ponto3[1]-this.ponto1[1], this.ponto3[2]-this.ponto1[2]];
		this.vetor_normal = [this.vetor1_2[1] * this.vetor1_3[2] - this.vetor1_2[2] * this.vetor1_3[1], (this.vetor1_2[2] * this.vetor1_3[0] - this.vetor1_2[0] * this.vetor1_3[2]) , this.vetor1_2[0] * this.vetor1_3[1] - this.vetor1_2[1] * this.vetor1_2[0]];
		this.vetor_normal_norma = Math.sqrt(Math.pow(this.vetor_normal[0],2)+ Math.pow(this.vetor_normal[1],2) + Math.pow(this.vetor_normal[2],2));
		this.vetor_normal_normalizado = [this.vetor_normal[0]/this.vetor_normal_norma , this.vetor_normal[1]/this.vetor_normal_norma , this.vetor_normal[2]/this.vetor_normal_norma];
		//this.vetor_normal_norma = Math.sqrt(Math.pow(this.vetor_normal_normalizado[0],2)+ Math.pow(this.vetor_normal_normalizado[1],2) + Math.pow(this.vetor_normal_normalizado[2],2));
		this.vetor_inverso = -1 * this.vetor_normal;
		console.log(this.vetor_normal_norma);
		//Counter-clockwise reference of vertices*/
		this.indices = [
			0, 1, 2,
			2, 1, 0
		];
		
		this.normals.push(...this.vetor_normal);
		this.normals.push(...this.vetor_normal);
		this.normals.push(...this.vetor_normal);

		this.texCoords = [
			0,1,
			1,1,
			0,0

		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
	

}

