var ASSET_VERSION = (new Date()).getTime();
var BASE_PATH = 'assets/';

var gameOverScreen = function (game) { }

gameOverScreen.prototype = {
    preload: function () {
        this.load.image('background', BASE_PATH + 'game_over.png?' + ASSET_VERSION);
    },
    create: function () {
        var sprite = this.game.add.tileSprite(0, 0, 800, 600, 'background');


    }, update: function () {

        if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)
            || (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)
                || (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)
                    || (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)
                        || (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)
                            || this.game.input.activePointer.isDown))))) {
            this.game.state.start("titleScreen");
        }
    }
}