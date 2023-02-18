let {ColorButton} = require('./ColorButton');
let {BrushButton} = require('./BrushButton');
const { ClipartCategoryTool } = require('./ClipartCategoriesTool');
const { ClipartSelector} = require('./ClipartSelector');
const { FontTool} = require('./FontTool');

const ActiveToolEnum = {
    PAINT: 1,
    FLOOD: 2,
    CLIPART: 3
   };
Object.freeze(ActiveToolEnum);


class GUI extends Phaser.Sprite {
    constructor(game, callback, context) {
        super(game, game.world.width - 325, 0, 'game', 'gui_bg');
        this.game.add.existing(this);

        this.initBrushes();
        this.initColors();
        this.initButtons(callback, context)

        if (!this.game.noclips)
            this.initClipart(context);
        this.initFonts(context);
        this.mode = ActiveToolEnum.PAINT;
    }

  
    initFonts(context) {

    
        const fonts = this.game.cache.getJSON('settings').fonts;
     
       
        console.log(fonts);
        let offsetX = this.width / 2 + 5, offsetY = 550;

        this.fontGroup = this.game.add.group();
        this.fontTool = new FontTool(this.game, offsetX, offsetY, fonts, context);
        this.fontGroup.addChild(this.fontTool);
        this.fontGroup.visible = false;
        this.addChild(this.fontGroup);
    }
    
    initColors() {
        let textColors = this.game.add.image(this.width / 2, 25, 'game', 'text_colors');
        textColors.anchor.setTo(0.5);
        this.addChild(textColors);

        this.colorList = [
            '0xCBAEA0',
            '0xC5AE78',
            '0x613D1B',
            '0xB17E47',

            '0xD0D0D0',
            '0x30261D',
            '0xffb8c6',
            '0xF0BF87',

            '0x911eb4',
            '0x458CCC',
            '0x7CC576',
            '0x7B4F42',

       
       

            '0xe6194b',
            '0xffac22',
            '0xffe119',
            '0xFFFFFF',
            '0xf58231',
            '0x911eb4',
            '0x46f0f0',
            '0xf032e6',
            '0xd2f53c',
            '0xfabebe',
            '0x008080',
            '0xe6beff',
            '0x000080',
            '0x808080',
            '0xFFFFFF',
            '0x000000'
        ];

        this.colors = [];

        let offsetX = 60;
        let offsetY = 95;
        let width = 72;
        let height = 74;

        for (let i = 0; i < 16; i++) {
            let cb = new ColorButton(this.game, offsetX + (i % 4) * width, offsetY + Math.floor(i / 4) * height, this.colorList[i], this.changeSelectedColor, this);
            this.addChild(cb);
            this.colors.push(cb);
        }

        this.changeSelectedColor(this.colors[0]);
    }

    changeSelectedColor(color, pointer) {
        if(this.selectedColor) {
            this.selectedColor.turnOff();
        }

      

        this.selectedColor = color;

      
        this.selectedColor.turnOn();
        this.game.audio.playSound('click');
        
        //this.updateBrushesTint();
    }

 
    get color() {

  
        return this.selectedColor.color;
    }

    get Mode() {
        return this.Mode;
    }
  

    initBrushes() {
        
        this.brushes = [];
        let sizes = [16, 32, 48, 64];
        let width = [0, 51, 118, 201];
        let offsetX = 60;
        let offsetY = 520;
        //let width = 74;
        let height = 74;

        for (let i = 0; i < 4; i++) {
            let bb_square = new BrushButton(this.game, offsetX + width[i], offsetY, 'square', sizes[i], this.changeSelectedBrush, this)
            this.addChild(bb_square);
            this.brushes.push(bb_square);

            let bb_round = new BrushButton(this.game, offsetX + width[i], offsetY + 80, 'round', sizes[i], this.changeSelectedBrush, this)
            this.addChild(bb_round);
            this.brushes.push(bb_round);
        }

        this.changeSelectedBrush(this.brushes[0]);
    }


    openClipartSelector(key) {
     this.game.world.bringToTop(this.game.clips);
        
    if (this.game.boundingBox)
        this.game.boundingBox.releaseClipart();


    if (this.game.art_sprites)
    this.game.art_sprites.visible = false;

    this.game.clips.show(key);
    //this.toggleClipTools(true);
    }
    
    setToolClipart() {
        this.mode = ActiveToolEnum.CLIPART;
        this.setToolBorder(this.toolClipart);
        this.game.audio.playSound('click');
        this.togglePaintTools(false);
        this.toggleTextTools(false);
        this.toggleClipTools(true);
        this.toggleFloodTools(false);

        return;
       
    }
            
    setToolText() {
        this.mode = ActiveToolEnum.TEXT;
        this.setToolBorder(this.toolText);
        this.game.audio.playSound('click');
        this.toggleClipTools(false);
        this.togglePaintTools(false);
        this.toggleTextTools(true);
        this.toggleFloodTools(false);
    }

    setToolFlood() {
        this.mode = ActiveToolEnum.FLOOD;
        this.setToolBorder(this.toolFlood);
        this.game.audio.playSound('click');
        this.togglePaintTools(false);
        this.toggleClipTools(false);
        this.toggleTextTools(false);
        this.toggleFloodTools(true);
    }

    setToolPaint() {
        this.mode = ActiveToolEnum.PAINT;
        this.setToolBorder(this.toolPaint);
        this.game.audio.playSound('click');
        this.togglePaintTools(true);
        this.toggleClipTools(false);
        this.toggleTextTools(false);
        this.toggleFloodTools(false);
    }


   

    toggleClipTools(isvisible) {
        this.clipartGroup.visible = isvisible;
        this.game.world.bringToTop(this.clipartGroup);
     
    }
         
    toggleTextTools(isvisible) {
        this.fontGroup.visible = isvisible;
        this.game.world.bringToTop(this.fontGroup);
   
    }
        
    togglePaintTools(isvisible){
        this.brushes.forEach((value, index)=> {
            value.visible = isvisible;
        });
       
        
    }
    toggleFloodTools(isvisible) {
    
    }
    

    changeSelectedBrush(brush) {
        if(this.selecteBrush) 
            this.selecteBrush.turnOff();

        this.selecteBrush = brush;
        this.selecteBrush.turnOn();
    }

    get brush() {
        return {type: this.selecteBrush.type, size: this.selecteBrush.size};
    }

    updateBrushesTint() {
        let color = this.color;
        this.brushes.forEach((brush) => {
            brush.tint = color;
        }, this);
    }

    setToolBorder(tool) {
        this.toolBorder.x = tool.x;
        this.toolBorder.y = tool.y;
    }

   
    initButtons(callback, context) {
     
        let posY = 420;
        let buffer = 32;


        this.toolBorder = this.game.add.image(0, 0, 'tool_border');
        this.toolBorder.anchor.setTo(0.5);
        this.toolBorder.scale.setTo(0.75);

        //let textBrushes = this.game.add.image(this.width / 2, 450, 'game', 'text_brushes');
        this.toolPaint = this.game.add.sprite(this.width / 4 - buffer / 2, posY, 'palette');
        this.toolPaint.anchor.setTo(0.5);
        this.toolPaint.scale.setTo(0.75);
          
        this.setToolBorder(this.toolPaint);
        
        this.toolFlood = this.game.add.sprite(this.width / 2 - buffer, posY,'floodfill');
        this.toolFlood.anchor.setTo(0.5);
        this.toolFlood.scale.setTo(0.75);
      
      

        this.toolClipart = this.game.add.sprite(this.width / 2 + buffer, posY,'clipart');
        this.toolClipart.anchor.setTo(0.5);
        this.toolClipart.scale.setTo(0.75);
      
        this.toolText = this.game.add.sprite(this.width - this.width / 4 + buffer / 2, posY, 'text');
        this.toolText.anchor.setTo(0.5);
      
        this.toolText.scale.setTo(0.75);
        

        

      
        var style = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        //  The Text is positioned at 0, 100
        //this.toolText = this.game.add.text(this.width /3, 460, "Paint", style);
        //this.toolText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

        this.toolPaint.inputEnabled = true;
        this.toolPaint.input.useHandCursor = true;
        this.toolPaint.events.onInputUp.add(this.setToolPaint, this);

        this.toolFlood.inputEnabled = true;
        this.toolFlood.input.useHandCursor = true;
        this.toolFlood.events.onInputUp.add(this.setToolFlood, this);

        this.toolClipart.inputEnabled = true;
        this.toolClipart.input.useHandCursor = true;
        this.toolClipart.events.onInputUp.add(this.setToolClipart, this);

        this.toolText.inputEnabled = true;
        this.toolText.input.useHandCursor = true;
        this.toolText.events.onInputUp.add(this.setToolText, this);


        this.addChild(this.toolPaint);
        this.addChild(this.toolFlood);
        this.addChild(this.toolClipart);
        this.addChild(this.toolText);
        this.addChild(this.toolBorder);
      
        this.toolClipart.visible = !this.game.noclips;

        let offsetY = 650;


        if (!window.cordova){
            let save = this.game.add.button(40, offsetY, 'game', callback, context, 'button_save_on', 'button_save_off');
            this.addChild(save);
        }

        let clear = this.game.add.button(130, offsetY, 'game', function(){
            this.game.state.start('GameState');
        }, this, 'button_clear_on', 'button_clear_off');
        this.addChild(clear);

        let quit = this.game.add.button(220, offsetY, 'game', function(){
            this.game.state.start('MainMenuState');
        }, this, 'button_quit_on', 'button_quit_off');
        this.addChild(quit);
    } 

    initClipart(context) {
    
        let categories = this.game.cache.getJSON('settings').clipartCategories;
        let offsetX = this.width / 2 + 5, offsetY = 550;

        this.clipartGroup = this.game.add.group();
        this.clipartTool = new ClipartCategoryTool(this.game, offsetX, offsetY, categories, context.openClipartSelector, context);
        this.clipartGroup.addChild(this.clipartTool);
        this.clipartGroup.visible = false;
        this.addChild(this.clipartGroup);


        this.game.clips = new ClipartSelector(this.game, 0, 0, 'bg', categories, context);
      
    }
}

module.exports = {GUI, ActiveToolEnum};