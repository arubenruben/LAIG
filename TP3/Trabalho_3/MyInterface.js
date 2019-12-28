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
        this.gui.add(this.scene, 'gameType', this.scene.gameTypes).name('Game Type');
        this.gui.add(this.scene, 'undo').name('Undo');
        //this.gui.add(this.scene, 'gameType', this.scene.gameTypes)
        this.m_pressed = 0;
        this.initKeys();

        return true;
    }

    /**
     * adds the lights checkbox option
     * @param scene Reference to the scene
     * @param lights array holding the cameras ids
     */
    gui_add_lights(scene, lights) {
        let views_key = [];
        var f0 = this.gui.addFolder('Lights');
        var i = 0;
        for (let key in lights) {
            views_key.push(key);
            f0.add(this.scene.lights[i], 'enabled').name(key);
            i++;
        }
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }
    /**
    * function to process the event of a key being pressed down
    */
    processKeyDown(event) {
        this.activeKeys[event.code] = true;
        if (event.code == "KeyM" && !event.repeat) {
            this.scene.graph.mPressed++;
        }
    };

    /**
    * function to process the event of a key being let up, sttoping pressing it
    */
    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    /**
    * function to determine if a key is being pressed or not
    */
    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }


}