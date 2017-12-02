var ASSET_VERSION = (new Date()).getTime();
var BASE_PATH = 'assets/';

var player;
var cursors;

var bmd;
var circle;

var colors;
var i = 0;
var p = null;

var x_offset = 960;
var y_offset = 540;

var objectCollide;

var state = {
    preload: function () {
        game.load.image('background', BASE_PATH + 'Map1.png?' + ASSET_VERSION);
        game.load.image('star1',BASE_PATH + 'assets/star.png?' + ASSET_VERSION);
        game.load.image('star2',BASE_PATH + 'assets/star2.png?' + ASSET_VERSION);
        game.load.image('star3',BASE_PATH + 'assets/star3.png?' + ASSET_VERSION);
        game.load.image('player', BASE_PATH + 'santa.png?' + ASSET_VERSION);
        this.load.image('background', BASE_PATH + 'Map1.png?' + ASSET_VERSION);;
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


        emitter = game.add.emitter(game.world.centerX, game.world.centerY, 400);
        emitter.makeParticles(['star1', 'star2', 'star3']);
        emitter.gravity = 200;
        emitter.setAlpha(1, 0, 3000);
        emitter.setScale(0.8, 0, 0.8, 0, 3000);
        emitter.start(false, 3000, 5);

        player = this.game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.game.physics.enable(player);
        player.scale.setTo(0.25, 0.25); //verkleinert das Playerimage
        player.anchor.set(0.5);
        player.body.fixedRotation = true;
        player.body.collideWorldBounds = true;
        player.body.drag.set(50);

        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    },
    update: function () {
        var px = player.body.velocity.x;
        var py = player.body.velocity.y;

        px *= -1;
        py *= -1;
        emitter.minParticleSpeed.set(px, py);
        emitter.maxParticleSpeed.set(px, py);

        emitter.emitX = player.x;
        emitter.emitY = player.y;

        this.game.physics.arcade.overlap(player, star, this.killByCircle, null, this);

        if (cursors.up.isDown) {
            emitter.on=true;
            game.physics.arcade.accelerationFromRotation(player.rotation, 200, player.body.acceleration);

        }
        else if (cursors.down.isDown) {
            emitter.on=true;
            game.physics.arcade.accelerationFromRotation(player.rotation, 0, player.body.acceleration);

        }
        else {
            player.body.acceleration.set(0);
            emitter.on=false;
        }

        if (cursors.left.isDown) {
            player.body.angularVelocity = -300;
            emitter.on=true;
        }
        else if (cursors.right.isDown) {
            player.body.angularVelocity = 300;
            emitter.on=true;
        }
        else {
            player.body.angularVelocity = 0;
            emitter.on=false;
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