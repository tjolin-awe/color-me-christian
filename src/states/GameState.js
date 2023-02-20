let {GUI, ActiveToolEnum} = require('../classes/game/GUI');
let {Clipart} = require('../classes/game/Clipart');
let {BoundingBox} = require('../classes/game/BoundingBox');
const { ClipartSelector } = require('../classes/game/ClipartSelector');
require('../components/BitmapDataFloodFill');
const { GameText} = require('../classes/game/GameText');
const { GameEvent} = require('../events/GameEvents');
const { UndoManager} = require('../classes/game/UndoManager');
class GameState {
    constructor(game) {
        this.game = game;

        this.tolerance = 50;
        this.key = '';
        this.isPainting = false;

        this.game.events = new GameEvent();
        this.game.events.registerEvent('ObjectReleased');
        this.game.events.registerEvent('ObjectCaptured');
        this.game.events.registerEvent('ObjectDestroyed');
        this.game.events.registerEvent('ObjectResized');
        this.game.events.registerEvent('ObjectStamped');

             
        this.game.events.addEventListener('ObjectReleased', this.onObjectReleased, this);
        this.game.events.addEventListener('ObjectCaptured', this.onObjectCaptured, this);
        this.game.events.addEventListener('ObjectDestroyed', this.onObjectDestroyed, this);
        this.game.events.addEventListener('ObjectResized', this.onObjectResized, this);
        this.game.events.addEventListener('ObjectStamped', this.onObjectStamped, this);

    }

    registerEvents() {

    }


    create() {

        this.game.audio.addSound('dustbin');

        this.game.undoManager = new UndoManager(this.game, this, 10);

        this.game.gui = new GUI(this.game, this.saveImage, this);

        this.game.stage.backgroundColor = '#fff';
        this.bmd = this.game.make.bitmapData(this.game.world.width - 320, 720);
        this.bmdContainer = this.bmd.addToWorld(0,0);

    
        this.game.bmdContainer = this.bmdContainer;
        this.game.bmd = this.bmd;

        //  Enable input for this sprite, so we can tell when it's clicked.
        this.bmdContainer.inputEnabled = true;      
        this.bmdContainer.events.onInputDown.add(this.fill, this);

        this.game.input.addMoveCallback(this.paint, this);
   
        this.bmd.fill(255, 255, 255, 1);

        if (this.game.currentPicture) {
        
         
            //  Textured paper background
            let paper = this.add.sprite(0, 0, 'paper');
            this.game.world.sendToBack(paper);
        
            this.bmdContainer.alpha = 0.7;
            this.key =  `picture${this.game.currentPicture}`;


            //  A copy of the image to be filled, placed over the top of the canvas
            //  This keeps the outline fresh, no matter how much filling takes place
            //  It could also contain a watermark or similar.
            var overlay = this.add.sprite(0, 0, this.key);
            overlay.x = this.bmdContainer.x;
            overlay.y = this.bmdContainer.y;
            overlay.alpha = this.bmdContainer.alpha;
            this.bmd.draw(`picture${this.game.currentPicture}`, 0, 0);
        }
  
        this.game.boundingBox = new BoundingBox(this.game, 'box', this);

    

      

        
        this.game.art_sprites = this.game.add.group();
        //if (this.game.cache.getJSON('settings').preserveLines) 
         //   this.game.add.image(0, 0, this.key);


        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.QUESTION_MARK);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.PERIOD);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.QUOTES);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.addCallbacks(this, null, this.keyPress, null);
        console.log('keyboard object');
        console.log(this.game.input.keyboard);

        // this.game.input.keyboard.on('keydown', this.keyPress);
       
    }

    saveImage() {

        this.game.audio.playSound('click');
        this.game.art_sprites.sort('z', Phaser.Group.SORT_ASCENDING);

        this.game.art_sprites.children.forEach((sprite)=> {
            console.log(`Id: ${sprite.Id}, Z: ${sprite.z}, Name:${sprite.name}`);
            if (sprite.alive)
                this.game.events.dispatchEvent('ObjectStamped', sprite);
        });

        this.game.boundingBox.hide();


        if (this.game.currentPicture) {
            if (this.game.cache.getJSON('settings').preserveLines) {
                this.bmd.draw(`picture${this.game.currentPicture}`, 0, 0);
            }
        }

        let url = this.bmd.canvas.toDataURL('image/jpg');
        let link = document.getElementById('link-mcb');
        link.href = url;
        link.download = 'my_picture.png';
        link.click();
    }

    createText() {


        let style = { font: this.game.gui.fontTool.getCurrentFont(), fill: `#${this.game.gui.color.substring(2)}`, boundsAlignH: "center", boundsAlignV: "middle" };
        
        console.log(style);
        let text = new GameText(this.game, this.game.bmd.width / 2, this.game.bmd.height / 2, 'Enter text here', style, this);
        text.fontIndex = this.game.gui.fontTool.index;
        this.game.boundingBox.captureClipart(text);
        this.game.art_sprites.visible = true;
        this.game.art_sprites.addChild(text);
        this.game.audio.playSound('click');

    }
    paint(pointer, x, y) {
        if (pointer.isDown && this.game.gui.mode == ActiveToolEnum.PAINT) {
            let rgb = Phaser.Color.getWebRGB(this.game.gui.color);
            let rgba = rgb.slice(0, -2) + '0.2)';
            
            if (this.game.gui.brush.type === 'square') {
                let xx = pointer.x - this.game.gui.brush.size / 2;
                let yy = pointer.y - this.game.gui.brush.size / 2;
                let width = this.game.gui.brush.size;
                this.bmd.rect(xx, yy, width, width, rgba);
            } else {
                this.bmd.circle(x, y, this.game.gui.brush.size / 2, rgba);
            }
            //  And update the pixel data, ready for the next fill
            this.bmd.update();
            
        }
    }

    

    openClipartSelector(category, pointer) {
        this.game.gui.openClipartSelector(category.name);
    }

    selectClipart(clipart, pointer) {
       
        this.game.audio.playSound('click');
        let clone = new Clipart(this.game, this.game.bmdContainer.width / 2 , this.game.bmdContainer.height / 2, clipart.lazyload_texture, clipart.lazyload_frame, pointer, this);
        clone.name = clipart.name;
        this.game.boundingBox.captureClipart(clone);
        this.game.clips.hide();
        this.game.art_sprites.visible = true;
        this.game.art_sprites.addChild(clone);

    }

   

    onDragUpdate(clone, pointer) {
       
    }

    onDragStart(clipart, pointer) {

    }
    onDragStop(clipart, pointer) {

        console.log('drop event');

       
        if (pointer.x > 0 && 
            pointer.x < this.game.bmdContainer.width &&
            pointer.y > 0 &&
            pointer.y < this.game.bmdContainer.height) 
            {
                //this.game.bmd.draw(clipart, pointer.x - clipart.width / 2, pointer.y -clipart.height / 2);
                //this.game.bmd.update();
            }
       

       // clipart.kill();

     
    }
        


     /**
     * Called when the picture is clicked.
     * 
     * Simple calculates the x and y value of the click, and passes that along with the
     * currently selected color to the BitmapData.floodFill routine.
     *
     * After filling the 'outline' is re-applied, so it never gets destroyed by the fill
     * process. If you are using a tolerance of 0 then this doesn't need to happen, we
     * only do it because our outline is aliased slightly.
     */
     fill(sprite, pointer) {

      
     
        if (this.game.gui.mode == ActiveToolEnum.FLOOD)
        {
            
            this.game.undoManager.add('flood');
            var color = Phaser.Color.hexToColor(this.game.gui.color);
        

        this.bmd.floodFill(
            pointer.x - this.bmdContainer.x,
            pointer.y - this.bmdContainer.y,
            color.r,
            color.g,
            color.b,
            255,
            this.tolerance);

        //  After filling, we'll re-apply the outline, so it never gets 'destroyed' by the fill
        if (this.game.currentPicture)
            this.bmd.copy(this.key);

        //  And update the pixel data, ready for the next fill

        
        this.bmd.update();
       
        }

    }
    keyPress(data) {
     
        console.log(data);
        if (data.keyCode == 27) {

            // Escape pressed
            if (this.game.boundingBox.isActive)
                this.game.boundingBox.releaseClipart();

            return;
        }
        else if (data.ctrlKey == true && (data.key == "z" || data.key == "Z")) {

            // CTRL-Z (undo)
            this.game.undoManager.undo();

           

        } else {
            if (this.game.boundingBox.isText) {
                this.game.boundingBox.element.addCharacter(data);
            }
        }

        }


        onObjectDestroyed(object) {

            if (!object)
                return;
            
            const type = object.artType;
            const id = object.Id;
                

            object.selected = false;
            object.inputEnabled = false;

            this.game.undoManager.add('object', object);

            object.kill();
            object = null;
    
            this.game.audio.playSound('dustbin');
            console.log(`Destroyed { ${id}, ${type}}`);
            
        }
    
        onObjectCaptured(object) {
    
            if (!object)
                return;
    
            object.selected = true;
    
            console.log(`Captured { ${object.Id}, ${object.artType}}`);
            
        }

        onObjectReleased(object) {

            if (!object)
                return;

            console.log(object);
            object.selected = false;


            if (object instanceof GameText)
                if (object.text === null || object.text.match(/^ *$/) !== null) {
                    object.setText('Enter new text');  
                    object.initialInput = false;
                }

            console.log(`Released { ${object.Id}, ${object.artType}}`);
        }

        onObjectResized(object) {
            
            if (!object)
                return;

            console.log(`Resized { ${object.Id}, ${object.artType}}`);

        }

        onObjectStamped(object, pointer) {
            if (!object)
                return;

            const id = object.Id;
            const type = object.type;
            
            this.game.undoManager.add('multi', object);
            object.inputEnabled = false;
            object.stamped = true;
            this.game.bmd.draw(object);
            this.game.bmd.update();
            object.kill();

            console.log(`Stamped { ${id}, ${type}}`);

        }
   
}

module.exports = {GameState};