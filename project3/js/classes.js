class Ball extends PIXI.Sprite {
    constructor(x, y, size, speed, texture) {
        // Call the super constructor of PIXI.Sprite
        super(PIXI.Texture.from(texture));

        //center the anchor
        this.anchor.set(0.5);
        this.width = this.height = size;

        //set position
        this.x = x;
        this.y = y;

        //set movement variables
        this.size = size;
        this.speed = speed;

        // Initial random direction
        this.direction = Math.random() * Math.PI * 2;

        // Add ball to the stage (app.stage)
        app.stage.addChild(this);
    }

    update() {
        // Move the ball
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;

        // Check for collisions with canvas edges
        if (this.x - this.size / 2 < 0 || this.x + this.size / 2 > app.renderer.width) {
            this.direction = Math.PI - this.direction; // Reflect on the x-axis
        }

        if (this.y - this.size / 2 < 0 || this.y + this.size / 2 > app.renderer.height) {
            this.direction = -this.direction; // Reflect on the y-axis
        }
    }
}

class Player extends PIXI.Sprite {
    constructor(x, y, width, height, speed, delay) {
        // Call the super constructor of PIXI.Sprite with a texture
        super(PIXI.Texture.from('images/paddle.png'));

        // Center the anchor
        this.anchor.set(0.5);
        this.width = width;
        this.height = height;

        // Set position
        this.x = x;
        this.y = y;

        // Set movement variables
        this.speed = speed;
        this.delay = delay;
        this.targetY = this.y;

        // Add player to the stage (PIXI.Application's stage)
        app.stage.addChild(this);

        // Set up any additional properties or methods as needed
    }

    update() {

        //this.y = lerp(this.y, this.targetY, this.delay);
        // Move towards the target position with a delay
        const deltaY = this.targetY - this.y;
        this.y += deltaY * this.delay;

        // Check boundaries to prevent the paddle from going off-screen
        if (this.y < 0) {
            this.y = 0;
        } else if (this.y + this.height > app.renderer.height) {
            this.y = app.renderer.height - this.height;
        }
    }
}
