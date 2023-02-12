class ClipArt extends Phaser.Sprite {
    constructor(game, x, y, texture, frame, pointer, context) {
        super(game, x, y, texture,frame);       

        this.game.add.existing(this);
       
        this.inputEnabled = true;
        this.input.useHandCursor = true;
        this.input.pixelPerfectClick = true;

        this.identifier = Math.floor(Math.random() * Date.now());

        
        this.context = context;
        this.input.enableDrag(false);


        //this.input.startDrag(pointer);
    

        this.events.onInputDown.add(this.onSelectClipArt, this);
        this.events.onDragUpdate.add(this.onDragClipart, this);
        this.events.onDragStart.add(this.onDragStart, this);
        this.events.onDragStop.add(this.onDragStop, this);
       
    }

    onSelectClipArt(clipart, pointer) {
        
        this.game.boundingBox.captureClipArt(clipart);

    }

    onDragClipart(clipart, pointer) {
        this.game.boundingBox.updatePositions();
        
    }

    onDragStart(clipart, pointer) {
        console.log(this.game.art_sprites.children);
        for (let i = 0; i < this.game.art_sprites.children.length; i++) {
            const child = this.game.art_sprites.children[i];
            if (child.identifier != this.identifier)
                child.inputEnabled = false;
        }
        this.input.pixelPerfectClick = false;

        
    }
    onDragStop(clipart, pointer) {

    
        this.game.art_sprites.setAll('inputEnabled', true);       
        this.input.pixelPerfectClick = true;
       
      
    }
}

module.exports = {ClipArt};