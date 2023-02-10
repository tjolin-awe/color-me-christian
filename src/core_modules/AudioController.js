class AudioController {
    constructor(game) {
        this.game = game;

        // create sound groups
        this.sounds = {};
        this.music = {};
        
        // initialize volumes for each group
        this.volume = {
            'sounds': this.game.storage.initItem('volumeSound', 1, 'float'),
            'music': this.game.storage.initItem('volumeMusic', 0.5, 'float')
        }
    }

    // ======= sounds =========
    addSound(name, allowMultiple = false) {
        this.sounds[name] = this.game.add.audio(name, this.volume.sounds);
        this.sounds[name].allowMultiple = allowMultiple;
    }

    playSound(name) {
        return this.sounds[name].play();    
    }

    getVolumeSounds() {
        return this.volume.sounds;
    }

    switchVolumeSounds() {
        this.volume.sounds = (this.volume.sounds == 0) ? 1 : 0;
        this.game.storage.setItem('volumeSound', this.volume.sounds);
        
        for (var _item in this.sounds) {
            this.sounds[_item].volume = this.volume.sounds;        
        }
        
        return this.volume.sounds;        
    }


    // ======= music =========
    addMusic(name) {
        this.music[name] = this.game.add.audio(name, this.volume.music);
    }

    playMusic(name) {
        this.music[name].loopFull();    
    }

    getVolumeMusic() {
        return this.volume.music;    
    }

    switchVolumeMusic() {
        this.volume.music = (this.volume.music == 0) ? 0.5 : 0;
        this.game.storage.setItem('volumeMusic', this.volume.music);
        
        for (var _item in this.music) {
            this.music[_item].volume = this.volume.music;
        }
        
        return this.volume.music;        
    }

    // loading helper
    // type: sound || music
    loadAudio(audioName, audioFile) {
        this.game.load.audio(
            audioName,
            [
                'assets/audio/' + audioFile + '.mp3',
                'assets/audio/' + audioFile + '.ogg',
            ]
        );
    }
}


module.exports = {AudioController};