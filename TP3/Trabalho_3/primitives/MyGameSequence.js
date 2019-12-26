/**
• Stores the a sequence of game moves (MyGameMove objects):
• Class MyGameSequence
• Methods:
• Add a game move
• Manage undo
• Feeds move replay
 */
class MyGameSequence extends CGFobject {
    constructor(orchestractor) {
        super(orchestractor.scene);
        this.orchestractor=orchestractor
        this.scene = orchestractor.scene;
        this.arrayGameSequence=new Array();
    }

    addGameMove(gameMove){
        this.arrayGameSequence.push(gameMove);
        console.log(this.arrayGameSequence);
    }


    //TODO:UNDO
    undo(){



    }
















}