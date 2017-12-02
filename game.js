var ASSET_VERSION = (new Date()).getTime();
var BASE_PATH = 'assets/';

var player;
var cursors;

var bmd;
var circle;
var graphics;

var star;

var colors;
var i = 0;
var p = null;

var x_offset = 960;
var y_offset = 540;

var objectCollide;

var state = {
    preload: function () {
        this.load.image('background', BASE_PATH + 'Map1.png?' + ASSET_VERSION);
        this.load.image('player', BASE_PATH + 'santa.png?' + ASSET_VERSION);
        this.load.image('star',BASE_PATH+'HouseStar.png?'+ASSET_VERSION);
    },
    create: function () {
        this.game.add.tileSprite(0, 0, 1920, 1080, 'background');
        this.game.world.setBounds(0, 0, 1920, 1080);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        star = this.game.add.sprite(1200 - x_offset, 600 - y_offset, 'star');
        this.game.physics.enable(star);
        star.scale.setTo(1, 1);
        star.anchor.set(0.5);

        player = this.game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.game.physics.enable(player);
        player.scale.setTo(0.25, 0.25); //verkleinert das Playerimage
        player.anchor.set(0.5);
        player.body.fixedRotation = true;
        player.body.collideWorldBounds = true;
        player.body.drag.set(50);
        

        cursors = game.input.keyboard.createCursorKeys();

        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    },
    update: function () {
        this.game.physics.arcade.overlap(player, star, this.killByCircle, null, this);
        
        if (cursors.up.isDown) {
            game.physics.arcade.accelerationFromRotation(player.rotation, 200, player.body.acceleration);
        }
        else if (cursors.down.isDown) {
            game.physics.arcade.accelerationFromRotation(player.rotation, 0, player.body.acceleration);
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
       // game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteInfo(player, 32, 32);

    },
    start: function () {

    },
    reset: function () {

    }, 
    killByCircle: function(player, star) {
        star.kill();
    }
};


var game = new Phaser.Game(
    800,
    600,
    Phaser.CANVAS,
    document.querySelector('#screen'),
    state
);