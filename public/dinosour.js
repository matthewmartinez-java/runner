const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const coderWidth = 50;
const coderHeight = 50;
let coderX = 50;
let coderY = canvas.height - coderHeight;
let coderJumping = false;
let jumpVelocity = 0;
let gameOverFlag = false;


let isDayTime = true;
let cycleSpeed = 0.001;
let cycleDirection = 1;
let cycleStep = 0;


const groundY = canvas.height - 10;
const groundWidth = canvas.width;
const groundHeight = 10;
let groundX = 0;


const gravity = 0.7;
const jumpForce = 15;


const obstacleWidth = 20;
const obstacleHeight = 20;
let obstacleX = canvas.width;
let obstacleY = groundY - obstacleHeight;
let obstacleSpeed = 5;
let speedUpInterval = 10000;
let lastSpeedUpTime = 0;

// Score
let score = 0;

function updateBackgroundColor()
{

    const lightColor = [225, 225, 225];
    const darkColor = [6,4,31]
    const now = Date.now();
    const period = 20000;
    const t = Math.sin(now / period * Math.PI * 2) / 2 + 0.5;

    const color = lightColor.map((channel, index) => Math.round(channel * (1 - t) + darkColor[index] * t));
    const [r,g,b] = color;
    canvas.style.backgroundColor = `rgb(${r}, ${g}, ${b}`;

    requestAnimationFrame(updateBackgroundColor);
}

function resetDayNightCycle()
{
    cycleDirection = 1;
    cycleStep = 0;
    updateBackgroundColor();
}

function resetGame()
{
    gameOverFlag = false;
    obstacleSpeed = 5;
    obstacleX = canvas.width;
    score = 0;
}


function drawCoder() {
    const mainRunner = document.getElementById('mainRunner');
    ctx.drawImage(mainRunner, coderX, coderY, coderWidth, coderHeight);
}

function increaseSpeed()
{
    let currentTime = Date.now();
    if (currentTime - lastSpeedUpTime > speedUpInterval)
    {
        obstacleSpeed += 1;
        lastSpeedUpTime = currentTime;
    }
}


function update()
{
    coderY += jumpVelocity;
    jumpVelocity += gravity;

    if (coderJumping && coderY >= groundY - coderHeight)
    {
        coderJumping = false;
        coderY = groundY - coderHeight;
        jumpVelocity = 0;
    }

    if (coderY >= groundY - coderHeight)
    {
        coderY = groundY - coderHeight;
    }
}

function drawGround()
{
    ctx.fillStyle = '#888';
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
}

function drawObstacle()
{
    ctx.fillStyle = '#000';
    ctx.font = '50px Arial';
    ctx.fillText(';',obstacleX, obstacleY + obstacleHeight);
}

//let drawSecondObstacle = false;
let obstacleGenerated = false;
function updateObstacle()
{
    obstacleX -= obstacleSpeed;

    if (obstacleX + obstacleWidth < 0)
    {
        obstacleX = canvas.width;
        score++;

        if(Math.random() < 0.4)
        {
            obstacleGenerated = true;
        }
        else
        {
            obstacleGenerated = false;
        }
    }


    if(obstacleGenerated && obstacleX + obstacleWidth + 10 < canvas.width) 
    {
        const secondObstacleX = obstacleX + obstacleWidth + 10;

        ctx.fillStyle = "#000";
        ctx.font = '50px Arial';
        ctx.fillText(';', obstacleX, obstacleY + obstacleHeight);
        ctx.fillText(';', secondObstacleX, obstacleY + obstacleHeight);
    }
}

function checkCollision() {
    if (coderX < obstacleX + obstacleWidth &&
        coderX + coderWidth > obstacleX &&
        coderY < obstacleY + obstacleHeight &&
        coderY + coderHeight > obstacleY) 
        {
        
        gameOver();
    }
}

function gameOver()
{
    cancelAnimationFrame(gameLoop);
    resetDayNightCycle();
    coderY = groundY - coderHeight;
    coderJumping = false;
    jumpVelocity = 0;

    alert('Game Over! Your score: ' + score);
    resetGame();

    setTimeout(() => {
        gameLoop()
    },1000);
}


document.addEventListener('keydown', function(event) 
{
    if (event.keyCode === 32 && !coderJumping) 
    {
        coderJumping = true;
        jumpVelocity = -jumpForce;
    }
});

function gameLoop()
{
    if(!gameOverFlag)
    {
        update();
        draw();
        updateObstacle();
        drawObstacle();
        checkCollision();
        increaseSpeed();
        requestAnimationFrame(gameLoop);
    }
}


function draw() 
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawCoder();

    ctx.fillStyle='#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, canvas.width - 100, 30);
}
gameLoop();
