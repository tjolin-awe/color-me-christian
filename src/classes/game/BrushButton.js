class BrushButton extends Phaser.Sprite {
    constructor(game, x, y, type, size, canerase, callback, context) {
        super(game, x, y, 'game', `${type}_${size}_off`);
        this.anchor.setTo(0.5);
        this.type = type;
        this.size = size;
        this.inputEnabled = true;
        this.input.useHandCursor = true;
        this.canerase = canerase;
        this.events.onInputDown.add(callback, context, this);
    }

    turnOn() {
        this.loadTexture('game', `${this.type}_${this.size}_on`);
       
    }

    turnOff() {
        this.loadTexture('game', `${this.type}_${this.size}_off`);
    }
}

module.exports = {BrushButton};