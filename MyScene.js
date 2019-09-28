/**
* MyScene
* @constructor
*/
class MyScene extends CGFscene {
    constructor() {
        super();
    }

    init(application) {
        super.init(application);
        this.initCameras();
        this.initLights();

        //Background color
        this.gl.clearColor(1, 1, 1, 1.0);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.enableTextures(true);


        //Initialize scene objects  
        this.axis = new CGFaxis(this);    
        this.sphere = new MySphere(this, 10, 3, 3);
        this.point_1 = [1, 2, 5];
        this.point_2 = [1, 2, -2];
        this.point_3 = [2, 1 ,0];
        this.triangle = new MyTriangle(this , this.point_1, this.point_2, this.point_3);
        this.quadMaterial = new CGFappearance(this);
        this.triangle_material=new CGFappearance(this);
        this.torus = new MyTorus(this, 3, 1, 10,10);

        this.triangle_material = new CGFappearance(this);
        this.triangle_material.setAmbient(1, 1, 1, 1);
        this.triangle_material.setDiffuse(1, 0, 0, 1);
        this.triangle_material.setSpecular(0.1, 0.1, 0.1, 1);
        this.triangle_material.setShininess(100.0);
        this.triangle_material.loadTexture('image1.jpg');
       // this.triangle_material.setTextureWrap('REPEAT', 'REPEAT');
        //------
        
        //------ Textures
        
        //-------

        //-------Objects connected to MyInterface
        this.displayAxis = true;
        this.scaleFactor = 1;
       
      }
      
    initLights() {
        this.lights[0].setPosition(5, 2, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }

    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    display() {
  
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.lights[0].update();
        
        // Draw axis
      
        if (this.displayAxis)
            this.axis.display();

        this.setDefaultAppearance();

        this.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);


        // ---- BEGIN Primitive drawing section
        //this.quadMaterial.apply();
        //this.sphere.enableNormalViz();
        //this.triangle_material.apply(); 
        this.sphere.display();
       // this.triangle.display();
        //this.torus.display();

        // Default texture filtering in WebCGF is LINEAR. 
        // Uncomment next line for NEAREST when magnifying, or 
        // add a checkbox in the GUI to alternate in real time
        
        // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        
        // ---- END Primitive drawing section
    }
}