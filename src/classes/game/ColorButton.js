const {GameText} = require('./GameText');

class ColorButton extends Phaser.Sprite {
    constructor(game, x, y, color, callback, context) {
        super(game, x, y, 'game', 'color_bg');
        this.color = color;
        this.anchor.setTo(0.5);
        this.game.add.existing(this);

        this.inputEnabled = true;
        this.input.useHandCursor = true;

        this.events.onInputDown.add(callback, context, this);

        this.initColor();
    }

    initColor() {
        this.colorSprite = this.game.add.image(0, 0, 'game', 'color');
        this.colorSprite.anchor.setTo(0.5);
        this.colorSprite.tint = this.color;

  
        this.addChild(this.colorSprite);
    }

    turnOn() {
        this.tint = '0xb4854e';


        if (this.game.boundingBox && this.game.boundingBox.clipart) {
           
            if (this.game.boundingBox.clipart instanceof GameText) {

             

                console.log('changing color');
                let newcolor = `#${this.color.substring(2)}`;
                this.game.boundingBox.clipart.addColor(newcolor,0);
                this.game.boundingBox.clipart.currentColor = newcolor;
            }

        }
    }

    turnOff() {
        this.tint = '0xffffff';
    }
}

module.exports = {ColorButton};