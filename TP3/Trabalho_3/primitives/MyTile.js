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
    constructor(scene, x, z, new_width, new_length, height, index_i, index_j) {
        super(scene);
        this.scene = scene;
        this.index_i = index_i;
        this.index_j = index_j;
        this.scale_x = new_width / 1;
        this.scale_z = new_length / (Math.cos(Math.PI / 6) * 0.5 * 2);
        this.height = height;
        this.piece = null;

        this.sphere = new MySphere(scene, 0.5, 6, 6);
        this.torus = new MyTorus(scene, 0.025, 0.475, 6, 6);

        this.m = 0;

        this.white = new CGFappearance(this.scene);
        this.white.setShininess(200);
        this.white.setAmbient(1, 1, 1, 1);
        this.white.setDiffuse(1, 1, 1, 1);
        this.white.setSpecular(1, 1, 1, 1);

        this.green = new CGFappearance(this.scene);
        this.green.setShininess(200);
        this.green.setAmbient(0, 1, 0, 1);
        this.green.setDiffuse(0, 1, 0, 1);
        this.green.setSpecular(0, 1, 0, 1);

        this.black = new CGFappearance(this.scene);
        this.black.setAmbient(0, 0, 0, 1);
        this.black.setDiffuse(0, 0, 0, 1);
        this.black.setSpecular(0, 0, 0, 1);
        this.x = x;
        this.z = z;
        this.piece_selected = false;
        this.delta = 0;
        this.first_time = true;
        this.counter = 0;


    }

    update(t) {
        if (piece_selected) {
            if (this.first_time) {
                this.delta = t;
            } else {
                this.delta = t - this.delta;
                if (this.delta > 100) {
                    this.delta = 0;
                    this.first_time = true;
                    this.counter++;
                    this.m = (this.counter + 1) % 2;
                }
            }
        }
    }


    display() {

        this.scene.pushMatrix();
        this.scene.translate(this.x, 0, this.z);
        this.scene.pushMatrix();
        if (this.piece != null) {

            this.scene.translate(0, 0.01 * this.scale_x, 0);
            this.scene.scale(this.scale_x, this.scale_x / 2, -this.scale_z);
            this.piece.display();
        }

        this.scene.popMatrix();
        this.scene.scale(this.scale_x, 1, this.scale_z);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);

        this.scene.pushMatrix();
        this.black.apply();
        this.scene.translate(0, 0, -0.01 * this.scale_x);
        this.scene.scale(1, 1, 0);
        this.torus.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        if (this.m == 0) {
            this.white.apply();
        } else if (this.m == 1) {
            this.green.apply();
        }
        this.scene.scale(1, 1, 0);
        this.sphere.display();
        this.scene.popMatrix();


        this.scene.popMatrix();
    }
}