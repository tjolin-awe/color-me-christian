require('expose-loader?PIXI!phaser-ce/build/custom/pixi.js');
require('expose-loader?p2!phaser-ce/build/custom/p2.js');
require('expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js');

let {config} = require('./config/config');
let {fonts} = require('./config/fonts');
let {embedFonts} = require('./util/util');
let {BootState} = require('./states/BootState');
let {PreloadState} = require('./states/PreloadState');
let {MainMenuState} = require('./states/MainMenuState');
let {GameState} = require('./states/GameState');
let {SelectPictureState} = require('./states/SelectPictureState');
let {StudioLoadState} = require('./states/StudioLoadState');


// embed fonts to the page
embedFonts(fonts);

// check if cordova is present
if (window.cordova) {
    document.addEventListener("deviceready", function(){
        // open links in moblie browser
        window.open = cordova.InAppBrowser.open;
        startGame();
    }, false);
} else {
    startGame();
}

// start game
function startGame() {
    // create game object
    let game = new Phaser.Game(
        config.gameWidth,
        config.gameHeight,
        Phaser.CANVAS,
        config.gameParentElementId
    );

    // add states
   
    game.state.add('BootState', new BootState(game));
    game.state.add('PreloadState', new PreloadState(game));
    game.state.add('MainMenuState', new MainMenuState(game));
   
    game.state.add('SelectPictureState', new SelectPictureState(game));
    game.state.add('StudioLoadState', new StudioLoadState(game));
    game.state.add('GameState', new GameState(game));
    game.state.start('BootState');
}