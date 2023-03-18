class SelectPictureState {
    constructor(game) {
        this.game = game;
    }

    create() {
        this.game.add.image(0, 0, 'bg');
        this.group = this.game.add.group();
        this.pictures = this.game.cache.getJSON('settings').pictures;
        this.game.noclips = true;
        let offsetX = 50;
        let offsetY = 50;
        let width = 500;
        let height = 450;

        for (let i = 0; i < this.pictures; i++) {
            let xx = offsetX + (i % 3) * width;
            let yy = offsetY + Math.floor(i / 3) * height;
            let bg = this.game.add.image(xx, yy, 'mainMenu', 'picture_bg');
            bg.width = 450;
            bg.height = 350;
            
            let pic = this.game.add.image(0, 0, `picture${i+1}`);
            pic.scale.setTo(0.15);
            pic.left = pic.width / 2 + 15;
            pic.top = pic.height / 2 + 10;
            pic.anchor.setTo(0.5);
            bg.addChild(pic);
            let border = this.game.add.image(0,0,'mainMenu', 'picture_border');
          
            bg.addChild(border);

            bg.inputEnabled = true;
            bg.input.useHandCursor = true;
            bg.events.onInputDown.add(function(){
                this.game.currentPicture = i + 1;
                this.game.state.start('GameState');
             
            }, this);

            this.group.add(bg);
            
        }

        this.button_menu = this.game.add.button(this.game.world.width - 75, 85, 'mainMenu', function(){
            this.game.state.start('MainMenuState');
        }, this, 'button_menu_on', 'button_menu_off');
        this.button_menu.anchor.setTo(0.5);

        this.button_up = this.game.add.button(this.button_menu.x, this.button_menu.y + 80, 'mainMenu', function(){
            this.slide('down');
        }, this, 'button_up_on', 'button_up_off');
        this.button_up.anchor.setTo(0.5);

        this.button_down = this.game.add.button(this.button_menu.x, this.button_up.y + 80, 'mainMenu', function(){
            this.slide('up');
        }, this, 'button_down_on', 'button_down_off');
        this.button_down.anchor.setTo(0.5);

        this.lastY = offsetY + Math.floor((this.pictures - 1) / 3) * height;
        this.updateButtons();
    }

    slide(direction) {
        if (this.sliding) return;
        var height = direction === 'up' ? -900 : 900;
        
        if (this.group.y + height < -(this.lastY + 50) || this.group.y + height > 0) return;
        this.sliding = true;
        this.hideButtons();

        this.game.add.tween(this.group).to({y: String(height)}, 500, Phaser.Easing.Back.Out, true).onComplete.add(function(){
            this.updateButtons();
            this.sliding = false;
        }, this);
    }

    updateButtons() {
        this.button_up.x = this.group.y === 0 ? 2000 : this.game.world.width - 75;
        this.button_down.x = this.group.y === -(this.lastY - 50) ? 2000 : this.game.world.width - 75;
    }

    hideButtons() {
        this.button_up.x = 2000;
        this.button_down.x = 2000;
    }
   
}

module.exports = {SelectPictureState};