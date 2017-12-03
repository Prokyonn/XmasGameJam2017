var ASSET_VERSION = (new Date()).getTime();
var BASE_PATH = 'assets/';

var flyGame = function (game) {
    console.log("%cStarting my awesome game", "color:white; background:red");

    player = null;
    cursors = null;

    housePosX = [535.5, 277.5, 732.0, 1243.0, 1660.5, 394.5, 601.5, 999.0, 1468.5, 1788.0, 87.0, 760.5, 988.5, 1314.0, 1519.5, 1707.0, 493.5, 145.5, 718.5];
    housePosY = [48.0, 151.5, 114.0, 55.5, 48.0, 324.0, 300.0, 283.5, 237.0, 226.5, 510.0, 520.5, 481.5, 525.0, 531.0, 535.5, 676.5, 829.5, 784.5];
}

flyGame.prototype = {

    init: function(score,minute,second, lastStarPos, playerPosX, playerPosY, playerRotation) {
        if(minute==null || second==null){
            this.minute=1;
            this.second=30;
        }else {
            this.minute=minute;
            this.second=second;
        }
        if(score==null){
            this.score=0;
        }else {
            this.score = score;
        }
        if(lastStarPos != null){
            this.lastStarPos = lastStarPos;
        }
        if(playerPosX == null || playerPosY == null){
            this.playerPosX = this.game.world.centerX;
            this.playerPosY = this.game.world.centerY + 250;
        } else {
            this.playerPosX = playerPosX;
            this.playerPosY = playerPosY;
        }
        if(playerRotation == null){
            this.playerRotation = 0;
        } else {
            this.playerRotation = playerRotation;
        }

    },
    preload: function () {
        this.load.image('background', BASE_PATH + 'Map1.png?' + ASSET_VERSION);
        this.load.image('star1', BASE_PATH + 'star.png?' + ASSET_VERSION);
        this.load.image('star2', BASE_PATH + 'star2.png?' + ASSET_VERSION);
        this.load.image('star3', BASE_PATH + 'star3.png?' + ASSET_VERSION);
        this.load.image('glitter', BASE_PATH + 'glitter.png?' + ASSET_VERSION);
        this.load.image('player', BASE_PATH + 'santa.png?' + ASSET_VERSION);
        this.load.image('background', BASE_PATH + 'Map1.png?' + ASSET_VERSION);
        this.load.image('star', BASE_PATH + 'HouseStar.png?' + ASSET_VERSION);
    },
    create: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;

        this.game.physics.startSystem(Phaser.Physics.Arcade);
        this.game.add.tileSprite(0, 0, 1920, 1080, 'background');
        this.game.world.setBounds(0, 0, 1920, 1080);

        cursors = this.game.input.keyboard.createCursorKeys();

        emitter = this.game.add.emitter(this.playerPosX, this.playerPosY, 400);
        emitter.makeParticles(['star1', 'star2', 'star3', 'glitter']);
        emitter.gravity = 200;
        emitter.setAlpha(1, 0, 3000);
        emitter.setScale(0.4, 0, 0.4, 0, 3000);
        emitter.start(false, 3000, 5);

        this.starPos = Math.floor(Math.random() * 19);
        while(this.starPos == this.lastStarPos){
            this.starPos = Math.floor(Math.random() * 19); 
        }
        star = this.game.add.sprite(housePosX[this.starPos], housePosY[this.starPos], 'star');
        this.game.physics.enable(star);
        star.scale.setTo(0.1, 0.1);
        star.anchor.set(0.5);

        player = this.game.add.sprite(this.playerPosX, this.playerPosY, 'player');
        this.game.physics.enable(player);
        player.scale.setTo(0.25, 0.25); //verkleinert das Playerimage
        player.anchor.set(0.5);
        player.body.fixedRotation = true;
        player.body.collideWorldBounds = true;
        player.body.drag.set(50);
        player.rotation = this.playerRotation;

        this.scoreText = this.add.text(900, 100,
            "",
            {
                fill: '#006400',
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
                fill: '#006400',
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
    },
    update: function () {
        this.start();
        var px = player.body.velocity.x;
        var py = player.body.velocity.y;

        px *= -1;
        py *= -1;
        emitter.minParticleSpeed.set(px, py);
        emitter.maxParticleSpeed.set(px, py);

        emitter.emitX = player.x;
        emitter.emitY = player.y;

        this.game.physics.arcade.overlap(player, star, this.killByStar, null, this);

        if (cursors.up.isDown) {
            emitter.on = true;
            this.game.physics.arcade.accelerationFromRotation(player.rotation, 200, player.body.acceleration);
        }
        else if (cursors.down.isDown) {
            emitter.on = true;
            this.game.physics.arcade.accelerationFromRotation(player.rotation, 0, player.body.acceleration);
        }
        else {
            player.body.acceleration.set(0);
            emitter.on = false;
        }

        if (cursors.left.isDown) {
            player.body.angularVelocity = -300;
            emitter.on = true;
        }
        else if (cursors.right.isDown) {
            player.body.angularVelocity = 300;
            emitter.on = true;
        }
        else {
            player.body.angularVelocity = 0;
        }

    }, render: function () {
        // game.debug.cameraInfo(game.camera, 32, 32);
        if (timer.running) {
            this.timeText.setText("Time:" + this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)));
        }
        if(this.minute==0 && this.second==0){
            this.game.state.start("gameOverScreen");
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

    },
    killByStar: function (player, star) {
        star.kill();
        this.game.state.start("gameHouse",true,false,this.score,this.minute,this.second, this.starPos, player.x, player.y, player.rotation);
    }
};