/**
 * Class MyPiece
• Piece can hold several piece types
• Has pointer to holding tile (if a piece is placed on the gameboard/auxiliary board)
• Methods:
• get/set type
• Display the piece (render)
 */
class MyPiece extends CGFobject {
    constructor(orchestrator, color, tile, x, y) {
        super(orchestrator.scene);
        this.scene = orchestrator.scene;
        this.color = color;

        if (this.color == 1) {
            this.color = 'red';
        } else if (this.color == 2) {
            this.color = 'blue';
        } else if (this.color == 3) {
            this.color = 'yellow';
        }

        this.cylinder = new MyCylinder(this.scene, 6, 6, 0.15, 0.3, 0.3);
        this.sphere = new MySphere(this.scene, 0.3, 6, 6);
        this.tile = tile;
        this.animation = null;
        this.animation2 = null;

        this.red = new CGFappearance(this.scene);
        this.red.setShininess(150);
        this.red.setAmbient(1, 0, 0, 1);
        this.red.setDiffuse(1, 0, 0, 1);
        this.red.setSpecular(1, 0, 0, 1);

        this.darkred = new CGFappearance(this.scene);
        this.darkred.setShininess(100);
        this.darkred.setAmbient(0.5, 0, 0, 1);
        this.darkred.setDiffuse(0.5, 0, 0, 1);
        this.darkred.setSpecular(0.5, 0, 0, 1);

        this.blue = new CGFappearance(this.scene);
        this.blue.setShininess(150);
        this.blue.setAmbient(0.1, 0.1, 1, 1);
        this.blue.setDiffuse(0.1, 0.1, 1, );
        this.blue.setSpecular(0.1, 0.1, 1, 1);

        this.darkblue = new CGFappearance(this.scene);
        this.darkblue.setShininess(100);
        this.darkblue.setAmbient(0, 0, 0.5, 1);
        this.darkblue.setDiffuse(0, 0, 0.5, 1);
        this.darkblue.setSpecular(0, 0, 0.5, 1);

        this.yellow = new CGFappearance(this.scene);
        this.yellow.setShininess(150);
        this.yellow.setAmbient(1, 1, 0, 1);
        this.yellow.setDiffuse(1, 1, 0, 1);
        this.yellow.setSpecular(1, 1, 0, 1);
        this.x = x;
        this.y = y;


        this.darkyellow = new CGFappearance(this.scene);
        this.darkyellow.setShininess(100);
        this.darkyellow.setAmbient(0.5, 0.5, 0, 1);
        this.darkyellow.setDiffuse(0.5, 0.5, 0, 1);
        this.darkyellow.setSpecular(0.5, 0.5, 0, 1);


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

        if (this.color == 'red') {
            this.darkred.apply();
        } else if (this.color == 'blue') {
            this.darkblue.apply();
        } else
            this.darkyellow.apply();

        this.cylinder.display();

        this.scene.popMatrix();


    }


}