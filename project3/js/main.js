"use strict";

const app = new PIXI.Application({
    width: 600,
    height: 600
});

document.querySelector("#gameWrapper").appendChild(app.view);

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
let gameScene, enemySprite, ball, player, enemy, lineSprite, playerScoreLabel, enemyScoreLabel, playAgainLabel, gameOverLabel, startSound, hitSound, scoreSound, gameOverSound;
let gameOverScene;

let playerScore = 0;
let enemyScore = 0;
let paused = true;

//creates scenes and calls ceateLabelsAndButtons()
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

let numberStyle = new PIXI.TextStyle({
    fill: 'white',
    fontSize: 75,
    fontFamily: "Orbitron"
});

//creates text labels and buttons to be used througout the web app
function createLabelsAndButtons() {
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 54,
        fontFamily: "Impact"
    });

    let logoStyle = new PIXI.TextStyle({
        fill: 'black',
        fontSize: 95,
        fontFamily: "Orbitron",
        stroke: 'white',
        strokeThickness: 2
    });
    let endTextStyle = new PIXI.TextStyle({
        fill: 'black',
        fontSize: 70,
        fontFamily: "Orbitron",
        stroke: 'white',
        strokeThickness: 2
    });

    //startScene
    let gameLabel = new PIXI.Text("Ping Pong");
    gameLabel.style = logoStyle;
    gameLabel.x = 39;
    gameLabel.y = 160;
    startScene.addChild(gameLabel);

    let startButton = new PIXI.Text("Click Here To Play");
    startButton.style = buttonStyle;
    startButton.x = 100;
    startButton.y = sceneHeight - 300;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame);

    //click effect
    startButton.on("pointerover", e => e.target.alpha = 0.6);
    startButton.on("pointerout", e => e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);

    //gameScene
    playerScoreLabel = new PIXI.Text(`${playerScore}`);
    playerScoreLabel.style = numberStyle;
    playerScoreLabel.x = 170;
    playerScoreLabel.y = 100;

    enemyScoreLabel = new PIXI.Text(`${enemyScore}`);
    enemyScoreLabel.style = numberStyle;
    enemyScoreLabel.x = sceneWidth - 232;
    enemyScoreLabel.y = 100;

    //gameOverScene
    gameOverLabel = new PIXI.Text("Player 1 Wins");
    gameOverLabel.style = endTextStyle;
    gameOverLabel.x = 47;
    gameOverLabel.y = 170;
    gameOverScene.addChild(gameOverLabel);

    playAgainLabel = new PIXI.Text("Play Again");
    playAgainLabel.style = buttonStyle;
    playAgainLabel.x = 188;
    playAgainLabel.y = sceneHeight - 300;
    playAgainLabel.interactive = true;
    playAgainLabel.buttonMode = true;

    //audio
    startSound = new Howl({
        src: ["sfx/gameStart.mp3"]
    });

    scoreSound = new Howl({
        src: ["sfx/scoreSound.mp3"]
    });

    gameOverSound = new Howl({
        src: ["sfx/gameOverSound.mp3"]
    });

    playAgainLabel.on("pointerup", startGame);

    //click effect
    playAgainLabel.on("pointerover", e => e.target.alpha = 0.6);
    playAgainLabel.on("pointerout", e => e.currentTarget.alpha = 1.0);
    gameOverScene.addChild(playAgainLabel);
}

//resets variables and creates objectss in the gameScene and starts the gameloop
function startGame() {
    startSound.play();
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    //console.log("game started");
    // Create an instance of the Ball class
    ball = new Ball((sceneWidth - 20) / 2, (sceneWidth - 20) / 2, 20, 300, "images/ball.png", "sfx/hitSound.wav");
    //console.log(`Ball Speed: ${ball.speed}`);
    // Create an instance of the Player class
    player = new Player(50, app.renderer.height / 2 - 50, 20, 100);
    // Create an instance of the Enemy class
    enemy = new Player(sceneWidth - 70, app.renderer.height / 2 - 50, 20, 100);

    //audio
    hitSound = new Howl({
        src: [ball.sound]
    });


    // Mouse input
    app.stage.interactive = true;
    // Add the event listener
    app.stage.on('mousemove', playerMouseMoveHandler);


    //Reset values
    playerScore = 0;
    enemyScore = 0;
    playerScoreLabel.text = `${playerScore}`;
    enemyScoreLabel.text = `${enemyScore}`;

    lineSprite = new PIXI.Sprite(PIXI.Texture.from('images/line.png'));
    // Set the anchor point to the center of the sprite
    lineSprite.anchor.set(0.5);
    // Set the position to the center of the screen
    lineSprite.x = app.screen.width / 2;
    lineSprite.y = app.screen.height / 2;
    lineSprite.width *= 0.4;
    lineSprite.height *= 0.9;

    gameScene.addChild(ball);
    gameScene.addChild(player);
    gameScene.addChild(enemy);
    gameScene.addChild(lineSprite);
    gameScene.addChild(playerScoreLabel);
    gameScene.addChild(enemyScoreLabel);
    gameLoop();
}

// Define the mousemove event handler
const playerMouseMoveHandler = (event) => {
    // Update the target position based on the mouse y-coordinate    
    player.targetY = event.data.global.y - player.height / 2;
};

//transitions to gameOverScene and pauses input and the game loop
function endGame() {
    startScene.visible = false;
    gameScene.visible = false;
    gameOverScene.visible = true;

    gameOverSound.play();

    // Remove the event listener
    app.stage.off('mousemove', playerMouseMoveHandler);

    gameScene.removeChildren();
    app.ticker.remove(gameLogic);
}

//adds the game logic to the ticker
function gameLoop() {
    // Game loop
    app.ticker.add(gameLogic);
}

//checks for if the ball has exited the left or right of the screen and handles it accordingly
function checkForScoreUpdate() {
    if (ball.x - ball.size / 2 < 0) {
        ball.direction = Math.PI - ball.direction; // Reflect on the x-axis
        enemyScore += 1;
        enemyScoreLabel.text = enemyScore;
        scoreSound.play();
        ball.reset();
    }

    else if (ball.x + ball.size / 2 > app.renderer.width) {
        playerScore += 1;
        playerScoreLabel.text = playerScore;
        scoreSound.play();
        ball.reset();
    }
}

//checks if the ball has collided with the player or enemy
function checkAndHandleCollisions() {
    if (ball.minX < player.maxX &&
        ball.maxX > player.minX &&
        ball.minY < player.maxY &&
        ball.maxY > player.minY) {
        //console.log("reflect");
        ball.x = player.maxX + (ball.width / 2);
        return hitBall();
    }
    else if (ball.minX < enemy.maxX &&
        ball.maxX > enemy.minX &&
        ball.minY < enemy.maxY &&
        ball.maxY > enemy.minY) {
        ball.x = enemy.minX - (ball.width / 2);
        return hitBall();
    }
    return false;
}

function hitBall() {
    ball.speed *= -1.2;
    if(ball.speed > ball.maxSpeed){
        ball.speed = ball.maxSpeed;
    }
    ball.direction = - ball.direction;
    hitSound.play();
    return true;
}

//updates all objects, checks for collisions/score updates
function gameLogic() {
    // Update the ball
    ball.update();

    //update the player
    player.update();
    enemy.targetY = ball.y;
    //update enemy
    enemy.update();

    if (checkForScoreUpdate());
    else {
        checkAndHandleCollisions();
    }

    if (playerScore > 7) {
        gameOverLabel.text = "Player 1 Wins";
        endGame();
    }

    else if (enemyScore > 7) {
        gameOverLabel.text = "Player 2 Wins";
        endGame();
    }
}