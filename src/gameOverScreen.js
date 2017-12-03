var ASSET_VERSION = (new Date()).getTime();
var BASE_PATH = 'assets/';

var gameOverScreen = function (game) { }

gameOverScreen.prototype = {
    init: function(score){
        this.score = score;
    },
    preload: function () {
        this.load.image('background', BASE_PATH + 'game_over.png?' + ASSET_VERSION);
    },
    create: function () {
        var sprite = this.game.add.tileSprite(0, 0, 800, 600, 'background');

        var bar = this.game.add.graphics();
        bar.beginFill(0xffffff, 0.8);
        bar.drawRect(0, 245, 900, 100);

        this.scoreText = this.add.text(900, 100,"",
            {
                fill: '#006400',
                align: 'center'
            }
        );
        this.scoreText.anchor.setTo(0.5, 0.5);
        this.scoreText.fontSize = 40;
        this.scoreText.fixedToCamera = true;
        this.scoreText.cameraOffset.setTo(400, 300);
        this.scoreText.setText("SCORE: " + this.score);

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