class GameText extends Phaser.Text {
    constructor(game, x, y, text, style, context) {
        super(game, x, y, text, style);       

         
        this.game.add.existing(this);
       
        this.inputEnabled = true;
        this.input.useHandCursor = true;

        this.identifier = Math.floor(Math.random() * Date.now());

        
        //this.context = context;
        this.input.enableDrag(false);


        //this.input.startDrag(pointer);
    

        this.events.onInputDown.add(this.onSelectClipArt, this);
        this.events.onDragUpdate.add(this.onDragClipart, this);
        this.events.onDragStart.add(this.onDragStart, this);
        this.events.onDragStop.add(this.onDragStop, this);

        this.selected = false;
        this.game.input.keyboard.addCallbacks(this, null, this.keyPress, null);
       
    }

   
   

    onSelectClipArt(clipart, pointer) {
        
        this.game.boundingBox.captureClipArt(clipart);
    

    }

    onDragClipart(clipart, pointer) {
        this.game.boundingBox.updatePositions();
        
    }

    onDragStart(clipart, pointer) {
       
        for (let i = 0; i < this.game.art_sprites.children.length; i++) {
            const child = this.game.art_sprites.children[i];
            if (child.identifier != this.identifier)
                child.inputEnabled = false;
        }
       
        
    }
    onDragStop(clipart, pointer) {

    
        this.game.art_sprites.setAll('inputEnabled', true);       
        
      
    }

    keyPress(data) {


        if (this.game.boundingBox && this.game.boundingBox.clipart) {
            if(this.identifier == this.game.boundingBox.clipart.identifier) {
                 var char = data.keyCode;
        
                console.log(data);
   
                    if ((char >= 48 && char <= 57) || 
                       (char >= 65 && char <= 90) ||
                        char == 188  ||  
                        data.key == '!' || data.key == '?' ||
                        data.key == '.' || data.key == '$' ||
                        data.key == '#' || data.key == ' ' ||
                        data.key == '@' || data.key == '%' ||
                        data.key == '*' || data.key == "'" ||
                        data.key == '[' || data.key == ']' ||
                        data.key == '(' || data.key == ')' ||
                        data.key == '-' || data.key == '=')      
                            this.setText(this.text += data.key);
                    else if(char == 8){
                        
                        this.setText(this.text.substring(0, this.text.length - 1));
                 
                    }
                    this.game.boundingBox.updatePositions();

                    
        
             }
        }
    
    }
}

module.exports = {GameText};