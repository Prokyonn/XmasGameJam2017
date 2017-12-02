var ASSET_VERSION = (new Date()).getTime();
var BASE_PATH = 'assets/';

var gameHouse = function(game) {
    player = null;
    facing = 'left';
    jumpTimer = 0;
    cursors = null;
    jumpButton = null;
    bg = null;
}

gameHouse.prototype = {
    preload: function () {
        this.game.load.spritesheet('santa', BASE_PATH + 'santa-sprite-sheet-right.png?' + ASSET_VERSION, 150, 150);
        this.game.load.image('background', BASE_PATH + 'background2.png?' + ASSET_VERSION);
    },
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, 1400, 600);

        bg = this.game.add.tileSprite(0, 0, 1400, 600, 'background');

        this.game.physics.arcade.gravity.y = 300;

        player = this.game.add.sprite(150, 320, 'santa');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);

        player.body.collideWorldBounds = true;
        player.body.gravity.y = 1000;
        player.body.maxVelocity.y = 500;
        // player.body.setSize(20, 32, 5, 16);

        player.animations.add('left', [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 24, 30, 31, 32], 22, true);
        player.animations.add('turn', [4], 20, true);
        player.animations.add('right', [0, 1, 2, 3, 8, 9, 10, 11, 16, 17, 18, 19, 25, 26, 27, 28, 29], 22, true);

        cursors = this.game.input.keyboard.createCursorKeys();
        jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


        this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        cursors = this.game.input.keyboard.createCursorKeys();
    },
    update: function () {
        // game.physics.arcade.collide(player, layer);

        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            player.body.velocity.x = -150;

            if (facing != 'left') {
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = 150;

            if (facing != 'right') {
                player.animations.play('right');
                facing = 'right';
            }
        }
        else {
            if (facing != 'idle') {
                player.animations.stop();

                if (facing == 'left') {
                    player.frame = 0;
                }
                else {
                    player.frame = 5;
                }

                facing = 'idle';
            }
        }

        if (jumpButton.isDown && player.body.onFloor() && this.game.time.now > jumpTimer) {
            player.body.velocity.y = -500;
            jumpTimer = this.game.time.now + 750;
        }

    }, render: function () {
        // game.debug.text(game.time.physicsElapsed, 32, 32);
        // game.debug.body(player);
        // game.debug.bodyInfo(player, 16, 24);
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
    },
    start: function () {

    },
    reset: function () {

    },
    addScore: function (addWhat) {
        this.score += addWhat;
        this.scoreText.setText("SCORE: " + this.score);
    },
    showHint: function (focusOn, text) {
        var hint = this.game.add.text(
            focusOn.x,
            focusOn.y,
            text,
            {
                fill: '#ffdd00',
                align: 'center'
            }
        );
        hint.anchor.setTo(0.5, 0.5);
        hint.fontSize = 20;

        var move = this.game.add.tween(hint);
        move.to({y: hint.y - 100, x: hint.x - 100 * Math.random() + 50}, 1000);
        move.onComplete.add(function () {
            hint.kill()
        }, this);
        move.start();

    }
    // setGameOver: function () {
    //     this.timeOver = this.game.time.now;
    //     this.gameOver = true;
    //
    //     this.scoreText.setText("FINAL SCORE: " + this.score + "\nTOUCH TO TRY AGAIN");
    // }
};