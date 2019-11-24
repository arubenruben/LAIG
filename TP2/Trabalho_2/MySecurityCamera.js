/**
* MySecurityCamera creates the rectangle shape of the camera to be displayed on the bottom right corner
    occupying 25% of the screen in width and height
* @constructor
* @param scene reference to the scene
*/
class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.rectangle = new MyRectangle(scene, 'camera', 0.5, -0.5, 1, -1);
        this.shader = new CGFshader(scene.gl, 'shaders/shader.vert', 'shaders/shader.frag');
        this.scene = scene;

        this.initBuffers();
    }

    /**
    * Sets the active shader, binds the RTTtexture, displays the security camera, set the active shader to be
    * the default one and unbinds the texture
    * @function
    */
    display() {

        this.scene.setActiveShader(this.shader)
        this.scene.textureRTT.bind()
        this.rectangle.display()
        this.scene.setActiveShader(this.scene.defaultShader)
        this.scene.textureRTT.unbind()

    }


    /**
    * Updates the time for the shader , for the withe lines to move upwards
    * @function
    */
    update(t) {
        this.shader.setUniformsValues({ timeFactor: t / 100 % 1000, SCLinesHeight: this.scene.SCLinesHeight, SCLinesRate: this.scene.SCLinesRate, SCRadialGradient: this.scene.SCRadialGradient});
    }
}
