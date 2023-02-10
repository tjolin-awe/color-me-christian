class AudioSwitch extends Phaser.Sprite {
    constructor(game, options) {
        if (!options) throw new Error('type, group, x, y, atlas, spriteOn, spriteOff, sndClick');
        if (!options.type || (options.type !== 'sound' && options.type !== 'music')) throw new Error('type must be sound or music');

        let type = options.type;
        let group = options.group || null;
        let x = options.x || null;
        let y = options.y || null;
        let atlas = options.atlas || null;
        let spriteOn = options.spriteOn || '';
        let spriteOff = options.spriteOff  || '';
        let sndClick = options.sndClick || null;

        let volume = type === 'sound' ? game.audio.getVolumeSounds() : game.audio.getVolumeMusic();
        var sprite = volume === 0 ? spriteOff : spriteOn;

        if (atlas) {
            super(game, x, y, atlas, sprite);
        } else {
            super(game, x, y, sprite);
        }

        this.anchor.setTo(0.5);
        this.type = type;
        this.group = group;
        this.atlas = atlas;
        this.spriteOn = spriteOn;
        this.spriteOff = spriteOff;
        this.sndClick = sndClick;

        if (group) {
            group.add(this);
        } else {
            game.add.existing(this);
        }

        this.inputEnabled = true;
        this.input.useHandCursor = true;
        this.events.onInputDown.add(this.switch, this);
    }

    switch() {
        let switchMethod = this.type === 'sound' ? this.game.audio.switchVolumeSounds() : this.game.audio.switchVolumeMusic();

        let volume = this.type === 'sound' ? this.game.audio.getVolumeSounds() : this.game.audio.getVolumeMusic();

        let sprite = volume === 0 ? this.spriteOff : this.spriteOn; 
        
        if (this.atlas) {
            this.loadTexture(this.atlas, sprite);
        } else {
            this.loadTexture(sprite);
        }

        if (this.sndClick) this.game.audio.playSound(sndClick);
    }
}

module.exports = {AudioSwitch};