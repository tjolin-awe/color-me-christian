const { Rectangle } = require("phaser-ce");

class Clipart extends Phaser.Sprite {
    constructor(game, x, y, texture, frame, pointer, context) {
        super(game, x, y, texture,frame);       

        this.game.add.existing(this);
       
        this.artType = "Clipart";
        this.inputEnabled = true;
        this.input.useHandCursor = true;
        this.input.pixelPerfectClick = true;
        this.preserveRatio = true;
     
        this.originalWidth = this.width;
        this.originalHeight = this.height;

        this.originalTexture = texture;
        this.originalFrame = frame;

        this.anchor.setTo(0.5);
        this.stamped = false;
        this.identifier = Math.floor(Math.random() * Date.now());

        
        this.context = context;
        this.input.enableDrag(false);

        this.events.onInputDown.add(this.onSelectClipart, this);
        this.events.onDragUpdate.add(this.onDragClipart, this);
        this.events.onDragStart.add(this.onDragStart, this);
        this.events.onDragStop.add(this.onDragStop, this);
        this.events.onRevived.add(this.onRevived, this);
      
        this.selected = false;
       

    }

   
    get Id() {
        return this.identifier;
    }

    onSelectClipart(clipart, pointer) {
        
        this.game.boundingBox.captureClipart(clipart);

    }


    
    onDragClipart(clipart, pointer) {

        

        this.game.boundingBox.updateBounds();
        this.game.boundingBox.drawBounds();
        
    }

    onDragStart(clipart, pointer) {

        
        for (let i = 0; i < this.game.art_sprites.children.length; i++) {
            const child = this.game.art_sprites.children[i];
            if (child.Id != clipart.Id)
                child.inputEnabled = false;
        }
        this.input.pixelPerfectClick = false;
        
    }
    onDragStop(clipart, pointer) {

        this.game.art_sprites.setAll('inputEnabled', true);       
        clipart.input.pixelPerfectClick = true;
       
    }

    onRevived(object){

        object.inputEnabled = true;
        object.stamped = false;
        object.selected = true;
        this.game.boundingBox.captureClipart(object);
      
    }
   
}




module.exports = {Clipart};