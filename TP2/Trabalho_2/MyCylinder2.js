/**
* MyCylinder2
* @constructor
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
        this.object=null;
        this.object2=null;
        this.hTop = this.radiustop/(0.750);
        this.hBottom = this.radiusbottom/(0.750);

        this.initBuffers();
    }
    
    initBuffers(){
        let controlPoints=
        //grau 1 em u e grau 1 em v
        [	// U = 0
            [ // V = 0..1;
                [-this.radiusbottom,  0, 0.0, 1 ],
                [-this.radiustop, this.height, 0.0, 1 ]
                
            ],
            // U = 1
            [ // V = 0..1
                [-this.radiusbottom,  0, this.hBottom, 1 ],						 
                [-this.radiustop, this.height, this.hTop, 1 ]
            ],
            // U = 2
            [
                [this.radiusbottom,  0, this.hBottom, 1 ],						 
                [this.radiustop, this.height, this.hTop, 1 ]
            ],
            // U = 3
            [ // V = 0..1							 
                [this.radiusbottom,  0, 0.0, 1 ],
                [this.radiustop, this.height, 0.0, 1 ]
            ]
        ];

        let controlPoints2=
        //grau 1 em u e grau 1 em v
        [	// U = 0
            [ // V = 0..1;
                [-this.radiustop, this.height, 0.0, 1 ],
                [-this.radiusbottom,  0, 0.0, 1 ],
                
            ],
            // U = 1
            [ // V = 0..1
                [-this.radiustop, this.height, -this.hTop, 1 ],
                [-this.radiusbottom,  0, -this.hBottom, 1 ],						 
            ],
            // U = 2
            [
                [this.radiustop, this.height, -this.hTop, 1 ],
                [this.radiusbottom,  0, -this.hBottom, 1 ],						 
            ],
            // U = 3
            [ // V = 0..1							 
                [this.radiustop, this.height, 0.0, 1 ],
                [this.radiusbottom,  0, 0.0, 1 ],
            ]
        ];

        
        let surface= new CGFnurbsSurface(3,1,controlPoints);
        let surface2= new CGFnurbsSurface(3,1,controlPoints2);
        this.object= new CGFnurbsObject(this.scene,this.slices,this.stacks,surface);
        this.object2= new CGFnurbsObject(this.scene,this.slices,this.stacks,surface2);
    }
    display(){
        this.object.display();
        this.object2.display();
    }


}
