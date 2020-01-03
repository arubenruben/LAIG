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
    constructor(orchestrator, x1, z1, x2, z2) {

        if (orchestrator == null || x1 == null || z1 == null || x2 == null || z2 == null) {
            console.error('Parameters null on the board constructor');
        }
        super(orchestrator.scene);
        this.orchestrator = orchestrator;
        this.scene = this.orchestrator.scene;
        this.x1 = x1;
        this.z1 = z1;
        this.x2 = x2;
        this.z2 = z2;
        this.height = Math.abs(x2 - x1) * 0.07;



        this.white = new CGFappearance(this.scene);
        this.white.setShininess(200);
        this.white.setAmbient(1, 1, 1, 1);
        this.white.setDiffuse(1, 1, 1, 1);
        this.white.setSpecular(1, 1, 1, 1);

        this.n_lines = 11;
        this.n_columns = 12;

        this.tiles_width = Math.abs((x2 - x1) / 8);
        this.tiles_height = Math.abs((z2 - z1) / 12);
        this.boardset = false;

        this.boardLenghtX = x2 + this.tiles_width / 4 - (x1 - this.tiles_width / 4);
        this.boardLenghtZ = z1 + this.tiles_height / 2 - z2;

        this.sideCylinderRadius = this.boardLenghtX * 0.03;

        this.cylinder_sides1 = new MyCylinder(this.scene, 10, 10, this.boardLenghtX, this.sideCylinderRadius, this.sideCylinderRadius);
        this.cylinder_sides2 = new MyCylinder(this.scene, 10, 10, this.boardLenghtZ, this.sideCylinderRadius, this.sideCylinderRadius);

        this.cylinder_corner = new MyTorus2(this.scene, this.sideCylinderRadius, this.sideCylinderRadius, 10, 10);
        let controlPoinsFromParser = [
            [x1 - this.tiles_width / 4, 0, z1 + this.tiles_height / 2],
            [x1 - this.tiles_width / 4, 0, z2],
            [x2 + this.tiles_width / 4, 0, z1 + this.tiles_height / 2],
            [x2 + this.tiles_width / 4, 0, z2],
        ]
        let controlPoinsFromParserSide = [
            [x1 - this.tiles_width / 4, 0, this.height],
            [x1 - this.tiles_width / 4, 0, 0],
            [x2 + this.tiles_width / 4, 0, this.height],
            [x2 + this.tiles_width / 4, 0, 0],
        ];


        let controlPoinsFromParserSide2 = [
            [this.height, 0, z2],
            [0, 0, z2],
            [this.height, 0, z1 + this.tiles_height / 2],
            [0, 0, z1 + this.tiles_height / 2],
        ];

        let controlPoinsFromParserBottom = [
            [x1 - this.tiles_width / 4, -this.height, z2],
            [x1 - this.tiles_width / 4, -this.height, z1 + this.tiles_height / 2],
            [x2 + this.tiles_width / 4, -this.height, z2],
            [x2 + this.tiles_width / 4, -this.height, z1 + this.tiles_height / 2],
        ];

        this.madeira_sides_tex = new CGFtexture(this.scene, './scenes/images/madeirasides.jpg');
        this.madeira_cilindro_tex = new CGFtexture(this.scene, './scenes/images/madeiracilindro.jpg');

        this.madeira_sides = new CGFappearance(this.scene);
        this.madeira_sides.setShininess(200);
        this.madeira_sides.setAmbient(1, 1, 1, 1);
        this.madeira_sides.setDiffuse(1, 1, 1, 1);
        this.madeira_sides.setSpecular(1, 1, 1, 1);

        this.mainGeometry = new MyPatch(this.scene, 2, 2, 15, 15, controlPoinsFromParser);
        this.sideGeometry = new MyPatch(this.scene, 2, 2, 15, 15, controlPoinsFromParserSide);
        this.sideGeometry2 = new MyPatch(this.scene, 2, 2, 15, 15, controlPoinsFromParserSide2);
        this.bottom = new MyPatch(this.scene, 2, 2, 15, 15, controlPoinsFromParserBottom);


        this.matrixBoard = new Array();
        this.translation_x = 0;
        this.translation_z = 0;

        this.aux = 0;
        this.counter = 0;
        this.tilesAreDefined = false;

        //this.updateMatrixOfTiles();
    }

    updateMatrixOfTiles() {

        this.tilesAreDefined = true;
        //MATRIX WITH THE TILE
        for (let i = 0; i < this.n_lines; i++) {
            this.matrixBoard[i] = new Array();
            if (i % 2 == 0) {
                this.translation_x = this.tiles_width / 4;
                this.translation_z = -1 * this.tiles_height / 2;
                this.aux = this.counter * this.tiles_width / 2;

                this.counter++;
            } else {
                this.translation_x = 0;
                this.translation_z = 0;
            }
            for (let j = 0; j < this.n_columns; j++) {
                this.matrixBoard[i][j] = new MyTile(this.orchestrator, i * this.tiles_width + this.translation_x - this.aux, -1 * j * this.tiles_height + this.translation_z, this.tiles_width, this.tiles_height, i, j);
                let initialPiece = this.orchestrator.initialBoardRaw[i][j];
                if (initialPiece > 0 && initialPiece < 4) {
                    this.matrixBoard[i][j].piece = new MyPiece(this.orchestrator, initialPiece, this.matrixBoard[i][j], j, i);
                }
            }
        }
    }

    display() {

        this.scene.pushMatrix();

        this.madeira_sides.setTexture(this.madeira_cilindro_tex);
        this.madeira_sides.apply();

        this.scene.pushMatrix();
        this.scene.translate(this.x2 + this.tiles_width / 4, 0, this.z1 + this.tiles_height / 2);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.cylinder_corner.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(this.x1 - this.tiles_width / 4, 0, this.z1 + this.tiles_height / 2);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.cylinder_corner.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.x1 - this.tiles_width / 4, 0, this.z2);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.cylinder_corner.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.x2 + this.tiles_width / 4, 0, this.z2);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.cylinder_corner.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(this.x1 - this.tiles_width / 4, 0, this.z1 + this.tiles_height / 2 + this.sideCylinderRadius);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.cylinder_sides1.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(this.x1 - this.tiles_width / 4, 0, this.z2 - this.sideCylinderRadius);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.cylinder_sides1.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(this.x1 - this.tiles_width / 4 - this.sideCylinderRadius, 0, this.z2);
        this.cylinder_sides2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.x2 + this.tiles_width / 4 + this.sideCylinderRadius, 0, this.z2);
        this.cylinder_sides2.display();
        this.scene.popMatrix();



        this.madeira_sides.setTexture(this.madeira_sides_tex);
        this.madeira_sides.apply();
        //Frontal
        this.scene.pushMatrix()
        this.scene.translate(0, 0, this.z1 + this.tiles_height / 2)
        this.scene.rotate(Math.PI / 2, 1, 0, 0)
        this.sideGeometry.display()
        this.scene.popMatrix()

        //Back
        this.scene.pushMatrix()
        this.scene.translate(0, -this.height, this.z2)
        this.scene.rotate(-Math.PI / 2, 1, 0, 0)
        this.sideGeometry.display()
        this.scene.popMatrix()

        //Left
        this.scene.pushMatrix()
        this.scene.translate(this.x1 - this.tiles_width / 4, 0, 0)
        this.scene.rotate(-Math.PI / 2, 0, 0, 1)
        this.sideGeometry2.display()
        this.scene.popMatrix()

        //Right
        this.scene.pushMatrix()
        this.scene.translate(this.x2 + this.tiles_width / 4, -this.height, 0)
        this.scene.rotate(Math.PI / 2, 0, 0, 1)
        this.sideGeometry2.display()
        this.scene.popMatrix()

        // bottom
        this.scene.pushMatrix();
        this.bottom.display();
        this.scene.popMatrix();

        this.white.apply();
        this.scene.pushMatrix();
        this.mainGeometry.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();

        this.scene.translate(this.x1, 0.02 * this.tiles_width, this.z1);
        if (this.tilesAreDefined) {
            for (let i = 0; i < this.n_lines; i++) {
                for (let j = 0; j < this.n_columns; j++) {
                    //TILES ARE PICKABLE
                    if (this.matrixBoard[i][j] != null) {
                        this.scene.registerForPick((i + 1) * 100 + j, this.matrixBoard[i][j]);
                        this.matrixBoard[i][j].display();
                    }
                }
            }
        }

        this.scene.popMatrix();

        if (this.orchestrator.gameboardSet) {
            this.scene.pushMatrix();

            this.orchestrator.timeBoard.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.orchestrator.player1_stash.display();
            this.orchestrator.player2_stash.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }

}