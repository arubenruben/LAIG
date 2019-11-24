/**
 * MyComponent
 * @constructor
 * @param id id of the component
 * @param is_defined bool, represents if the element that was created was already passed on the xml or not
 */
class MyComponent {
	constructor(id, is_defined) {

		// variable used to tell if a component is already defined or not in the components block,´
		// at the end of the components block needs to checked if all components have this variable as true
		//	if not means some components refers it 
		this.definition_made = is_defined;

		// component id
		this.id = id;

		// variable to hold either the transformation refered or to hold the trasnformation 
		// if a transformation is refered to then this.transformation= this.materials[transformationref];
		this.transformation;


		// variable to hold the current active material of the component
		this.material_active;

		// array to hold the materials used and the ids in case the material, if id == "inherit" then the material would be that of the
		// father.
		// if the component has inherit material then this.material[position_of_that_material] == "inherit"
		this.materials = [];


		// variable to hold the id of the texture used, if id == "inherit" then the texture would be that of the
		// father. if id == "none" no texture is applicable
		// this.texture[0] = value of texture/object (this.textures[id])  or inherit or none
		// this.texture[1] = lenght_s;
		// this.texture[2] = lenght_t;
		this.texture = [];

		// array to hold children that are component
		this.children_component = [];

		// array to hold children that are primitives
		this.children_primitives = [];

		//animation varaible to hold the animation
		this.animation = null;

	}
}

