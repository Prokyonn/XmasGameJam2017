var ASSET_VERSION = (new Date()).getTime();
var BASE_PATH = 'assets/';

var titleScreen = function (game) { }

titleScreen.prototype = {
    preload: function () {
        this.load.image('background', BASE_PATH + 'titlescreen.png?' + ASSET_VERSION);
    },
    create: function () {
        var sprite = this.game.add.tileSprite(0, 0, 800, 600, 'background');
    },
    update: function () {
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || this.game.input.activePointer.isDown) {
            this.game.state.start("flyGame");
        }
    }
}