/**
 * MyPrimitive
 * @constructor
 */
class MyPrimitive{
	constructor(graph, primitive_element){
	
        this.graph = graph;
        this.primitiveType = primitive_element.nodeName;
        this.primitive;
        this.error = false;
        this.args = [];
        
        switch(this.primitiveType){
            
            case "rectangle":
                this.args = this.parse_rectangle_attributes(primitive_element , graph);
                if(!Array.isArray(this.args)){
                    this.args = this.args + " primitive of type " +  this.primitiveType;
                    this.error = true;
                }
                else            
                    this.primitive = new MyRectangle(this.graph.scene,0, this.args[0], this.args[1], this.args[2], this.args[3]);
            break;
            
            case "triangle":
                this.args = this.parse_triangle_attributes(primitive_element);
                if(!Array.isArray(this.args)){
                    this.args = this.args + " primitive of type " +  this.primitiveType;
                    this.error = true; 
                }
                else
                    this.primitive = new MyTriangle(this.graph.scene, this.args[0], this.args[1], this.args[2]);
            break;
            
            case "cylinder":
                this.args = this.parse_cylinder_attributes(primitive_element);
                if(!Array.isArray(this.args)){
                    this.args = this.args + " primitive of type " +  this.primitiveType;
                    this.error = true;
                }
                else
                    this.primitive = new MyCilinder(this.graph.scene, this.args[0], this.args[1], this.args[2], this.args[3], this.args[4]);            
            break;
            
            case "sphere":
                this.args = this.parse_sphere_attributes(primitive_element);
                if(!Array.isArray(this.args)){
                    this.args = this.args + " primitive of type " +  this.primitiveType;
                    this.error = true;
                }
                else
                    this.primitive = new MySphere(this.graph.scene, this.args[0], this.args[1], this.args[2]); 
            break;

            case "semisphere":
                this.args = this.parse_sphere_attributes(primitive_element);
                if(!Array.isArray(this.args)){
                    this.args = this.args + " primitive of type " +  this.primitiveType;
                    this.error = true;
                }
                else
                    this.primitive = new MySemiSphere(this.graph.scene, this.args[0], this.args[1], this.args[2]); 
            break;
                        
            case "torus":
                this.args =this.parse_torus_attributes(primitive_element);
                if(!Array.isArray(this.args)){
                    this.args = this.args + " primitive of type " +  this.primitiveType; 
                    this.error = true;
                }
                else
                    this.primitive = new MyTorus(this.graph.scene, this.args[0], this.args[1], this.args[2], this.args[3]);
            break;

            default:
                this.onXMLMinorError("unknown tag <" + this.primitiveType + ">"); 
            break;
        }
    }

    parse_rectangle_attributes(primitive_element, graph){
        
        var args_aux = [];
        this.graph = graph;
        var x1, y1, x2, y2;
        
        x1 = this.graph.reader.getFloat(primitive_element, 'x1');
        if (!(x1 != null && !isNaN(x1))){
            return "No attribute x1 or incorrect value for it, ";
        }
        y1 = this.graph.reader.getFloat(primitive_element, 'y1');
        if (!(y1 != null && !isNaN(y1))){
            return "No attribute y1 or incorrect value for it, ";
        }
        x2 = this.graph.reader.getFloat(primitive_element, 'x2');
        if (!(x2 != null && !isNaN(x2))){
            return "No attribute x2 or incorrect value for it, ";
        }
            
        y2 = this.graph.reader.getFloat(primitive_element, 'y2'); 
        if (!(y2 != null && !isNaN(y2))){
            return "No attribute y2 or incorrect value for it, ";
        }

        args_aux.push(...[x1,y1,x2,y2]);

        return args_aux;
    }

    parse_triangle_attributes(primitive_element){
        
        var args_aux = [];
        var point1 = [];
        var point2 = [];
        var point3 = [];
        var x, y, z;
       
        x = this.graph.reader.getFloat(primitive_element, 'x1');
        if (!(x != null && !isNaN(x))){
            return "No attribute x or incorrect value for it for point 1, ";
        }
        
        y = this.graph.reader.getFloat(primitive_element, 'y1');
        if (!(y != null && !isNaN(y))){
            return "No attribute y or incorrect value for it for point 1, ";
        }

        z = this.graph.reader.getFloat(primitive_element, 'z1');
        if (!(z != null && !isNaN(z))){
            return "No attribute z or incorrect value for it for point 1, ";
        }

        point1.push(...[x,y,z]);

        x = this.graph.reader.getFloat(primitive_element, 'x2');
        if (!(x != null && !isNaN(x))){
            return "No attribute x or incorrect value for it for point 2, ";
        }
        
        y = this.graph.reader.getFloat(primitive_element, 'y2');
        if (!(y != null && !isNaN(y))){
            return "No attribute y or incorrect value for it for point 2, ";
        }
        
        z = this.graph.reader.getFloat(primitive_element, 'z2');
        if (!(z != null && !isNaN(z))){
            return "No attribute z or incorrect value for it for point 2, ";
        }
        
        point2.push(...[x,y,z]);
        
        x = this.graph.reader.getFloat(primitive_element, 'x3');
        if (!(x != null && !isNaN(x))){
            return "No attribute x or incorrect value for it for point 3, ";
        }
        
        y = this.graph.reader.getFloat(primitive_element, 'y3');
        if (!(y != null && !isNaN(y))){
            return "No attribute y or incorrect value for it for point 3, ";
        }
        
        z = this.graph.reader.getFloat(primitive_element, 'z3');
        if (!(z != null && !isNaN(z))){
            return "No attribute z or incorrect value for it for point 3, ";
        }
        
        point3.push(...[x,y,z]);

        args_aux.push(point1);
        args_aux.push(point2);
        args_aux.push(point3);
    
        return args_aux;
    
    }
        
    parse_cylinder_attributes(primitive_element){
        
        var args_aux = [];
        var base, top, height, slices, stacks;

        base = this.graph.reader.getFloat(primitive_element, 'base');
        if (!(base != null && !isNaN(base))){
            return "No attribute base or incorrect value for it, ";
        }
        
        top = this.graph.reader.getFloat(primitive_element, 'top');
        if (!(top != null && !isNaN(top))){
            return "No attribute top or incorrect value for it, ";
        }
        
        height = this.graph.reader.getFloat(primitive_element, 'height');
        if (!(height != null && !isNaN(height))){
            return "No attribute height or incorrect value for it, ";
        }
        
        slices = this.graph.reader.getFloat(primitive_element, 'slices');
        if (!(slices != null && !isNaN(slices))){
            return "No attribute slices or incorrect value for it, ";
        }
        
        stacks = this.graph.reader.getFloat(primitive_element, 'stacks');

        args_aux.push(...[slices, stacks, height, top, base]);

        return args_aux;
    }
    
    parse_sphere_attributes(primitive_element){
        
        var args_aux = [];
        var radius, slices, stacks;

        radius = this.graph.reader.getFloat(primitive_element, 'radius');
        if (!(radius != null && !isNaN(radius))){
            return "No attribute radius or incorrect value for it, ";
        }
        
        slices = this.graph.reader.getFloat(primitive_element, 'slices');
        if (!(slices != null && !isNaN(slices))){
            return "No attribute slices or incorrect value for it, ";
        }
        
        stacks = this.graph.reader.getFloat(primitive_element, 'stacks');
        if (!(stacks != null && !isNaN(stacks))){
            return "No attribute stacks or incorrect value for it, ";
        }

        args_aux.push(...[radius, slices, stacks]);

        return args_aux;
    }
    
    parse_torus_attributes(primitive_element){
        
        var args_aux = [];
        var inner, outer, slices, loops;

        inner = this.graph.reader.getFloat(primitive_element, 'inner');
        if (!(inner != null && !isNaN(inner))){
            return "No attribute inner or incorrect value for it, ";
        }

        outer = this.graph.reader.getFloat(primitive_element, 'outer');
        if (!(outer != null && !isNaN(outer))){
            return "No attribute outer or incorrect value for it, ";
        }

        slices = this.graph.reader.getFloat(primitive_element, 'slices');
        if (!(slices != null && !isNaN(slices))){
            return "No attribute slices or incorrect value for it, ";
        }
        
        loops = this.graph.reader.getFloat(primitive_element, 'loops');
        if (!(loops != null && !isNaN(loops))){
            return "No attribute loops or incorrect value for it, ";
        }

        args_aux.push(...[inner, outer, slices, loops]);

        return args_aux;
    }
}

