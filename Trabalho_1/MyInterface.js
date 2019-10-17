/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)
        this.gui.add(this.scene, 'displayAxis').name("Display axis");
        this.gui.add(this.scene, 'displayNormals').name("Display Normals");
        
        
      /*  this.gui.add(this.scene, 'selectedCamera', this.graph.camera).name('Selected Object').onChange(this.scene.updateObjectComplexity.bind(this.scene));
        var f0 = this.gui.addFolder('Lights');
        f0.add(this.scene.lights[0], 'enabled').name("Enabled");
*/
        this.m_pressed = 0;
        this.initKeys();
    
      

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event){
        this.activeKeys[event.code]=true;
        if(event.code == "KeyM" && !event.repeat){
                this.scene.graph.mPressed++;
        }
    };
    
    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }


}