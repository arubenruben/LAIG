/**
* MySecurityCamera
* @constructor
*/
class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.rectangle=new MyRectangle(scene,'camera',0.5,-0.5,1,-1)
        this.shader=new CGFshader(scene.gl,'shaders/shader.vert','shaders/shader.frag')

        //this.rectangle.updatetexCoords(0.5, 0.5)
        
        this.scene = scene;
     
        this.initBuffers();
    }
    
    display(){
        
        this.scene.setActiveShader(this.shader)
        this.scene.textureRTT.bind()
        this.rectangle.display()
        this.scene.setActiveShader(this.scene.defaultShader)
    }


}
