/**
 * MyPrimitive
 * @constructor
 */
class MyPrimitive(){
	constructor(graph, primitiveType) {
		
		// Primitive id
		this.graph = graph;
        switch(primitiveType){
		case(primitiveType == 'rectangle'):{
            // x1
            var x1 = this.reader.getFloat(grandChildren[0], 'x1');
            if (!(x1 != null && !isNaN(x1)))
                return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

            // y1
            var y1 = this.reader.getFloat(grandChildren[0], 'y1');
            if (!(y1 != null && !isNaN(y1)))
                return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

            // x2
            var x2 = this.reader.getFloat(grandChildren[0], 'x2');
            if (!(x2 != null && !isNaN(x2) && x2 > x1))
                return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

            // y2
            var y2 = this.reader.getFloat(grandChildren[0], 'y2');
            if (!(y2 != null && !isNaN(y2) && y2 > y1))
                return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

            var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

            this.primitives[primitiveId] = rect;
        }
        else if(){


        }
    

}

