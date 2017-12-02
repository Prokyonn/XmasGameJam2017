var ASSET_VERSION = (new Date()).getTime();
var BASE_PATH = 'assets/';

var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var floor;
var jumpButton;
var bg;

var state = {
    preload: function () {
        game.load.spritesheet('santa', BASE_PATH + 'santa-sprite-sheet.png?' + ASSET_VERSION, 150, 150);
        game.load.image('background', BASE_PATH + 'house_inside.png?' + ASSET_VERSION, 24, 96);
        game.load.image("desk", BASE_PATH + "desk.png?" + ASSET_VERSION);
        game.load.image("floor", BASE_PATH + "floor.png?" + ASSET_VERSION);
    },
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 1920, 600);


        bg = game.add.tileSprite(0, 0, 1920, 600, 'background');

        game.physics.arcade.gravity.y = 300;

        player = game.add.sprite(150, 320, 'santa');
        player.scale.setTo(1.3, 1.3); //verkleinert das Playerimage
        game.physics.enable(player, Phaser.Physics.ARCADE);

        player.body.collideWorldBounds = true;
        player.body.gravity.y = 1000;
        player.body.maxVelocity.y = 1000;
        player.body.setSize(150, 133, 0, 0);

        player.animations.add('right',
            [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31], 25, true);
        player.animations.add('turn', [4], 20, true);
        player.animations.add('left',
            [3, 2, 1, 0, 11, 10, 9, 8, 19, 18, 17, 16, 27, 26, 25, 24], 25, true);


        floor = game.add.sprite(0, game.world.height - 50, 'floor');
        game.physics.enable(floor);
        floor.body.collideWorldBounds = true;
        floor.body.immovable = true;

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.desks = this.add.group();
        this.spawnDesk();


        this.hints = this.add.group();

        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        cursors = game.input.keyboard.createCursorKeys();
    },
    update: function () {
        game.physics.arcade.collide(player, floor);
        game.physics.arcade.collide(floor, this.desks);
        //game.physics.arcade.overlap(player, this.tables, this.killedByChimney, null, this);
        game.physics.arcade.collide(player, this.desks);

        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            player.body.velocity.x = -300;

            if (facing != 'left') {
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = 300;

            if (facing != 'right') {
                player.animations.play('right');
                facing = 'right';
            }
        }
        else if (this.gameOver) {
            this.showHint(player, "FUCK! I woke them up.");
            this.reset();
        }
        else {
            if (facing != 'idle') {
                player.animations.stop();

                if (facing == 'left') {
                    player.frame = 0;
                }
                else {
                    player.frame = 7;
                }

                facing = 'idle';
            }
        }

        if (jumpButton.isDown && player.body.touching.down && game.time.now > jumpTimer) {
            player.body.velocity.y = -1000;
            jumpTimer = game.time.now + 750;
        }

    },
    spawnDesk: function () {
        var desk = this.desks.create(
            game.width - 200,
            floor.body.top - 200,
            'desk'
        );
        game.physics.arcade.enable(desk);
        desk.body.setSize(775, 113);
        desk.body.moves = false;
        desk.body.velocity.x = 0;
       // desk.body.setSize(150, 133, 0, 0);

    },

    render: function () {
        // game.debug.text(game.time.physicsElapsed, 32, 32);
        // game.debug.body(player);
        // game.debug.bodyInfo(player, 16, 24);
        game.debug.cameraInfo(game.camera, 32, 32);
    },
    start: function () {

    },
    reset: function () {
        this.gameStarted = false;
        this.gameOver = false;
    },
    killedByChimney: function (player, chimney) {
        chimney.body.velocity.x = 0;
        chimney.body.velocity.y = 0;
       // this.showHint(player, "FUCK! I woke them up.");
        this.setGameOver();
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
                fill: '#ff1105',
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
    setGameOver: function () {
        // this.timeOver = this.game.time.now;
        this.gameOver = true;

        // this.scoreText.setText("FINAL SCORE: " + this.score + "\nTOUCH TO TRY AGAIN");
    }
};


var game = new Phaser.Game(
    800,
    600,
    Phaser.CANVAS,
    document.querySelector('#screen'),
    state
);