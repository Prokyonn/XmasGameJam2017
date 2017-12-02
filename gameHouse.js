var ASSET_VERSION = (new Date()).getTime();
var BASE_PATH = 'assets/';

var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var floor;
var jumpButton;
var bg;
var desk;
var lamp;
var glass;
var smallTable;

var state = {
    preload: function () {
        game.load.spritesheet('santa', BASE_PATH + 'santa-sprite-sheet.png?' + ASSET_VERSION, 150, 150);
        game.load.image('background', BASE_PATH + 'house_inside.png?' + ASSET_VERSION, 24, 96);
        game.load.image("desk", BASE_PATH + "desk.png?" + ASSET_VERSION);
        game.load.image("floor", BASE_PATH + "floor.png?" + ASSET_VERSION);
        game.load.image("lamp", BASE_PATH + "lamp.png?" + ASSET_VERSION);
        game.load.image("glass", BASE_PATH + "glas.png?" + ASSET_VERSION);
        game.load.image("smallTable", BASE_PATH + "tischKlein.png?" + ASSET_VERSION);
    },
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 1920, 600);


        bg = game.add.tileSprite(0, 0, 1920, 600, 'background');
        game.physics.arcade.gravity.y = 300;

        this.createPlayer();
        this.createFloor();

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.desks = this.add.group();
        this.spawnDesk(200, 100);

        this.lamps = this.add.group();
        this.spawnLamp(150, 66);

        this.smallTables = this.add.group();
        this.spawnSmallTable(400, 100);

        this.glasses = this.add.group();
        this.spawnGlass(50, 52);
        this.spawnGlass(20, 52);
        this.spawnGlass(0, 52);

        this.hints = this.add.group();

        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        cursors = game.input.keyboard.createCursorKeys();
    },
    update: function () {
        game.physics.arcade.collide(player, this.desks);
        game.physics.arcade.collide(floor, this.desks);
        game.physics.arcade.collide(player, floor);
        game.physics.arcade.overlap(player, this.lamps, this.killedByObject, null, this);
        game.physics.arcade.overlap(player, this.glasses, this.killedByObject, null, this);
        game.physics.arcade.overlap(player, this.lamps, this.killedByObject, null, this);

        player.body.velocity.x = 0;


        if (this.gameOver) {
            this.showHint(player, "FUCK! I woke them up.");
            this.reset();
        }

        if (cursors.left.isDown) {
            player.body.velocity.x = -300;

            if (player.body.touching.down) {
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = 300;

            if (player.body.touching.down) {
                player.animations.play('right');
                facing = 'right';
            }
        } else {
            if (facing != 'idle') {
                if (facing == 'left') {
                    player.animations.play('standLeft');
                }
                else {
                    player.animations.play('standRight');
                }
                facing = 'idle';
            }
        }

        if (jumpButton.isDown && player.body.touching.down && game.time.now > jumpTimer) {
            player.body.velocity.y = -1000;
            jumpTimer = game.time.now + 750;
            if (facing == 'left') {
                player.animations.play('jumpLeft');
            } else {
                player.animations.play('jumpRight');
            }
        }
    },
    spawnDesk: function (x, y) {
        desk = this.desks.create(
            game.width - x,
            floor.body.top - y,
            'desk'
        );
        game.physics.arcade.enable(desk);

        desk.body.immovable = true;
        desk.body.moves = false;
        desk.body.setSize(700, 133, 0, 90);
        desk.scale.setTo(0.5, 0.5);
    },
    spawnLamp: function (x, y) {
        lamp = this.lamps.create(
            game.width - x,
            floor.body.top - y,
            'lamp'
        );
        game.physics.arcade.enable(lamp);

        lamp.body.immovable = true;
        lamp.body.moves = false;
        lamp.body.setSize(80, 125, 26, 0);
        lamp.anchor.setTo(0.5, 0.9);
        //lamp.scale.setTo(0, 0);
    },
    spawnGlass: function (x, y) {
        glass = this.glasses.create(
            game.width - x,
            floor.body.top - y,
            'glass'
        );
        game.physics.arcade.enable(glass);

        glass.body.immovable = true;
        glass.body.moves = false;
        glass.body.setSize(80, 125, 26, 0);
        glass.scale.setTo(0.5, 0.5);
        glass.anchor.setTo(0.5, 0.9);
    },

    spawnSmallTable: function (x, y) {
        smallTable = this.smallTables.create(
            game.width - x,
            floor.body.top - y,
            'smallTable'
        );
        game.physics.arcade.enable(smallTable);

        smallTable.body.immovable = true;
        smallTable.body.moves = false;
        smallTable.body.setSize(100, 100, 26, 0);
    },

    render: function () {
        // game.debug.text(game.time.physicsElapsed, 32, 32);
        game.debug.body(player);
        game.debug.body(desk);
        game.debug.body(lamp);
        game.debug.body(smallTable);
        // game.debug.body(glass);
        // game.debug.bodyInfo(player, 16, 24);
        game.debug.cameraInfo(game.camera, 32, 32);
    },
    start: function () {

    },
    reset: function () {
        this.gameStarted = false;
        this.gameOver = false;
    },
    killedByObject: function (player, object) {
        if (facing == 'left')
            object.angle = -90;
        else
            object.angle = 90;
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
        this.gameOver = true;
        this.showHint(player, "FUCK! I woke them up.");

        // this.scoreText.setText("FINAL SCORE: " + this.score + "\nTOUCH TO TRY AGAIN");
    },

    createPlayer: function () {
        player = game.add.sprite(150, 320, 'santa');
        player.scale.setTo(1.3, 1.3); //verkleinert das Playerimage
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 1000;
        player.body.maxVelocity.y = 1000;
        player.body.setSize(92, 120, 20, 13);

        player.animations.add('right',
            [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31], 25, true);
        player.animations.add('turn', [4], 20, true);
        player.animations.add('left',
            [3, 2, 1, 0, 11, 10, 9, 8, 19, 18, 17, 16, 27, 26, 25, 24], 25, true);
        player.animations.add('jumpLeft', [33], 1, false);
        player.animations.add('jumpRight', [32], 1, false);
        player.animations.add('standLeft', [35], 1, false);
        player.animations.add('standRight', [34], 1, false);
    }, createFloor: function () {
        floor = game.add.sprite(0, game.world.height - 50, 'floor');
        game.physics.enable(floor);
        floor.body.collideWorldBounds = true;
        floor.body.immovable = true;
    }
};


var game = new Phaser.Game(
    800,
    600,
    Phaser.CANVAS,
    document.querySelector('#screen'),
    state
);