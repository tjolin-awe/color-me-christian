class PreloadState {
    constructor(game) {
        this.game = game;
    }

    preload() {

          

        // show logo and progress bar
        this.preloadLogo = this.game.add.image(this.game.world.width / 2, this.game.world.height / 2 - 100, 'logo');
        this.preloadLogo.anchor.setTo(0.5);
        
        this.preloadBar = this.game.add.sprite(this.game.world.width / 2, this.game.world.height / 2 + 100, 'progress');
        this.preloadBar.x -= this.preloadBar.width / 2;
        this.game.load.setPreloadSprite(this.preloadBar);

        this.madeby = this.game.add.image(this.game.world.width, this.game.world.height,'madeby');
        this.madeby.y -= this.madeby.height;
        this.madeby.x -= this.madeby.width;
        
        // load assets    
        this.game.load.atlasJSONHash('mainMenu', 'assets/images/main_menu.png', 'assets/images/main_menu.json');    
        this.game.load.atlasJSONHash('game', 'assets/images/game.png', 'assets/images/game.json'); 
        //this.game.load.atlas('clipart_characters', 'assets/images/clipart/characters.png', 'assets/images/clipart/characters.json');   
        this.game.load.image('bg', 'assets/images/mm_background.png');
        this.game.load.image('swatch','assets/images/swatch.png');
        this.game.load.image('selected','assets/images/selected.png');
        this.game.load.image('paper','assets/images/paper.png');
        this.game.load.image('palette','assets/images/palette.png');
        this.game.load.image('floodfill', 'assets/images/floodfill.png');
        //this.game.load.image('clipart', 'assets/images/clipart.png');
        //this.game.load.image('corner','assets/images/corner.png');
        //this.game.load.image('lock', 'assets/images/lock.png');
         // load assets    
       this.game.load.image('clipart', 'assets/images/clipart.png');
         this.game.load.atlas('box', 'assets/images/box.png', 'assets/images/box.json');

        this.game.load.image('button_studio_on', 'assets/images/button_studio_on.png');
        this.game.load.image('button_studio_off', 'assets/images/button_studio_off.png');
        this.game.audio.loadAudio('ost', 'ost');

        // pictures
        let pictures = this.game.cache.getJSON('settings').pictures;
        for (let i = 0; i < pictures; i++) {
            let index = i + 1;
            this.game.load.image(`picture${index}`, `assets/images/pictures/${index}.png`)
        }
    }

    
    create() {
        this.game.audio.addMusic('ost');
        this.game.audio.playMusic('ost');

    
        this.time.events.add(3000, function () {
 

            
            this.game.state.start('MainMenuState');
       
 
        }, this);
       

    }
}

module.exports = {PreloadState};