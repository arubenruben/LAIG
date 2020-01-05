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
        this.application = application;
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI;
        this.scene.gui = this.gui;

        // add a group of controls (and open/expand by defult)
        this.gui.add(this.scene, 'displayAxis').name("Display axis");
        this.gui.add(this.scene, 'displayNormals').name("Display Normals");
        this.gui.add(this.scene, 'gameType', this.scene.gameTypes).name('Game Type');
        this.gui.add(this.scene,'loadScene').name('Load Scene');
        this.gui.add(this.scene, 'undo').name('Undo');
        this.gui.add(this.scene, 'gameMovie').name('Game Movie');
        this.gui.add(this.scene, 'reset').name('Reset');
        this.m_pressed = 0;
        this.initKeys();

        return true;
    }


    /**
     * adds the cameras options
     * @param scene Reference to the scene
     * @param views array holding the cameras ids
     */
    gui_add_camera(scene, views) {
        let views_key = [];
        for (let key in views) {
            views_key.push(key)
        }
        this.gui.add(scene, 'selectedCamera', views_key).onChange(scene.updateCamera.bind(scene));
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
            f0.add(scene.lights[i], 'enabled').name(key);
            i++;
        }
    }

    /**
     * initKeys
     */
    initKeys() {
            this.scene.gui = this;
            this.processKeyboard = function() {};
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

    reset(scene) {
        scene.gui.gui.destroy();
        this.gui = new dat.GUI();
        scene.gui.gui = this.gui;
        this.gui.add(scene, 'displayAxis').name("Display axis");
        this.gui.add(scene, 'displayNormals').name("Display Normals");
        this.gui.add(scene, 'gameType', scene.gameTypes).name('Game Type');
        this.gui.add(scene, 'undo').name('Undo');
        this.gui.add(scene, 'gameMovie').name('Game Movie');
        this.gui.add(scene, 'reset').name('Reset');
    }


}