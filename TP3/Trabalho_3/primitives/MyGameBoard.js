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

        this.scene = orchestrator.scene;
        this.x1 = x1;
        this.z1 = z1;
        this.x2 = x2;
        this.z2 = z2;
        this.height = height

        this.n_lines = 11
        this.n_columns = 12

        this.tiles_width = (x2 - x1) / 14
        this.tiles_height = (z2 - z1) / 12

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
        //MATRIX WITH THE TILE
        
        for (let i = 0; i < this.n_lines; i++) {
            this.matrixBoard[i] = new Array()
            for (let j = 0; j < this.n_columns; j++) {
                //TODO: CALCULAR AQUI A COORDENADA
                //TODO: DESENHAR 11 ou 12 Pecas em coluna
                this.matrixBoard[i][j] = new MyTile(orchestrator,
                    i * this.tiles_width, j * this.tiles_height, this.tiles_width, this.tiles_height, height);
            }
        }
    }

    display() {

        this.mainGeometry.display()
            //Frontal
        this.scene.pushMatrix()
        this.scene.translate(0, 0, this.z1)
        this.scene.rotate(Math.PI / 2.0, 1, 0, 0)
        this.sideGeometry.display()
        this.scene.popMatrix()
            //Left
        this.scene.pushMatrix()
        this.scene.translate(this.x1, 0, this.z1)
        this.scene.rotate(Math.PI / 2.0, 0, 1, 0)
        this.scene.translate(-this.x1, -this.height, 0)
        this.scene.rotate(-Math.PI / 2.0, 1, 0, 0)
        this.sideGeometry.display()
        this.scene.popMatrix()
            //Right
        this.scene.pushMatrix()
        this.scene.rotate(-Math.PI / 2.0, 0, 1, 0)
        this.scene.translate(0, -this.height, -this.x2)
        this.scene.rotate(-Math.PI / 2.0, 1, 0, 0)
        this.sideGeometry.display()
        this.scene.popMatrix()
            //Back
        this.scene.pushMatrix()
        this.scene.translate(0, -this.height, this.z2)
        this.scene.rotate(-Math.PI / 2.0, 1, 0, 0)
        this.sideGeometry.display()
        this.scene.popMatrix()

        this.scene.pushMatrix()
        this.scene.translate(this.x1 + this.tiles_width * 2, 0.01, this.z1 + this.tiles_height / 2);

        for (let i = 0; i < this.n_lines; i++) {
            for (let j = 0; j < this.n_columns; j++) {
                this.matrixBoard[i][j].display()
            }
        }

        this.scene.popMatrix()
    }

}