function Event(name){
    this.name = name;
    this.callbacks = [];
  }

  Event.prototype.registerCallback = function(callback, context){
    this.callbacks.push({method: callback, context: context});
  }
  
  function GameEvent(){
    this.events = {};
  }
  
  GameEvent.prototype.registerEvent = function(eventName){
    var event = new Event(eventName);
    this.events[eventName] = event;
  };
  
  GameEvent.prototype.dispatchEvent = function(eventName, eventArgs){
    this.events[eventName].callbacks.forEach(function(callback){
      callback.method.call(callback.context, eventArgs);
    });
  };
  
  GameEvent.prototype.addEventListener = function(eventName, callback, context){
    this.events[eventName].registerCallback(callback, context);
  };

  GameEvent.prototype.removeEventListener = function(eventName, callback, context) {
    /*TODO: remove callback from array of callbacks */
  }

module.exports = {Event, GameEvent}