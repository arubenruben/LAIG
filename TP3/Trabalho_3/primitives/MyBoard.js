'use strict'

class MyBoard extends CGFobject{


    constructor(scene){
        this.scene=scene
        super(scene)
        this.array_pieces=new Array()
        this.plane=new MyPlane(scene,5,5)

    }




    display(){
        this.plane.display()






    }






}