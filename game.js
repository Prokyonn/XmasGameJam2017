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
    },
    create: function () {

        game.add.tileSprite(0, 0, 1920, 1080, 'background');

        game.world.setBounds(0, 0, 1920, 1080);

        game.physics.startSystem(Phaser.Physics.Arcade);

        emitter = game.add.emitter(game.world.centerX, game.world.centerY, 400);

        emitter.makeParticles(['star1', 'star2', 'star3']);

        emitter.gravity = 200;
        emitter.setAlpha(1, 0, 3000);
        emitter.setScale(0.8, 0, 0.8, 0, 3000);
        emitter.start(false, 3000, 5);
        


        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        player.scale.setTo(0.25, 0.25); //verkleinert das Playerimage
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

        //circles

        colors = Phaser.Color.HSVColorWheel();

        //  Create a Circle
        circle = new Phaser.Circle(game.world.centerX, game.world.centerY, 30);

        //  Create a BitmapData just to plot Circle points to
        bmd = game.add.bitmapData(game.width, game.height);
        bmd.addToWorld();

        //  And display our circle on the top
        var graphics = game.add.graphics(1200 - x_offset, 600 - y_offset);
        graphics.lineStyle(1, 0xFF69B4, 1);
        graphics.beginFill(0xFF69B4, 1);
        graphics.drawCircle(circle.x, circle.y, circle.diameter);

        p = new Phaser.Point();


        //test
        this.scoreText = this.add.text(
            this.world.width / 2,
            this.world.height / 3,
            "",
            {
                fill: '#ffdd00',
                align: 'center'
            }
        );
        this.scoreText.anchor.setTo(0.5, 0.5);
        this.scoreText.fontSize = 20;
        this.reset();


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


        //circles
        for (var c = 0; c < 10; c++)
        {
            circle.random(p);

            //  We'll floor it as setPixel needs integer values and random returns floats
            p.floor();

            bmd.setPixel(p.x, p.y, colors[i].r, colors[i].g, colors[i].b);
        }

        i = game.math.wrapValue(i, 1, 359);

        objectCollide = game.physics.arcade.collide(player, this.circle);
        this.game.physics.arcade.overlap(player, this.circle, this.killByCircle, null, this);


    }, render: function () {
       // game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteInfo(player, 32, 32);

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

    }, killByCircle: function(player, circle) {
        this.setGameOver();


    }, setGameOver: function () {
        this.scoreText.setText("FINAL SCORE: " + this.score + "\nTOUCH TO TRY AGAIN");
    },
};


var game = new Phaser.Game(
    800,
    600,
    Phaser.CANVAS,
    document.querySelector('#screen'),
    state
);