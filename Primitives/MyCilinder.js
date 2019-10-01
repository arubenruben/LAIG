/**
* MyCilinder
* @constructor
*/
class MyCilinder extends CGFobject {
    constructor(scene, slices, stacks,trunkHeight, trunkRadius)
    {
        super(scene);
        this.slices = slices;
        this.trunkHeight = trunkHeight;
        this.trunkRadius =  trunkRadius;
        this.stacks = stacks;
        this.initBuffers();
    }
    initBuffers() {
        
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;
        var texture_parameter = 1.0 / this.slices;
        

        for(var i = 0; i < this.slices; i++){
            // All vertices have to be declared for a given face
            // even if they are shared with others, as the normals 
            // in each face will be different

            var sa=this.trunkRadius * Math.sin(ang);
            var saa=this.trunkRadius * Math.sin(ang+alphaAng);
            var ca=this.trunkRadius * Math.cos(ang);
            var caa=this.trunkRadius * Math.cos(ang+alphaAng);

        
            this.vertices.push(ca, this.trunkHeight, -sa);//A
            this.vertices.push(ca, 0, -sa);//B
            this.vertices.push(caa, 0, -saa);//D
            this.vertices.push(caa, this.trunkHeight, -saa);//C

            // triangle normal computed by cross product of two edges
          //  var normal= [
           //     Math.cos(media_angulo+(Math.PI/4)*i),0,Math.sin(media_angulo+(Math.PI/4)*i)
            //];
            var normal= [
                ca,
                0,
                -sa
            ];
            var norma2= [
                caa,
                0,
                -saa
            ]
            
            var textcoords1 =[
                i * texture_parameter,0,
                i*texture_parameter,1,
                texture_parameter+ i*texture_parameter,1,
                texture_parameter+ i*texture_parameter,0
            ];
         
    
            // push normal once for each vertex of this triangle
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...norma2);
            this.normals.push(...norma2);
            this.texCoords.push(...textcoords1);


            this.indices.push(4*i, (4*i+1) , (4*i+2));
            this.indices.push((4*i+2), (4*i+3) , (4*i+0));
            this.indices.push((4*i+2), (4*i+1) , 4*i);
            this.indices.push((4*i+0), (4*i+3) ,(4*i+2));
     
            ang+=alphaAng;
        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

  
}


