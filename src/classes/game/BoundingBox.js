const { Rectangle, Graphics } = require('phaser-ce');
const {BoxHandleEnum, BoxSquare} = require('../game/BoxSquare');
const {GameText} = require('./GameText');
const { ActiveToolEnum } = require('./GUI');
const {Clipart} = require('./Clipart');

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
        if (!this.game.device.desktop) {
            button.scale.setTo(2);
        }
        return button;
    }   

    initHandles(){

      
        this.handles = new Phaser.Group(this.game);   
   

        this.buttonLock = this.createButton(this.onToggleLock, 'unlock_hover', 'unlock');
        this.buttonStamp = this.createButton(this.onStamped, 'stamp_hover', 'stamp');
        this.buttonDelete = this.createButton(this.onDelete, 'delete_hover', 'delete');
        this.buttonZorderDown = this.createButton(this.onSendBack, 'down_hover', 'down');
        this.buttonZorderUp = this.createButton(this.onBringForward, 'up_hover', 'up');
        this.buttonRotateClockwise = this.createButton(this.onRotate, 'rotate_hover', 'rotate');
        this.buttonRotateCounterClockwise = this.createButton(this.onRotate, 'rotate_cc_hover', 'rotate_cc');
        this.buttonFlip = this.createButton(this.onFlip, 'flip_hover', 'flip');

        this.handles.addMultiple([this.buttonLock, this.buttonStamp, this.buttonDelete, 
                                this.buttonZorderDown, this.buttonZorderUp, this.buttonRotateClockwise, this.buttonRotateCounterClockwise, this.buttonFlip])
      
        this.bounds = this.game.add.graphics(0,0);
        this.bounds.anchor.setTo(0.5);
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

    show() {
        this.handles.visible = true;

        if (this.clipart) 
            if (this.clipart.preserveRatio) {
                this.leftHandle.visible = false;
                this.rightHandle.visible = false;
                this.topCenterHandle.visible = false;
                this.bottomCenterHandle.visible= false;
            }
    }

    createHandle(position) {
        const box =  new BoxSquare(this.game, 0, 0, this.texture, 'handle', position, this);
        if (!this.game.device.desktop) {
            box.scale.setTo(2);
        }
        return box;
    }

    resizeClipart(rect) {
        


        if (!this.clipart)
            return;

        if (this.clipart.preserveRatio) { 

            let maxWidth = rect.width;
            let maxHeight = rect.height;
 
             // Calculate the ratio of the source image 
             // TODO: Always use original dimensions for ratio?      
             let ratioX = maxWidth / this.clipart.width;
             let ratioY = maxHeight / this.clipart.height;
             let ratio = Math.abs(Math.min(ratioX, ratioY));
            
             // Width and height based on aspect ratio
             this.clipart.width = Math.abs(this.clipart.width * ratio);
             this.clipart.height = Math.abs(this.clipart.height * ratio);
            
            
             
        } else  {

          
            
            this.clipart.width = rect.width;
            this.clipart.height = rect.height;
        }

    
        this.game.events.dispatchEvent('ObjectResized', this.clipart);
    } 

    rotatePoint(tx, ty, centerx, centery, degrees) {
        var newx = (tx - centerx) * Math.cos(degrees * Math.PI / 180) - (ty - centery) * Math.sin(degrees * Math.PI / 180) + centerx;
        var newy = (tx - centerx) * Math.sin(degrees * Math.PI / 180) + (ty - centery) * Math.cos(degrees * Math.PI / 180) + centery;
        return { x: newx, y: newy};
    }

    releaseClipart() {
        if (this.isActive) {
            this.hide();
            this.game.events.dispatchEvent('ObjectReleased', this.clipart);
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

    captureClipart(clipart) {
       

        if (this.clipart != null)
            if (this.clipart.Id != clipart.Id)
                this.game.events.dispatchEvent('ObjectReleased', this.clipart);
    
        this.clipart = clipart;



      
        this.game.events.dispatchEvent('ObjectCaptured', clipart);

        if (this.isText) {
            this.buttonLock.visible = false;
            this.game.gui.fontTool.setCurrentFont(this.clipart.fontIndex);
            this.game.gui.setTool(ActiveToolEnum.TEXT, false);
        } 
        else 
        {
            this.buttonLock.visible = true;
            this.game.gui.setTool(ActiveToolEnum.CLIPART, false);
        }

        this.updateBounds();
        this.setResizeRatioMode(this.clipart.preserveRatio);
        this.show();
        
        this.resetButtonTextures();
        this.drawBounds();
        this.bringToTop();

       
    }
// 10:30 4/18 
    resetButtonTextures() {

        if (!this.clipart)
            return;
        
        
    

        this.buttonDelete.loadTexture(this.texture, 'delete');
        this.buttonStamp.loadTexture(this.texture, 'stamp');
        this.buttonZorderDown.loadTexture(this.texture,'down');
        this.buttonZorderUp.loadTexture(this.texture,'up');
        this.buttonRotateClockwise.loadTexture(this.texture, 'rotate');
        this.buttonRotateCounterClockwise.loadTexture(this.texture, 'rotate_cc');
        this.buttonFlip.loadTexture(this.texture, 'flip');
    }

    drawBounds() {

       
        if (!this.clipart)
            return;

        this.bounds.clear();
        this.bounds.lineStyle(1, 0x4567FF);

        if (!this.raw_rect)
            return;


        // if the ratio locked bounding is null, create a new one
        let tl = this.raw_rect.topLeft;
        let tr = this.raw_rect.topRight;
        let bl = this.raw_rect.bottomLeft;
        let br = this.raw_rect.bottomRight;
        const cx = this.raw_rect.centerX;
        const cy = this.raw_rect.centerY;
        let l = {x: this.raw_rect.left, y: this.raw_rect.centerY};
        let r = {x: this.raw_rect.right, y: this.raw_rect.centerY};
        let bc = {x: this.raw_rect.centerX, y: this.raw_rect.bottom};
        let tc = {x: this.raw_rect.centerX, y: this.raw_rect.top};
        const a = this.clipart.angle;

  //      tl = this.rotatePoint(tl.x, tl.y, cx, cy, a);
  //      tc = this.rotatePoint(tc.x, tc.y, cx, cy, a);
  //      tr = this.rotatePoint(tr.x, tr.y, cx, cy, a);
   //     l = this.rotatePoint(l.x, l.y, cx, cy, a);
    //    r = this.rotatePoint(r.x, r.y, cx, cy, a);
     //   bl = this.rotatePoint(bl.x, bl.y, cx, cy, a);
     //   bc = this.rotatePoint(bc.x, bc.y, cx, cy, a);
     //   br = this.rotatePoint(br.x, br.y, cx, cy, a);

        this.bounds.moveTo(tl.x, tl.y);
        this.bounds.lineTo(tr.x, tr.y);

        this.bounds.moveTo(tr.x, tr.y);
        this.bounds.lineTo(br.x, br.y);

        this.bounds.moveTo(br.x, br.y);
        this.bounds.lineTo(bl.x, bl.y);

        this.bounds.moveTo(bl.x, bl.y);
        this.bounds.lineTo(tl.x, tl.y);


        this.adjustHandles(tl, tc, tr, l, r, bl, bc, br);

    }
        


  

    setResizeRatioMode(value) {
        this.clipart.preserveRatio = value;

        if (this.clipart.preserveRatio) {

            this.leftHandle.visible =false;
            this.rightHandle.visible = false;
            this.topCenterHandle.visible =false;
            this.bottomCenterHandle.visible = false;

            if (!this.isText)
                this.clipart.loadTexture(this.clipart.originalTexture, this.clipart.originalFrame);

            this.buttonLock.loadTexture(this.texture,'lock');
            this.buttonLock.setFrames('lock_hover', 'lock');
            this.topLeftHandle.loadTexture(this.texture,'handle_locked');
            this.topCenterHandle.loadTexture(this.texture,'handle_locked');
            this.topRightHandle.loadTexture(this.texture,'handle_locked');
            this.leftHandle.loadTexture(this.texture,'handle_locked');
            this.rightHandle.loadTexture(this.texture,'handle_locked');
            this.bottomLeftHandle.loadTexture(this.texture,'handle_locked');
            this.bottomCenterHandle.loadTexture(this.texture,'handle_locked');
            this.bottomRightHandle.loadTexture(this.texture,'handle_locked');
            

        } else {
           
            this.leftHandle.visible = true;
            this.rightHandle.visible =true;
            this.topCenterHandle.visible = true;
            this.bottomCenterHandle.visible = true;
            this.buttonLock.loadTexture(this.texture,'unlock');
            this.buttonLock.setFrames('unlock_hover','unlock');
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

        this.setResizeRatioMode(!this.clipart.preserveRatio);
    }

    onBringForward(button, pointer) {
        if (!this.clipart) 
            return;
        
        this.clipart.moveUp();
        this.bringToTop();
        this.game.world.bringToTop(this.game.gui);
    }



  

   

    
    onSendBack(button, pointer) {
        if (!this.clipart) 
            return;
        
        this.clipart.moveDown();
        this.bringToTop();
        this.game.world.bringToTop(this.game.gui);
    }

    bringToTop(){
        this.game.world.bringToTop(this.handles);
        this.game.world.bringToTop(this.game.gui);
    }

    onDelete(button, pointer) {
        if (!this.isActive)
            return;

        this.game.events.dispatchEvent('ObjectDestroyed', this.clipart);      
        this.clipart = null;
        this.hide();
    }



    onPaint(button, pointer){

        if (!this.isActive) 
            return;

        this.hide();
        
        this.game.events.dispatchEvent('ObjectStamped', this.clipart);
        this.clipart = null;
       
            
    
    }

    setHandlePosition(handle, position) {
        handle.x = position.x;
        handle.y = position.y;
    }

    adjustHandles(tl, tc, tr, l, r, bl, bc, br) {

        if (!this.clipart)
            return;
      
        this.setHandlePosition(this.topLeftHandle, tl);
        this.setHandlePosition(this.topCenterHandle, tc);
        this.setHandlePosition(this.topRightHandle, tr);

        this.setHandlePosition(this.leftHandle, l);
        this.setHandlePosition(this.rightHandle, r);

        
        this.setHandlePosition(this.bottomLeftHandle, bl);
        this.setHandlePosition(this.bottomCenterHandle, bc);
        this.setHandlePosition(this.bottomRightHandle, br);

        /*
        const bounds = new Phaser.Rectangle(this.clipart.x - this.clipart.width / 2, this.clipart.y - this.clipart.height / 2, this.clipart.height, this.clipart.width);
        this.topRightHandle.x = bounds.x + bounds.width + HANDLE_BUFFER;
        this.topRightHandle.y = bounds.y - HANDLE_BUFFER; 

        this.topCenterHandle.x = bounds.x + bounds.width / 2;
        this.topCenterHandle.y = bounds.y - HANDLE_BUFFER;

        this.topLeftHandle.x = bounds.x - HANDLE_BUFFER; 
        this.topLeftHandle.y = bounds.y - HANDLE_BUFFER;
        
        this.leftHandle.x = bounds.x - HANDLE_BUFFER;
        this.leftHandle.y = bounds.y + bounds.height / 2;

        this.rightHandle.x = bounds.x + bounds.width + HANDLE_BUFFER;
        this.rightHandle.y = bounds.y + bounds.height / 2; 

        this.bottomLeftHandle.x = bounds.x - HANDLE_BUFFER; 
        this.bottomLeftHandle.y = bounds.y + bounds.height + HANDLE_BUFFER;

        this.bottomCenterHandle.x = bounds.x + bounds.width / 2;
        this.bottomCenterHandle.y = bounds.y + bounds.height + HANDLE_BUFFER;

        this.bottomRightHandle.x = bounds.x + bounds.width + HANDLE_BUFFER;
        this.bottomRightHandle.y = bounds.y + bounds.height + HANDLE_BUFFER; */

       
      
        this.updateButtons();
       
       /* this.handles.forEach((handle)=> {
            this.rotateHandle(handle, this.clipart.angle);
        }); */
        
   
        
    }

    rotateHandle(handle, angle){

        if (handle instanceof Phaser.Graphics || handle.norotate)
            return;

        const pos = this.rotatePoint(handle.x, handle.y, this.clipart.centerX, this.clipart.centerY, this.clipart.angle);
        handle.x = pos.x; 
        handle.y = pos.y;
        handle.angle = angle;
        handle.updateTransform();
    }

    updateButtons() {

      
        if (!this.clipart)
            return;


        
        let handleX = this.topLeftHandle.x;
        let handleY = this.topLeftHandle.y;

       
        
        let modX = 1; 
        let modY = 1;
        /*


        if (this.clipart.y + this.clipart.height / 2 < this.game.bmdContainer.height / 2) {
            handleY = this.bottomLeftHandle.y;
            modY = 1;
        }

        if (this.clipart.x + this.clipart.width / 2 < this.game.bmdContainer.width / 2) {
            handleX = this.topRightHandle.x - this.topRightHandle.width / 2;
            modX = -1;
        }*/


        if (handleX < 33)
            handleX = 33;

        if (handleY < 66)
            handleY = 66;

        if (handleX > this.game.bmd.width - 66)
            handleX = this.game.bmd.width - 66;

        if (handleY > this.game.bmd.height)
            handleY = this.game.bmd.height;


        this.buttonFlip.x = handleX + (231 * modX);
        this.buttonFlip.y = handleY - (33 * modY);

        this.buttonRotateClockwise.x = handleX + (198 * modX);
        this.buttonRotateClockwise.y = handleY - (33 * modY);

        this.buttonRotateCounterClockwise.x = handleX + (165 * modX);
        this.buttonRotateCounterClockwise.y = handleY - (33 * modY);
    

        this.buttonLock.x = handleX + (132 * modX);   
        this.buttonLock.y = handleY - (33 * modY);

        this.buttonZorderUp.x = handleX + (99 * modX);
        this.buttonZorderUp.y = handleY - (33 * modY);

        this.buttonZorderDown.x = handleX + (66 * modX);
        this.buttonZorderDown.y = handleY - (33 * modY);
    
    
       

        this.buttonStamp.x = handleX;
        this.buttonStamp.y = handleY -(33 * modY);

        this.buttonDelete.x = handleX + (33 * modX);
        this.buttonDelete.y = handleY - (33 * modY);
    }

    updateBounds() {

        if (!this.clipart)
            return;

        const flip = this.clipart.scale.x < 0;
            
        if (flip)
            this.clipart.scale.x = this.clipart.scale.x * -1;

        let x = this.clipart.x - this.clipart.width / 2;
        let y = this.clipart.y - this.clipart.height / 2;




        this.raw_rect = new Phaser.Rectangle(x, y, this.clipart.width, this.clipart.height);

        if (flip)
            this.clipart.scale.x = this.clipart.scale.x * -1;
    }

    /** 
     * Resizes the bounding box around the captured gameart
     * 
     * TODO: Determine how to resize using the phaser rectangle object.
     * Look to simplify this method in the next release
     */
    onHandleDragUpdate(handle, pointer) {

       
        const padding = 34;  // minimum spacing between handles         
        const flip = this.clipart.scale.x < 0;

        this.updateBounds();

        let handleName = handle.name;
     
        let tl = this.raw_rect.topLeft;
        let tr = this.raw_rect.topRight;
        let bl = this.raw_rect.bottomLeft;
        let br = this.raw_rect.bottomRight;
        const cx = this.raw_rect.centerX;
        const cy = this.raw_rect.centerY;
         
        let tc = {x: cx, y: this.raw_rect.top};
        let bc = {x: cx, y: this.raw_rect.bottom};
        let l = {x: this.raw_rect.left, y: cy};
        let r = {x: this.raw_rect.right, y: cy};
        const a = this.clipart.angle;


        let dir = 1;
        if (flip){
          
            dir = -1;
        
        }
        
        const translation = { x: pointer.x, y: pointer.y} // this.rotatePoint(pointer.x, pointer.y, handle.dragStartPosition.x, handle.dragStartPosition.y, 0);
      
    
        switch (handleName) {
            case BoxHandleEnum.BottomRight:

                
                if (translation.x < tl.x * dir + padding * dir)
                    translation.x = tl.x * dir + padding * dir;
                
                if (translation.y < tr.y + padding)
                    translation.y = tr.y + padding;

                br = translation;
                tr.x = br.x;
                bl.y = br.y;
            break;

            case BoxHandleEnum.Left:

                if (translation.x > r.x * dir - padding * dir)
                    translation.x = r.x * dir - padding * dir;

                l = translation;
                tl.x = l.x;
                bl.x = l.x;
            break;

            case BoxHandleEnum.Right:

                if (translation.x < l.x * dir + padding * dir)
                    translation.x = l.x * dir + padding * dir


                r = translation;
                tr.x = r.x;
                br.x = r.x;
            break;

            case BoxHandleEnum.TopCenter:
  
                if (translation.y > bc.y - padding)
                    translation.y = bc.y - padding

                tc = translation;
                tl.y = tc.y;
                tr.y = tc.y;
            break;

            case BoxHandleEnum.BottomCenter:

            
            if (translation.y > tc.y + padding)
                translation.y = tc.y + padding

            bc = translation;
            bl.y = bc.y;
            br.y = bc.y;
        break;


            case BoxHandleEnum.BottomLeft:

                

                if (translation.x > br.x - padding)
                    translation.x = br.x - padding;
            
                if (translation.y < tl.y + padding)
                    translation.y = tl.y + padding;

                bl = translation;
                tl.x = bl.x;
                br.y = bl.y;
            break;
        case BoxHandleEnum.TopLeft:

                
            if (translation.x > tr.x - padding)
                translation.x = tr.x - padding;
            
            if (translation.y > bl.y - padding)
                translation.y = bl.y - padding;

            tl = translation;
            bl.x = tl.x;
            tr.y = tl.y;
            break;

        case BoxHandleEnum.TopRight:

                
        if (translation.x < tl.x + padding)
            translation.x = tl.x + padding;
        
        if (translation.y > br.y - padding)
            translation.y = br.y - padding;

        tr = translation;
        br.x = tr.x;
        tl.y = tr.y;
        break;
        }

        this.resizeClipart(new Phaser.Rectangle(tl.x, tl.y, br.x - bl.x, br.y - tr.y));
        this.drawBounds();

        if (flip)
            this.clipart.scale.x = this.clipart.scale.x * -1;
        
       return;

    }
    

    onDragStop(sprite, pointer) {
        
        
        this.isResizing = false;
      

    }

    onDragStart(handle, pointer) {
        this.isResizing = true;
    }
    onRotate(button) {
        
    
        
    }

    onFlip(button) {

        if (!this.clipart)
            return;


        this.clipart.scale.x = this.clipart.scale.x * -1;
       
        this.updateBounds();
        this.drawBounds();
        this.game.events.dispatchEvent('ObjectFlipped', this.clipart);
    }

    onStamped(button) {
        this.game.events.dispatchEvent('ObjectStamped', this.clipart);
        this.hide();
        this.clipart = null;
    }

    update() {

    
        if (!this.clipart)
            return;

        if (this.clipart.isDragged || this.clipart.isResizing)
            return;

        let amount = 1;

        if (this.game.input.activePointer.isDown) {

            if (this.game.input.activePointer.duration > 1000)
                amount = 2;


            if (this.buttonRotateClockwise.input.checkPointerOver(this.game.input.activePointer)) {
                this.clipart.angle += amount;
                this.clipart.updateTransform();
                this.updateBounds();
                this.drawBounds();
            }
     
            
            if (this.buttonRotateCounterClockwise.input.checkPointerOver(this.game.input.activePointer)) {     
                this.clipart.angle -= amount;
                this.clipart.updateTransform();
                this.updateBounds();
                this.drawBounds();
            }
        
        }
    }
}

module.exports = {BoundingBox}