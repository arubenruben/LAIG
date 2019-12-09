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
    constructor(scene, x1, z1, x2, z2,height,tile=null) {
        super(scene);
        //TODO: Add tile==null to this parameters
        if(scene==null||x1==null||z1==null||x2==null||z2==null){
            console.error('Parameters null on the board constructor')
        }
        this.scene = scene;
        this.x1 = x1;
        this.z1 = z1;
        this.x2 = x2;
        this.z2 = z2;
        this.height=height

        const n_lines=12
        const n_columns=11
        
        this.tile_prototype=tile
        let controlPoinsFromParser=[
            [x1, 0, z1],
            [x1, 0, z2],
            [x2, 0, z1],
            [x2, 0, z2],
        ]
        let controlPoinsFromParserSide=[
            [x1, 0, height],
            [x1, 0, 0],
            [x2, 0, height],
            [x2, 0, 0],
        ]
        this.mainGeometry=new MyPatch(scene,2,2,15,15,controlPoinsFromParser)
        this.sideGeometry=new MyPatch(scene,2,2,15,15,controlPoinsFromParserSide)
        //MATRIX REPRESENTING THE BOARD
        this.matrixBoard=new Array(n_lines)
        for(let i=0;i<n_lines;i++)
            this.matrixBoard[i]=new Array(n_columns)
    }

display(){
    
    this.mainGeometry.display()
    //Frontal
    this.scene.pushMatrix()
    this.scene.translate(0,0,this.z1)
    this.scene.rotate(Math.PI/2.0,1,0,0)
    this.sideGeometry.display()
    this.scene.popMatrix()
    //Left
    this.scene.pushMatrix()
    this.scene.translate(this.x1,0,this.z1)
    this.scene.rotate(Math.PI/2.0,0,1,0)
    this.scene.translate(-this.x1,-this.height,0)
    this.scene.rotate(-Math.PI/2.0,1,0,0)
    this.sideGeometry.display()
    this.scene.popMatrix()
    //Right
    this.scene.pushMatrix()
    this.scene.rotate(-Math.PI/2.0,0,1,0)
    this.scene.translate(0,-this.height,-this.x2)
    this.scene.rotate(-Math.PI/2.0,1,0,0)
    this.sideGeometry.display()
    this.scene.popMatrix()
    
    //Back
    this.scene.pushMatrix()
    this.scene.translate(0,-this.height,this.z2)
    this.scene.rotate(-Math.PI/2.0,1,0,0)
    this.sideGeometry.display()
    this.scene.popMatrix()
    
}   

}