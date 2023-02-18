class ClipartCategoryTool extends Phaser.Sprite {
    constructor(game, x, y, categories, callback, context) {
        super(game, x, y, 'mainMenu', 'picture_bg');
       
        this.categories = categories
        this.index = 0;
        this.name = this.categories[0].key;

        this.anchor.setTo(0.5);
        this.inputEnabled = true;
        this.input.useHandCursor = true;
        this.events.onInputDown.add(callback, context);

        this.clip = this.game.add.image(0, 0, `clipart_${categories[0].key}`);
        this.clip.anchor.setTo(0.5);
        this.clip.scale.setTo(0.5);
        this.addChild(this.clip);

        let border = this.game.add.image(0,0, 'mainMenu', 'picture_border');
        border.anchor.setTo(0.5);
        this.addChild(border);

        this.btnNext = thi,s.game.add.button(120, 0, 'mainMenu', , this, 'button_up_on', 'button_up_off');

        
        this.btnNext.anchor.setTo(0.5);
        this.btnNext.angle = 90;
        this.btnNext.events.onInputUp.add(this.next, this);

        this.addChild(this.btnNext);
       
        this.btnPrevious = this.game.add.button(-120, 0, 'mainMenu', function(){
        }, this, 'button_up_on', 'button_up_off');
        
        this.btnPrevious.anchor.setTo(0.5);
        this.btnPrevious.angle = 270;
        this.btnPrevious.events.onInputUp.add(this.previous, this);

        this.addChild(this.btnPrevious);
    }

    next() {
        
        this.index++;
        this.index = this.index % this.categories.length    
        this.loadCategoryIcon();
    }


    previous() {
       
        this.index--;

        if (this.index < 0)
            this.index = this.categories.length - 1;

        this.index = this.index % this.categories.length;
        this.loadCategoryIcon();
    }

    loadCategoryIcon() {
        this.name = this.categories[this.index].key;
        this.clip.loadTexture(`clipart_${this.name}`);
    }

}

module.exports = {ClipartCategoryTool};