const {BoxHandleEnum, BoxSquare} = require('../game/BoxSquare');
const {GameText} = require('./GameText');

const HANDLE_BUFFER = 10;

class BoundingBox {
    constructor(game, texture) {
        
        this.texture = texture;
        this.game = game;
        
        this.clipart = null;
        this.initHandles();
    }

    createButton(callback, overTexture, outTexture) {
        let button = new Phaser.Button(this.game, 0, 0, this.texture, callback, this, overTexture, outTexture);
        button.anchor.setTo(0.5);
        return button;
    }   

    initHandles(){

        this.handles = new Phaser.Group(this.game);
        this.buttonLock = this.createButton(this.onToggleLock, 'unlock_hover', 'unlock');
        this.buttonStamp = this.createButton(this.onStamped, 'stamp_hover', 'stamp');
        this.buttonDelete = this.createButton(this.onDelete, 'delete_hover', 'delete');
        this.buttonZorderDown = this.createButton(this.onSendBack, 'down_hover', 'down');
        this.buttonZorderUp = this.createButton(this.onBringForward, 'up_hover', 'up');
    
        this.handles.addMultiple([this.buttonLock, this.buttonStamp, this.buttonDelete, 
                                this.buttonZorderDown, this.buttonZorderUp])
      
        this.bounds = this.game.add.graphics(0,0);
        this.handles.add(this.bounds);

        this.topLeftHandle = this.createHandle(BoxHandleEnum.TopLeft);   
        this.topCenterHandle = this.createHandle(BoxHandleEnum.TopCenter);
        this.topRightHandle = this.createHandle(BoxHandleEnum.TopRight);
        this.leftHandle = this.createHandle(BoxHandleEnum.Left);
        this.rightHandle = this.createHandle(BoxHandleEnum.Right);
        this.bottomLeftHandle = this.createHandle(BoxHandleEnum.BottomLeft);
        this.bottomCenterHandle = this.createHandle(BoxHandleEnum.BottomCenter);
        this.bottomRightHandle = this.createHandle(BoxHandleEnum.BottomRight);

        this.handles.addMultiple([this.topLeftHandle, this.topCenterHandle, this.topRightHandle,
                                  this.leftHandle, this.rightHandle, 
                                  this.bottomLeftHandle, this.bottomCenterHandle, this.bottomRightHandle]);
    
        this.hide()
      
    } 

    hide() {
        this.handles.visible = false;
    }

    createHandle(position) {
        return new BoxSquare(this.game, 0, 0, this.texture, 'handle', position, this);
    }

    resizeClipart() {
        
        if (!this.element)
            return;

        if (this.element.preserveRatio) { 

            let maxWidth =  (this.rightHandle.x + HANDLE_BUFFER) - (this.leftHandle.x - HANDLE_BUFFER);
            let maxHeight = (this.bottomCenterHandle.y - HANDLE_BUFFER) - (this.topCenterHandle.y + HANDLE_BUFFER);
 
             // Calculate the ratio of the source image TODO: Always use original dimensions for ratio?      
             let ratioX = maxWidth / this.element.width;
             let ratioY = maxHeight / this.element.height;
             let ratio = Math.abs(Math.min(ratioX, ratioY));
            
             // Width and height based on aspect ratio
             this.element.width = Math.abs(this.element.width * ratio);
             this.element.height = Math.abs(this.element.height * ratio);
             
             if (this.element.width >= (this.rightHandle.x - HANDLE_BUFFER)  - (this.leftHandle.x + HANDLE_BUFFER))
                 this.element.x = this.topLeftHandle.x - HANDLE_BUFFER;
             else 
                this.element.x = this.leftHandle.x + ((this.rightHandle.x - HANDLE_BUFFER) - (this.leftHandle.x + HANDLE_BUFFER)) / 2 - (this.element.width / 2);

            this.element.y = this.topLeftHandle.y + HANDLE_BUFFER;
           
        } else {

            this.element.x = this.topLeftHandle.x;
            this.element.y = this.topLeftHandle.y;    
            
            this.element.width = Math.abs((this.topRightHandle.x) - (this.topLeftHandle.x));
            this.element.height = Math.abs((this.bottomRightHandle.y)- (this.topRightHandle.y));
        }

        this.game.events.dispatchEvent('ObjectResized', this.element);
    } 


    releaseClipart() {
        if (this.isActive) {
            this.hide();
            this.game.events.dispatchEvent('ObjectReleased', this.element);
            this.clipart = null;
        }
    }

    get isText() {
        if (this.isActive)
            return this.clipart instanceof GameText;
        else 
            return false;
    }

    get isActive() {
        return this.clipart; 
    }

    get element() {
        return this.clipart;
    }

    captureClipart(clipart) {
       

        if (this.element != null)
            if (this.element.Id != clipart.Id)
                this.game.events.dispatchEvent('ObjectReleased', this.clipart);

        this.clipart = clipart;

        this.game.events.dispatchEvent('ObjectCaptured', clipart);

        if (this.isText) {
            this.setRatioLock(true);  // Lock ratio for text by default
            this.buttonLock.visible = false;
            this.game.gui.fontTool.setCurrentFont(this.clipart.fontIndex);
            this.game.gui.setToolText();
        } 
        else 
        {
            this.buttonLock.visible = true;
            this.setRatioLock(this.clipart.preserveRatio);
            this.game.gui.setToolClipart();
        }

        this.hide();
        
        this.resetButtonTextures();
        this.updatePositions();
        this.bringToTop();

       
    }

    resetButtonTextures() {

        // TODO: Fix this up
        this.onInputOutLock(null, null);
        this.buttonDelete.loadTexture(this.texture,'delete');
        this.buttonStamp.loadTexture(this.texture, 'stamp');
        this.buttonZorderDown.loadTexture(this.texture,'down');
        this.buttonZorderUp.loadTexture(this.texture,'up');
    }

    drawBounds() {

        
        if (!this.clipart)
            return;

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
        // TODO: REMOVE THIS
        if (!this.clipart)
            return;
    
        if (this.clipart.preserveRatio) {
            this.buttonLock.loadTexture(this.texture,'lock_hover');
        } else {
           
            this.buttonLock.loadTexture(this.texture,'unlock_hover');
        }
    }

    onInputOutLock(button, pointer) {
        // TODO: REMOVE THIS
        if (!this.clipart)
            return;
      
       
        if (this.clipart.preserveRatio) {
            this.buttonLock.loadTexture(this.texture,'lock');
        } else {
           
            this.buttonLock.loadTexture(this.texture,'unlock');
        }
    }

    setRatioLock(value) {

        if (!this.clipart || this.isText)
            return;


        this.clipart.preserveRatio = value;
        if (this.clipart.preserveRatio) {
            console.log('setting lock');
            this.buttonLock.loadTexture(this.texture,'lock');
            this.topLeftHandle.loadTexture(this.texture,'handle_locked');
            this.topCenterHandle.loadTexture(this.texture,'handle_locked');
            this.topRightHandle.loadTexture(this.texture,'handle_locked');
            this.leftHandle.loadTexture(this.texture,'handle_locked');
            this.rightHandle.loadTexture(this.texture,'handle_locked');
            this.bottomLeftHandle.loadTexture(this.texture,'handle_locked');
            this.bottomCenterHandle.loadTexture(this.texture,'handle_locked');
            this.bottomRightHandle.loadTexture(this.texture,'handle_locked');
            

        } else {
           
            console.log('setting unlock');
            this.buttonLock.loadTexture(this.texture,'unlock');
            this.topLeftHandle.loadTexture(this.texture,'handle');
            this.topCenterHandle.loadTexture(this.texture,'handle');
            this.topRightHandle.loadTexture(this.texture,'handle');
            this.leftHandle.loadTexture(this.texture,'handle');
            this.rightHandle.loadTexture(this.texture,'handle');
            this.bottomLeftHandle.loadTexture(this.texture,'handle');
            this.bottomCenterHandle.loadTexture(this.texture,'handle');
            this.bottomRightHandle.loadTexture(this.texture,'handle');
        }

    }


    onToggleLock(button, pointer) {

      
        if (!this.clipart || this.isText)
            return;

        this.clipart.preserveRatio = !this.clipart.preserveRatio;
        if (this.clipart.preserveRatio) {
            this.buttonLock.loadTexture(this.texture,'lock');
            this.topLeftHandle.loadTexture(this.texture,'handle_locked');
            this.topCenterHandle.loadTexture(this.texture,'handle_locked');
            this.topRightHandle.loadTexture(this.texture,'handle_locked');
            this.leftHandle.loadTexture(this.texture,'handle_locked');
            this.rightHandle.loadTexture(this.texture,'handle_locked');
            this.bottomLeftHandle.loadTexture(this.texture,'handle_locked');
            this.bottomCenterHandle.loadTexture(this.texture,'handle_locked');
            this.bottomRightHandle.loadTexture(this.texture,'handle_locked');
            

        } else {
           
            this.buttonLock.loadTexture(this.texture,'unlock');
            this.topLeftHandle.loadTexture(this.texture,'handle');
            this.topCenterHandle.loadTexture(this.texture,'handle');
            this.topRightHandle.loadTexture(this.texture,'handle');
            this.leftHandle.loadTexture(this.texture,'handle');
            this.rightHandle.loadTexture(this.texture,'handle');
            this.bottomLeftHandle.loadTexture(this.texture,'handle');
            this.bottomCenterHandle.loadTexture(this.texture,'handle');
            this.bottomRightHandle.loadTexture(this.texture,'handle');
        }

        
    }

    onBringForward(button, pointer) {
        if (!this.clipart) 
            return;
        
        this.clipart.moveUp();
        this.bringToTop();
    }

    
    onSendBack(button, pointer) {
        if (!this.clipart) 
            return;
        
        this.clipart.moveDown();
        this.bringToTop();
    }

    bringToTop(){
        this.game.world.bringToTop(this.handles);
    }

    onDelete(button, pointer) {
        if (!this.isActive)
            return;

        this.game.events.dispatchEvent('ObjectDestroyed', this.element);      
        this.clipart = null;
        this.hide();
    }



    onPaint(button, pointer){

        if (!this.isActive) 
            return;

        this.hide();
        
        this.game.events.dispatchEvent('ObjectStamped', this.element);
        this.clipart = null;
       
            
    
    }

    updatePositions() {

        if (!this.clipart)
            return;

        this.topRightHandle.x = this.clipart.x + this.clipart.width + HANDLE_BUFFER;
        this.topRightHandle.y = this.clipart.y - HANDLE_BUFFER; 

        this.topCenterHandle.x = this.clipart.x + this.clipart.width / 2;
        this.topCenterHandle.y = this.clipart.y - HANDLE_BUFFER;

        this.topLeftHandle.x = this.clipart.x - HANDLE_BUFFER; 
        this.topLeftHandle.y = this.clipart.y - HANDLE_BUFFER;
        
        this.leftHandle.x = this.clipart.x - HANDLE_BUFFER;
        this.leftHandle.y = this.clipart.y + this.clipart.height / 2;

        this.rightHandle.x = this.clipart.x + this.clipart.width + HANDLE_BUFFER;
        this.rightHandle.y = this.clipart.y + this.clipart.height / 2; 

        this.bottomLeftHandle.x = this.clipart.x - HANDLE_BUFFER; 
        this.bottomLeftHandle.y = this.clipart.y + this.clipart.height + HANDLE_BUFFER;

        this.bottomCenterHandle.x = this.clipart.x + this.clipart.width / 2;
        this.bottomCenterHandle.y = this.clipart.y + this.clipart.height + HANDLE_BUFFER;

        this.bottomRightHandle.x = this.clipart.x + this.clipart.width + HANDLE_BUFFER;
        this.bottomRightHandle.y = this.clipart.y + this.clipart.height + HANDLE_BUFFER;

         
     
        this.updateButtons();
        this.drawBounds();
        
    }

    updateButtons() {

      
        if (!this.clipart)
            return;

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
    

        this.buttonLock.x = handleX + (132 * modX);   
        this.buttonLock.y = handleY + (33 * modY);

        this.buttonZorderUp.x = handleX + (99 * modX);
        this.buttonZorderUp.y = handleY + (33 * modY);

        this.buttonZorderDown.x = handleX + (66 * modX);
        this.buttonZorderDown.y = handleY + (33 * modY);
    
    
       

        this.buttonStamp.x = handleX;
        this.buttonStamp.y = handleY + (33 * modY);

        this.buttonDelete.x = handleX + (33 * modX);
        this.buttonDelete.y = handleY + (33 * modY);
    }

    onHandleDragUpdate(handle, pointer) {

        let padding = 34;  // minimum spacing between handles
        switch(handle.name){
            case BoxHandleEnum.TopLeft:
 

                // adjust east and west
                if (handle.x > this.topRightHandle.x - padding)
                    handle.x = this.topRightHandle.x - padding

                if (handle.y > this.bottomLeftHandle.y - padding)
                    handle.y = this.bottomLeftHandle.y - padding

                
                this.leftHandle.x = handle.x;
                
                // Adjust adjacent handle
                this.bottomLeftHandle.x = handle.x;
                

                // adjust north and south
                this.topCenterHandle.x = handle.x + Math.abs(this.topRightHandle.x - handle.x) / 2;
                this.topCenterHandle.y = handle.y;
                this.bottomCenterHandle.x = this.topCenterHandle.x;
                this.leftHandle.y = this.bottomLeftHandle.y - Math.abs(this.bottomLeftHandle.y - handle.y) / 2;
                this.rightHandle.y = this.leftHandle.y;

                    // adjust adjacent corners
                this.topRightHandle.y = handle.y;
                break;

            case BoxHandleEnum.TopCenter:


                // Force vertical movement only for the center handle
                this.topCenterHandle.x = this.bottomCenterHandle.x;
                if (handle.y > this.bottomCenterHandle.y - padding) {
                    handle.y = this.bottomCenterHandle.y - padding
                }
                    // adjust adjacent corners
                    this.topLeftHandle.y =  handle.y;
                    this.topRightHandle.y = handle.y;

                    // adjust east and west
                    this.leftHandle.y = this.bottomLeftHandle.y - Math.abs(this.bottomLeftHandle.y - handle.y) / 2;
                    this.rightHandle.y = this.leftHandle.y;
                
                break;

            case BoxHandleEnum.TopRight:
                
                    
                if (handle.x < this.topLeftHandle.x + padding)
                    handle.x = this.topLeftHandle.x + padding

                if (handle.y > this.bottomRightHandle.y - padding)
                    handle.y = this.bottomRightHandle.y - padding

                    
                    // adjust east and west
                     this.rightHandle.x = handle.x;

                     this.bottomRightHandle.x = handle.x;
                     this.bottomCenterHandle.x = this.topCenterHandle.x;
                     this.topCenterHandle.x = this.topLeftHandle.x + Math.abs(handle.x - this.topLeftHandle.x) / 2;
                 
                    // adjust north and sound
                     this.topCenterHandle.y = handle.y;
               
                    this.leftHandle.y = this.bottomLeftHandle.y - Math.abs(this.bottomLeftHandle.y - handle.y) / 2;
                    this.rightHandle.y = this.leftHandle.y;               
                
                    // adjust adjacent corners
                    this.topLeftHandle.y = handle.y;
                   
                   
                break;

            case BoxHandleEnum.Left:

                // Allow only horizontal movement
                this.leftHandle.y = this.rightHandle.y;

                if (handle.x > this.rightHandle.x - padding) {
                    handle.x = this.rightHandle.x - padding
                }
                    // Adjust adjacent corners
                    this.topLeftHandle.x = handle.x;
                    this.bottomLeftHandle.x = handle.x;

                    // Adjust north and south
                    this.topCenterHandle.x = handle.x + Math.abs(this.topRightHandle.x - handle.x) / 2;
                    this.bottomCenterHandle.x = this.topCenterHandle.x;
               

                break;

            case BoxHandleEnum.Right:

                  // Allow only horizontal movement
                  this.rightHandle.y = this.leftHandle.y;

                  if (handle.x < this.leftHandle.x + padding) {
                        handle.x = this.leftHandle.x + padding
                  }
                
                  // Adjust adjacent corners
                  this.topRightHandle.x = handle.x;
                  this.bottomRightHandle.x = handle.x;
  
                  // Adjust north and south
                  this.topCenterHandle.x = this.topLeftHandle.x + Math.abs(handle.x - this.topLeftHandle.x) / 2;
                  this.bottomCenterHandle.x = this.topCenterHandle.x;
                 
                break;

            case BoxHandleEnum.BottomLeft:
                

                    if (handle.x > this.bottomRightHandle.x - padding)
                        handle.x = this.bottomRightHandle.x - padding

                    if (handle.y < this.topLeftHandle.y + padding)
                        handle.y = this.topLeftHandle.y + padding

                    // adjust east and west

                        this.leftHandle.x = handle.x;
                        this.topCenterHandle.x = handle.x + Math.abs(this.bottomRightHandle.x - handle.x) / 2;         
                        this.bottomCenterHandle.x = this.topCenterHandle.x;
                        // adjust corners
                        this.topLeftHandle.x = handle.x;
                  

                  
                        this.rightHandle.y = this.leftHandle.y;
                        this.leftHandle.y = handle.y - Math.abs(handle.y - this.topLeftHandle.y) / 2;
                    
                        // adjust north and sound
                        this.bottomCenterHandle.y = handle.y;
                        this.bottomRightHandle.y = handle.y;
                  
                  
                break;

            case BoxHandleEnum.BottomCenter:

                // force vertical only movement for the bottom center handle
                this.bottomCenterHandle.x = this.topCenterHandle.x;

                if (handle.y < this.topCenterHandle.y + padding) {
                    handle.y = this.topCenterHandle.y + padding
                }
                // adjust adjacent corners
                this.bottomLeftHandle.y = handle.y;
                this.bottomRightHandle.y = handle.y;

                // adjust east and west
                this.leftHandle.y = handle.y - Math.abs(handle.y - this.topLeftHandle.y) / 2;
                this.rightHandle.y = this.leftHandle.y;
                
                break;
 
            case BoxHandleEnum.BottomRight:
               
                if (handle.x < this.bottomLeftHandle.x + padding)
                    handle.x = this.bottomLeftHandle.x + padding

                if (handle.y < this.topRightHandle.y + padding)
                    handle.y = this.topRightHandle.y + padding

                // adjust east and west
                this.rightHandle.x = handle.x;
                   // adjust north and sound

                this.topCenterHandle.x = this.leftHandle.x + Math.abs(handle.x - this.bottomLeftHandle.x) / 2;         
                this.bottomCenterHandle.x = this.topCenterHandle.x;
                this.topRightHandle.x = handle.x;
              

                this.bottomCenterHandle.y = handle.y;
                this.rightHandle.y = this.leftHandle.y;
                this.leftHandle.y = handle.y - Math.abs(handle.y - this.topRightHandle.y) / 2;
             
           
                this.bottomLeftHandle.y = handle.y;
                
               
               
               
                break;
        }
    
        this.updateButtons();

        this.drawBounds();

        this.resizeClipart();
    
    }
    onDragStop(sprite, pointer) {
       
        this.resizeClipart();
    }

    onStamped(button) {
        this.game.events.dispatchEvent('ObjectStamped', this.element);
        this.hide();
        this.clipart = null;
    }

}
module.exports = {BoundingBox}