let {config} = require('../config/config');
let {Storage} = require('../core_modules/Storage');
let {AudioController} = require('../core_modules/AudioController');

class BootState {
    constructor(game) {
        this.game = game;
    }

    init() {
        // Responsive scaling
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        // Center the game
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;



    }

    

    preload() {
        
        this.game.load.image('logo', 'assets/images/logo.png');
        this.game.load.image('title','assets/images/title.png');
        this.game.load.image('progress', 'assets/images/progress.png');
        this.game.load.json('settings', 'settings.json');
        this.game.load.image('madeby','assets/images/madeby.png');

    }

    create() {
        // add storage controller
        this.game.storage = new Storage(config.storagePrefix);
        this.game.audio = new AudioController(this.game);

     

        this.game.state.start('PreloadState');
        
     
        
    }

   
    
}

module.exports = {BootState};