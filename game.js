var ASSET_VERSION = (new Date()).getTime();
var BASE_PATH = 'assets/';

var player;
var cursors;

var state = {
    preload: function () {
        game.load.image('background', BASE_PATH + 'debug-grid-1920x1920.png?' + ASSET_VERSION);
        game.load.image('player', BASE_PATH + 'santa.png?' + ASSET_VERSION);
    },
    create: function () {

        game.add.tileSprite(0, 0, 1920, 1920, 'background');

        game.world.setBounds(0, 0, 1920, 1920);

        game.physics.startSystem(Phaser.Physics.P2JS);

        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        player.scale.setTo(0.3, 0.3); //verkleinert das Playerimage
        player.anchor.set(0.5);

        game.physics.arcade.enable(player);

        // game.physics.p2.enable(player);

        player.body.fixedRotation = true;

        player.body.collideWorldBounds = true;

        cursors = game.input.keyboard.createCursorKeys();

        player.anchor.set(0.5);
        player.body.drag.set(50);

        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    },
    update: function () {
        // player.body.velocity.x = 0;
        // player.body.velocity.y = 0;
        // player.body.angularVelocity = 0;
        //
        // if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        //     player.body.angularVelocity = -300;
        // }else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        //     player.body.angularVelocity = 300;
        // }else {
        //     player.body.angularVelocity = 0;
        // }
        //
        // if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        //     //game.physics.arcade.velocityFromAngle(player.angle, 500, player.body.velocity);
        //     game.physics.arcade.accelerationFromRotation(player.rotation, 20000, player.body.acceleration);
        // }else {
        //     player.body.acceleration.set(0);
        // }

        if (cursors.up.isDown) {
            game.physics.arcade.accelerationFromRotation(player.rotation, 200, player.body.acceleration);
        }
        else if (cursors.down.isDown) {
            game.physics.arcade.accelerationFromRotation(player.rotation, 0, player.body.acceleration);
            // if(player.body.acceleration.get() > 100) {
            //     game.physics.arcade.accelerationFromRotation(player.rotation, -100, player.body.acceleration);
            // }else if (player.body.acceleration.get() > 0) {
            //     game.physics.arcade.accelerationFromRotation(player.rotation, -1, player.body.acceleration);
            // }
        }
        else {
            player.body.acceleration.set(0);
        }

        if (cursors.left.isDown) {
            player.body.angularVelocity = -300;
        }
        else if (cursors.right.isDown) {
            player.body.angularVelocity = 300;
        }
        else {
            player.body.angularVelocity = 0;
        }


    }, render: function () {
        game.debug.cameraInfo(game.camera, 32, 32);

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

    },
    // setGameOver: function () {
    //     this.timeOver = this.game.time.now;
    //     this.gameOver = true;
    //
    //     this.scoreText.setText("FINAL SCORE: " + this.score + "\nTOUCH TO TRY AGAIN");
    // }

};


var game = new Phaser.Game(
    800,
    600,
    Phaser.CANVAS,
    document.querySelector('#screen'),
    state
);