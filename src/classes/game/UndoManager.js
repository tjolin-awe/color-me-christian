class UndoManager {
    constructor(game, context, length) {
        this.context = context;
        this.game = game;
        this.length = 0;
        this.maxLength = length;
        this.queue = [];
       
    }

    destroy(undo) {

        
            switch (undo) {
                case 'multi':
                    undo.object.destroy();
                    undo.canvas.destroy();
                    break;
                case 'object':
                    undo.object.destroy();
                    break;
                case 'flood':
                    undo.canvas.destroy();
                    break;
            }      
        
    }




    add(type, object) {

        if (this.length > this.maxLength) 
            this.destroy(this.queue.shift());

        
        
        switch(type) {
            case 'multi':
                let canvasArea = this.game.make.bitmapData(this.game.bmd.width, this.game.bmd.height);
                canvasArea.copy(this.game.bmd);
                this.queue.push({type: type, object: object, canvas: canvasArea});
                break;
            case 'object':
                this.queue.push({type: type, object: object});
                break;
            case 'flood':
                let canvas = this.game.make.bitmapData(this.game.bmd.width, this.game.bmd.height);
                canvas.copy(this.game.bmd);
                this.queue.push({type: type, canvas: canvas});
                break;
        }

    }
    undo() {
        
        const undo = this.queue.pop();
        switch(undo.type) {
            case 'multi':
                this.game.bmd.copy(undo.canvas);
                this.game.bmd.update();
                undo.object.revive();
                undo.canvas.destroy();
            
                break;
            case 'object':
                undo.object.revive();
                break;
            case 'flood':
                this.game.bmd.copy(undo.canvas);
                this.game.bmd.update();
                undo.canvas.destroy();
        }
    }
}

module.exports = {UndoManager}