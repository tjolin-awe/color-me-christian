// dynamically inject fonts into html page and preload them
function embedFonts(fonts) {
    if (!fonts || fonts.length === 0) 
        return;
        
    var style = fonts.pop();

    var newStyle = document.createElement('style');
    var textNode = '@font-face {';
    textNode += 'font-family: "' + style.name + '";';
    textNode += 'src: url("assets/fonts/' + style.filename + '.woff2") format("woff2"),';
    textNode += 'url("assets/fonts/' + style.filename + '.woff") format("woff");';
    textNode += 'font-weight: normal: font-style: normal';
    textNode += '}';

    newStyle.appendChild(document.createTextNode(textNode));
    document.head.appendChild(newStyle);

    var fontLoader = document.createElement('div');
    fontLoader.innerHTML = 'asd'
    fontLoader.style.position = 'absolute';
    fontLoader.style.left = '-1000px';
    fontLoader.style.visibility = 'hidden';
    fontLoader.style.fontFamily = style.name;
    document.body.appendChild(fontLoader);

    embedFonts(fonts);
}

// generate random int 
function irandom(max) {
    return Math.floor(Math.random() * (max + 1));
}

// generate random int in range
function irandomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate random numebr in range
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// gets random array item
function randomArrayItem(array) {
    if (!Array.isArray(array)) throw new Error('You need to pass an array');
    if (array.length === 0) throw new Error('You need to pass an array with at least one item');
    return array[irandom(array.length - 1)];
}

// randomly choose one of the passed items
function choose(...items) {
    if (items.length === 0) throw new Error('You need to pass at least one item');
    return items[irandom(items.length - 1)];
}

module.exports = {
    embedFonts,
    irandom,
    irandomRange,
    randomRange,
    randomArrayItem,
    choose
}