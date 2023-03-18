
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
    constructor(game, x, y, texture, frame, name, context) {
        super(game, x, y, texture, frame);    
        this.anchor.setTo(0.5);   
        this.scale.setTo(0.5);
        this.game.add.existing(this);
       
        this.name = name;
    
        this.inputEnabled = true;

        this.input.enableDrag(true);
        this.events.onInputOver.add(this.onMouseOver, this);
        this.events.onInputOut.add(this.onMouseOut, this);
        this.events.onDragUpdate.add(context.onHandleDragUpdate, context);
        this.events.onDragStop.add(context.onDragStop, context);
        this.events.onDragStart.add(context.onDragStart, this);

        

    }

    onMouseOut(sprite, pointer) {
        this.game.canvas.style.cursor = 'default';
    }

    onMouseOver(sprite,pointer) {
        this.game.canvas.style.cursor = MouseCursors[sprite.name];           
    }

    


}

module.exports = {BoxSquare, BoxHandleEnum};