"use strict";

const app = new PIXI.Application({
    width: 600,
    height: 600
});

document.body.appendChild(app.view);

// Pre-load the images (this code works with PIXI v6)
app.loader.add([
    "images/ball.png",
    "images/line.png",
    "images/paddle.png"
]);

app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();

// Constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

//aliases
let stage;

// Game variables
let startScene;
let gameScene, enemySprite, ball, player, lineSprite, playerScoreLabel, enemyScoreLabel, hitSound, scoreSound;
let gameOverScene;

let playerScore = 0;
let enemyScore = 0;
let paused = true;

function setup() {
    stage = app.stage;

    startScene = new PIXI.Container();
    stage.addChild(startScene);

    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    //setup text and buttons
    createLabelsAndButtons();
}

// // Mouse input
// app.stage.interactive = true;
// app.stage.on('mousemove', (event) => {
//     // Update the target position based on the mouse y-coordinate
//     player.targetY = event.data.global.y - player.height / 2;
// });

function createLabelsAndButtons() {
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 48,
        fontFamily: "Georgia"
    });

    let logoStyle = new PIXI.TextStyle({
        fill: 'black',
        fontSize: 120,
        fontFamily: "Impact",
        stroke: 'white',
        strokeThickness: 2
    });

    //startScene

    let gameLabel = new PIXI.Text("Ping Pong");
    gameLabel.style = logoStyle;
    gameLabel.x = 58;
    gameLabel.y = 160;
    startScene.addChild(gameLabel);

    let startButton = new PIXI.Text("Click Here To Play");
    startButton.style = buttonStyle;
    startButton.x = 95;
    startButton.y = sceneHeight - 300;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame);
    //click effect
    startButton.on("pointerover", e => e.target.alpha = 0.6);
    startButton.on("pointerout", e => e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);

    //gameScene
}

function startGame() {
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
}


function gameLoop() {
    // Create an instance of the Ball class
    ball = new Ball(100, 100, 40, 5, "images/ball.png");
    // Create an instance of the Player class
    player = new Player(50, app.renderer.height / 2 - 50, 20, 100, 0.1, 1.0);
    stage.addChild(ball);
    stage.addChild(player);
    // Game loop
    app.ticker.add(() => {
        //delta time delay
        //let dt = 1 / app.ticker.FPS;
        //if (dt > 1 / 12) dt = 1 / 12;
        //let amt = 6 * dt;

        // Update the ball
        ball.update();

        //update the player
        player.update();
    });
}