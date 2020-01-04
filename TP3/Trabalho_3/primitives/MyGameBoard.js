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

        this.madeira_sides_tex = this.orchestrator.imagesAssets.light_wood;
        this.madeira_cilindro_tex = this.orchestrator.imagesAssets.dark_wood;

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

        let keyframe1, keyframe2, keyframe3, keyframe4, keyframe5, keyframe6;
        let arrayOfKeyframes, arrayOfKeyframes2;
        let positionTileXRelative, positionTileZRelative;
        let positionTileXAbsolute, positionTileZAbsolute;
        let positionTileAuxiliarBoard1X, positionTileAuxiliarBoard1Z;
        let positionTileAuxiliarBoard2X, positionTileAuxiliarBoard2Z;

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
                positionTileXRelative = i * this.tiles_width + this.translation_x - this.aux;
                positionTileZRelative = -1 * j * this.tiles_height + this.translation_z;
                this.matrixBoard[i][j] = new MyTile(this.orchestrator, positionTileXRelative, positionTileZRelative, this.tiles_width, this.tiles_height, i, j);





                let initialPiece = this.orchestrator.initialBoardRaw[i][j];
                if (initialPiece > 0 && initialPiece < 4) {

                    positionTileXAbsolute = i * this.tiles_width + this.translation_x - this.aux + this.x1
                    positionTileZAbsolute = -1 * j * this.tiles_height + this.translation_z + this.z1;

                    positionTileAuxiliarBoard1X = Math.abs(this.x2 - positionTileXAbsolute);
                    positionTileAuxiliarBoard1Z = Math.abs(this.z2 - positionTileZAbsolute);

                    positionTileAuxiliarBoard2X = Math.abs(this.x1 - positionTileXAbsolute);
                    positionTileAuxiliarBoard2Z = Math.abs(this.z1 - positionTileXAbsolute);

                    console.log(positionTileAuxiliarBoard1X + ' AND ' + positionTileAuxiliarBoard1Z);

                    this.matrixBoard[i][j].piece = new MyPiece(this.orchestrator, initialPiece, this.matrixBoard[i][j], j, i);
                    this.matrixBoard[i][j].piece.animation = new MyAnimation(this.scene);
                    this.matrixBoard[i][j].piece.animation2 = new MyAnimation(this.scene);
                    keyframe1 = new MyKeyFrameAnimation(this.orchestrator.scene);
                    keyframe1.instant = 0;
                    keyframe1.translate_vec = [0, 0, 0];
                    keyframe1.rotate_vec = [0, 0, 0];
                    keyframe1.scale_vec = [1, 1, 1];


                    keyframe2 = new MyKeyFrameAnimation(this.orchestrator.scene);
                    keyframe2.instant = 2.5;
                    keyframe2.translate_vec = [0, this.boardLenghtX / 2, 0];
                    keyframe2.rotate_vec = [0, 0, 0];
                    keyframe2.scale_vec = [1, 1, 1];

                    keyframe3 = new MyKeyFrameAnimation(this.orchestrator.scene);
                    keyframe3.instant = 5;
                    keyframe3.translate_vec = [positionTileAuxiliarBoard1X - this.tiles_width, this.boardLenghtX / 2, -positionTileAuxiliarBoard1Z - this.tiles_height];
                    keyframe3.rotate_vec = [0, 0, 0];
                    keyframe3.scale_vec = [1, 1, 1];

                    keyframe4 = new MyKeyFrameAnimation(this.orchestrator.scene);
                    keyframe4.instant = 7.5;
                    keyframe4.translate_vec = [positionTileAuxiliarBoard1X - this.tiles_width, 0, -positionTileAuxiliarBoard1Z - this.tiles_height];
                    keyframe4.rotate_vec = [0, 90, 0];
                    keyframe4.scale_vec = [1, 1, 1];

                    keyframe5 = new MyKeyFrameAnimation(this.orchestrator.scene);
                    keyframe5.instant = 5;
                    keyframe5.translate_vec = [-positionTileAuxiliarBoard2X + this.tiles_width, this.boardLenghtX / 2, positionTileAuxiliarBoard2Z - 2 * this.tiles_height];
                    keyframe5.rotate_vec = [0, 0, 0];
                    keyframe5.scale_vec = [1, 1, 1];

                    keyframe6 = new MyKeyFrameAnimation(this.orchestrator.scene);
                    keyframe6.instant = 7.5;
                    keyframe6.translate_vec = [-positionTileAuxiliarBoard2X + this.tiles_width, 0, positionTileAuxiliarBoard2Z - 2 * this.tiles_height];
                    keyframe6.rotate_vec = [0, 90, 0];
                    keyframe6.scale_vec = [1, 1, 1];



                    arrayOfKeyframes = [keyframe1, keyframe2, keyframe3, keyframe4];
                    arrayOfKeyframes2 = [keyframe1, keyframe2, keyframe5, keyframe6];


                    this.matrixBoard[i][j].piece.animation.parse_keyframes(arrayOfKeyframes);
                    this.matrixBoard[i][j].piece.animation2.parse_keyframes(arrayOfKeyframes2);





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