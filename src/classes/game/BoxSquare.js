
const BoxHandleEnum = {
    TopLeft: 'top-left' ,
    TopCenter: 'top-center',
    TopRight: 'top-right',
    Left: 'left' ,
    Right: 'right',
    BottomLeft: 'bottom-left',
    BottomCenter: 'bottom-center',
    BottomRight: 'bottom-right'
   };

Object.freeze(BoxHandleEnum);

const MouseCursors = { 'top-left': 'nwse-resize', 
                      'top-right': 'nesw-resize', 
                      'bottom-left':'nesw-resize',
                      'bottom-right': 'nwse-resize',
                      'left': 'ew-resize',
                      'right':'ew-resize',
                      'top-center': 'ns-resize',
                      'bottom-center': 'ns-resize'
                    };

class BoxSquare extends Phaser.Sprite {
    constructor(game, x, y, texture, frame, name, box, context) {
        super(game, x, y, texture, frame);    
        this.anchor.setTo(0.5);   
        this.scale.setTo(0.5);
        this.game.add.existing(this);
       
        this.name = name;
        this.context = context;

        this.boundingBox = box;
        this.inputEnabled = true;
        this.input.enableDrag(true);
        this.events.onInputOver.add(this.onMouseOver, this);
        this.events.onInputOut.add(this.onMouseOut, this);
        this.events.onDragUpdate.add(this.onDragUpdate, this);
        this.events.onDragStop.add(this.onDragStop, this);

    }

    onMouseOut(sprite, pointer) {
        this.game.canvas.style.cursor = 'default';
    }

    onMouseOver(sprite, pointer) {
        this.game.canvas.style.cursor = MouseCursors[sprite.name];           
    }

    onDragUpdate(square, pointer) {
   
        switch(square.name){
            case BoxHandleEnum.TopLeft:

                // adjust east and west
                this.boundingBox.leftHandle.x = square.x;
                this.boundingBox.leftHandle.y = this.boundingBox.bottomLeftHandle.y - Math.abs(this.boundingBox.bottomLeftHandle.y - square.y) / 2;
                this.boundingBox.rightHandle.y = this.boundingBox.leftHandle.y;
                
                // adjust north and south
                this.boundingBox.topCenterHandle.x = square.x + Math.abs(this.boundingBox.topRightHandle.x - square.x) / 2;
                this.boundingBox.topCenterHandle.y = square.y;
                this.boundingBox.bottomCenterHandle.x = this.boundingBox.topCenterHandle.x;

                // adjust adjacent corners
                this.boundingBox.topRightHandle.y = square.y;
                this.boundingBox.bottomLeftHandle.x = square.x;

                break;

            case BoxHandleEnum.TopCenter:

                // Force vertical movement only for the center handle
                this.boundingBox.topCenterHandle.x = this.boundingBox.bottomCenterHandle.x;

                // adjust adjacent corners
                this.boundingBox.topLeftHandle.y =  square.y;
                this.boundingBox.topRightHandle.y = square.y;

                // adjust east and west
                this.boundingBox.leftHandle.y = this.boundingBox.bottomLeftHandle.y - Math.abs(this.boundingBox.bottomLeftHandle.y - square.y) / 2;
                this.boundingBox.rightHandle.y = this.boundingBox.leftHandle.y;
            
                break;

            case BoxHandleEnum.TopRight:
                
                    
                    // adjust east and west
                    this.boundingBox.leftHandle.y = this.boundingBox.bottomLeftHandle.y - Math.abs(this.boundingBox.bottomLeftHandle.y - square.y) / 2;
                    this.boundingBox.rightHandle.y = this.boundingBox.leftHandle.y;               
                    this.boundingBox.rightHandle.x = square.x;
                      
                    // adjust north and sound
                    this.boundingBox.topCenterHandle.x = this.boundingBox.topLeftHandle.x + Math.abs(square.x - this.boundingBox.topLeftHandle.x) / 2;
                    this.boundingBox.topCenterHandle.y = square.y;
                    this.boundingBox.bottomCenterHandle.x = this.boundingBox.topCenterHandle.x;
    
                    // adjust adjacent corners
                    this.boundingBox.topLeftHandle.y = square.y;
                    this.boundingBox.bottomRightHandle.x = square.x;
                
                break;

            case BoxHandleEnum.Left:

                // Allow only horizontal movement
                this.boundingBox.leftHandle.y = this.boundingBox.rightHandle.y;

                // Adjust adjacent corners
                this.boundingBox.topLeftHandle.x = square.x;
                this.boundingBox.bottomLeftHandle.x = square.x;

                // Adjust north and south
                this.boundingBox.topCenterHandle.x = square.x + Math.abs(this.boundingBox.topRightHandle.x - square.x) / 2;
                this.boundingBox.bottomCenterHandle.x = this.boundingBox.topCenterHandle.x;


                break;

            case BoxHandleEnum.Right:

                  // Allow only horizontal movement
                  this.boundingBox.rightHandle.y = this.boundingBox.leftHandle.y;

                  // Adjust adjacent corners
                  this.boundingBox.topRightHandle.x = square.x;
                  this.boundingBox.bottomRightHandle.x = square.x;
  
                  // Adjust north and south
                  this.boundingBox.topCenterHandle.x = this.boundingBox.topLeftHandle.x + Math.abs(square.x - this.boundingBox.topLeftHandle.x) / 2;
                  this.boundingBox.bottomCenterHandle.x = this.boundingBox.topCenterHandle.x;
  
                break;

            case BoxHandleEnum.BottomLeft:
                
                    // adjust east and west
                    this.boundingBox.leftHandle.y = square.y - Math.abs(square.y - this.boundingBox.topLeftHandle.y) / 2;
                    this.boundingBox.leftHandle.x = square.x;
                    this.boundingBox.rightHandle.y = this.boundingBox.leftHandle.y;
                    
                    // adjust north and sound
                    this.boundingBox.topCenterHandle.x = square.x + Math.abs(this.boundingBox.bottomRightHandle.x - square.x) / 2;         
                    this.boundingBox.bottomCenterHandle.x = this.boundingBox.topCenterHandle.x;
                    this.boundingBox.bottomCenterHandle.y = square.y;

                    // adjust corners
                    this.boundingBox.topLeftHandle.x = square.x;
                    this.boundingBox.bottomRightHandle.y = square.y;
                  
                break;

            case BoxHandleEnum.BottomCenter:

                // force vertical only movement for the bottom center handle
                this.boundingBox.bottomCenterHandle.x = this.boundingBox.topCenterHandle.x;

                // adjust adjacent corners
                this.boundingBox.bottomLeftHandle.y = square.y;
                this.boundingBox.bottomRightHandle.y = square.y;

                // adjust east and west
                this.boundingBox.leftHandle.y = square.y - Math.abs(square.y - this.boundingBox.topLeftHandle.y) / 2;
                this.boundingBox.rightHandle.y = this.boundingBox.leftHandle.y;
                break;

            case BoxHandleEnum.BottomRight:
               
                // adjust east and west
                this.boundingBox.leftHandle.y = square.y - Math.abs(square.y - this.boundingBox.topRightHandle.y) / 2;
                this.boundingBox.rightHandle.x = square.x;
                this.boundingBox.rightHandle.y = this.boundingBox.leftHandle.y;
                
                // adjust north and sound
                this.boundingBox.topCenterHandle.x = this.boundingBox.leftHandle.x + Math.abs(square.x - this.boundingBox.bottomLeftHandle.x) / 2;         
                this.boundingBox.bottomCenterHandle.x = this.boundingBox.topCenterHandle.x;
                this.boundingBox.bottomCenterHandle.y = square.y;

                this.boundingBox.bottomLeftHandle.y = square.y;
                this.boundingBox.topRightHandle.x = square.x;
               
                break;
        }
    
        this.boundingBox.updateButtons();

        this.boundingBox.drawBounds();

        this.boundingBox.resizeClipArt();
    }
    onDragStop(sprite, pointer) {
        console.log('onDragStop');
        this.boundingBox.resizeClipArt();
    }


}

module.exports = {BoxSquare, BoxHandleEnum};