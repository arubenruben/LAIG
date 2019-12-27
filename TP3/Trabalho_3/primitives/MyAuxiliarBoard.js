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
class MyAuxiliarBoard extends CGFobject {
    constructor(orchestrator, x1, z1, x2, z2, tiles_width, tiles_height, player) {

        if (orchestrator == null || x1 == null || z1 == null || x2 == null || z2 == null || player == null) {
            console.error('Parameters null on the board constructor')
        }
        super(orchestrator.scene);
        this.orchestrator = orchestrator;
        this.scene = this.orchestrator.scene;
        this.player = player;

        if (this.player == 1) {
            this.player_stash = this.orchestrator.gameStateControl.score_player_1;
        } else if (this.player == 2) {
            this.player_stash = this.orchestrator.gameStateControl.score_player_2;
        } else {
            console.error('Player ' + player + ' doesnt exits');
        }

        this.x1 = x1;
        this.z1 = z1;
        this.x2 = x2;
        this.z2 = z2;

        this.redPiece = new MyPiece(this.orchestrator, 1, null, null, null);
        this.bluePiece = new MyPiece(this.orchestrator, 2, null, null, null)
        this.yellowPiece = new MyPiece(this.orchestrator, 3, null, null, null);




        // vai ser preciso para fazer a parte gráfica do stash
        // this.white = new CGFappearance(this.scene);
        // this.white.setShininess(200);
        // this.white.setAmbient(1, 1, 1, 1);
        // this.white.setDiffuse(1, 1, 1, 1);
        // this.white.setSpecular(1, 1, 1, 1);

        // this.n_lines = 11;
        // this.n_columns = 12;

        // this.tiles_width = Math.abs((x2 - x1) / 8);
        // this.tiles_height = Math.abs((z2 - z1) / 12);
        // this.boardset = false;

        // this.boardLenghtX = x2 + this.tiles_width / 4 - (x1 - this.tiles_width / 4);
        // this.boardLenghtZ = z1 + this.tiles_height / 2 - z2;

        // this.sideCylinderRadius = this.boardLenghtX * 0.02;

        // this.cylinder_sides1 = new MyCylinder(this.scene, 10, 10, this.boardLenghtX, this.sideCylinderRadius, this.sideCylinderRadius);
        // this.cylinder_sides2 = new MyCylinder(this.scene, 10, 10, this.boardLenghtZ, this.sideCylinderRadius, this.sideCylinderRadius);

        // this.cylinder_corner = new MyTorus2(this.scene, this.sideCylinderRadius, this.sideCylinderRadius, 10, 10);
        // let controlPoinsFromParser = [
        //     [x1 - this.tiles_width / 4, 0, z1 + this.tiles_height / 2],
        //     [x1 - this.tiles_width / 4, 0, z2],
        //     [x2 + this.tiles_width / 4, 0, z1 + this.tiles_height / 2],
        //     [x2 + this.tiles_width / 4, 0, z2],
        // ]
        // let controlPoinsFromParserSide = [
        //     [x1 - this.tiles_width / 4, 0, this.height],
        //     [x1 - this.tiles_width / 4, 0, 0],
        //     [x2 + this.tiles_width / 4, 0, this.height],
        //     [x2 + this.tiles_width / 4, 0, 0],
        // ];


        // let controlPoinsFromParserSide2 = [
        //     [this.height, 0, z2],
        //     [0, 0, z2],
        //     [this.height, 0, z1 + this.tiles_height / 2],
        //     [0, 0, z1 + this.tiles_height / 2],
        // ];

        // let controlPoinsFromParserBottom = [
        //     [x1 - this.tiles_width / 4, -this.height, z2],
        //     [x1 - this.tiles_width / 4, -this.height, z1 + this.tiles_height / 2],
        //     [x2 + this.tiles_width / 4, -this.height, z2],
        //     [x2 + this.tiles_width / 4, -this.height, z1 + this.tiles_height / 2],
        // ];

        // this.madeira_sides_tex = new CGFtexture(this.scene, './primitives/madeirasides.jpg');
        // this.madeira_cilindro_tex = new CGFtexture(this.scene, './primitives/madeiracilindro.jpg');

        // this.madeira_sides = new CGFappearance(this.scene);
        // this.madeira_sides.setShininess(200);
        // this.madeira_sides.setAmbient(1, 1, 1, 1);
        // this.madeira_sides.setDiffuse(1, 1, 1, 1);
        // this.madeira_sides.setSpecular(1, 1, 1, 1);

        // this.mainGeometry = new MyPatch(this.scene, 2, 2, 15, 15, controlPoinsFromParser);
        // this.sideGeometry = new MyPatch(this.scene, 2, 2, 15, 15, controlPoinsFromParserSide);
        // this.sideGeometry2 = new MyPatch(this.scene, 2, 2, 15, 15, controlPoinsFromParserSide2);
        // this.bottom = new MyPatch(this.scene, 2, 2, 15, 15, controlPoinsFromParserBottom);


    }

    display() {

        //desenhar peças vermelhas
        this.scene.pushMatrix();

        if (this.player == 2) {
            this.scene.translate(0, 0, 5);
        }



        for (let i = 0; i < this.player_stash[0]; i++) {
            this.scene.pushMatrix();
            this.scene.translate(0, i / 3, 0);
            this.redPiece.display();
            this.scene.popMatrix();
        }

        this.scene.translate(2, 0, 0);

        for (let i = 0; i < this.player_stash[1]; i++) {
            this.scene.pushMatrix();
            this.scene.translate(0, i / 3, 0);
            this.bluePiece.display();
            this.scene.popMatrix();
        }

        this.scene.translate(2, 0, 0);

        for (let i = 0; i < this.player_stash[2]; i++) {
            this.scene.pushMatrix();
            this.scene.translate(0, i / 3, 0);
            this.yellowPiece.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();


    }
}