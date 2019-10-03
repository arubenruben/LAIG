/**
* MyCilinder
* @constructor
*/
class MyCilinder extends CGFobject {
    constructor(scene, slices, stacks,height,radiustop,radiusbottom)
    {
        super(scene);
        this.slices = slices;
        this.height=height;
        this.stacks = stacks;
        this.radiustop=radiustop;
        this.radiusbottom=radiusbottom;
        this.initBuffers();
    }
    initBuffers() {
        
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];


        let delta_r=(this.radiusbottom-this.radiustop)/this.stacks;
        let var_teta=2*Math.PI/this.slices;
        let var_height=this.height/this.stacks;
        let x=0,y=0,z=0;
        
        //Comeco a desenhar a base

        let cos_value;
        let sin_value;
        
        for(let i = 0; i < this.stacks; i++){
            
            let radius=this.radiusbottom-i*delta_r;
            
            for(let j=0;j<this.slices;j++){

                z=var_height*i;
                cos_value=Math.cos(j*var_teta);
                x=radius*cos_value;
                sin_value=Math.sin(j*var_teta);
                y=radius*sin_value;
                this.vertices.push(x,y,z);
                
                this.normals.push(cos_value,sin_value,0);

             
                
            }    
            
        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

  
}

