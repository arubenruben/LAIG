/**
 * MyPrimitive
 * @constructor
 * @param graph reference to MySceneGraph
 * @param primitive_element the type of the element to be created (cylinder, patch , traingle, ....)
 */
class MyPrimitive {
    constructor(graph, primitive_element) {

        // Reference to MyScenegraph
        this.graph = graph;

        // Var to hold the primitive type
        this.primitiveType = primitive_element.nodeName;

        // Variable to hold the primitive that is about ot be created
        this.primitive;

        // variable used to detect a error in the parsing of a certain arguments 
        this.error = false;

        // Array to hold the parsed parameters
        this.args = [];

        //  Array to hold the control points in case the primitive is one of the nurb primitives
        this.controlPoints = [];

        // switch for the various primitives that exist (Rectangle, triangle, cylinder, cylinder2, sphere...)
        switch (this.primitiveType) {

            case "rectangle":
                this.args = this.parse_rectangle_attributes(primitive_element, graph);
                if (!Array.isArray(this.args)) {
                    this.args = this.args + " primitive of type " + this.primitiveType;
                    this.error = true;
                } else
                    this.primitive = new MyRectangle(this.graph.scene, 0, this.args[0], this.args[1], this.args[2], this.args[3]);
                break;

            case "triangle":
                this.args = this.parse_triangle_attributes(primitive_element);
                if (!Array.isArray(this.args)) {
                    this.args = this.args + " primitive of type " + this.primitiveType;
                    this.error = true;
                } else
                    this.primitive = new MyTriangle(this.graph.scene, this.args[0], this.args[1], this.args[2]);
                break;

            case "cylinder":
                this.args = this.parse_cylinder_attributes(primitive_element);
                if (!Array.isArray(this.args)) {
                    this.args = this.args + " primitive of type " + this.primitiveType;
                    this.error = true;
                } else
                    this.primitive = new MyCylinder(this.graph.scene, this.args[0], this.args[1], this.args[2], this.args[3], this.args[4]);
                break;

            case "sphere":
                this.args = this.parse_sphere_attributes(primitive_element);
                if (!Array.isArray(this.args)) {
                    this.args = this.args + " primitive of type " + this.primitiveType;
                    this.error = true;
                } else
                    this.primitive = new MySphere(this.graph.scene, this.args[0], this.args[1], this.args[2]);
                break;

            case "semisphere":
                this.args = this.parse_sphere_attributes(primitive_element);
                if (!Array.isArray(this.args)) {
                    this.args = this.args + " primitive of type " + this.primitiveType;
                    this.error = true;
                } else
                    this.primitive = new MySemiSphere(this.graph.scene, this.args[0], this.args[1], this.args[2]);
                break;

            case "torus":
                this.args = this.parse_torus_attributes(primitive_element);
                if (!Array.isArray(this.args)) {
                    this.args = this.args + " primitive of type " + this.primitiveType;
                    this.error = true;
                } else
                    this.primitive = new MyTorus(this.graph.scene, this.args[0], this.args[1], this.args[2], this.args[3]);
                break;

            case "plane":
                this.args = this.parse_plane_attributes(primitive_element);
                if (!Array.isArray(this.args)) {
                    this.args = this.args + " primitive of type " + this.primitiveType;
                    this.error = true;
                } else
                    this.primitive = new MyPlane(this.graph.scene, this.args[0], this.args[1]);

                break;

            case "patch":
                this.args = this.parse_patch_attributes(primitive_element);
                this.controlPoints = this.parsePatchControlPoints(primitive_element);
                if (!Array.isArray(this.args)) {
                    this.args = this.args + " primitive of type " + this.primitiveType;
                    this.error = true;
                } else
                    this.primitive = new MyPatch(this.graph.scene, this.args[0], this.args[1], this.args[2], this.args[3], this.controlPoints);
                break;

            case "cylinder2":
                this.args = this.parse_cylinder_attributes(primitive_element);
                if (!Array.isArray(this.args)) {
                    this.args = this.args + " primitive of type " + this.primitiveType;
                    this.error = true;
                } else
                    this.primitive = new MyCylinder2(this.graph.scene, this.args[0], this.args[1], this.args[2], this.args[3], this.args[4]);
                break;
            case "gameboard":
                this.args = this.parse_gameboard_attributes(primitive_element);
                if (!Array.isArray(this.args)) {
                    this.args = this.args + " primitive of type " + this.primitiveType;
                    this.error = true;
                } else {
                    //this.graph.scene.gameOrchestrator.gameboard = new MyGameBoard(this.graph.scene.gameOrchestrator, this.args[0], this.args[1], this.args[2], this.args[3]);
                }
                break;
            default:
                this.onXMLMinorError("unknown tag <" + this.primitiveType + ">");
                break;
        }
    }

    // FUNCTIONS USED TO PARSE THE XML PRIMITIVE PARAMETERS

    parse_rectangle_attributes(primitive_element, graph) {

        let args_aux = [];
        this.graph = graph;
        let x1, y1, x2, y2;

        x1 = this.graph.reader.getFloat(primitive_element, 'x1');
        if (!(x1 != null && !isNaN(x1))) {
            return "No attribute x1 or incorrect value for it, ";
        }
        y1 = this.graph.reader.getFloat(primitive_element, 'y1');
        if (!(y1 != null && !isNaN(y1))) {
            return "No attribute y1 or incorrect value for it, ";
        }
        x2 = this.graph.reader.getFloat(primitive_element, 'x2');
        if (!(x2 != null && !isNaN(x2))) {
            return "No attribute x2 or incorrect value for it, ";
        }

        y2 = this.graph.reader.getFloat(primitive_element, 'y2');
        if (!(y2 != null && !isNaN(y2))) {
            return "No attribute y2 or incorrect value for it, ";
        }

        args_aux.push(...[x1, y1, x2, y2]);

        return args_aux;
    }

    parse_gameboard_attributes(primitive_element) {

        let args_aux = [];
        let x1, z1, x2, z2;

        x1 = this.graph.reader.getFloat(primitive_element, 'x1');
        if (!(x1 != null && !isNaN(x1))) {
            return "No attribute x1 or incorrect value for it, ";
        }
        z1 = this.graph.reader.getFloat(primitive_element, 'z1');
        if (!(z1 != null && !isNaN(z1))) {
            return "No attribute z1 or incorrect value for it, ";
        }
        x2 = this.graph.reader.getFloat(primitive_element, 'x2');
        if (!(x2 != null && !isNaN(x2))) {
            return "No attribute x2 or incorrect value for it, ";
        }

        z2 = this.graph.reader.getFloat(primitive_element, 'z2');
        if (!(z2 != null && !isNaN(z2))) {
            return "No attribute z2 or incorrect value for it, ";
        }

        args_aux.push(...[x1, z1, x2, z2]);

        return args_aux;
    }

    parse_triangle_attributes(primitive_element) {

        let args_aux = [];
        let point1 = [];
        let point2 = [];
        let point3 = [];
        let x, y, z;

        x = this.graph.reader.getFloat(primitive_element, 'x1');
        if (!(x != null && !isNaN(x))) {
            return "No attribute x or incorrect value for it for point 1, ";
        }

        y = this.graph.reader.getFloat(primitive_element, 'y1');
        if (!(y != null && !isNaN(y))) {
            return "No attribute y or incorrect value for it for point 1, ";
        }

        z = this.graph.reader.getFloat(primitive_element, 'z1');
        if (!(z != null && !isNaN(z))) {
            return "No attribute z or incorrect value for it for point 1, ";
        }

        point1.push(...[x, y, z]);

        x = this.graph.reader.getFloat(primitive_element, 'x2');
        if (!(x != null && !isNaN(x))) {
            return "No attribute x or incorrect value for it for point 2, ";
        }

        y = this.graph.reader.getFloat(primitive_element, 'y2');
        if (!(y != null && !isNaN(y))) {
            return "No attribute y or incorrect value for it for point 2, ";
        }

        z = this.graph.reader.getFloat(primitive_element, 'z2');
        if (!(z != null && !isNaN(z))) {
            return "No attribute z or incorrect value for it for point 2, ";
        }

        point2.push(...[x, y, z]);

        x = this.graph.reader.getFloat(primitive_element, 'x3');
        if (!(x != null && !isNaN(x))) {
            return "No attribute x or incorrect value for it for point 3, ";
        }

        y = this.graph.reader.getFloat(primitive_element, 'y3');
        if (!(y != null && !isNaN(y))) {
            return "No attribute y or incorrect value for it for point 3, ";
        }

        z = this.graph.reader.getFloat(primitive_element, 'z3');
        if (!(z != null && !isNaN(z))) {
            return "No attribute z or incorrect value for it for point 3, ";
        }

        point3.push(...[x, y, z]);

        args_aux.push(point1);
        args_aux.push(point2);
        args_aux.push(point3);

        return args_aux;

    }

    parse_cylinder_attributes(primitive_element) {

        let args_aux = [];
        let base, top, height, slices, stacks;

        base = this.graph.reader.getFloat(primitive_element, 'base');
        if (!(base != null && !isNaN(base))) {
            return "No attribute base or incorrect value for it, ";
        }

        top = this.graph.reader.getFloat(primitive_element, 'top');
        if (!(top != null && !isNaN(top))) {
            return "No attribute top or incorrect value for it, ";
        }

        height = this.graph.reader.getFloat(primitive_element, 'height');
        if (!(height != null && !isNaN(height))) {
            return "No attribute height or incorrect value for it, ";
        }

        slices = this.graph.reader.getFloat(primitive_element, 'slices');
        if (!(slices != null && !isNaN(slices))) {
            return "No attribute slices or incorrect value for it, ";
        }

        stacks = this.graph.reader.getFloat(primitive_element, 'stacks');

        args_aux.push(...[slices, stacks, height, top, base]);

        return args_aux;
    }

    parse_sphere_attributes(primitive_element) {

        let args_aux = [];
        let radius, slices, stacks;

        radius = this.graph.reader.getFloat(primitive_element, 'radius');
        if (!(radius != null && !isNaN(radius))) {
            return "No attribute radius or incorrect value for it, ";
        }

        slices = this.graph.reader.getFloat(primitive_element, 'slices');
        if (!(slices != null && !isNaN(slices))) {
            return "No attribute slices or incorrect value for it, ";
        }

        stacks = this.graph.reader.getFloat(primitive_element, 'stacks');
        if (!(stacks != null && !isNaN(stacks))) {
            return "No attribute stacks or incorrect value for it, ";
        }

        args_aux.push(...[radius, slices, stacks]);

        return args_aux;
    }

    parse_torus_attributes(primitive_element) {

        let args_aux = [];
        let inner, outer, slices, loops;

        inner = this.graph.reader.getFloat(primitive_element, 'inner');
        if (!(inner != null && !isNaN(inner))) {
            return "No attribute inner or incorrect value for it, ";
        }

        outer = this.graph.reader.getFloat(primitive_element, 'outer');
        if (!(outer != null && !isNaN(outer))) {
            return "No attribute outer or incorrect value for it, ";
        }

        slices = this.graph.reader.getFloat(primitive_element, 'slices');
        if (!(slices != null && !isNaN(slices))) {
            return "No attribute slices or incorrect value for it, ";
        }

        loops = this.graph.reader.getFloat(primitive_element, 'loops');
        if (!(loops != null && !isNaN(loops))) {
            return "No attribute loops or incorrect value for it, ";
        }

        args_aux.push(...[inner, outer, slices, loops]);

        return args_aux;
    }

    parse_patch_attributes(primitive_element) {
        let args_aux = [];
        let npartsU, npartsV, npointsU, npointsV;

        npointsU = this.graph.reader.getFloat(primitive_element, 'npointsU');
        if (!(npointsU != null && !isNaN(npointsU))) {
            return "No attribute npointsU or incorrect value for it, ";
        }

        npointsV = this.graph.reader.getFloat(primitive_element, 'npointsV');
        if (!(npointsV != null && !isNaN(npointsV))) {
            return "No attribute npointsV or incorrect value for it, ";
        }

        npartsU = this.graph.reader.getFloat(primitive_element, 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU))) {
            return "No attribute npartsU or incorrect value for it, ";
        }

        npartsV = this.graph.reader.getFloat(primitive_element, 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV))) {
            return "No attribute npartsV or incorrect value for it, ";
        }

        args_aux.push(...[npointsU, npointsV, npartsU, npartsV]);

        return args_aux;
    }

    parsePatchControlPoints(primitive_element) {
        let args_aux = [];
        let children = primitive_element.children;

        for (let i = 0; i < children.length; i++) {
            let point = [];
            point = this.graph.parseCoordinates3DControlPoint(children[i], 'Control point wrong');
            args_aux.push(point);
        }
        return args_aux;
    }
    parse_plane_attributes(primitive_element) {
        let args_aux = [];
        let npartsU, npartsV;

        npartsU = this.graph.reader.getFloat(primitive_element, 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU))) {
            return "No attribute npartsU or incorrect value for it, ";
        }

        npartsV = this.graph.reader.getFloat(primitive_element, 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV))) {
            return "No attribute npartsV or incorrect value for it, ";
        }
        args_aux.push(...[npartsU, npartsV]);

        return args_aux;
    }
}