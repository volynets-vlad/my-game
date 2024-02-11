class Main extends Phaser.Scene {
    preload() {
        this.load.image('plane', 'assets/plane.png',);
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('sky', 'assets/sky.png');
        this.load.audio('jump', 'assets/jump.wav');
        this.load.image('bullet', 'assets/bullet.png');
        this.load.audio('laser', 'assets/laser.wav');
    }

    create() {
        this.add.image(400, 300, 'sky');
        //Додаємо літак на сцену
        this.plane = this.physics.add.sprite(50, 100, 'plane')
        //Масштабуємо літак
        this.plane.setScale(0.6, 0.6);
        //Встановлюємо опорну точку літака
        this.plane.setOrigin(0, 0.5);
        this.plane.play("planeAnimation");

        this.plane.body.gravity.y = 500;
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.score = 0;
         this.labelScore = this.add.text(140, 20, "Created by Covid 20 pro msax ultra nfc 5g", { fontSize: 10, color: "white" });
         this.labelScore = this.add.text(15, 15, "0", { fontSize: 30, color: "white" });

        this.pipes = this.physics.add.group();

        

        this.timedEvent = this.time.addEvent({
            delay: 1500,
            callback: this.addRowOfPipes, //Цю функцію реалізуємо на наступному кроці
            callbackScope: this,
            loop: true
        });
        this.physics.add.overlap(this.plane, this.pipes, this.hitPipe, null, this);
        this.input.mouse.disableContextMenu();

        this.input.on('pointerdown', function (pointer)
        {
        //this.add.image(pointer.x, pointer.y, 'bullet');    
        this.shot();   
        }, this);
    }
    
    update() {
        if (this.plane.angle < 20) {
            this.plane.angle += 1;
        }

        if (this.plane.y < 0 || this.plane.y > 600) {
            this.scene.restart();
        }
        if (this.spaceBar.isDown) {
            this.jump();
        }
        

    }
    shot() {
    this.bullet = this.physics.add.sprite(this.plane.x, this.plane.y, 'bullet')
    this.bullet.body.velocity.x = 300;
    var sound = this.sound.add('laser');
    sound.play();
    /*this.game.physics.arcade.collide(pipe, bullets, this.collision, null, this);
    this.bullet.collideWorldBounds = true;
    function collision( bullets, pipe){
            pipe.kill();
        }*/
    }

    jump() {
        this.tweens.add({
            targets: this.plane,
            angle: -20,
            duration: 100,
            repeat: 1
        });
        this.plane.body.velocity.y = -170;
            var sound = this.sound.add('jump');
        sound.play();
    }
    //Функція для створення блоку труби
    addOnePipe(x, y) {
        var pipe = this.physics.add.sprite(800, y, 'pipe');
        pipe.setOrigin(0, 0);
        this.pipes.add(pipe);
        pipe.body.velocity.x = -250;

        pipe.collideWorldBounds = true;
        pipe.outOfBoundsKill = true;
    }
    //Функція створення труби (стовпчик блоків)
    addRowOfPipes() {
        var hole = Math.floor(Math.random() * 4) + 1;
        this.score += 1;
        this.labelScore.text = this.score;
        for (var i = 0; i < 8; i++) {
            if (!(i >= hole && i <= hole + 2))
                this.addOnePipe(400, i * 65 + 10);
        }
    }
    hitPipe () {
        if (this.plane.alive == false) return;
    
        this.timedEvent.remove(false);
        this.plane.alive = false;
    
        this.pipes.children.each(function(pipe) {
            pipe.body.velocity.x = 0;
        });
        this.scene.restart();
    }
}











const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 540,
    scene: Main, // Цю сцену ми створимо на 4-му кроці
    backgroundColor: '#71c5cf',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);