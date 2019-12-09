/**
 * Class MyTile
• Unitary element that creates the gameboard and auxiliary board
spaces.
• Class MyTile
• Has pointer to gameboard and pointer to piece (if a piece occupies
tile)
• Methods:
• Set/unset piece on tile
• Get piece using tile
• Display the tile (render)
 */

class MyTile extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.areaBox;
    }


    display() {
        this.cylinder.display()
    }

}