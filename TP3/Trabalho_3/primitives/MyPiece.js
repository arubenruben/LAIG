/**
 * Class MyPiece
• Piece can hold several piece types
• Has pointer to holding tile (if a piece is placed on the gameboard/auxiliary board)
• Methods:
• get/set type
• Display the piece (render)
 */
class MyPiece extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.cylinder = new MyCylinder(scene, 19, 10, 1, 0.5, 0.5);
        this.sphere = new MySphere(scene, 0.2, 10, 10);


    }

    display() {
        // this.scene.pushMatrix();

        // this.scene.translate(3.5, 0, 3.5);
        // this.scene.translate(0.5, 0, 0.5);
        // this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        this.sphere.display();
        this.cylinder.display();

        // this.red.apply();

        // this.scene.popMatrix();
        // this.scene.pushMatrix();
    }


}