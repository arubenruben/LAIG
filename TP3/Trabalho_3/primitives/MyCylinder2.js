/**
* MyCylinder2 cylinder using NURBS, points towards the y axis , its base lays on the xz plane
* @constructor
* @param scene scene 
* @param slices the number of slices of cylinder
* @param the number of the stacks of a cylinder
* @param height height of the cylinder
* @param radiustop the radius on the top of the cylinder, may not be the same as the bottom one
* @param radiusbottom the radius on the bottom of the cylinder, may not be the same as the top one
*/
class MyCylinder2 extends CGFobject {
    constructor(scene, slices, stacks, height, radiustop, radiusbottom) {
        super(scene);
        this.scene = scene;
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.radiusbottom = radiusbottom;
        this.radiustop = radiustop;
        this.object = null;
        this.object2 = null;
        this.hTop = this.radiustop / (0.750);
        this.hBottom = this.radiusbottom / (0.750);

        this.initBuffers();
    }

    /**
     * Programs the control points based on the parameters passed on the constructor of this class and create the
     * nurbs based on that 
    * @function
    */
    initBuffers() {
        let controlPoints =
            //grau 1 em u e grau 1 em v
            [	// U = 0
                [ // V = 0..1;
                    [-this.radiusbottom, 0, 0.0, 1],
                    [-this.radiustop, this.height, 0.0, 1]

                ],
                // U = 1
                [ // V = 0..1
                    [-this.radiusbottom, 0, this.hBottom, 1],
                    [-this.radiustop, this.height, this.hTop, 1]
                ],
                // U = 2
                [
                    [this.radiusbottom, 0, this.hBottom, 1],
                    [this.radiustop, this.height, this.hTop, 1]
                ],
                // U = 3
                [ // V = 0..1							 
                    [this.radiusbottom, 0, 0.0, 1],
                    [this.radiustop, this.height, 0.0, 1]
                ]
            ];

        let controlPoints2 =
            //grau 1 em u e grau 1 em v
            [	// U = 0
                [ // V = 0..1;
                    [-this.radiustop, this.height, 0.0, 1],
                    [-this.radiusbottom, 0, 0.0, 1],

                ],
                // U = 1
                [ // V = 0..1
                    [-this.radiustop, this.height, -this.hTop, 1],
                    [-this.radiusbottom, 0, -this.hBottom, 1],
                ],
                // U = 2
                [
                    [this.radiustop, this.height, -this.hTop, 1],
                    [this.radiusbottom, 0, -this.hBottom, 1],
                ],
                // U = 3
                [ // V = 0..1							 
                    [this.radiustop, this.height, 0.0, 1],
                    [this.radiusbottom, 0, 0.0, 1],
                ]
            ];


        let surface = new CGFnurbsSurface(3, 1, controlPoints);
        let surface2 = new CGFnurbsSurface(3, 1, controlPoints2);
        this.object = new CGFnurbsObject(this.scene, this.slices, this.stacks, surface);
        this.object2 = new CGFnurbsObject(this.scene, this.slices, this.stacks, surface2);
    }

    /**
    * Used to display the two parts of the cylinder using nurbs, the front one and the back one
    * @function
    */
    display() {
        this.object.display();
        this.object2.display();
    }


}
