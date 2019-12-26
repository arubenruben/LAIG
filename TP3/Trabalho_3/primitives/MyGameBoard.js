'use strict'

/**
• Stores the set of tiles that composes the entire game board
• Class MyGameBoard
• Methods:
• Create a gameboard instance
• Add piece to a given tile
• Remove piece from a given tile
• Get piece on a given tile
• Get tile given a piece
• Get tile by board coordinate system (A..H;1..8 on chess or 0..7;0..7)
• Move piece (piece, starting tile, destination tile)
• Display the gameboard (render). Calls display of tiles and of pieces
 */
class MyGameBoard extends CGFobject {
    constructor(orchestrator, x1, z1, x2, z2, height) {

        if (orchestrator == null || x1 == null || z1 == null || x2 == null || z2 == null) {
            console.error('Parameters null on the board constructor')
        }
        super(orchestrator.scene);
        this.orchestrator = orchestrator;
        this.scene = this.orchestrator.scene;
        this.x1 = x1;
        this.z1 = z1;
        this.x2 = x2;
        this.z2 = z2;
        this.height = height;



        this.white = new CGFappearance(this.scene);
        this.white.setShininess(200);
        this.white.setAmbient(1, 1, 1, 1);
        this.white.setDiffuse(1, 1, 1, 1);
        this.white.setSpecular(1, 1, 1, 1);

        this.n_lines = 11;
        this.n_columns = 12;

        this.tiles_width = (x2 - x1) / 9;
        this.tiles_height = (z2 - z1) / 12
        this.boardset = false;

        let controlPoinsFromParser = [
            [x1, 0, z1],
            [x1, 0, z2],
            [x2, 0, z1],
            [x2, 0, z2],
        ]
        let controlPoinsFromParserSide = [
            [x1, 0, height],
            [x1, 0, 0],
            [x2, 0, height],
            [x2, 0, 0],
        ]
        this.mainGeometry = new MyPatch(this.scene, 2, 2, 15, 15, controlPoinsFromParser);
        this.sideGeometry = new MyPatch(this.scene, 2, 2, 15, 15, controlPoinsFromParserSide);
        this.matrixBoard = new Array();
        this.translation_x = 0;
        this.translation_z = 0;

        this.aux = 0;
        this.counter = 0;

        //MATRIX WITH THE TILE
        for (let i = 0; i < this.n_lines; i++) {
            this.matrixBoard[i] = new Array();
            if (i % 2 == 0) {
                this.translation_x = this.tiles_width / 4;
                this.translation_z = this.tiles_height / 2;
                this.aux = this.counter * this.tiles_width / 2;

                this.counter++;
            } else {
                this.translation_x = 0;
                this.translation_z = 0;
            }
            for (let j = 0; j < this.n_columns; j++) {
                this.matrixBoard[i][j] = new MyTile(this.orchestrator, i * this.tiles_width + this.translation_x - this.aux, j * this.tiles_height + this.translation_z, this.tiles_width, this.tiles_height, height, i, j);
                let initialPiece = this.orchestrator.initialBoardRaw[i][j];
                if (initialPiece > 0) {
                    this.matrixBoard[i][j].piece = new MyPiece(this.orchestrator, initialPiece, this.matrixBoard[i][j], j, i);
                }
            }
        }
    }

    display() {

        this.white.apply();
        this.mainGeometry.display();
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -this.tiles_height / 2);
        this.mainGeometry.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(-this.tiles_width / 4, 0, -this.tiles_height / 2);
        this.mainGeometry.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(-this.tiles_width / 4, 0, 0);
        this.mainGeometry.display();
        this.scene.popMatrix();

        //     //Frontal
        // this.scene.pushMatrix()
        // this.scene.translate(0, 0, this.z1)
        // this.scene.rotate(Math.PI / 2.0, 1, 0, 0)
        // this.sideGeometry.display()
        // this.scene.popMatrix()
        //     //Left
        // this.scene.pushMatrix()
        // this.scene.translate(this.x1, 0, this.z1)
        // this.scene.rotate(Math.PI / 2.0, 0, 1, 0)
        // this.scene.translate(-this.x1, -this.height, 0)
        // this.scene.rotate(-Math.PI / 2.0, 1, 0, 0)
        // this.sideGeometry.display()
        // this.scene.popMatrix()
        //     //Right
        // this.scene.pushMatrix()
        // this.scene.rotate(-Math.PI / 2.0, 0, 1, 0)
        // this.scene.translate(0, -this.height, -this.x2)
        // this.scene.rotate(-Math.PI / 2.0, 1, 0, 0)
        // this.sideGeometry.display()
        // this.scene.popMatrix()
        //     //Back
        // this.scene.pushMatrix()
        // this.scene.translate(0, -this.height, this.z2)
        // this.scene.rotate(-Math.PI / 2.0, 1, 0, 0)
        // this.sideGeometry.display()
        // this.scene.popMatrix()

        this.scene.pushMatrix()

        this.scene.translate(this.x1, 0.02 * this.tiles_width, this.z1);

        for (let i = 0; i < this.n_lines; i++) {
            for (let j = 0; j < this.n_columns; j++) {
                //TILES ARE PICKABLE
                this.scene.registerForPick((i + 1) * 100 + j, this.matrixBoard[i][j]);
                this.matrixBoard[i][j].display();
            }
        }





        this.scene.popMatrix()
    }

}