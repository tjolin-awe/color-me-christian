class Storage {
    constructor(prefix) {
        this.prefix = prefix;
    }

    getItem(name, type) {
        var _item = localStorage.getItem(this.prefix + name);

        // return false if no item found in local storage
        if (_item === null) return null;

        // return item of type
        return this._itemOfType(_item, type);        
    }

    setItem(name, value, type) {
        if (type === 'boolean') {
            value = (value) ? 1 : 0;
        }
        localStorage.setItem(this.prefix + name, value);        
    }

    // adds a new item to the local storage if there is no item 
    // does nothing if there is an item already
    initItem(name, defaultValue, type) {
        var _item = localStorage.getItem(this.prefix + name);
        if (_item === null) {
            this.setItem(name, defaultValue, type);
            _item = defaultValue;
        }
        
        // return item of type
        return this._itemOfType(_item, type);
    }

    // returns variable of given type
    _itemOfType(item, type) {
        if (type === 'int') return parseInt(item);
        if (type === 'float') return parseFloat(item);
        if (type === 'boolean') return (parseInt(item)) ? true : false;
        return String(item);
    }
}

module.exports = {Storage};
