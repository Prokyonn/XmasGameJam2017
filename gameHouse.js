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
var gift;
var cat;

var gameHouse = function (game) {
}

gameHouse.prototype = {
    init: function(score,minute,second) {
        if (minute == null || second == null) {
            this.minute = 1;
            this.second = 30;
        } else {
            this.minute = minute;
            this.second = second;

            if (score == null) {
                this.score = 0;
            } else {
                this.score = score;
            }
        }
    },
    preload: function () {
        this.game.load.spritesheet('santa', BASE_PATH + 'santa-sprite-sheet.png?' + ASSET_VERSION, 150, 150);
        this.game.load.image('background', BASE_PATH + 'house_inside.png?' + ASSET_VERSION, 24, 96);
        this.game.load.image("desk", BASE_PATH + "desk.png?" + ASSET_VERSION);
        this.game.load.image("floor", BASE_PATH + "floor.png?" + ASSET_VERSION);
        this.game.load.image("lamp", BASE_PATH + "lamp.png?" + ASSET_VERSION);
        this.game.load.image("glass", BASE_PATH + "glas.png?" + ASSET_VERSION);
        this.game.load.image("smallTable", BASE_PATH + "smallTable.png?" + ASSET_VERSION);
        this.game.load.image("gift", BASE_PATH + "gift.png?" + ASSET_VERSION);
        this.game.load.image("cat", BASE_PATH + "cat.png?" + ASSET_VERSION);
    },
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.world.setBounds(0, 0, 1920, 600);


        bg = this.game.add.tileSprite(0, 0, 1920, 600, 'background');
        this.game.physics.arcade.gravity.y = 300;


        this.createFloor();

        this.smallTables = this.add.group();
        this.spawnSmallTable(-550, 120);

        this.createPlayer();

        cursors = this.game.input.keyboard.createCursorKeys();
        jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.desks = this.add.group();
        this.spawnDesk(200, 100);

        this.lamps = this.add.group();
        this.spawnLamp(150, 66, 1, 1);
        this.spawnLamp(450, 15, 1.5, 1.5);

        this.glasses = this.add.group();
        this.spawnGlass(50, 52);
        this.spawnGlass(30, 52);
        this.spawnGlass(-180, 52);
        this.spawnGlass(-670, 52);

        this.cats = this.add.group();
        this.spawnCat(-400, -15);


        // this.smallTables = this.add.group();
        // this.spawnSmallTable(-350, 100);

        this.hints = this.add.group();

        this.scoreText = this.add.text(900, 100,
            "",
            {
                fill: '#2aff4d',
                align: 'center'
            }
        );
        this.scoreText.anchor.setTo(0.5, 0.5);
        this.scoreText.fontSize = 20;
        this.scoreText.fixedToCamera = true;
        this.scoreText.cameraOffset.setTo(700, 20);

        this.timeText = this.add.text(900, 100,
            "",
            {
                fill: '#2aff4d',
                align: 'center'
            }
        );
        this.timeText.anchor.setTo(0.5, 0.5);
        this.timeText.fontSize = 20;
        this.timeText.fixedToCamera = true;
        this.timeText.cameraOffset.setTo(550, 20);

        timer = this.game.time.create();
        timerEvent = timer.add(Phaser.Timer.MINUTE * this.minute + Phaser.Timer.SECOND * this.second, this.endTimer, this);

        this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        cursors = this.game.input.keyboard.createCursorKeys();
    },
    update: function () {
        this.start();
        this.game.physics.arcade.collide(player, this.desks);
        this.game.physics.arcade.collide(floor, this.desks);
        this.game.physics.arcade.collide(player, floor);

        this.game.physics.arcade.collide(player, this.smallTables);

        this.game.physics.arcade.overlap(player, this.lamps, this.killedByObject, null, this);
        this.game.physics.arcade.collide(player, this.lamps);

        this.game.physics.arcade.overlap(player, this.glasses, this.killedByObject, null, this);
        this.game.physics.arcade.collide(player, this.glasses);

        this.game.physics.arcade.overlap(player, this.lamps, this.killedByObject, null, this);
        this.game.physics.arcade.collide(player, this.lamps);

        this.game.physics.arcade.overlap(player, this.cats, this.killedByObject, null, this);

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
        } else if (cursors.down.isDown) {
            if (player.x > 1650) {
                gift = this.spawnGift(player.body.x, player.body.y);
                player.body.velocity.x = 0;
                player.body.velocity.y = 0;
                this.game.time.events.add(5000, this.game.state.start("flyGame"), this);
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

        if (jumpButton.isDown && player.body.touching.down && this.game.time.now > jumpTimer) {
            player.body.velocity.y = -1000;
            jumpTimer = this.game.time.now + 750;
            if (facing == 'left') {
                player.animations.play('jumpLeft');
            } else {
                player.animations.play('jumpRight');
            }
        }
    },
    spawnDesk: function (x, y) {
        desk = this.desks.create(
            this.game.width - x,
            floor.body.top - y,
            'desk'
        );
        this.game.physics.arcade.enable(desk);

        desk.body.immovable = true;
        desk.body.moves = false;
        desk.body.setSize(700, 133, 0, 90);
        desk.scale.setTo(0.5, 0.5);
    },
    spawnLamp: function (x, y, scaleX, scaleY) {
        lamp = this.lamps.create(
            this.game.width - x,
            floor.body.top - y,
            'lamp'
        );
        this.game.physics.arcade.enable(lamp);

        lamp.body.immovable = true;
        lamp.body.moves = false;
        lamp.body.setSize(80, 125, 26, 0);
        lamp.anchor.setTo(0.5, 0.9);
        lamp.scale.setTo(scaleX, scaleY);
    },
    spawnGlass: function (x, y) {
        glass = this.glasses.create(
            this.game.width - x,
            floor.body.top - y,
            'glass'
        );
        this.game.physics.arcade.enable(glass);

        glass.body.immovable = true;
        glass.body.moves = false;
        glass.body.setSize(80, 125, 26, 0);
        glass.scale.setTo(0.5, 0.5);
        glass.anchor.setTo(0.5, 0.9);
    },

    spawnCat: function (x, y) {
        cat = this.cats.create(
            this.game.width - x,
            floor.body.top - y,
            'cat'
        );
        this.game.physics.arcade.enable(cat);

        cat.body.immovable = true;
        cat.body.moves = false;
        cat.body.setSize(80, 125, 26, 0);
        cat.scale.setTo(0.1, 0.1);
        cat.anchor.setTo(0.5, 0.9);
    },


    spawnSmallTable: function (x, y) {
        smallTable = this.smallTables.create(
            this.game.width - x,
            floor.body.top - y,
            'smallTable'
        );
        this.game.physics.arcade.enable(smallTable);

        smallTable.body.immovable = true;
        smallTable.body.moves = false;
        smallTable.body.setSize(185, 130, 5, 80);
    },
    spawnGift: function (x, y) {
        gift = this.smallTables.create(
            x + 20,
            y + 72,
            'gift'
        );
        this.game.physics.arcade.enable(gift);
        gift.body.immovable = true;
        gift.body.moves = false;
        gift.body.setSize(100, 100, 26, 0);
    },

    render: function () {
        // game.debug.text(game.time.physicsElapsed, 32, 32);
        // this.game.debug.body(player);
        // this.game.debug.body(desk);
        // this.game.debug.body(lamp);
        // game.debug.body(smallTable);
        // game.debug.body(glass);
        // game.debug.bodyInfo(player, 16, 24);
        // this.game.debug.cameraInfo(this.game.camera, 32, 32);
        if (timer.running) {
            this.timeText.setText("Time:" + this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)));


        }
        else {
            this.game.debug.text("Done!", 2, 14, "#0f0");
        }

    },
    formatTime: function (s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        this.minute= minutes.substr(-2);
        this.second= seconds.substr(-2);
        return this.minute+ ":" + this.second;
    },
    start: function () {
        this.scoreText.setText("SCORE: " + this.score);
        timer.start();

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
        player = this.game.add.sprite(100, 320, 'santa');
        player.scale.setTo(1.3, 1.3); //verkleinert das Playerimage
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
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
    },

    createFloor: function () {
        floor = this.game.add.sprite(0, this.game.world.height - 50, 'floor');
        this.game.physics.enable(floor);
        floor.body.collideWorldBounds = true;
        floor.body.immovable = true;
    }
};
