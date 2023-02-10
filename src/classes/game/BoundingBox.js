let {BoxHandleEnum, BoxSquare} = require('../game/BoxSquare');

class BoundingBox {
    constructor(game, texture, context) {
        this.context = context;
        this.texture = texture;
        this.game = game;
        this.clipart = null;
        this.preserveRatio = false;

        this.handles = new Phaser.Group(this.game);
        this.initBoxHandles();
    }

    initBoxHandles(){

        this.buttonLock = new Phaser.Sprite(this.game, 0, 0, this.texture, 'unlock');
        this.buttonLock.anchor.setTo(0.5);
        this.buttonLock.inputEnabled = true;
        this.buttonLock.events.onInputUp.add(this.onToggleLock, this);
        this.buttonLock.events.onInputOver.add(this.onInputOverLock, this);
        this.buttonLock.events.onInputOut.add(this.onInputOutLock, this);


        this.buttonStamp = new Phaser.Button(this.game, 0, 0, this.texture, this.onPaint, this, 'stamp_hover', 'stamp');
        this.buttonStamp.anchor.setTo(0.5);
    
        this.buttonDelete = new Phaser.Button(this.game, 0,0, this.texture, this.onDelete,this, 'delete_hover', 'delete');
        this.buttonDelete.anchor.setTo(0.5);

        this.buttonZorder = new Phaser.Button(this.game, 0,0, this.texture, this.onBringForward,this, 'zorder_hover', 'zorder');
        this.buttonZorder.anchor.setTo(0.5);

        this.game.add.existing(this.buttonLock);
        this.handles.addChild(this.buttonLock);
        this.handles.addChild(this.buttonStamp);
        this.handles.addChild(this.buttonDelete);
        this.handles.addChild(this.buttonZorder);

      
        this.bounds = this.game.add.graphics(0,0);
        
        this.handles.add(this.bounds);

        this.topLeftHandle = this.createSquare(BoxHandleEnum.TopLeft);   
        this.topCenterHandle = this.createSquare(BoxHandleEnum.TopCenter);
        this.topRightHandle = this.createSquare(BoxHandleEnum.TopRight);
        this.leftHandle = this.createSquare(BoxHandleEnum.Left);
        this.rightHandle = this.createSquare(BoxHandleEnum.Right);
        this.bottomLeftHandle = this.createSquare(BoxHandleEnum.BottomLeft);
        this.bottomCenterHandle = this.createSquare(BoxHandleEnum.BottomCenter);
        this.bottomRightHandle = this.createSquare(BoxHandleEnum.BottomRight);


        this.handles.addChild(this.topLeftHandle);
        this.handles.addChild(this.topCenterHandle);
        this.handles.addChild(this.topRightHandle);
        this.handles.addChild(this.leftHandle);
        this.handles.addChild(this.rightHandle);
        this.handles.addChild(this.bottomLeftHandle);
        this.handles.addChild(this.bottomCenterHandle);
        this.handles.addChild(this.bottomRightHandle);


     
        
        
        this.handles.visible = false;

     
    
        // make it a red rectangle
       
         
      
                  
      
    } 

    createSquare(position) {
        return new BoxSquare(this.game, 0, 0, this.texture, 'corner', position, this, this.context);    
    }

    resizeClipArt() {

        console.log('resizeClipArt');

     

        if (!this.preserveRatio) { 
            this.clipart.x = this.topLeftHandle.x + 10;
            this.clipart.y = this.topLeftHandle.y + 10;     
            this.clipart.width = Math.abs((this.topRightHandle.x - 10) - (this.topLeftHandle.x + 10));
            this.clipart.height = Math.abs((this.bottomRightHandle.y - 10)- (this.topRightHandle.y + 10));
        } else {


            let maxWidth =  (this.rightHandle.x + 10) - (this.leftHandle.x - 10);
            let maxHeight = (this.bottomCenterHandle.y - 10) - (this.topCenterHandle.y + 10);
 
             // To preserve the aspect ratio
             
             let ratioX = maxWidth / this.clipart.width;
             let ratioY = maxHeight / this.clipart.height;
             let ratio = Math.abs(Math.min(ratioX, ratioY));
            
    
             //width and height based on aspect ratio

            

             
             
             this.clipart.width = Math.abs(this.clipart.width * ratio);
             this.clipart.height = Math.abs(this.clipart.height * ratio);
             
             if (this.clipart.width >= (this.rightHandle.x - 10)  - (this.leftHandle.x + 10))
                 this.clipart.x = this.topLeftHandle.x - 10;
             else 
                this.clipart.x = this.leftHandle.x + ((this.rightHandle.x - 10) - (this.leftHandle.x + 10)) / 2 - (this.clipart.width / 2);

                this.clipart.y = this.topLeftHandle.y + 10;
        }

      
        
    } 

    

    releaseClipart() {

        this.handles.visible = false;

        if (this.clipart)
            this.game.world.moveDown(this.clipart);
        this.clipart = null;
    
    }

    captureClipArt(clipart) {
        console.log('captureClipArt');
        this.clipart = clipart;
       // this.clipart.bringToTop();
        this.handles.visible = true;
        
        this.update();
        this.bringToTop();

       
    }

    drawBounds() {

        this.bounds.clear();
        this.bounds.lineStyle(1, 0x0000FF);
        this.bounds.moveTo(this.bottomLeftHandle.x, this.bottomLeftHandle.y);
        this.bounds.lineTo(this.topLeftHandle.x, this.topLeftHandle.y);

        this.bounds.moveTo(this.topLeftHandle.x, this.topLeftHandle.y);
        this.bounds.lineTo(this.topRightHandle.x, this.topRightHandle.y);

        this.bounds.moveTo(this.topRightHandle.x, this.topRightHandle.y);
        this.bounds.lineTo(this.bottomRightHandle.x, this.bottomRightHandle.y);

        this.bounds.moveTo(this.bottomRightHandle.x, this.bottomRightHandle.y);
        this.bounds.lineTo(this.bottomLeftHandle.x, this.bottomLeftHandle.y);

    }
        
    
    onInputOverLock(button, pointer) {
        console.log(button);
      
    
        if (this.preserveRatio) {
            this.buttonLock.loadTexture('box','lock_hover');
        } else {
           
            this.buttonLock.loadTexture('box','unlock_hover');
        }
    }

    onInputOutLock(button, pointer) {
        console.log(button);
      
       
        if (this.preserveRatio) {
            this.buttonLock.loadTexture('box','lock');
        } else {
           
            this.buttonLock.loadTexture('box','unlock');
        }
    }
    onToggleLock(button, pointer) {

      
        this.preserveRatio = !this.preserveRatio;
        if (this.preserveRatio) {
            this.buttonLock.loadTexture('box','lock');
            this.topLeftHandle.loadTexture('box','corner_locked');
            this.topCenterHandle.loadTexture('box','corner_locked');
            this.topRightHandle.loadTexture('box','corner_locked');
            this.leftHandle.loadTexture('box','corner_locked');
            this.rightHandle.loadTexture('box','corner_locked');
            this.bottomLeftHandle.loadTexture('box','corner_locked');
            this.bottomCenterHandle.loadTexture('box','corner_locked');
            this.bottomRightHandle.loadTexture('box','corner_locked');
            

        } else {
           
            this.buttonLock.loadTexture('box','unlock');
            this.topLeftHandle.loadTexture('box','corner');
            this.topCenterHandle.loadTexture('box','corner');
            this.topRightHandle.loadTexture('box','corner');
            this.leftHandle.loadTexture('box','corner');
            this.rightHandle.loadTexture('box','corner');
            this.bottomLeftHandle.loadTexture('box','corner');
            this.bottomCenterHandle.loadTexture('box','corner');
            this.bottomRightHandle.loadTexture('box','corner');
        }

        
    }

    onBringForward(button, pointer) {
        if (!this.clipart) 
            return;
        
        this.clipart.moveUp();
        this.bringToTop();
    }

    bringToTop(){
        this.game.world.bringToTop(this.handles);
    }

    onDelete(button, pointer) {
        if (!this.clipart)
            return;

        this.clipart.kill();
        this.clipart = null;
        this.handles.visible = false;
    }

    onPaint(button, pointer){

    
        

        if (!this.clipart) 
            return;

        this.handles.visible = false;
        this.clipart.inputEnabled = false;
        //this.clipart.stage.updateTransform();
        this.game.bmd.draw(this.clipart, this.clipart.x, this.clipart.y);
        this.game.bmd.update();
            
        this.clipart.kill();
        this.clipart = null;

       
            
    
    }

    update() {
        this.topRightHandle.x = this.clipart.x + this.clipart.width + 10;
        this.topRightHandle.y = this.clipart.y - 10; 

        this.topCenterHandle.x = this.clipart.x + this.clipart.width / 2;
        this.topCenterHandle.y = this.clipart.y - 10;

        this.topLeftHandle.x = this.clipart.x - 10; 
        this.topLeftHandle.y = this.clipart.y - 10;
        
        this.leftHandle.x = this.clipart.x - 10;
        this.leftHandle.y = this.clipart.y + this.clipart.height / 2;

        this.rightHandle.x = this.clipart.x + this.clipart.width + 10;
        this.rightHandle.y = this.clipart.y + this.clipart.height / 2; 

        this.bottomLeftHandle.x = this.clipart.x - 10; 
        this.bottomLeftHandle.y = this.clipart.y + this.clipart.height + 10;

        this.bottomCenterHandle.x = this.clipart.x + this.clipart.width / 2;
        this.bottomCenterHandle.y = this.clipart.y + this.clipart.height + 10;

        this.bottomRightHandle.x = this.clipart.x + this.clipart.width + 10;
        this.bottomRightHandle.y = this.clipart.y + this.clipart.height + 10;

         
     
        this.updateButtons();
        this.drawBounds();
        
    }

    updateButtons() {

      
        let handleX = this.topLeftHandle.x + this.topLeftHandle.width / 2;
        let handleY = this.topLeftHandle.y;
        
        let modX = 1; 
        let modY = -1;



        if (this.clipart.y + this.clipart.height / 2 < this.game.bmdContainer.height / 2) {
            handleY = this.bottomLeftHandle.y;
            modY = 1;
        }

        if (this.clipart.x + this.clipart.width / 2 < this.game.bmdContainer.width / 2) {
            handleX = this.topRightHandle.x - this.topRightHandle.width / 2;
            modX = -1;
        }
    
        this.buttonZorder.x = handleX + (99 * modX);
        this.buttonZorder.y = handleY + (33 * modY);
    
        this.buttonLock.x = handleX + (66 * modX);   
        this.buttonLock.y = handleY + (33 * modY);

        this.buttonStamp.x = handleX;
        this.buttonStamp.y = handleY + (33 * modY);

        this.buttonDelete.x = handleX + (33 * modX);
        this.buttonDelete.y = handleY + (33 * modY);
    }

}
module.exports = {BoundingBox}