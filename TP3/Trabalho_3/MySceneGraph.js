var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;
var TRANSLATION_POS = 0;
var ROTATION_POS = 1;
var SCALE_POS = 2;


/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        //  Array to hold the cameras of the scene
        this.Views = [];

        //  Array to hold the cameras for the security camera
        this.ViewsSecurity = [];

        // Array to hold ambient configurations
        this.ambient = [];
        this.background = [];

        // Var that holds the number of times the m key was pressed
        this.mPressed = 0;

        // Array to hold the animations in the xml
        this.animations = [];

        // Array to hold the ids of components that have animations
        this.idsComponentsAnimation = [];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {

        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }


    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     * Nesta funcao e chamado com um objeto do tipo 
     */
    parseXMLFile(rootElement) {

        //A root tem de se chamar lxs
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing. Root tem de ter o name_tag lxs";

        var nodes = rootElement.children;
        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        //Leio o nome dos nos(os ids) dos filhos da root
        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        this.transformations = [];

        // Processes each node, verifying errors.

        // <scene>
        var index;

        //*****Check if the order is completed is already done******

        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            //Is made here
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Ordem certa e existente, passamos para o parsing
            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse globals block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index], this.transformations)) != null)
                return error;
        }

        // <animation>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse primitives block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')

        if (root == null)
            return "no root defined for scene. Tag root not defined";

        //id da root vai ser o nome da mesma
        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');

        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        //Assuming axis length is one.
        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {


        var view_root = this.reader.getString(viewsNode, 'default');

        if (view_root == null)
            return "Default view is not defined";

        var children = viewsNode.children; //Tem de existir um vista ortogonal ou em prespetiva

        if (children.length == 0)
            return "At least one View must be defined, either perspective or orthogonal";

        //array to store the cameras
        var view_id, view_type;
        var near, far, angle, left, right, top, bottom;
        var attributeNames = ["from", "to", "up"];


        this.view_default = view_root;
        this.active_camera = view_root;
        var grandChildren = [];
        var from = [];
        var to = [];
        var up = [];
        var index_from, index_up, index_to;
        var camera;


        for (var i = 0; i < children.length; i++) {

            view_type = children[i].nodeName;

            if (view_type != "perspective" && view_type != "ortho") {
                this.onXMLMinorError("unknown tag <" + view_type + "> in the views Node, valid tags (perspective or ortho), view not added");
                continue;
            }

            // Get id of the current view.
            view_id = this.reader.getString(children[i], 'id');
            if (view_id == null) {
                this.onXMLError("id not found for element of type " + view_type + " in views Node, view not added");
                continue;
            }

            // Checks for repeated IDs.
            if (this.Views[view_id] != null) {
                this.onXMLError("id for element of type " + view_type + "is already in use, view not added, first view with same id remains");
                continue;
            }

            // common attributes and elements for both type of views
            near = this.reader.getFloat(children[i], 'near');
            if (near == null || isNaN(near)) {
                this.onXMLMinorError("near attribute for view element with id " + view_id + "is not defined or as a invalid value, view not added");
                continue;
            }

            far = this.reader.getFloat(children[i], 'far');
            if (far == null || isNaN(far)) {
                this.onXMLMinorError("far attribute for view element with id " + view_id + "is not defined or as a invalid value, view not added");
                continue;
            }

            //starting to parse specific attributes and elements for view of type perspective
            if (view_type == "perspective") {

                angle = this.reader.getFloat(children[i], 'angle');


                //Meter os angulos em radianos
                angle = angle * DEGREE_TO_RAD;


                if (angle == null || isNaN(angle)) {
                    this.onXMLMinorError("perspective attribute for view element with id " + view_id + "is not defined or as a invalid value, view not added");
                    continue;
                }
            } else if (view_type == "ortho") {
                //starting to parse specific attributes and elements for view of type ortho

                left = this.reader.getFloat(children[i], 'left');
                if (left == null || isNaN(left)) {
                    this.onXMLMinorError("left attribute for view element with id " + view_id + "is not defined or as a invalid value, view not added");
                    continue;
                }

                right = this.reader.getFloat(children[i], 'right');
                if (right == null || isNaN(right)) {
                    this.onXMLMinorError("right attribute for view element with id " + view_id + "is not defined or as a invalid value, view not added");
                    continue;
                }

                top = this.reader.getFloat(children[i], 'top');
                if (top == null || isNaN(top)) {
                    this.onXMLMinorError("top attribute for view element with id " + view_id + "is not defined or as a invalid value, view not added");
                    continue;
                }

                bottom = this.reader.getFloat(children[i], 'bottom');
                if (bottom == null || isNaN(bottom)) {
                    this.onXMLMinorError("bottom attribute for view element with id " + view_id + "is not defined or as a invalid value, view not added");
                    continue;
                }

            }

            //grandchildren (from , to or up)

            grandChildren = children[i].children;

            // Specifications for the current view.
            var nodeNames = [];

            for (var j = 0; j < grandChildren.length; j++) {
                //Coloco em nodemae os valores de from e to
                nodeNames.push(grandChildren[j].nodeName);

                //Nao sao parametros validos que se apliquem aqui
                if (grandChildren[j].nodeName != attributeNames[0] && grandChildren[j].nodeName != attributeNames[1] && grandChildren[j].nodeName != attributeNames[2]) {
                    this.onXMLMinorError("Tag unknown found for view of id " + view_id + ", view will still be added if it has no errors");
                }

            }

            //Valor index do from para verificar existencia dos atributos no xml
            index_from = nodeNames.indexOf(attributeNames[0]);

            if (index_from == -1) {
                //Neste caso nao ha tag from definido. Ha um erro
                this.onXMLMinorError("Tag  from not found for view of id " + view_id + ", view not added");
                continue;
            }

            from = this.parseCoordinates3D(grandChildren[index_from], "View position" + view_id);

            if (!Array.isArray(from)) {
                this.onXMLMinorError(from + " , view not added");
                continue;
            }


            //Valor index do to para verificar existencia dos atributos no xml

            index_to = nodeNames.indexOf(attributeNames[1]);

            if (index_to == -1) {
                this.onXMLMinorError("Tag /to/ not found for view of id " + view_id + ", view not added");
                continue;
            }
            to = this.parseCoordinates3D(grandChildren[index_to], "View position" + view_id);

            if (!Array.isArray(to)) {
                this.onXMLMinorError(to + " , view not added");
                continue;
            }

            //Ortho tem um grandchild up ainda
            if (view_type == "ortho") {

                index_up = nodeNames.indexOf(attributeNames[2]);
                if (index_up == -1) {
                    this.onXMLMinorError("Tag  up not found for view of id " + view_id + ", view not added");
                    continue;
                }
                up = this.parseCoordinates3D(grandChildren[index_up], "View position" + view_id);
                if (!Array.isArray(up)) {
                    this.onXMLMinorError(up + " , view not added");
                    continue;
                }
            }

            var camera;
            var cameraS;

            //CGFcamera( fov, near, far, position, target )
            if (view_type == "perspective") {

                camera = new CGFcamera(angle, near, far, vec3.fromValues(from[0], from[1], from[2]), vec3.fromValues(to[0], to[1], to[2]));
                cameraS = new CGFcamera(angle, near, far, vec3.fromValues(from[0], from[1], from[2]), vec3.fromValues(to[0], to[1], to[2]));
            }

            // CGFcameraOrtho( left, right, bottom, top, near, far, position, target, up)
            else if (view_type == "ortho") {
                camera = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(from[0], from[1], from[2]), vec3.fromValues(to[0], to[1], to[2]), vec3.fromValues(up[0], up[1], up[2]));
                cameraS = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(from[0], from[1], from[2]), vec3.fromValues(to[0], to[1], to[2]), vec3.fromValues(up[0], up[1], up[2]));
            }


            //O array de views fica no indice "nome da camara" com o objeto do tipo camara
            this.Views[view_id] = camera;
            this.ViewsSecurity[view_id] = cameraS;


        }

        // Since our approach was if it was a error but theres still more views , its possible that the default view has a error and wasnt added
        // this feature is done so that the program doesnt end if there one error in another view that inst the default one
        // this may need to be correct since if our program wants to change views it will not know the view is not defined
        if (this.Views[this.view_default] == null) {
            return "unable to start program as default view as issues or is not defined";
        }

        this.log("Parsed View");
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        var children = ambientsNode.children;

        var nodeNames = [];

        for (var i = 0; i < children.length; i++) {

            //Verifico se em ambient as tags tem nome valido
            if (children[i].nodeName != "ambient" && children[i].nodeName != "background") {

                this.onXMLMinorError("unkown tag " + children[i].nodeName + " in globals block");
            } else {
                nodeNames.push(children[i].nodeName);
            }

        }


        var ambientIndex = nodeNames.indexOf("ambient");

        if (ambientIndex == -1) {
            return ("tag ambient must be present in globals block");
        }

        //Color_ambient e um array
        var color_ambient = this.parseColor(children[ambientIndex], "ambient");

        if (!Array.isArray(color_ambient))
            return color_ambient;

        this.ambient = color_ambient;


        //background tag
        var backgroundIndex = nodeNames.indexOf("background");
        if (backgroundIndex == -1) {
            return ("tag background must be present in globals block");
        }

        var color_background;

        color_background = this.parseColor(children[backgroundIndex], "background");


        if (!Array.isArray(color_background))
            return color_background;

        this.background = color_background;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

            var children = lightsNode.children;
            let attributeNames = ["location", "ambient", "diffuse", "specular", "attenuation", "target"];
            let attributeTypes = ["position", "color", "color", "color"];

            this.Lights = [];
            this.numLights = 0;
            var grandChildren = [];
            var one_light_defined = false;
            var decomp_atten;


            if (children.length == 0) {
                return "Error: must have at least one light";
            }

            // Any number of lights.
            for (var i = 0; i < children.length; i++) {


                // Storing light information
                var store_light_info = [];
                let nodeNames = [];

                var light_is_invalid = false;
                //Check type of light
                if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                    this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                    continue;
                }

                // Get id of the current light.
                var lightId = this.reader.getString(children[i], 'id');

                if (lightId == null) {
                    this.onXMLMinorError("no ID defined for light of type " + children[i].nodeName + ", light not added");
                    continue;
                }

                // Checks for repeated IDs.
                if (this.Lights[lightId] != null) {
                    this.onXMLMinorError("ID must be unique for each light (conflict: ID = " + lightId + "), light not added, first light with same id remains");
                    continue;
                }



                //store_light_info fica com a info temporaria
                store_light_info["type"] = children[i].nodeName;

                // Light enable/disable
                var enableLight = false;
                var aux = this.reader.getBoolean(children[i], 'enabled');

                if (!(aux != null && !isNaN(aux) && (aux == true || aux == false))) {
                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                    enableLight = aux || 1;

                } else {
                    enableLight = aux;
                }

                // assuming enable value is 1 or true

                store_light_info["enable"] = enableLight;

                grandChildren = children[i].children;
                // Specifications for the current light.


                // Gets the additional attributes of the spot light
                if (children[i].nodeName == "spot") {


                    var angle = this.reader.getFloat(children[i], 'angle');

                    if (!(angle != null && !isNaN(angle))) {
                        this.onXMLMinorError("unable to parse angle of the light for ID = " + lightId + ", light not added");
                        continue;
                    }

                    store_light_info["angle"] = angle;

                    var exponent = this.reader.getFloat(children[i], 'exponent');

                    if (!(exponent != null && !isNaN(exponent))) {
                        this.onXMLMinorError("unable to parse exponent of the light for ID = " + lightId + ", light not added");
                        continue;
                    }
                    store_light_info["exponent"] = exponent;

                }

                nodeNames = [];

                for (var j = 0; j < grandChildren.length; j++) {
                    nodeNames.push(grandChildren[j].nodeName);
                }



                for (var j = 0; j < attributeNames.length; j++) {

                    var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                    if (attributeIndex != -1) {

                        if (attributeNames[j] == "location") {

                            var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID " + lightId + ", light not added");

                            if (!Array.isArray(aux)) {
                                this.onXMLMinorError(aux);
                                light_is_invalid = true;
                                break;
                            }
                            store_light_info["location"] = aux;

                        } else if (attributeNames[j] == "attenuation") {

                            var aux = [];

                            decomp_atten = this.reader.getFloat(grandChildren[attributeIndex], 'constant');

                            if (decomp_atten > 1 || decomp_atten < 0 || isNaN(decomp_atten) || decomp_atten == null) {
                                this.onXMLMinorError("constant attribute of attenuation tag of light element with id" + lightId + " is not defined or as a invalid value, light not added");
                                light_is_invalid = true;
                                break;
                            }
                            aux.push(decomp_atten);

                            decomp_atten = this.reader.getFloat(grandChildren[attributeIndex], 'linear');
                            if (decomp_atten > 1 || decomp_atten < 0 || isNaN(decomp_atten) || decomp_atten == null) {
                                this.onXMLMinorError("linear attribute of attenuation tag of light element with id" + lightId + " is not defined or as a invalid value, light not added");
                                light_is_invalid = true;
                                break;
                            }
                            aux.push(decomp_atten);

                            decomp_atten = this.reader.getFloat(grandChildren[attributeIndex], 'quadratic');
                            if (decomp_atten > 1 || decomp_atten < 0 || isNaN(decomp_atten) || decomp_atten == null) {
                                this.onXMLMinorError("quadratic attribute of attenuation tag of light element with id" + lightId + " is not defined or as a invalid value, light not added");
                                light_is_invalid = true;
                                break;
                            }
                            aux.push(decomp_atten);


                            //atenuation e um array
                            store_light_info["attenuation"] = aux;


                        } else if (attributeNames[j] == "target") {

                            var aux = this.parseCoordinates3D(grandChildren[attributeIndex], "target light for ID " + lightId);
                            if (!Array.isArray(aux)) {
                                light_is_invalid = true;
                                this.onXMLMinorError(aux + ", light not added");
                            }
                            store_light_info["target"] = aux;

                        }

                        //Se nao for nenhum dos acima, entao e uma cor
                        else {

                            var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);
                            if (!Array.isArray(aux)) {
                                this.onXMLMinorError(aux + ", light not added");
                                light_is_invalid = true;
                                break;
                            }
                            store_light_info[attributeNames[j]] = aux;
                        }
                    } else {
                        //Por causa de so o spot ter target o index retorna -1, para nao estar a mudar tudo
                        if (attributeNames[j] != "target" && children[i].nodeName != "spot") {

                            this.onXMLMinorError("light target undefined for ID = " + lightId + " , light not added");
                            continue;
                        }
                    }
                }

                if (light_is_invalid == true) {
                    continue;
                }

                this.Lights[lightId] = store_light_info;

                one_light_defined = true;

                this.numLights++;
            }

            if (this.numLights > 8)
                return ("too many lights defined; WebGL imposes a limit of 8 lights");

            if (one_light_defined == false)
                return ("At least one light must be defined without erros - reminder elements with errors are not added");

            this.log("Parsed lights");
            return null;
        }
        /**
         * Parses the <textures> block. 
         * @param {textures block element} texturesNode
         */
    parseTextures(texturesNode) {
        var children = texturesNode.children;
        this.textures = [];
        var one_texture_defined = false;

        if (children.length == 0) {
            return "there must be at least one texture declared in the textures block";
        }

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unkown tag inside textures block");
                continue;
            }


            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null) {
                this.onXMLMinorError("texture id is not defined or is a invalid value, texture not added");
                continue;
            }

            var filepath = this.reader.getString(children[i], 'file');
            if (filepath == null) {
                this.onXMLMinorError("texture file is not defined or is a invalid value, texture not added");
                continue;
            }

            var new_texture = new CGFtexture(this.scene, filepath);

            this.textures[textureID] = new_texture;
            one_texture_defined = true;

        }

        if (one_texture_defined == false) {
            return ("A texture is defined but it must contain errors so it wasnt added, fix the errors");
        }


        this.log("Parsed textures.");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

        var children = materialsNode.children;
        this.materials = [];
        var grandChildren = [];
        var ambient = [];
        var diffuse = [];
        var specular = [];
        var emission = [];
        var emissionIndex;
        var ambientIndex;
        var diffuseIndex;
        var specularIndex;

        var one_material_defined = false;

        if (children.length == 0) {
            return "At least one material must be defined";
        }

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null) {
                this.onXMLMinorError("no ID defined or invalid value for material, material not added");
                continue;
            }


            // Checks for repeated IDs.
            if (this.materials[materialID] != null) {
                this.onXMLMinorError("ID must be unique for each light (conflict: ID = " + materialID + "), material not added, first one still remains");
                continue;
            }

            var shininess = this.reader.getString(children[i], 'shininess');
            if (!(shininess != null && !isNaN(shininess))) {
                this.onXMLMinorError("Attribute shininess is either missing or wrong for material of id: " + materialID);
                continue;
            }

            grandChildren = children[i].children;

            var nodeNames = [];

            for (var j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);


            emissionIndex = nodeNames.indexOf("emission");
            if (emissionIndex == -1) {
                this.onXMLMinorError("Tag emission not found for material of id " + materialID + ", material not added");
                continue;
            }
            emission = this.parseColor(grandChildren[emissionIndex], "emission error in material of id " + materialID);
            if (!Array.isArray(emission)) {
                this.onXMLMinorError(emission + ", material not added");
                continue;
            }

            ambientIndex = nodeNames.indexOf("ambient");
            if (ambientIndex == -1) {
                this.onXMLMinorError("Tag  ambient not found for material of id " + materialID + ", material not added");
                continue;
            }
            ambient = this.parseColor(grandChildren[ambientIndex], "ambient error in material of id " + materialID);
            if (!Array.isArray(ambient)) {
                this.onXMLMinorError(ambient + ", material not added");
                continue;
            }

            diffuseIndex = nodeNames.indexOf("diffuse");
            if (diffuseIndex == -1) {
                this.onXMLMinorError("Tag  diffuse not found or material of id " + materialID + ", material not added");
                continue;
            }
            diffuse = this.parseColor(grandChildren[diffuseIndex], "diffuse error in material of id " + materialID);
            if (!Array.isArray(diffuse)) {
                this.onXMLMinorError(diffuse + ", material not added");
                continue;
            }

            specularIndex = nodeNames.indexOf("specular");
            if (specularIndex == -1) {
                this.onXMLMinorError("Tag specular not found for material of id " + materialID + ", material not added");
                continue;
            }
            specular = this.parseColor(grandChildren[specularIndex], "specular error in material of id " + materialID);
            if (!Array.isArray(specular)) {
                this.onXMLMinorError(specular + ", material not added");
                continue;
            }

            if (nodeNames.length > 4) {
                this.onXMLMinorError("There are other tags besides emission, ambient, diffuse, specular for material of id: " + materialID);
                continue;
            }

            var new_material = new CGFappearance(this.scene);
            new_material.setShininess(shininess);
            new_material.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            new_material.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            new_material.setSpecular(specular[0], specular[1], specular[2], specular[3]);
            new_material.setEmission(emission[0], emission[1], emission[2], emission[3]);
            new_material.setTextureWrap('REPEAT', 'REPEAT');
            this.materials[materialID] = new_material;
            one_material_defined = true;

        }

        if (one_material_defined == false) {
            return "At least one material must be defined";
        }

        this.log("Parsed materials");
        return null;
    }

    parseTransformations_components(transformationsNode, id) {

        var children = transformationsNode.children;
        // Specifications for the current transformation.
        var transformation;
        var transfMatrix = mat4.create();

        for (var j = 0; j < children.length; j++) {
            switch (children[j].nodeName) {
                case 'translate':
                    var coordinates = this.parseCoordinates3D(children[j], "translate transformation in transformations block for component of id " + id);
                    if (!Array.isArray(coordinates)) {
                        this.onXMLError(coordinates);
                        return -1;
                    }
                    transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                    break;
                case 'scale':

                    var coordinates = this.parseCoordinates3D(children[j], "Scale tranformation in transformations block for component of id " + id);

                    if (!Array.isArray(coordinates)) {
                        this.onXMLError(coordinates);
                        return -1;
                    }

                    transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);

                    break;
                case 'rotate':
                    // angle
                    //Os angulos e preciso converter para radianos
                    var x = 0,
                        y = 0,
                        z = 0;
                    var aux_array_axis = [];

                    var axis = this.reader.getString(children[j], 'axis');

                    if (axis == null) {
                        this.onXMLError("Error finding the tag axis in rotation in transformations block for component of id " + id);
                        return -1;
                    }

                    var angle = this.reader.getFloat(children[j], 'angle');
                    if (angle == null || isNaN(angle)) {
                        this.onXMLError("Error finding the tag angle in rotation in transformations block for component of id " + id);
                        return -1;
                    }

                    if (axis == 'x') {
                        x = 1;
                    } else if (axis == 'y') {
                        y = 1;
                    } else if (axis == 'z') {
                        z = 1;
                    } else {
                        this.onXMLError("Invalid axis in transformations block for component of id " + id);
                        return -1;
                    }

                    aux_array_axis.push(...[x, y, z]);

                    if (!Array.isArray(aux_array_axis)) {
                        this.onXMLError(aux_array_axis);
                        return -1;
                    }

                    transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, aux_array_axis);
                    break;
                case 'transformationref':
                    this.onXMLError("There is a transformation ref in the component of id " + id + " after a explicit transformations");
                    return -1;
            }
        }
        transformation = transfMatrix;

        return transformation;
    }


    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode, transformations_array) {
        var children = transformationsNode.children;

        var transformations = transformations_array;

        var grandChildren = [];

        // Any number of transformations.

        if (children.length == 0) {
            return "Nao pode existir 0 transformacoes";
        }

        for (var i = 0; i < children.length; i++) {

            //Processa cada bloco transformacao

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            //Cada bloco transformacao. Comeca com uma instaciacao de uma mat4 e depois processar os diferentes componentes que dele podem fazer parte


            let transfMatrix = mat4.create();


            for (var j = 0; j < grandChildren.length; j++) {

                switch (grandChildren[j].nodeName) {

                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate for transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);

                        break;

                    case 'scale':

                        var coordinates = this.parseCoordinates3D(grandChildren[j], "Scale for tranformation for ID" + transformationID);

                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);

                        break;
                    case 'rotate':
                        // angle
                        //Os angulos e preciso converter para radianos
                        var x = 0,
                            y = 0,
                            z = 0;
                        var aux_array_axis = [];

                        var axis = this.reader.getString(grandChildren[j], 'axis');

                        if (axis == null) {
                            return "Error finding the tag axis in rotation in transformation of id " + transformationID;
                        }


                        var angle = this.reader.getFloat(grandChildren[j], 'angle');
                        if (angle == null) {
                            return "Error finding the tag angle in rotation in transformation of id " + transformationID;
                        }

                        if (axis == 'x') {
                            x = 1;
                        } else if (axis == 'y') {
                            y = 1;
                        } else if (axis == 'z') {
                            z = 1;
                        } else {
                            return "Invalid axis in transformation of id " + transformationID;
                        }


                        //Aux array fica com o valor do eixo sobre o qual o objeto roda

                        aux_array_axis.push(...[x, y, z]);

                        if (!Array.isArray(aux_array_axis))
                            return aux_array_axis;

                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, aux_array_axis);


                        break;
                }
            }
            transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /*Animation Array Structure:

    Placed to the position, animation_id. Where are pushed into the keyframes arrays, instants should be ordered to performance imporvement.

    */

    parseAnimations(animationNode) {

        let children = animationNode.children;
        this.animations = [];
        let grandChildren = [];
        let grandgrandChildren = [];
        let lasttime = 0;
        //Animations pode ser vazio

        for (let i = 0; i < children.length; i++) {

            //Se a animacao for invalida, nao estouro. Sinalizo erro e prossigo para a proxima tentative de animacao.

            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            let animationId = this.reader.getString(children[i], 'id');

            if (animationId == null)
                return "no ID defined for the animation";
            //Test if the animation is unique
            if (this.animations[animationId] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationIdeId + ")";

            grandChildren = children[i].children;

            let animation = new MyAnimation(this.scene);

            /*Key frame nao pode ser vazio*/
            //Iterar as keyframes//
            if (grandChildren.length > 0) {
                let keyframes_array_aux = [];
                let value_first_keyframe = -1;

                /*Crio aqui na pos 0 a matriz identidade para representar a keyframe 0*/
                //Testar se o primeiro input e no instante 0 e se ha necessidade de "injetar a origem"
                value_first_keyframe = this.reader.getFloat(grandChildren[0], 'instant');

                if (value_first_keyframe > 0) {
                    let keyframe_auxiliar_first = new MyKeyFrameAnimation(this.scene, 0);
                    keyframe_auxiliar_first.translate_vec = [0, 0, 0];
                    keyframe_auxiliar_first.rotate_vec = [0, 0, 0];
                    keyframe_auxiliar_first.scale_vec = [1, 1, 1];
                    keyframes_array_aux.push(keyframe_auxiliar_first);
                }

                for (let j = 0; j < grandChildren.length; j++) {


                    if (grandChildren[j].nodeName != "keyframe") {
                        this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                        continue;
                    }
                    let keyframe_instant = this.reader.getFloat(grandChildren[j], 'instant');

                    if (j > 0) {
                        if (keyframe_instant < lasttime) {
                            this.onXMLMinorError("Keyframe in incorrect order. Not inserted the keyframe:" + keyframe_instant)
                            continue
                        }
                    }

                    lasttime = keyframe_instant

                    let keyframe_auxiliar_var = new MyKeyFrameAnimation(this.scene, keyframe_instant);

                    if (keyframe_instant == null) {
                        return "keyframe_instant in" + animationId + "must be valid";
                    }

                    keyframe_auxiliar_var.instant = keyframe_instant;

                    //O grandchildren sao as transformacoes
                    grandgrandChildren = grandChildren[j].children;

                    //Ver se as 3 transformacoes estao instanciadas e pela ordem indicada

                    for (let transf_pos = 0; transf_pos < 3; transf_pos++) {

                        switch (transf_pos) {

                            case TRANSLATION_POS:
                                {

                                    if (grandgrandChildren[transf_pos].nodeName != "translate") {
                                        this.onXMLMinorError("Keyframe" + animationId + keyframe_instant);
                                        return ("Animation order not respected");
                                    } else {
                                        let translate_array = this.parseCoordinates3D(grandgrandChildren[transf_pos], "Translate keyfram" + animationId);

                                        if (!(Array.isArray(translate_array))) {
                                            return "Translate Array invalid";
                                        }

                                        keyframe_auxiliar_var.translate_vec = translate_array;
                                    }
                                    break;
                                }

                            case ROTATION_POS:
                                {

                                    if (grandgrandChildren[transf_pos].nodeName != "rotate") {

                                        this.onXMLMinorError("Keyframe" + animationId + keyframe_instant);
                                        return ("Animation order not respected");
                                    } else {

                                        let angle_x = this.reader.getFloat(grandgrandChildren[transf_pos], 'angle_x');

                                        if (angle_x == null) {
                                            this.onXMLMinorError("Keyframe" + animationId + "invalid x_rotation");
                                            break;
                                        }

                                        keyframe_auxiliar_var.rotate_vec.push(angle_x);

                                        let angle_y = this.reader.getFloat(grandgrandChildren[transf_pos], 'angle_y');

                                        if (angle_y == null) {
                                            this.onXMLMinorError("Keyframe" + animationId + "invalid x_rotation");
                                            break;
                                        }

                                        keyframe_auxiliar_var.rotate_vec.push(angle_y);

                                        let angle_z = this.reader.getFloat(grandgrandChildren[transf_pos], 'angle_z');

                                        if (angle_z == null) {
                                            this.onXMLMinorError("Keyframe" + animationId + "invalid x_rotation");
                                            break;
                                        }

                                        keyframe_auxiliar_var.rotate_vec.push(angle_z);

                                    }
                                    break;
                                }
                            case SCALE_POS:
                                {

                                    if (grandgrandChildren[transf_pos].nodeName != "scale") {

                                        this.onXMLMinorError("Keyframe" + animationId + keyframe_instant);
                                        return ("Animation order not respected");
                                    } else {

                                        let scale_array = this.parseCoordinates3D(grandgrandChildren[transf_pos], "Scale keyfram" + animationId);

                                        if (!Array.isArray(scale_array)) {
                                            return ("Invalid scale_array");
                                        }
                                        keyframe_auxiliar_var.scale_vec = scale_array;

                                    }
                                    break;
                                }
                        }
                    }
                    /*Introduce the keyframe(i) in the animations array*/
                    keyframes_array_aux.push(keyframe_auxiliar_var);
                }
                //faz a traducao de keyframes para segmentos na animacao
                animation.parse_keyframes(keyframes_array_aux);
                this.animations[animationId] = animation;
            } else {
                return "It must be at least a keyframe defined in the animation:" + animationId;
            }

        }

        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for the primitive";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'cylinder2' && grandChildren[0].nodeName != 'plane' && grandChildren[0].nodeName != 'patch' && grandChildren[0].nodeName != 'gameboard')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus, patch, plane or cylinder2)"
            }

            var new_primitive = new MyPrimitive(this, grandChildren[0]);

            if (new_primitive.error == true) {
                return new_primitive.args + " with id: " + primitiveId;
            }

            this.primitives[primitiveId] = new_primitive;

        }

        this.log("Parsed primitives");
        return null;
    }

    check_components_integrity() {

        for (var key in this.components) {
            if (this.components[key].definition_made == false) {
                return "component of id " + key + " is referenced inside another component but it is not defined in the list of components";
            }
        }
        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {

        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var componentID;
        var component_aux;


        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.

            if (this.components[componentID] != null) {
                if (this.components[componentID].definition_made == true) {
                    return "ID must be unique for each component (conflict: ID = " + componentID + ")";
                }
                component_aux = this.components[componentID];
            } else {
                this.components[componentID] = new MyComponent(componentID, false);
                component_aux = this.components[componentID];
            }

            grandChildren = children[i].children;

            if (grandChildren.length == 0) {
                return "Blocks Transformation, Materials, Texture, Children need to be declared for component of id " + componentID;
            }

            var block_transformation = false;
            var block_materials = false;
            var block_texture = false;
            var block_children = false;


            for (var j = 0; j < grandChildren.length; j++) {

                grandgrandChildren = grandChildren[j].children;


                //Processar o bloco de transformacoes em componets
                if (grandChildren[j].nodeName == "transformation") {

                    block_transformation = true;

                    if (grandgrandChildren.length == 0) {
                        component_aux.transformation = mat4.create();

                    } else {
                        //transformation ref
                        if (grandgrandChildren[0].nodeName == "transformationref") {

                            if (grandgrandChildren.length > 1) {
                                return "There can only one transformation ref or there is only one transformation ref but there are also explicit transformations  for components of id " + componentID;
                            }
                            var transformation_id = this.reader.getString(grandgrandChildren[0], 'id');

                            if (this.transformations[transformation_id] == null) {
                                return "ID in the transformations Block for a transformation ref for component of id " + componentID + "must be a valid reference";
                            }
                            component_aux.transformation = this.transformations[transformation_id];
                        }
                        // explicit declaration
                        else {
                            component_aux.transformation = this.parseTransformations_components(grandChildren[j], componentID);
                            if (component_aux.transformation == -1) {
                                return "Fix Errors";
                            }
                        }
                    }

                } else if (grandChildren[j].nodeName == "animationref") {

                    let animation_in_componet_id = this.reader.getString(grandChildren[j], 'id');

                    if (animation_in_componet_id == null) {
                        this.onXMLMinorError("Animation not added to component. ID not found");
                    }

                    //Se o id estiver definido
                    else {
                        //Testar se a animacao esta definida
                        if (this.animations[animation_in_componet_id] != null) {

                            component_aux.animation = this.animations[animation_in_componet_id];
                            this.idsComponentsAnimation.push(componentID);

                        } else {
                            this.onXMLMinorError("Animations not defined. Not added to the component");
                        }
                    }
                }

                //component_aux.materials fica com a lista de materiais do bloco
                else if (grandChildren[j].nodeName == "materials") {

                    component_aux.material_active = 0;
                    block_materials = true;

                    if (grandgrandChildren.length == 0)
                        return "At least one material must be defined for component of id " + componentID;

                    for (var k = 0; k < grandgrandChildren.length; k++) {

                        var material_id = this.reader.getString(grandgrandChildren[k], 'id');
                        if (material_id != "inherit" && material_id != "none") {
                            if (this.materials[material_id] == null) {
                                return "ID in the material Block for component of id " + componentID + " must be a valid reference";
                            }
                            component_aux.materials.push(this.materials[material_id]);
                        } else {
                            component_aux.materials.push(material_id);
                        }

                    }

                } else if (grandChildren[j].nodeName == "texture") {

                    block_texture = true;

                    var texture_id = this.reader.getString(grandChildren[j], 'id');
                    if (texture_id == "inherit") {
                        component_aux.texture.push(texture_id);

                    } else if (texture_id == "none") {
                        component_aux.texture.push(texture_id);
                    }


                    //Nao existe entao textures no array de texturas
                    else if (this.textures[texture_id] == null) {
                        return "ID in the texture Block for component of id " + componentID + " must be a valid reference";
                    }


                    //Se a textura estiver definida, entao. Associamos a textura ao bloco component
                    else if (this.textures[texture_id] != null) {
                        component_aux.texture.push(this.textures[texture_id]);

                        var length_s = this.reader.getString(grandChildren[j], 'length_s');
                        if (length_s == null) {
                            return "length_s is null or not defined correctly for texture block of component with id " + componentID;
                        }
                        var length_t = this.reader.getString(grandChildren[j], 'length_t');
                        if (length_t == null) {
                            return "length_t is null or not defined correctly for texture block of component with id " + componentID;
                        }
                        component_aux.texture.push(length_s);
                        component_aux.texture.push(length_t);
                    }

                    if (texture_id == "inherit" || texture_id == "none") {

                        if (this.reader.getString(grandChildren[j], 'length_s', false) != null) {
                            this.onXMLError("Nao podemos definir lenght_s quando a texture esta inherit ou none");
                        }

                        if (this.reader.getString(grandChildren[j], 'length_t', false) != null) {
                            this.onXMLError("Nao podemos definir lenght_t quando a texture esta inherit ou none");
                        }
                    }
                } else if (grandChildren[j].nodeName == "children") {

                    block_children = true;

                    if (grandgrandChildren.length == 0) {
                        return "At least one of the following tags must be defined <componetref> or <primitiveref>";
                    }
                    for (var k = 0; k < grandgrandChildren.length; k++) {

                        if (grandgrandChildren[k].nodeName == "componentref") {

                            var children_component_id = this.reader.getString(grandgrandChildren[k], 'id');

                            if (this.components[children_component_id] != null)
                                component_aux.children_component.push(this.components[children_component_id]);

                            else {
                                this.components[children_component_id] = new MyComponent(children_component_id, false);
                                component_aux.children_component.push(this.components[children_component_id]);
                            }
                        } else if (grandgrandChildren[k].nodeName == "primitiveref") {

                            var children_primitive_id = this.reader.getString(grandgrandChildren[k], 'id');

                            if (this.primitives[children_primitive_id] == null) {
                                return "ID in the children Block for component of id" + componentID + "must be a valid reference";
                            }
                            component_aux.children_primitives.push(this.primitives[children_primitive_id]);
                        } else
                            return "unknown tag " + grandgrandChildren[k].nodeName + " in children for component of id " + componentID;
                    }
                } else
                    return "Unknown block with name " + grandChildren[j].nodeName + " for component of id " + componentID;

            }

            // checking if any of the blocks is missing from component
            if (block_transformation == false)
                return "Block Transformation needs to be declared for component of id " + componentID;
            else if (block_materials == false)
                return "Block Materials needs to be declared for component of id " + componentID;
            else if (block_texture == false)
                return "Block Textures needs to be declared for component of id " + componentID;
            else if (block_children == false)
                return "Block Children needs to be declared for component of id " + componentID;

            component_aux.definition_made = true;
        }

        var returnedValue;
        if ((returnedValue = this.check_components_integrity()) != null) {
            return returnedValue;
        }

        // checking to see of root component is declared and has the correct tags or not
        if (this.components[this.idRoot] == null) {
            return "Error root component of id " + this.idRoot + " defined in scene block is not in the components block";
        }
        if (this.components[this.idRoot].materials[0] == "inherit") {
            return "Error in the root component of id= " + this.idRoot + " , material must not be inherit";
        }

    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates for a control Point Cannot use the  parseCoordinates3D function because 
     * the coordinates are in this format xx, yy, zz, instead of x, y, z
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3DControlPoint(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'xx');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'yy');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'zz');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);
        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r)) && r >= 0 && r <= 1)
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g)) && g >= 0 && g <= 1)
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b)) && b >= 0 && b <= 1)
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a)) && a >= 0 && a <= 1)
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        var root = this.components[this.idRoot];

        this.scene.pushMatrix();
        this.displaySceneRecursive(root, root.materials[0], root.texture[0], root.texture[1], root.texture[2]);
        this.scene.popMatrix();

    }

    /**
     * Fnctions that determines if a certain value is an  object or not
     * @param val the value we want to determine if it is a object or not
     */
    isObject(val) {
        if (val === null) { return false; }
        return ((typeof val === 'function') || (typeof val === 'object'));
    }

    /**
     * Fnctions that determines if a certain value is an  object or not
     * @param Node the current node
     * @param material_father the material of the father of the current node
     * @param texture_father the texture of the father  of the current node     
     * @param ls the length_s of the texture of the father
     * @param lt the length_t of the texture of the father
     */
    displaySceneRecursive(Node, material_father, texture_father, ls, lt) {

        var current_node = Node;

        // setting the texture of the father material to null , meaning no texture
        material_father.setTexture(null);

        // determining the material active for the current nove based on the number of materials the node has
        // and how many times the key m was pressed
        current_node.material_active = this.mPressed % current_node.materials.length;

        // Testing if the component have material with the property inherit, this is if the current node inherits
        // the texture of the father
        if (current_node.materials[current_node.material_active] == "inherit") {

            // setting the texture wrap of the materialfather to repeat repeat
            material_father.setTextureWrap('REPEAT', 'REPEAT');

            // Testing the property for the texture if inherit means it inherits the texture of the father 
            if (current_node.texture[0] == "inherit") {
                if (texture_father != "none") {
                    material_father.setTexture(texture_father);
                }
            }

            // if its not inherits and also not none then that means we are gonna apply the current nodes texture
            else if (current_node.texture[0] != "none") {
                material_father.setTexture(current_node.texture[0]);
            }

            // if the texture propert is none then when we apply the father material and because we set its texture
            // to null at the begginning we end up not applying any texture with it             
            material_father.apply();
        }

        // if the material propert isnt inherit then we are gonna apply the currents node material 
        // very similiar to the previous one just this little change
        else {

            // setting the texture wrap of the material to repeat repeat
            current_node.materials[current_node.material_active].setTextureWrap('REPEAT', 'REPEAT');

            // Testing the property for the texture if inherit means it inherits the texture of the father 
            if (current_node.texture[0] == "inherit") {
                if (texture_father != "none") {
                    current_node.materials[current_node.material_active].setTexture(texture_father);
                }
            }

            // if its not inherits and also not none then that means we are gonna apply the current nodes texture
            else if (current_node.texture[0] != "none") {
                current_node.materials[current_node.material_active].setTexture(current_node.texture[0]);
            }
            // it it is none then we do set texture to null
            else {
                current_node.materials[current_node.material_active].setTexture(null);
            }

            // applying the current node material
            current_node.materials[current_node.material_active].apply();
        }


        //  Applying the current node transformation
        this.scene.multMatrix(current_node.transformation);


        //  Applying the animation matrix in case the component has a animation
        if (current_node.animation != null) {
            current_node.animation.apply();
        }


        // Cycle to display the current nodes primitves
        for (let i = 0; i < current_node.children_primitives.length; i++) {
            let type = current_node.children_primitives[i].primitiveType;

            // if the primitive is of type plane patch and cylinder2 then we cant show normals, wecgf error not ours
            if (type != "patch" && type != "plane" && type != "cylinder2") {

                if (this.scene.displayNormals)
                    current_node.children_primitives[i].primitive.enableNormalViz();
                else
                    current_node.children_primitives[i].primitive.disableNormalViz();

                // updating the texcorrds of a primitive if lenght_s and lenght_t is defined and texture property is 
                // different than none
                if (current_node.texture[0] != "none") {
                    if (current_node.texture[0] == "inherit")
                        current_node.children_primitives[i].primitive.updatetexCoords(ls, lt);
                    else
                        current_node.children_primitives[i].primitive.updatetexCoords(current_node.texture[1], current_node.texture[2]);
                }
            }

            // display the primitive itself
            current_node.children_primitives[i].primitive.display();
        }


        // iterative cycle to iterate thorugh the components children that are components
        for (let i = 0; i < current_node.children_component.length; i++) {

            // pushing the current matrix
            this.scene.pushMatrix();

            // Different cases in which we have to pass diferent parameters to the children component

            // if the material is inherit we have to pass the father material to the children
            if (current_node.materials[current_node.material_active] == "inherit") {

                // if the texture is inherit then we pass to the children the father's texture
                if (current_node.texture[0] == "inherit")
                    this.displaySceneRecursive(current_node.children_component[i], material_father, texture_father, ls, lt);

                // if the texture is none then we pass to the children the current node's texture that will be defined with nothing
                else if (current_node.texture[0] == "none")
                    this.displaySceneRecursive(current_node.children_component[i], material_father, current_node.texture[0], 1, 1);

                // if the texture is not none and not inherit then we pass to the children the current node's texture    
                else
                    this.displaySceneRecursive(current_node.children_component[i], material_father, current_node.texture[0], current_node.texture[1], current_node.texture[2]);

            }
            // if the material is not inherit then we have to pass the current node's material to the children
            else {

                // if the texture is inherit then we pass to the children the father's texture
                if (current_node.texture[0] == "inherit")
                    this.displaySceneRecursive(current_node.children_component[i], current_node.materials[current_node.material_active], texture_father, ls, lt);

                // if the texture is none then we pass to the children the current node's texture that will be defined with nothing
                else if (current_node.texture[0] == "none")
                    this.displaySceneRecursive(current_node.children_component[i], current_node.materials[current_node.material_active], current_node.texture[0], 1, 1);

                // if the texture is not none and not inherit then we pass to the children the current node's texture   
                else
                    this.displaySceneRecursive(current_node.children_component[i], current_node.materials[current_node.material_active], current_node.texture[0], current_node.texture[1], current_node.texture[2]);
            }

            // pop of the current matrix
            this.scene.popMatrix();
        }
    }

}