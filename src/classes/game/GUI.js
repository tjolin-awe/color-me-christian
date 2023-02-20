let {ColorButton} = require('./ColorButton');
let {BrushButton} = require('./BrushButton');
const { ClipartCategoryTool } = require('./ClipartCategoriesTool');
const { ClipartSelector} = require('./ClipartSelector');
const { FontTool} = require('./FontTool');

const ActiveToolEnum = {
    PAINT: 1,
    FLOOD: 2,
    CLIPART: 3,
    TEXT: 4
   };
Object.freeze(ActiveToolEnum);


class GUI extends Phaser.Sprite {
    constructor(game, callback, context) {
        super(game, game.world.width - 325, 0, 'game', 'gui_bg');
        this.game.add.existing(this);

        this.initBrushes();
        this.initColors();
        this.initButtons(callback, context)

        this.clipartGroup = this.game.add.group();
        this.clipartGroup.visible = false;
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

    setTool(id, click) {

        if (click)
            this.game.audio.playSound('click');

       
        const tool = this.tools[id];

        for (const [key, value] of Object.entries(this.tools)) {
            console.log(key, value);
            value.selectedcallback.call(this, false);
        }

        this.setToolBorder(id);
        tool.selectedcallback.call(this, true);
        this.mode = id;
    }
            
    onToolButtonClicked(tool) {
        this.setTool(tool.id, true);
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

    setToolBorder(id) {

        this.toolBorder.x =  this.tools[id].x;
        this.toolBorder.y =  this.tools[id].y;
    }


    createTool(id, icon, x, y, callback) {
        const tool = this.game.add.sprite(x, y, icon);
        tool.anchor.setTo(0.5);
        tool.scale.setTo(0.75);
        tool.inputEnabled = true;
        tool.selectedcallback = callback;
        tool.input.useHandCursor = true;
        tool.id = id;
        tool.events.onInputUp.add(this.onToolButtonClicked, this);
        this.tools[id] = tool;

        console.log(tool);
        return tool;
    }

   
    initButtons(callback, context) {
     
        let posY = 420;
        let buffer = 32;

        this.tools = {};
       
        this.addChild(this.createTool(ActiveToolEnum.PAINT, 'palette',this.width / 4 - buffer, posY, this.togglePaintTools));
        this.addChild(this.createTool(ActiveToolEnum.FLOOD, 'floodfill',this.width / 2 - buffer, posY, this.toggleFloodTools));
        this.addChild(this.createTool(ActiveToolEnum.TEXT,'text', this.width / 2 + buffer + 8, posY, this.toggleTextTools));
        this.addChild(this.createTool(ActiveToolEnum.CLIPART,'clipart',this.width - this.width / 4 + buffer - 8, posY, this.toggleClipTools));
     
        this.toolBorder = this.game.add.image(0, 0, 'tool_border');
        this.toolBorder.anchor.setTo(0.5);
        this.toolBorder.scale.setTo(0.75);
        this.addChild(this.toolBorder);

        this.setToolBorder(ActiveToolEnum.PAINT);
      
        this.tools[ActiveToolEnum.CLIPART].visible = !this.game.noclips;

        let offsetY = 650;


      
        let save = this.game.add.button(40, offsetY, 'game', callback, context, 'button_save_on', 'button_save_off');
        
        this.addChild(save);

        let clear = this.game.add.button(130, offsetY, 'game', function(){
            this.game.state.start('GameState');
            this.game.audio.playSound('dustbin');
        }, this, 'button_clear_on', 'button_clear_off');
        this.addChild(clear);

        let quit = this.game.add.button(220, offsetY, 'game', function(){
            this.game.state.start('MainMenuState');
            this.game.audio.playSound('click');
        }, this, 'button_quit_on', 'button_quit_off');
        this.addChild(quit);
    } 

    initClipart(context) {
    
        let categories = this.game.cache.getJSON('settings').clipartCategories;
        let offsetX = this.width / 2 + 5, offsetY = 550;

        this.clipartTool = new ClipartCategoryTool(this.game, offsetX, offsetY, categories, context.openClipartSelector, context);
        this.clipartGroup.addChild(this.clipartTool);
        this.addChild(this.clipartGroup);


        this.game.clips = new ClipartSelector(this.game, 0, 0, 'bg', categories, context);
      
    }
}

module.exports = {GUI, ActiveToolEnum};