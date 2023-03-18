let {irandomRange} = require('../util/util');
let {AudioSwitch} = require('../components/AudioSwitch');

class MainMenuState {
    constructor(game) {
        this.game = game;
    }

   

    create() {


        
        

        //this.game.add.image(0, 0, 'mainMenu', 'bg');
        this.game.add.image(0,0, 'bg');
        //this.game.add.image(this.game.world.centerX, 100, 'mainMenu', 'title').anchor.setTo(0.5);
        this.game.add.image(this.game.world.centerX, 100, 'title').anchor.setTo(0.5);

        
        // this.game.add.image(this.game.world.centerX, this.game.world.centerY + 45, 'mainMenu', 'menu').anchor.setTo(0.5);

        let play = this.game.add.button(this.game.world.centerX, this.game.world.centerY - 50, 'studio_buttons', function(){
        
            this.game.state.start('SelectPictureState');


        }, this, 'button_studio_choose_on', 'button_studio_choose_off');
        play.anchor.setTo(0.5);
       
        let random = this.game.add.button(this.game.world.centerX, play.y + play.height + 10, 'studio_buttons', function(){
            let pictures = this.game.cache.getJSON('settings').pictures;
            this.game.currentPicture = irandomRange(1, pictures);
            this.game.state.start('GameState');
           

        }, this, 'button_studio_random_on', 'button_studio_random_off');
        random.anchor.setTo(0.5);
  
        let studio = this.game.add.button(this.game.world.centerX, random.y + random.height + 10, 'studio_buttons', function(){
            let pictures = this.game.cache.getJSON('settings').pictures;
            this.game.currentPicture = null;
            this.game.audio.playSound('click');
            this.game.state.start('StudioLoadState');
            
        }, this, 'button_studio_on', 'button_studio_off');



        studio.anchor.setTo(0.5);
      

        let music = new AudioSwitch(this.game, {
            x: this.game.world.width - 50,
            y: 50,
            type: 'music',
            atlas: 'mainMenu',
            spriteOn: 'button_music_on',
            spriteOff: 'button_music_off'
        })

        this.game.audio.addSound('click');
    
        this.madeby = this.game.add.image(this.game.world.width, this.game.world.height,'madeby');
        this.madeby.y -= this.madeby.height + 10;
        this.madeby.x -= this.madeby.width + 10;
        //this.game.state.start('SelectPictureState');
    }
   
}

module.exports = {MainMenuState};