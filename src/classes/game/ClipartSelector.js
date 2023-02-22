

class ClipartSelector extends Phaser.Sprite {
    constructor(game, x, y, texture, categories, context) {
        super(game, x, y, texture);
        this.game.add.existing(this);
        this.context = context;
        this.visible = false;
   
        this.categories = categories;
        this.currentCategory = ''

        this.clipGroup = this.game.add.group();
        this.initButtons();
    }

    initButtons() {

        let offsetX = 50;
        let offsetY = 50;
        let width = 279;
        let height = 200;


        this.button_menu = this.game.add.button(this.game.world.width - 75, 85, 'mainMenu', function(){
           
            
            this.hide();
            this.game.art_sprites.visible = true;
            this.game.audio.playSound('click');
          
        }, this, 'button_menu_on', 'button_menu_off');
        this.button_menu.anchor.setTo(0.5);
        this.addChild(this.button_menu);


        this.button_up = this.game.add.button(this.button_menu.x, this.button_menu.y + 80, 'mainMenu', function(){
            this.slide('down');
        }, this, 'button_up_on', 'button_up_off');
        this.button_up.anchor.setTo(0.5);
        this.addChild(this.button_up);
    
        this.button_down = this.game.add.button(this.button_menu.x, this.button_up.y + 80, 'mainMenu', function(){
            this.slide('up');
        }, this, 'button_down_on', 'button_down_off');
        this.button_down.anchor.setTo(0.5);
        this.addChild(this.button_down);
    
     
    }

    getClipartCategory(key) {
        return this.categories.filter(
            function(resource){ return resource.key == key }
        )[0];
    }

    show(key) {

        this.visible = true;
      
        console.log(`Loading ${key} clipart`);

        if (this.currentCategory != key) {

            const category = this.getClipartCategory(key);
            console.log(category);

            this.onLoadComplete(category);
            /*this.game.load.onLoadComplete.addOnce(this.onLoadComplete, this, 0, [key, category.sprites.count]);

            for (let i = 0; i < category.sprites.count; i++) {
                this.game.load.atlas(`${category.key}-${i}`, 
                                     `${category.sprites.path}/${category.key}-${i}.png`, 
                                     `${category.sprites.path}/${category.key}-${i}.json`);
            }

            this.game.load.start();*/
        }
        this.currentCategory = key;
    

    }

    hide() {
        this.visible = false;
    }

    getClips(key, cnt=1){

        let clips = [];
        for (let c = 0; c < cnt; c++){
            let json = this.game.cache.getJSON(`json_${key}-${c}`);
           
            console.log(json);
            for (let i =0; i < json.frames.length; i++) { 
                let texture = `${key}-${c}`;
                console.log(texture);
                clips.push({
                    texture: texture,
                    frame: json.frames[i].filename,   
                    index: i           
                });
            }
        }
        clips.sort((a, b) => a.frame > b.frame);
        return clips;
    }

    onLoadComplete(category) {

        this.clips = this.getClips(category.key, category.sprites.count);
        
        let offsetX = 50;
        let offsetY = 50;
        let width = 279;
        let height = 200;

        this.clipGroup.removeAll();
        this.clipGroup.y = 0;
      
        let style = {font: 'Impact, Haettenschweiler, Franklin Gothic Bold, Charcoal, Helvetica Inserat, Bitstream Vera Sans Bold, Arial Black, sans serif', fontSize: '16pt', fill: '#000' };

        for (let i = 0; i < this.clips.length; i++) {
           
           
            let xx = offsetX + (i % 4) * width;
            let yy = offsetY + Math.floor(i / 4) * height;
            let bg = this.game.add.image(xx, yy, 'mainMenu', 'picture_bg');
            
            let pic = this.game.add.image(bg.width / 2, bg.height / 2, this.clips[i].texture, this.clips[i].frame);
            pic.anchor.setTo(0.5);
            pic.scale.setTo(0.50);
            pic.name = this.clips[i].frame;
            bg.addChild(pic);
            
            bg.addChild(this.game.add.image(0, 0, 'mainMenu', 'picture_border'));
            bg.lazyload_texture = this.clips[i].texture;
            bg.lazyload_frame = this.clips[i].index;
            bg.inputEnabled = true;
            bg.input.useHandCursor = true;
            bg.events.onInputDown.add(this.context.selectClipart, this.context);

            let label = this.game.add.text(17,10, this.clips[i].frame, style);
            bg.addChild(label);


            this.clipGroup.addChild(bg);
    
          
        }
        this.addChild(this.clipGroup);
        this.lastY = offsetY + Math.floor((this.clips.length - 1) / 4) * height;
        this.updateButtons();
    }

   


slide(direction) {
    if (this.sliding) 
        return;
    
    this.game.audio.playSound('click');
    var height = direction === 'up' ? -600 : 600;


    if (this.clipGroup.y + height < -(this.lastY + 50) || this.clipGroup.y + height > 0) 
        return;

    this.sliding = true;
    this.hideButtons();

    this.game.add.tween(this.clipGroup).to({y: String(height)}, 500, Phaser.Easing.Back.Out, true).onComplete.add(function(){
        this.updateButtons();
        this.sliding = false;
    }, this);
}

updateButtons() {
    this.button_up.x = this.clipGroup.y === 0 ? 2000 : this.game.world.width - 75;
    this.button_down.x = this.clipGroup.y === -(this.lastY - 50) ? 2000 : this.game.world.width - 75;
}

hideButtons() {
    this.button_up.x = 2000;
    this.button_down.x = 2000;
}



}

module.exports = {ClipartSelector}