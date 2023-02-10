let {GUI, ActiveToolEnum} = require('../classes/game/GUI');
let {ClipArt} = require('../classes/game/ClipArt');
let {BoundingBox} = require('../classes/game/BoundingBox');
const { ClipartSelector } = require('../classes/game/ClipartSelector');
require('../components/BitmapDataFloodFill');

class GameState {
    constructor(game) {
        this.game = game;

        this.tolerance = 50;
        this.key = '';
        this.isPainting = false;

    }

    create() {
        
        
        //  Textured paper background
        this.paper = this.add.sprite(0, 0, 'paper');
        
        this.game.gui = new GUI(this.game, this.saveImage, this);

        this.game.stage.backgroundColor = '#fff';
        this.bmd = this.game.make.bitmapData(this.game.world.width - 320, 720);
        this.bmdContainer = this.bmd.addToWorld();
        this.game.bmdContainer = this.bmdContainer;
        this.game.bmd = this.bmd;





           //  This applies a small alpha to the image, allowing you to see
        //  the paper texture through it. You can remove this depending
        //  on what your requirements are.
        


        //  Enable input for this sprite, so we can tell when it's clicked.
        this.bmdContainer.inputEnabled = true;      
        this.bmdContainer.events.onInputDown.add(this.fill, this);

        this.game.input.addMoveCallback(this.paint, this);

        
   
        this.bmd.fill(255, 255, 255, 1);
        if (this.game.currentPicture) {
            console.log(this.game.currentPicture);
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
      
      /*  if (this.game.currentPicture)     
            this.bmd.load(this.key);*/

       // this.game.gui.initClipArt(this);
          

        //this.game.activeClipart = new Phaser.Group();
  
        this.game.boundingBox = new BoundingBox(this.game, 'box', this);

        
      

        
        this.game.art_sprites = this.game.add.group();
        //if (this.game.cache.getJSON('settings').preserveLines) 
         //   this.game.add.image(0, 0, this.key);
    }

    saveImage() {

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


    openClipArtSelector(category, pointer) {
        this.game.gui.openClipArtSelector(category.name);
    }

    selectClipArt(clipart, pointer) {

 
       
        let clone = new ClipArt(this.game, this.game.bmdContainer.width / 2 , this.game.bmdContainer.height / 2, clipart.lazyload_texture, clipart.lazyload_frame, pointer, this);
        this.game.boundingBox.captureClipArt(clone);
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

        if (this.game.gui.mode == ActiveToolEnum.CLIPART)
        {
            
        }
     
        if (this.game.gui.mode == ActiveToolEnum.FLOOD)
        {

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
}

module.exports = {GameState};