class Ball extends PIXI.Sprite {
    constructor(x, y, size, speed, texture, sound) {
        // Call the super constructor of PIXI.Sprite
        super(PIXI.Texture.from(texture));

        //center the anchor
        this.anchor.set(0.5);
        this.width = this.height = size;

        //set position
        this.x = x;
        this.y = y;

        this.minX = x - this.width / 2;
        this.maxX = x + this.width / 2;
        this.minY = y - this.height / 2;
        this.maxY = y + this.height / 2;

        this.startingX = x;
        this.startingY = y;

        //set movement variables
        this.size = size;
        this.startSpeed = this.speed = speed;
        this.maxSpeed = this.startSpeed * 5;

        this.sound = sound;

        hitSound = new Howl({
            src: [this.sound]
        });

        // Initial random direction
        this.direction = Math.random() * Math.PI / 3;

        // Add ball to the stage (app.stage)
        app.stage.addChild(this);
    }

    //updates the ball's position
    update() {
        // Move towards the target position with a delay
        let dt = 1 / app.ticker.FPS;
        if (dt > 1 / 9) dt = 1 / 9;

        // Move the ball
        this.x += Math.cos(this.direction) * this.speed * dt;
        this.y += Math.sin(this.direction) * this.speed * dt;

        this.minX = this.x - this.width / 2;
        this.maxX = this.x + this.width / 2;
        this.minY = this.y - this.height / 2;
        this.maxY = this.y + this.height / 2;

        // Check for collisions with canvas edges
        if (this.y - this.size / 2 < 0 || this.y + this.size / 2 > app.renderer.height) {
            this.direction = -this.direction; // Reflect on the y-axis
            //play hit sound
            hitSound.play();
        }
    }

    //restes the ball's position and gives it a new direction
    reset() {
        this.x = this.startingX;
        this.y = this.startingY;
        this.direction = Math.random() * Math.PI / 3;
        this.speed = this.startSpeed;
        console.log("reset");
    }
}

class Player extends PIXI.Sprite {
    constructor(x, y, width, height) {
        // Call the super constructor of PIXI.Sprite with a texture
        super(PIXI.Texture.from('images/paddle.png'));

        // Center the anchor
        this.anchor.set(0.5);
        this.width = width;
        this.height = height;

        // Set position
        this.x = x;
        this.y = y;

        this.minX = x - this.width / 2;
        this.maxX = x + this.width / 2;
        this.minY = y - this.height / 2;
        this.maxY = y + this.height / 2;

        // Set movement variable
        this.targetY = this.y;

        // Add player to the stage (PIXI.Application's stage)
        app.stage.addChild(this);
    }

    //moves the paddle based on target position
    update() {
        // Move towards the target position with a delay
        let dt = 1 / app.ticker.FPS;
        if (dt > 1 / 8) dt = 1 / 8;

        this.y = lerp(this.y, this.targetY, dt);

        this.minX = this.x - this.width / 2;
        this.maxX = this.x + this.width / 2;
        this.minY = this.y - this.height / 2;
        this.maxY = this.y + this.height / 2;

        // Check boundaries to prevent the paddle from going off-screen
        if (this.y < 0) {
            this.y = 0;
        } else if (this.maxY > app.renderer.height) {
            this.y = app.renderer.height - (this.height / 2);
        }
    }
}