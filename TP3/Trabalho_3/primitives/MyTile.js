/**
 * Class MyTile
• Unitary element that creates the gameboard and auxiliary board
spaces.
• Class MyTile
• Has pointer to gameboard and pointer to piece (if a piece occupies
tile)
• Methods:
• Set/unset piece on tile
• Get piece using tile
• Display the tile (render)
 */

class MyTile extends CGFobject {
    constructor(scene,x,z, new_width, new_length,height) {
        super(scene);
        this.scene = scene;
        this.areaBox;
        this.scale_x=0.5/new_width;
        this.scale_z=(Math.cos(Math.PI/6) *0.5)/new_length;
        this.height=height
        
        this.sphere = new MySphere(scene, 0.5, 6, 6);
        this.torus = new MyTorus(scene, 0.025, 0.475, 6, 6);

        this.white = new CGFappearance(this.scene);
        this.white.setShininess(200);
        this.white.setAmbient(1, 1, 1, 1);
        this.white.setDiffuse(1, 1, 1, 1);
        this.white.setSpecular(1, 1, 1, 1);

        this.black = new CGFappearance(this.scene);
        this.black.setShininess(200);
        this.black.setAmbient(0, 0, 0, 1);
        this.black.setDiffuse(0, 0, 0, 1);
        this.black.setSpecular(0, 0, 0, 1);
        this.x=x;
        this.z=z;


    }


    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.height, this.z);
        this.scene.scale(this.scale_x, 0, this.scale_z);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.black.apply();
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.01);
        this.scene.scale(1, 1, 0);
        this.torus.display();
        this.scene.popMatrix();

        this.white.apply();
        this.scene.pushMatrix();
        this.scene.scale(1, 1, 0);
        this.sphere.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}