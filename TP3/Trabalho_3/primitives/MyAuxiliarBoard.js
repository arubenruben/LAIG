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

        if (orchestrator == null || player == null) {
            console.error('Parameters null on the board constructor')
        }
        super(orchestrator.scene);
        this.orchestrator = orchestrator;
        this.scene = this.orchestrator.scene;
        this.player = player;

        this.scale_x = tiles_width;
        this.scale_z = tiles_height / (Math.cos(Math.PI / 6) * 0.5 * 2);

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
        this.tiles_height = tiles_height;
        this.tiles_width = tiles_width;

        this.white = new CGFappearance(this.scene);
        this.white.setShininess(200);
        this.white.setAmbient(1, 1, 1, 1);
        this.white.setDiffuse(1, 1, 1, 1);
        this.white.setSpecular(1, 1, 1, 1);


        this.redPiece = new MyPiece(this.orchestrator, 1, null, null, null);
        this.bluePiece = new MyPiece(this.orchestrator, 2, null, null, null)
        this.yellowPiece = new MyPiece(this.orchestrator, 3, null, null, null);

        this.number0 = this.orchestrator.imagesAssets.number0;
        this.number1 = this.orchestrator.imagesAssets.number1;
        this.number2 = this.orchestrator.imagesAssets.number2;
        this.number3 = this.orchestrator.imagesAssets.number3;
        this.number4 = this.orchestrator.imagesAssets.number4;
        this.number5 = this.orchestrator.imagesAssets.number5;
        this.number6 = this.orchestrator.imagesAssets.number6;
        this.number7 = this.orchestrator.imagesAssets.number7;
        this.number8 = this.orchestrator.imagesAssets.number8;
        this.number9 = this.orchestrator.imagesAssets.number9;
        this.numberTimes = this.orchestrator.imagesAssets.numberTimes;
        this.light_wood = this.orchestrator.imagesAssets.light_wood;

        this.madeira_sides_tex = new CGFtexture(this.scene, './scenes/images/madeirasides.jpg');
        this.madeira_cilindro_tex = new CGFtexture(this.scene, './scenes/images/madeiracilindro.jpg');

        this.numberRectangle = new MyRectangle(this.scene, null, -tiles_width / 2, -tiles_height / 2, tiles_width / 2, tiles_height / 2);
        this.numberRectangleTimes = new MyRectangle(this.scene, null, -tiles_width / 4, -tiles_height / 4, tiles_width / 4, tiles_height / 4);

        this.floor = new MyRectangle(this.scene, null, -this.tiles_width, 2 * 1.2 * this.tiles_height, 2 * this.tiles_width + this.tiles_width / 2, -this.tiles_height);
        this.boardLenghtX = x2 + this.tiles_width / 4 - (x1 - this.tiles_width / 4);
        this.boardLenghtZ = z1 + this.tiles_height / 2 - z2;

        this.sideCylinderRadius = this.boardLenghtX * 0.02;
        this.sideCylinderLength = 3 * this.tiles_width + this.tiles_width / 2;
        this.sideCylinder1Length = 2 * 1.2 * this.tiles_height + this.tiles_height;

        this.cylinder_sides1 = new MyCylinder(this.scene, 10, 10, this.sideCylinderLength, this.sideCylinderRadius, this.sideCylinderRadius);
        this.cylinder_sides2 = new MyCylinder(this.scene, 10, 10, this.sideCylinder1Length, this.sideCylinderRadius, this.sideCylinderRadius);
        this.cylinder_corner = new MyTorus2(this.scene, this.sideCylinderRadius, this.sideCylinderRadius, 10, 10);

    }

    numberTexture(number) {
        switch (number) {
            case 0:
                return this.number0;
            case 1:
                return this.number1;
            case 2:
                return this.number2;
            case 3:
                return this.number3;
            case 4:
                return this.number4;
            case 5:
                return this.number5;
            case 6:
                return this.number6;
            case 7:
                return this.number7;
            case 8:
                return this.number8;
            case 9:
                return this.number9;
            default:
                return this.number0;
        }

    }

    display() {
        //desenhar peças vermelhas
        if (this.player == 1) {
            this.player_stash = this.orchestrator.gameStateControl.score_player_1;
        } else if (this.player == 2) {
            this.player_stash = this.orchestrator.gameStateControl.score_player_2;
        } else {
            console.error('Player ' + player + ' doesnt exits');
        }

        this.scene.pushMatrix();


        if (this.player == 1) {
            this.scene.translate(this.x2 - 2 * this.tiles_width, 0, this.z2 - this.tiles_height / 2);
            this.scene.translate(this.tiles_height / 2, 0, -this.tiles_width / 2);
            this.scene.rotate(Math.PI / 2, 0, 1, 0);

        } else if (this.player == 2) {
            this.scene.translate(this.x1 + 2 * this.tiles_width, 0, this.z1 + this.tiles_height);
            this.scene.translate(-this.tiles_height / 2, 0, this.tiles_width / 2);
            this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        }

        this.scene.pushMatrix();
        this.scene.translate(this.sideCylinderLength - this.tiles_height, 0, -this.tiles_width / 2);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.white.setTexture(this.madeira_cilindro_tex);
        this.white.apply();
        this.cylinder_sides1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.sideCylinderLength - this.tiles_height, 0, this.sideCylinder1Length - this.tiles_height / 4);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.cylinder_sides1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.sideCylinderLength - this.tiles_width / 2, 0, -this.tiles_height / 2);
        this.cylinder_sides2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.sideCylinderLength - this.tiles_width / 2 - this.sideCylinderRadius, 0, -this.tiles_height / 2);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.cylinder_corner.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.sideCylinderLength - this.tiles_width / 2 - this.sideCylinderRadius, 0, this.sideCylinder1Length - this.tiles_height / 4 - this.sideCylinderRadius);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.cylinder_corner.display();
        this.scene.popMatrix();





        this.scene.pushMatrix();
        this.white.setTexture(this.light_wood);
        this.white.apply();
        this.scene.translate(this.tiles_height / 2, -0.01, this.tiles_height * 1.9);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.floor.display();
        this.scene.popMatrix();





        for (let i = 0; i < this.player_stash[0]; i++) {
            this.scene.pushMatrix();
            this.scene.translate(this.tiles_width / 4, i * this.tiles_width / 6, 0);
            this.scene.scale(this.scale_x, this.scale_x / 2, this.scale_z);
            this.redPiece.display();
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
        this.scene.translate(this.tiles_width, 0, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.white.setTexture(this.numberTimes);
        this.white.apply();
        this.numberRectangleTimes.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.tiles_width + this.tiles_width, 0, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.white.setTexture(this.numberTexture(this.player_stash[0]));
        this.white.apply();
        this.numberRectangle.display();
        this.scene.popMatrix();

        this.scene.translate(0, 0, this.tiles_height * 1.2);

        for (let i = 0; i < this.player_stash[1]; i++) {
            this.scene.pushMatrix();
            this.scene.translate(this.tiles_width / 4, i * this.tiles_width / 6, 0);
            this.scene.scale(this.scale_x, this.scale_x / 2, this.scale_z);
            this.bluePiece.display();
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
        this.scene.translate(this.tiles_width, 0, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.white.setTexture(this.numberTimes);
        this.white.apply();
        this.numberRectangleTimes.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(this.tiles_width + this.tiles_width, 0, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.white.setTexture(this.numberTexture(this.player_stash[1]));
        this.white.apply();
        this.numberRectangle.display();
        this.scene.popMatrix();

        this.scene.translate(0, 0, this.tiles_height * 1.2);

        for (let i = 0; i < this.player_stash[2]; i++) {
            this.scene.pushMatrix();
            this.scene.translate(this.tiles_width / 4, i * this.tiles_width / 6, 0);
            this.scene.scale(this.scale_x, this.scale_x / 2, this.scale_z);
            this.yellowPiece.display();
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
        this.scene.translate(this.tiles_width, 0, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.white.setTexture(this.numberTimes);
        this.white.apply();
        this.numberRectangleTimes.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.translate(this.tiles_width + this.tiles_width, 0, 0);
        this.scene.rotate(Math.PI / 2, -1, 0, 0);
        this.white.setTexture(this.numberTexture(this.player_stash[2]));
        this.white.apply();
        this.numberRectangle.display();
        this.scene.popMatrix();

        this.scene.popMatrix();


    }
}