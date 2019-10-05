/**
 * MyComponent
 * @constructor
 */
class MyComponent {
	constructor(id) {

		this.loaded = false;
		
		// component id
		this.id = id;
		
		// array to hold either the id of transformations refered or to hold information about the trasnformation
		this.transformations = [];

		// array to hold the id of the materials used, if id == "inherit" then the material would be that of the
		// father.
		this.materials = [];

		// variable to hold the id of the texture used, if id == "inherit" then the texture would be that of the
		// father. if id == "none" no texture is applicable
		// this.texture[0] = id of the texture;
		// this.texture[1] = lenght_s;
		// this.texture[2] = lenght_t;
		this.texture = [];
		
		// array to hold children that are component
		this.children_component = [];

		// array to hold children that are primitives
		this.children_primitives = []
	}
}

