var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

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

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

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
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

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
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
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
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");
        
        //Assuming axis length is one
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

        if (view_root == null) {
            return "Default view is not defined";
        }

        var children = viewsNode.children; //Tem de existir um vista ortogonal ou em prespetiva

        if(children.length == 0)
            return "At least one View must be defined, either perspective or orthogonal";
        

        this.Views = [];

        this.idview = view_root;

        var numViews = 0;

        var grandChildren = [];
        var nodeNames = [];

        var perspective_set = false;
        var ortho_set = false;

        for (var i = 0; i < children.length; i++) {

            // Storing camera information
            var global = [];
            var attributeNames = [];

            //Check type of light

            if (children[i].nodeName == "perspective" && perspective_set == false) {

                //preeche os cabecalhos que iremos encontrar para ajudar no parsing

                attributeNames.push(...["from", "to"]);
                //Nao sei que nome meter nestes dois de baixo
                //Ja sei, nas cores os atributos podem ser de dois tipos, posicoes e cores, e para automizar o processamento
                perspective_set = true;

            } else if (children[i].nodeName == "ortho" && ortho_set == false) {

                attributeNames.push(...["from", "to", "up"]);
                //Nao sei que nome meter nestes dois de baixo
                ortho_set = true;


            }

            else if ((children[i].nodeName == "perspective" && perspective_set == true) || children[i].nodeName == "ortho" && ortho_set == true) {
                this.onXMLError("Nao era suposto existirem duas tags do mesmo tipo (perspetive ou ortho) na vista");
            }
            else {
                //Nao e ortho nem perspective
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;

            }

            // Get id of the current view.
            var ViewId = this.reader.getString(children[i], 'id');
            if (ViewId == null)
                return "no ID defined for View";

            // Checks for repeated IDs.
            if (this.Views[ViewId] != null)
                return "ID must be unique for each View (conflict: ID = " + ViewId + ")";

            global.push(children[i].nodeName);
            global.push(ViewId);

            //Falta processar os near/fars, etc...
            var array_view_def = [];

            var aux_ret;

            aux_ret = this.reader.getFloat(children[i], 'near');
            if (aux_ret == null) {
                return "Near attribute not defined";
            } else {
                array_view_def.push(aux_ret);
            }

            aux_ret = this.reader.getFloat(children[i], 'far');
            if (aux_ret == null) {
                return "far attribute not defined";
            } else {
                array_view_def.push(aux_ret);
            }

            if (children[i].nodeName == "perspective") {

                aux_ret = this.reader.getFloat(children[i], 'angle');
                if (aux_ret == null) {
                    return "angle attribute not defined";
                } else {
                    array_view_def.push(aux_ret);
                }

            } else if (children[i].nodeName == "ortho") {

                aux_ret = this.reader.getFloat(children[i], 'left');
                if (aux_ret == null) {
                    return "left attribute not defined";
                } else {
                    array_view_def.push(aux_ret);
                }

                aux_ret = this.reader.getFloat(children[i], 'right');
                if (aux_ret == null) {
                    return "right attribute not defined";
                } else {
                    array_view_def.push(aux_ret);
                }

                aux_ret = this.reader.getFloat(children[i], 'top');
                if (aux_ret == null) {
                    return "top attribute not defined";
                } else {
                    array_view_def.push(aux_ret);
                }

                aux_ret = this.reader.getFloat(children[i], 'bottom');
                if (aux_ret == null) {
                    return "bottom attribute not defined";
                } else {
                    array_view_def.push(aux_ret);
                }

            }
            global.push(...array_view_def);

            grandChildren = children[i].children;
            // Specifications for the current view.

            nodeNames = [];
            //Array dos filhos

            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {

                    var aux = this.parseCoordinates3D(grandChildren[attributeIndex], "View position" + ViewId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "View " + attributeNames[i] + " undefined for ID = " + ViewId;
            }

            this.Views[ViewId] = global;
           

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

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        if (children.length == 0) {
            return "Error: must have at least one light";
        }

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

           // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular", "attenuation"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            // SUSPEITO
            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeNames[j] == "location")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    
                    else if (attributeNames[j] == "attenuation") {
                        var aux = [];

                        var decomp_atten = this.reader.getFloat(grandChildren[j], 'constant');
                        if (aux > 1 || aux < 0) {
                            return "Error in " + attributeNames[j];
                        }
                        aux.push(decomp_atten);
                        decomp_atten = this.reader.getFloat(grandChildren[j], 'linear');
                        if (aux > 1 || aux < 0) {
                            return "Error in " + attributeNames[j];
                        }
                        aux.push(decomp_atten);
                        decomp_atten = this.reader.getFloat(grandChildren[j], 'quadratic');
                        if (aux > 1 || aux < 0) {
                            return "Error in " + attributeNames[j];
                        }
                        aux.push(decomp_atten);


                    }
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[j] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

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

        for(var i = 0; i < children.length; i++){
            var textureID = this.reader.getString(children[i], 'id');
            var filepath = this.reader.getString(children[i], 'file');


            var new_texture = new CGFtexture(this.scene, filepath);

            this.textures[textureID] = new_texture;
        }
       
        //For each texture in textures block, check ID and file URL
        //this.onXMLMinorError("To do: Parse textures.");
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
        var one_material_defined = false;

        if(children.length == 0){
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
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";
            
            var shininess = this.reader.getString(children[i], 'shininess');
            if(!(shininess != null && !isNaN(shininess)))
                return "Attribute shininess is either missing or wrong for material of id: " + materialID;

            grandChildren = children[i].children;

            var nodeNames = [];

            for (var j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);
    
            var emissionIndex = nodeNames.indexOf("emission");
            if(emissionIndex == null){
                return "Tag emission for material of id " + materialID; 
            }

            var ambientIndex = nodeNames.indexOf("ambient");
            if(ambientIndex == null){
                return "Tag ambient for material of id " + materialID;
            }

            var diffuseIndex = nodeNames.indexOf("diffuse");
            if(diffuseIndex == null){
                return "Tag diffuse for material of id " + materialID;
            }
            
            var specularIndex = nodeNames.indexOf("specular");
            if(specularIndex == null){
                return "Tag specular for material of id " + materialID;
            }

            if(nodeNames.length > 4){
                this.onXMLMinorError("There are other tags besides emission, ambient, diffuse, specular for material of id: " + materialID);
            }
            
            emission = this.parseColor(grandChildren[emissionIndex], "emission error in material of id " + materialID);
            if(!Array.isArray(emission)){
                return emission;
            }
            
            ambient =  this.parseColor(grandChildren[ambientIndex], "ambient error in material of id " + materialID);
            if(!Array.isArray(ambient)){
                return ambient;
            }
            
            diffuse =  this.parseColor(grandChildren[diffuseIndex], "diffuse error in material of id " + materialID);
            if(!Array.isArray(diffuse)){
                return diffuse;
            }
            
            specular  =  this.parseColor(grandChildren[specularIndex], "specular error in material of id " + materialID);
            if(!Array.isArray(specular)){
                return specular;
            }
    
            var new_material = new CGFappearance(this.scene);
            new_material.setShininess(shininess);
            new_material.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            new_material.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            new_material.setSpecular(specular[0], specular[1], specular[2], specular[3]);
            new_material.setEmission(emission[0], emission[1], emission[2], emission[3]);
            this.materials[materialID] = new_material;
            one_material_defined = true;
        
        }
        
        if(one_material_defined == false){
            return "At least one material must be defined";
        }

        this.log("Parsed materials");
        return null;
    }

    parseTransformations_components(transformationsNode, transformation = [], id) {
        
        var children = transformationsNode.children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < children.length; j++) {
                switch (children[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(children[j], "translate transformation for component of " + id);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':

                        var coordinates= this.parseCoordinates3D(children[j],"Scale tranformation for component of " + id);

                        if (!Array.isArray(coordinates))
                            return coordinates;
                    
                        transfMatrix=mat4.scale(transfMatrix,transfMatrix,coordinates);
                    
                        break;
                    case 'rotate':
                        // angle
                        //Os angulos e preciso converter para radianos
                        var x=0,y=0,z=0;
                        var aux_array_axis=[];
                        
                        var axis= this.reader.getString(children[j],'axis');
                        
                        if(axis==null){
                            return "Erro a encontrar a tag axis na rotacao";
                        }

                        var angle=this.reader.getFloat(children[j],'angle');
                        if(angle==null){
                            return "Erro a encontrar a tag angle na rotacao";
                        }

                        if(axis=='x'){
                            x=1;
                        }else if(axis=='y'){
                            y=1;
                        }else if(axis=='z'){
                            z=1;
                        }else{
                            return "Axis invalido na rotacao";
                        }
                        
                        aux_array_axis.push(...[x,y,z]);

                        if (!Array.isArray(aux_array_axis))
                            return aux_array_axis;
                        
                        transfMatrix=mat4.rotate(transfMatrix,transfMatrix,angle*DEGREE_TO_RAD,aux_array_axis);
                        
                    
                        break;
                }
            }
            transformation.push(transfMatrix);

        this.log("Parsed transformations for component of id "  + id);
            return null;
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

        if(children.length==0){
            return "Nao pode existir 0 transformacoes";
        }
        
        for (var i = 0; i < children.length; i++) {

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

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':

                        var coordinates= this.parseCoordinates3D(grandChildren[j],"Scale tranformation for ID"+transformationID);

                        if (!Array.isArray(coordinates))
                            return coordinates;
                    
                        transfMatrix=mat4.scale(transfMatrix,transfMatrix,coordinates);
                    
                        break;
                    case 'rotate':
                        // angle
                        //Os angulos e preciso converter para radianos
                        var x=0,y=0,z=0;
                        var aux_array_axis=[];
                        
                        var axis= this.reader.getString(grandChildren[j],'axis');
                        
                        if(axis==null){
                            return "Erro a encontrar a tag axis na rotacao";
                        }

                        var angle=this.reader.getFloat(grandChildren[j],'angle');
                        if(angle==null){
                            return "Erro a encontrar a tag angle na rotacao";
                        }

                        if(axis=='x'){
                            x=1;
                        }else if(axis=='y'){
                            y=1;
                        }else if(axis=='z'){
                            z=1;
                        }else{
                            return "Axis invalido na rotacao";
                        }
                        
                        aux_array_axis.push(...[x,y,z]);

                        if (!Array.isArray(aux_array_axis))
                            return aux_array_axis;
                        
                        transfMatrix=mat4.rotate(transfMatrix,transfMatrix,angle*DEGREE_TO_RAD,aux_array_axis);
                        
                    
                        break;
                }
            }
            transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
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
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }
            
            var new_primitive = new MyPrimitive(this, grandChildren[0]);
            
            if(new_primitive.error == true){
                return new_primitive.args + " with id: " + primitiveId;
            }

            this.primitives[primitiveId] = new_primitive;
        
        }

        this.log("Parsed primitives");
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
        var nodeNames = [];
        var componentID;
        
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
            if (this.components[componentID] != null)
            return "ID must be unique for each component (conflict: ID = " + componentID + ")";
            
            
            var component_aux = new MyComponent(componentID);
            grandChildren = children[i].children;
            
            
            if(grandChildren.length == 0){
                return "Blocks Transformation, Materials, Texture, Children need to be declared";
            }

            var block_transformation = false;
            var block_materials = false;
            var block_texture= false;
            var block_children = false;

            
            for (var j = 0; j < grandChildren.length; j++) {
                
                
                grandgrandChildren = grandChildren[j].children;
                
                if(grandChildren[j].nodeName == "transformation"){

                    block_transformation = true;

                    if(grandgrandChildren.length == 0){
                        return "At least one reference to a transformation or a explicit transformation must be declared";
                    }

                    for (var k = 0; k < grandgrandChildren.length; k++){

                        
                        if(grandgrandChildren[0].nodeName == "transformationref" && j==0){
                            component_aux.transformations_ref = true;
                        }
                    
                        if(component_aux.transformations_ref == true){
                            var transformation_id = this.reader.getString(grandgrandChildren[k],'id');
                            if(this.transformations[transformation_id]  == null){
                                return "ID in the transformations Block for component of id " + componentID + "must be a valid reference";
                            }
                            component_aux.transformations.push(this.transformations[transformation_id]);
                        }
                        else{
                            this.parseTransformations_components(grandChildren[j], component_aux.transformations,  componentID);
                        }
                    }
                }
            
                else if(grandChildren[j].nodeName == "materials"){

                    block_materials = true;
                    
                    if(grandgrandChildren.length == 0)
                        return "At least one material must be defined";
                    
                    for (var k = 0; k < grandgrandChildren.length; k++){
                        
                        var material_id = this.reader.getString(grandgrandChildren[k], 'id'); 
                        if(this.materials[material_id]  == null){
                            return "ID in the material Block for component of id" + componentID + "must be a valid reference";
                        }
                        component_aux.materials.push(this.materials[material_id]);  
                        
                    }
                   
                }
                else if(grandChildren[j].nodeName == "texture"){

                    block_texture = true;
                    var texture_id = this.reader.getString(grandChildren[j], 'id'); 
                    if(this.textures[texture_id]  == null  && texture_id!="inherit"){
                        return "ID in the material Block for component of id" + componentID + "must be a valid reference";
                    }
                    else if(texture_id == "inherit"){
                        component_aux.texture.push(texture_id);

                    }
                    else if(texture_id == "none"){
                        component_aux.texture.push(texture_id);

                    }
                    
                    var length_s = this.reader.getString(grandChildren[i], 'length_s'); 
                    var length_t = this.reader.getString(grandChildren[i], 'length_t'); 
                    
                    
                    component_aux.texture.push(this.textures[texture_id]);
                    component_aux.texture.push(length_s);
                    component_aux.texture.push(length_t);

                }
                else{
                    block_children = true;

                    if(grandgrandChildren.length == 0){
                        return "At least one of the following tags must be defined <componetref> or <primitiveref>";
                    }
                    for (var k = 0; k < grandgrandChildren.length; k++){
                
                        if(grandgrandChildren[k].nodeName == "componentref"){

                        var children_component_id = this.reader.getString(grandgrandChildren[k], 'id'); 
                        /*if(this.components[componentID] == null){
                            return "ID in the children Block for component of id" + componentID + "must be a valid reference";
                        }*/
                            component_aux.children_component.push(this.components[children_component_id]);
                        }
                        else{

                            var children_primitive_id = this.reader.getString(grandgrandChildren[k], 'id'); 
                            if(this.primitives[children_primitive_id]  == null){
                                return "ID in the children Block for component of id" + componentID + "must be a valid reference";
                            }
                            component_aux.children_primitives.push(this.primitives[children_primitive_id]);
                        }
                    }
                }
            }
            
            if(block_transformation == false){
                return "Block Transformation needs to be declared";
            }
            else if(block_materials == false){
                return "Block Materials needs to be declared";
            }
            else if(block_texture == false){
                return "Block Textures needs to be declared";
            }
            else if(block_children == false){
                return "Block Children needs to be declared";
            }

            this.components[componentID] = component_aux;
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

        this.scene.pushMatrix();
        this.displaySceneRecursive(this.components[this.idRoot], this.components[this.idRoot].materials[0], this.components[this.idRoot].texture[0]);
        this.scene.popMatrix();

       
    }

    displaySceneRecursive(Node, material_father, texture_father, ls, lt){

        var current_node = Node;
        
        if(current_node.materials[0] == "inherit"){
            material_father.apply()
        }
        else{
            current_node.materials[0].apply();
        }

        if(current_node.texture[0] == "inherit"){
            texture_father.bind();
        }
        else if(current_node.texture[0] == "none"){
            texture_father.unbind();
        }
        else{
            current_node.texture[0].bind();
        }
    
        this.scene.multMatrix(current_node.transformations[0]);
        
        for(let i = 0; i < current_node.children_primitives.length; i++){
            //current_node.children_primitives[i].primitive.enableNormalViz();
            current_node.children_primitives[i].primitive.display();
        }
        
       for(let i = 0 ; i < current_node.children_component.length; i++){
            this.scene.pushMatrix();
            if(current_node.texture[0] == "inherit"){
                this.displaySceneRecursive(current_node.children_component[i], current_node.materials[0], texture_father);
            }
            else{
                this.displaySceneRecursive(current_node.children_component[i], current_node.materials[0], current_node.texture[0]);
            }

            this.scene.popMatrix();
        }
    }

}
