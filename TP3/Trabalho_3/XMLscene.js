var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();
        this.interface = myinterface;

        //this.orchestrator = new MyGameOrchestrator(this);
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {

        super.init(application);
        this.sceneInited = false;
        this.enableTextures(true);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.axis = new CGFaxis(this);
        this.UPDATE_PERIOD = 30;
        this.displayAxis = true;
        this.displayNormals = false;
        this.selectedCamera = 0;
        this.gameType = null;
        this.ai1Dificulty = null;
        this.ai2Dificulty = null;
        this.string = null;
        this.gameTypes = ['1vs1', 'Player vs AI', 'AI vs Player', 'AI vs AI'];
        this.ai1Dificulties = [0, 1, 2];
        this.ai2Dificulties = [0, 1, 2];
        this.orchestrator = new MyGameOrchestrator(this);
        this.undo = function () {
            this.orchestrator.gameSequence.undo();
        }
        this.gameMovie = function () {
            this.orchestrator.gameSequence.gameMovie();
        }
        this.reset = function () {
            this.orchestrator.gameSequence.reset();
        }
        this.loadScene = function () {
            this.orchestrator.loadNewScene();
        }
        this.cameraAnimation = false;
        //JUST AFTER GameType Selected
        this.setPickEnabled(false);
        this.boardCameraDelta = Math.PI / 60;
        this.boardCameraOrbitValue = 0;
        this.lastBoardCameraOrbitValue = 0;
        this.cameraAnimationDone = false;
    }
    /**
     * updates the scene camera
     */
    updateCamera() {
        this.camera = this.graph.Views[this.selectedCamera];
        if (this.selectedCamera != this.graph.boardCameraId) {
            this.interface.setActiveCamera(this.camera);
        }
    }


    updateBoardCamera() {

        // if the camera animation is active, meaning the current state of the orchestrator is ROTATING_CAMERA
        if (this.cameraAnimation) {

            // If conditions to make sure to rotation is done properly and the angle at the end of the animation is correct and the camera
            // is stationed precisely looking at the board
            this.boardCameraOrbitValue = this.boardCameraOrbitValue + this.boardCameraDelta;
            if (this.boardCameraOrbitValue > Math.PI) {
                this.graph.Views[this.graph.boardCameraId].orbit(vec3.fromValues(0, 1, 0), Math.PI - this.lastBoardCameraOrbitValue);

                this.boardCameraOrbitValue = 0;
                // In case the selected camera isn't the baord camera we still have to rotate the one in the graph
                this.cameraAnimation = false;
                this.cameraAnimationDone = true;

            } else if (this.boardCameraOrbitValue == Math.PI) {
                this.graph.Views[this.graph.boardCameraId].orbit(vec3.fromValues(0, 1, 0), this.boardCameraDelta);
                this.boardCameraOrbitValue = 0;
                this.cameraAnimation = false;
                this.cameraAnimationDone = true;
            } else {
                this.graph.Views[this.graph.boardCameraId].orbit(vec3.fromValues(0, 1, 0), this.boardCameraDelta);
            }

            // used for the last transition to make sure it rotates always PI rad
            this.lastBoardCameraOrbitValue = this.boardCameraOrbitValue;
        }

    }

    /**
     * initializes the security camera and the scene camera with the default values
     */
    initCameras() {
        this.selectedCamera = this.graph.view_default;
        this.camera = this.graph.Views[this.selectedCamera];
        if (this.selectedCamera != this.graph.boardCameraId) {
            this.interface.setActiveCamera(this.camera);
        }
    }



    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {

        var i = 0;
        var location_index, ambient_index, diffuse_index, specular_index, attenuation_index, target_index;
        var enable_index, angle_index, exponent_index, type_index;
        var attributeNames = ["location", "target", "ambient", "diffuse", "specular", "attenuation", "enable", "exponent", "angle", "type"];
        // Reads the lights from the scene graph.
        var light;
        for (var key in this.graph.Lights) {
            // Only eight lights allowed by WebGL.
            if (i >= 8)
                break;

            light = this.graph.Lights[key];
            location_index = attributeNames[0];
            target_index = attributeNames[1];
            ambient_index = attributeNames[2];
            diffuse_index = attributeNames[3];
            specular_index = attributeNames[4];
            attenuation_index = attributeNames[5];
            enable_index = attributeNames[6];
            exponent_index = attributeNames[7];
            angle_index = attributeNames[8];
            type_index = attributeNames[9];

            // atributes that are common betteewn lights (omin and spot)
            this.lights[i].setPosition(light[location_index][0], light[location_index][1], light[location_index][2], light[location_index][3], light[location_index][4]);
            this.lights[i].setAmbient(light[ambient_index][0], light[ambient_index][1], light[ambient_index][2], light[ambient_index][3], light[ambient_index][4]);
            this.lights[i].setDiffuse(light[diffuse_index][0], light[diffuse_index][1], light[diffuse_index][2], light[diffuse_index][3], light[diffuse_index][4]);
            this.lights[i].setSpecular(light[specular_index][0], light[specular_index][1], light[specular_index][2], light[specular_index][3], light[specular_index][4]);
            this.lights[i].setConstantAttenuation(light[attenuation_index][0]);
            this.lights[i].setLinearAttenuation(light[attenuation_index][1]);
            this.lights[i].setQuadraticAttenuation(light[attenuation_index][2]);

            if (light[type_index] == "spot") {
                this.lights[i].setSpotCutOff(light[angle_index]);
                this.lights[i].setSpotExponent(light[exponent_index]);
                this.lights[i].setSpotDirection(light[target_index][0] - light[location_index][0], light[target_index][1] - light[location_index][1], light[target_index][2] - light[location_index][2]);
            }

            if (light[enable_index] == true) {
                this.lights[i].enable();
            } else {
                this.lights[i].disable();
            }
            this.lights[i].setVisible(true);

            this.lights[i].update();
            i++;

        }
    }

    /** set the default appearance of the scene
     */
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        let handlerVAR = this.orchestrator.handler;

        this.orchestrator.prolog.getPrologRequest(
            'start',
            function (data) {
                handlerVAR.handleInitialBoard(data.target.response);
            },
            function (data) {
                handlerVAR.handlerError(data.target.response);
            });

        this.orchestrator.loadedPending=false;
        this.orchestrator.loadedScene=true;
        
        this.initLights();
        this.initCameras();
        this.interface.gui_add_lights(this, this.graph.Lights);
        this.interface.gui_add_camera(this, this.graph.Views);
        //Time in ms
        this.setUpdatePeriod(this.UPDATE_PERIOD);

        this.updateCamera();

        this.sceneInited = true;
    }

    /*Called at a precise frame rate defined in the constructor*/
    update(t) {
        var key;
        for (var i = 0; i < this.graph.idsComponentsAnimation.length; i++) {
            key = this.graph.idsComponentsAnimation[i];
            this.component_animation = this.graph.components[key].animation;

            /*Animacoes com NULL sao components sem animationref definido*/
            if (this.component_animation != null) {
                this.component_animation.update(t);
            }
        }

        //TODO:Para fazer o update no my game orchestrator
        if (this.orchestrator.loaded == true) {
            this.orchestrator.update(t);
        }
        this.updateBoardCamera();

    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup
        this.orchestrator.orchestrate();
        if (this.orchestrator.loadedPending == false) {

            //PICKABLE
            this.orchestrator.managePick(this.pickMode, this.pickResults);
            this.clearPickRegistration();

            // Clear image and depth buffer everytime we update the scene
            if (this.sceneInited) {
                this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
                this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

                // Initialize Model-View matrix as identity (no transformation
                this.updateProjectionMatrix();
                this.loadIdentity();

                // Apply transformations corresponding to the camera position relative to the origin
                this.applyViewMatrix();

            }

            this.pushMatrix();

            if (this.displayAxis)
                this.axis.display();

            for (var i = 0; i < this.graph.numLights; i++) {
                this.lights[i].update();
            }

            if (this.sceneInited) {
                // Draw axis
                this.setDefaultAppearance();
                // Displays the scene (MySceneGraph function).
                this.graph.displayScene();
            }
            this.popMatrix();
            // ---- END Background, camera and axis setup
        }
    }
}