class FontTool extends Phaser.Sprite {
    constructor(game, x, y, fonts, context) {
        super(game, x, y, 'font_icon_off');
  


        this.inputEnabled = true;
        this.events.onInputOver.add(this.onInputOver, this);
        this.events.onInputOut.add(this.onInputOut, this);
        this.events.onInputUp.add(context.createText, this);
        this.anchor.setTo(0.5);
        this.fonts = fonts;
        this.fontLength = Object.keys(this.fonts).length;
        this.index = 0;

        let newstyle = {
            
            font: '18pt Brush Script MT, cursive',
            fill: '#fff',
            boundsAlignH: "center", boundsAlignV: "middle"
        };

        var bar = game.add.graphics();
        bar.beginFill(0x000000, 0.2);
        bar.drawRect(-154, 42, 308, 48);
        bar.anchor.setTo(0.5);
        this.addChild(bar);
        this.sampleText = this.game.add.text(-1, 66, this.fonts[0].name, newstyle);

        console.log(this.sampleText);
        this.sampleText.anchor.setTo(0.5);
        this.sampleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);



        this.addChild(this.sampleText);
       // this.bringToTop(this.sampleText);

      

        this.btnNext = this.game.add.button(120, 0, 'mainMenu', function(){
        }, this, 'button_up_on', 'button_up_off');
        
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
    next(){
        this.index++;
        this.index = this.index % this.fontLength    
        this.updateFont();
        this.game.audio.playSound('click');
    }
    previous(){
        this.index--;

        if (this.index < 0)
            this.index = this.fontLength - 1;

        this.index = this.index % this.fontLength;
        this.updateFont();
        this.game.audio.playSound('click');
    }

    getCurrentFont(){
        return `${this.fonts[this.index].fontWeight} ${this.fonts[this.index].size} ${this.fonts[this.index].family}`;
    }

    setCurrentFont(index) {
        this.index = index;
        this.updateFont();
    }

    updateFont() {

        let font = this.getCurrentFont();
        if (this.game.boundingBox.isText && this.game.boundingBox.handles.visible == true) {

          
            this.game.boundingBox.clipart.setStyle({font: font, fill: this.game.boundingBox.clipart.currentColor, boundsAlignH: "center", boundsAlignV: "middle"}, true);
            this.game.boundingBox.clipart.fontIndex = this.index;
            this.game.boundingBox.updatePositions();
         }
            this.sampleText.setText(this.fonts[this.index].name);
           
            this.sampleText.visible = true;
            this.sampleText.setStyle({font: font, fontSize: '18pt', fill:'#fff',boundsAlignH: "center", boundsAlignV: "middle"}, true);

    }

    onInputOut() {
        this.loadTexture('font_icon_off');
    }
    onInputOver() {
        this.loadTexture('font_icon_on');
    }
}

module.exports = {FontTool}