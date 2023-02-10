
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
    }

    turnOff() {
        this.tint = '0xffffff';
    }
}

module.exports = {ColorButton};