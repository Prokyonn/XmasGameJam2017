var ASSET_VERSION = (new Date()).getTime();
var BASE_PATH = 'assets/';

var player;
var cursors;

var housePosX =[535.5 , 277.5, 732.0, 1243.0, 1660.5, 394.5, 601.5, 999.0, 1468.5, 1788.0, 87.0, 760.5, 988.5, 1314.0, 1519.5, 1707.0, 493.5, 145.5, 718.5];
var housePosY =[48.0, 151.5, 114.0, 55.5, 48.0, 324.0, 300.0, 283.5, 237.0, 226.5, 510.0, 520.5, 481.5, 525.0, 531.0, 535.5, 676.5, 829.5, 784.5];

var state = {
    preload: function () {
        this.load.image('background', BASE_PATH + 'Map1.png?' + ASSET_VERSION);
        this.load.image('star1',BASE_PATH + 'star.png?' + ASSET_VERSION);
        this.load.image('star2',BASE_PATH + 'star2.png?' + ASSET_VERSION);
        this.load.image('star3',BASE_PATH + 'star3.png?' + ASSET_VERSION);
        this.load.image('player', BASE_PATH + 'santa.png?' + ASSET_VERSION);
        this.load.image('background', BASE_PATH + 'Map1.png?' + ASSET_VERSION);;
        this.load.image('star',BASE_PATH+'HouseStar.png?'+ASSET_VERSION);
    },
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.Arcade);
        this.game.add.tileSprite(0, 0, 1920, 1080, 'background');
        this.game.world.setBounds(0, 0, 1920, 1080);

        var randomnumber = Math.floor(Math.random()*20);

        star = this.game.add.sprite(housePosX[randomnumber], housePosY[randomnumber], 'star');
        this.game.physics.enable(star);
        star.scale.setTo(0.1, 0.1);
        star.anchor.set(0.5);

        cursors = game.input.keyboard.createCursorKeys();

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
        this.game.state.start("gameHouse");
    }
};


var game = new Phaser.Game(
    800,
    600,
    Phaser.CANVAS,
    document.querySelector('#screen'),
    state
);