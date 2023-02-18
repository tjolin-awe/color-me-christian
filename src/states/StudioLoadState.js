class StudioLoadState {
    constructor(game) {
        this.game = game;
    }

    preload() {
        // show logo and progress bar
        this.preloadLogo = this.game.add.image(this.game.world.width / 2, this.game.world.height / 2 - 100, 'logo');
        this.preloadLogo.anchor.setTo(0.5);
        this.game.noclips = false;
        this.preloadBar = this.game.add.sprite(this.game.world.width / 2, this.game.world.height / 2 + 100, 'progress');
        this.preloadBar.x -= this.preloadBar.width / 2;
        this.game.load.setPreloadSprite(this.preloadBar);

        let categories = this.game.cache.getJSON('settings').clipartCategories;

        // Load clipart categories
        categories.forEach(resource => {
            this.game.load.image(`clipart_${resource.key}`, `${resource.icon}`);          
            for (let i = 0; i < resource.sprites.count; i++) {

               
                this.game.load.json(`json_${resource.key}-${i}`, `${resource.sprites.path}/${resource.key}-${i}.json`);
                this.game.load.atlas(`${resource.key}-${i}`, 
                                     `${resource.sprites.path}/${resource.key}-${i}.png`, 
                                     `${resource.sprites.path}/${resource.key}-${i}.json`); 
            }
        });

     
    }

    create() {
        this.game.state.start('GameState');
    }
}

module.exports = {StudioLoadState};