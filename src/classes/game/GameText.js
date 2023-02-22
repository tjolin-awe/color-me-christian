const KEYS = {"!":"!","?":"?",".":".","$":"$","#":"#",
              " ":" ","@":"@","%":"%","*":"*","[":"[",
              "]":"]","(":"(",")":")","-":"-","=":"=",
              "'":"'",";":";",'"':'"'};


class GameText extends Phaser.Text {
    constructor(game, x, y, text, style, context) {
        super(game, x, y, text, style);       

        this.initialInput = true;
        this.game.add.existing(this);
        this.currentColor = style.fill;
       
        this.artType = "GameText";
        this.inputEnabled = true;
        this.input.useHandCursor = true;
        this.preserveRatio = true;
        this.identifier = Math.floor(Math.random() * Date.now());

        
        //this.context = context;
        this.input.enableDrag(false);


        //this.input.startDrag(pointer);
   
        this.events.onInputDown.add(this.onSelectText, this);
        this.events.onDragUpdate.add(this.onDragText, this);
        this.events.onDragStart.add(this.onDragStart, this);
        this.events.onDragStop.add(this.onDragStop, this);
        this.events.onRevived.add(this.onRevived, this);

        this.selected = false;
       
    }

    get Id() {
        return this.identifier;
    }

    addCharacter(data) {

        const char = data.keyCode;
        const key = data.key;
        if (this.initialInput) {
            this.initialInput = false;
            this.setText('');
        }

        if ((char >= 48 && char <= 57) || (char >= 65 && char <= 90) || key.toString() in KEYS) {   
            this.setText(this.text + data.key);
        }
        else if(char == 8) 
            this.setText(this.text.substring(0, this.text.length - 1));  // Backspace
        else if(char == 13)
            this.setText(this.text + '\n');

        this.game.boundingBox.updatePositions();
    }
    

    onSelectText(text, pointer) {
        this.game.boundingBox.captureClipart(text);
    }

    onDragText(text, pointer) {

        this.game.boundingBox.updatePositions(); 
           
    }

    onDragStart(text, pointer) {

        for (let i = 0; i < this.game.art_sprites.children.length; i++) {
            const child = this.game.art_sprites.children[i];
            if (child.Id != text.Id)
                child.inputEnabled = false;
        }
    }
    onDragStop(text, pointer) {

        this.game.art_sprites.setAll('inputEnabled', true); 

    }

    onRevived(object) {

        object.inputEnabled = true;
        object.selected = true;

        this.game.boundingBox.captureClipart(object);
    }

   
}

module.exports = {GameText};