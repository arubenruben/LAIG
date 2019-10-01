/**
 * MyPrimitive
 * @constructor
 */
class MyPrimitive{
	constructor(graph, primitive_element){
	
        this.graph = graph;
        this.primitiveType = primitive_element.nodeName;
        this.primitive;

        var args = [];

        
        
        switch(this.primitiveType){
            
            case "rectangle":
                args = this.parse_rectangle_attributes(primitive_element , graph);
                this.primitive = new MyRectangle(this.graph.scene,0, args[0], args[1], args[2], args[3]);
            break;
            
            case "triangle":
                args = this.parse_triangle_attributes(primitive_element);
                this.primitive = new MyTriangle(this.graph.scene, args[0], args[1], args[2]);
            break;
            
            case "cylinder":
                args = this.parse_cylinder_attributes(primitive_element);
                this.primitive = new MyCilinder(this.graph.scene, args[0], args[1], args[2], args[3], args[4]);            
            break;
            
            case "sphere":
                args = this.parse_sphere_attributes(primitive_element);
                this.primitive = new MySphere(this.graph.scene, args[0], args[1], args[2]); 
            break;
            
            case "torus":
                args = this.parse_torus_attributes(primitive_element);
                this.primitive = new MyTorus(this.graph.scene, args[0], args[1], args[2], args[3]);
            break;

        }
        


    }


    parse_rectangle_attributes(primitive_element, graph){
        
        var args = [];
        this.graph = graph;
        var x1, y1, x2, y2;
        
        x1 = this.graph.reader.getFloat(primitive_element, 'x1');
        y1 = this.graph.reader.getFloat(primitive_element, 'y1');
        x2 = this.graph.reader.getFloat(primitive_element, 'x2');
        y2 = this.graph.reader.getFloat(primitive_element, 'y2'); 

        args.push(...[x1,y1,x2,y2]);

        return args;
    }

    parse_triangle_attributes(primitive_element){
        
        var args = [];
        var point1 = [];
        var point2 = [];
        var point3 = [];
        var x, y, z;
       
        x = this.graph.reader.getFloat(primitive_element, 'x1');
        y = this.graph.reader.getFloat(primitive_element, 'y1');
        z = this.graph.reader.getFloat(primitive_element, 'z1');
        point1.push(...[x,y,z]);

        x = this.graph.reader.getFloat(primitive_element, 'x2');
        y = this.graph.reader.getFloat(primitive_element, 'y2');
        z = this.graph.reader.getFloat(primitive_element, 'z2');
        point2.push(...[x,y,z]);
        
        x = this.graph.reader.getFloat(primitive_element, 'x3');
        y = this.graph.reader.getFloat(primitive_element, 'y3');
        z = this.graph.reader.getFloat(primitive_element, 'z3');
        point3.push(...[x,y,z]);

        args.push(point1);
        args.push(point2);
        args.push(point3);
    
        return args;
    
    }
        
    parse_cylinder_attributes(primitive_element){
        
        var args = [];
        var base, top, height, slices, stacks;

        base = this.graph.reader.getFloat(primitive_element, 'base');
        top = this.graph.reader.getFloat(primitive_element, 'top');
        height = this.graph.reader.getFloat(primitive_element, 'height');
        slices = this.graph.reader.getInt(primitive_element, 'slices');
        stacks = this.graph.reader.getInt(primitive_element, 'stacks');

        args.push(...[base, top, height, slices, stacks]);

        return args;
    }
    
    parse_sphere_attributes(primitive_element){
        
        var args = [];
        var radius, slices, stacks;

        radius = this.graph.reader.getFloat(primitive_element, 'radius');
        slices = this.graph.reader.getInt(primitive_element, 'slices');
        stacks = this.graph.reader.getInt(primitive_element, 'stacks');

        args.push(...[base, slices, stacks]);

        return args;
    }
    
    parse_torus_attributes(primitive_element){
        
        var args = [];
        var inner, outer, slices, loops;

        inner = this.graph.reader.getFloat(primitive_element, 'inner');
        outer = this.graph.reader.getFloat(primitive_element, 'outer');
        slices = this.graph.reader.getInt(primitive_element, 'slices');
        loops = this.graph.reader.getInt(primitive_element, 'loops');

        args.push(...[inner, outer, slices, loops]);

        return args;
    }
    

}

