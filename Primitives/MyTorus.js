/**
 * MyTorus
 * @constructor
 */
/**
 * MySemiSphere
 * @constructor
 */
class MyTorus extends CGFobject {
    constructor(scene, radius_outter, radius_inner, loops, slices) {
        super(scene);
        this.scene = scene;

        this.r_inner = radius_inner;
        this.r_outter = radius_outter;
        this.slices = slices;
        this.loops = loops;
    

        this.initBuffers();
    }

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var teta, fi, x, y, z;

        var increment_teta = (2* Math.PI) / this.slices;
        var increment_fi = (2 * Math.PI) / this.loops;



        for (var i = 0; i < this.loops; i++) {
            
            fi = i * increment_fi;
        for (var j = 0; j <1; j++) {
            
            teta = j * increment_teta;
            
                
                x= (this.r_outter + this.r_inner * Math.cos(teta))*Math.cos(fi);
                z = this.r_inner*Math.sin(teta);
                y = (this.r_outter + this.r_inner * Math.cos(teta))*Math.sin(fi);
                this.vertices.push(x, y, z);

               
                this.indices.push()
                this.normals.push(x , y , z );
              
               // this.texCoords.push(...this.texCoords1);

            
            }

        }
        
      
       


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

/*class MyTorus extends CGFobject {
    constructor(scene, radius_outer, radius_inner, loops, slices)
    {
        super(scene);
        this.scene = scene;

        var r_outer = radius_outer;
        var r_inner = radius_inner;
        this.slices = slices;
        this.loops= loops;
        
        this.points = [];
        
        for(var i = 0; i <  this.loops+1 ; i++){
            this.points[i] = [];
            
        }
        for(var i = 0; i < this.loops+1 ; i++){
            for(var j = 0; j < this.slices+1 ; j++){
                this.points[i][j] = [0, 0 ,0];
            }
        }
        
        var increment_lon = 2*Math.PI/this.slices;
        var increment_lat = 2*Math.PI/this.loops;
        var lon, lat, x, y, z;
        
        for(var i = 0; i < this.loops+1; i++){
            lat =  i * increment_lat;
            for(var j = 0; j < this.slices+1; j++){
                lon = j * increment_lon;
                
                z = r_inner * Math.sin(lat);
                y = (r_outer + r_inner * Math.cos(lat))*Math.sin(lon);
                x = (r_outer+ r_inner* Math.cos(lat))*Math.cos(lon)
           
                this.points[i][j][0] = x;
                this.points[i][j][1] = y;
                this.points[i][j][2] = z;
            }
        }
        this.initBuffers();
    }
    
    initBuffers() {
        
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
                
            
        for(var i = 0; i < this.loops; i++){
            console.log('Change lat');
            for(var j = 0; j < this.slices; j++){

            this.vertices.push(...this.points[i][j]);
            this.vertices.push(...this.points[i+1][j]);
            this.vertices.push(...this.points[i][j+1]);
            this.vertices.push(...this.points[i+1][j+1]);

            this.vetor1_2 = [this.points[i][j+1][0]-this.points[i][j][0],this.points[i][j+1][1]-this.points[i][j][1], this.points[i][j+1][2]-this.points[i][j][2]];
            this.vetor1_3 = [this.points[i+1][j][0]-this.points[i][j][0],this.points[i+1][j][1]-this.points[i][j][1], this.points[i+1][j][2]-this.points[i][j][2]];
            this.vetor_normal = [this.vetor1_2[1] * this.vetor1_3[2] - this.vetor1_2[2] * this.vetor1_3[1], (this.vetor1_2[2] * this.vetor1_3[0] - this.vetor1_2[0] * this.vetor1_3[2]) , this.vetor1_2[0] * this.vetor1_3[1] - this.vetor1_2[1] * this.vetor1_2[0]];
		    this.vetor_normal_norma = Math.sqrt(Math.pow(this.vetor_normal[0],2)+ Math.pow(this.vetor_normal[1],2) + Math.pow(this.vetor_normal[2],2));
		    this.vetor_normal_normalizado = [this.vetor_normal[0]/this.vetor_normal_norma , this.vetor_normal[1]/this.vetor_normal_norma , this.vetor_normal[2]/this.vetor_normal_norma];
            this.normals.push(...this.vetor_normal_normalizado);
            this.normals.push(...this.vetor_normal_normalizado);
            this.normals.push(...this.vetor_normal_normalizado);
            this.normals.push(...this.vetor_normal_normalizado);

           

            this.texCoords1=[
                0, 0,
                0, 1,
                1, 0,
                1,1
            ];

            this.texCoords.push(...this.texCoords1);
                
            this.indices.push(4*j+4*i*this.slices + 0, 4*j + 4*i*this.slices+ 1, 4*j +4*i*this.slices+2);
            this.indices.push(4*j +4*i*this.slices+ 2, 4*j + 4*i*this.slices+ 1, 4*j+ 4*i*this.slices+0);
            this.indices.push(4*j+4*i*this.slices + 1, 4*j + 4*i*this.slices+ 3, 4*j +4*i*this.slices+2);
            this.indices.push(4*j +4*i*this.slices+ 2, 4*j + 4*i*this.slices+ 3, 4*j+ 4*i*this.slices+1);
            
            this.texCoords.push()

            }
        }
               
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

  
}*/