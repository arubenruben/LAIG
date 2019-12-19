/**
 * Class MyPiece
• Piece can hold several piece types
• Has pointer to holding tile (if a piece is placed on the gameboard/auxiliary board)
• Methods:
• get/set type
• Display the piece (render)
 */
class MyPiece extends CGFobject {
    constructor(scene, color, tile) {
        super(scene);
        this.scene = scene;
        this.color = color;
        this.cylinder = new MyCylinder(scene, 20, 20, 0.15, 0.3, 0.3);
        this.sphere = new MySphere(scene, 0.3, 20, 20);
        this.tile = tile;

        this.red = new CGFappearance(this.scene);
        this.red.setShininess(200);
        this.red.setAmbient(1, 0, 0, 1);
        this.red.setDiffuse(1, 0, 0, 1);
        this.red.setSpecular(1, 0, 0, 1);

        this.blue = new CGFappearance(this.scene);
        this.blue.setShininess(200);
        this.blue.setAmbient(0.1, 0.1, 1, 1);
        this.blue.setDiffuse(0.1, 0.1, 1, );
        this.blue.setSpecular(0.1, 0.1, 1, 1);

        this.yellow = new CGFappearance(this.scene);
        this.yellow.setShininess(200);
        this.yellow.setAmbient(1, 1, 0, 1);
        this.yellow.setDiffuse(1, 1, 0, 1);
        this.yellow.setSpecular(1, 1, 0, 1);
    }

    display() {

        if (this.color == 'red') {
            this.red.apply();
        } else if (this.color == 'blue') {
            this.blue.apply();
        } else
            this.yellow.apply();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.15);
        this.scene.scale(1, 1, 0.5);
        this.sphere.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(1, 1, 0);
        this.sphere.display();
        this.scene.popMatrix();

        this.cylinder.display();

        this.scene.popMatrix();


    }


}