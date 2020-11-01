const LEVEL_IMG = new Image();
LEVEL_IMG.src = "img/level.png";

const LIFE_IMG = new Image();
LIFE_IMG.src = "img/life.png";

const SCORE_IMG = new Image();
SCORE_IMG.src = "img/score.png";

const SCORE_UP = new Image();
SCORE_UP.src = "img/coins.png";

const EXPAND_IMG = new Image();
EXPAND_IMG.src = "img/expand.png";

const BOMB_IMG = new Image();
BOMB_IMG.src = "img/bomb.png";

const CACTUS_IMG = new Image();
CACTUS_IMG.src = "img/cactus.png";

const SHRINK = new Image();
SHRINK.src = "img/shrink.png";

const WALL_HIT = new Audio();
WALL_HIT.src = "sounds/wall.mp3";

const LIFE_LOST = new Audio();
LIFE_LOST.src = "sounds/life_lost.mp3";

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "sounds/paddle_hit.wav";

const WIN = new Audio();
WIN.src = "sounds/win.mp3";

const BRICK_HIT = new Audio();
BRICK_HIT.src = "sounds/brick_hit.mp3";

const REWARD = new Audio();
REWARD.src = "sounds/reward.wav";

const BOMB = new Audio();
BOMB.src = "sounds/bomb.mp3";

const POWER_UP = new Audio();
POWER_UP.src = "sounds/power_up.wav";

const EXPAND = new Audio();
EXPAND.src = "sounds/expand.wav";

const CACTUS = new Audio();
CACTUS.src = "sounds/life_lost.wav";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.lineWidth = 3;

const paddleWidth = 170;
const paddleMarginBottom = 50;
const paddleHeight = 20;
const ballRadius = 13;
let LIFE = 3; 
let SCORE = 0;  
const scoreUnit = 10;
let LEVEL = 1;
const maxLevel = 4;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

let paddle = {
    x : canvas.width/2 - paddleWidth/2,
    y : canvas.height - paddleMarginBottom - paddleHeight,
    width : paddleWidth,
    height : paddleHeight,
    dx :10
}

function drawPaddle(){
    ctx.fillStyle = "#cccccc";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    ctx.strokeStyle = "#cccccc";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightArrow = true;
    }
    else if(e.keyCode == 37) {
        leftArrow = true;
    } 
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightArrow = false;
    }
    else if(e.keyCode == 37) {
        leftArrow = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width;
    }
}

function touchHandler(e) {
    if(e.touches) {
        paddle.x = e.touches[0].clientX - canvas.offsetLeft - paddle.width / 2;
        e.preventDefault();
    }
}

function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < canvas.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

let ball = {
    x : canvas.width/2,
    y : paddle.y - ballRadius,
    radius : ballRadius,
    speed : 8,
    dx : 8 * (Math.random() * 2 - 1),
    dy : -8
}

function drawBall(){
    ctx.beginPath();
    
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#ffcd05";
    ctx.fill();
    
    ctx.strokeStyle = "#FFF187";
    ctx.stroke();
    
    ctx.closePath();
}

function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function ballWallCollision(){
    if(ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0){
        ball.dx = - ball.dx;
        WALL_HIT.play(); 
    }
    
    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
        WALL_HIT.play();
    }
    
    if(ball.y + ball.radius > canvas.height){
        LIFE--; 
        LIFE_LOST.play();
        resetBall();
    }
}

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = paddle.y - ballRadius;
    ball.dx = 8 * (Math.random() * 2 - 1);
    ball.dy = -8;
}

function ballPaddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){
        
        PADDLE_HIT.play();
        
        let collidePoint = ball.x - (paddle.x + paddle.width/2);
        
        collidePoint = collidePoint / (paddle.width/2);
        
        let angle = collidePoint * Math.PI/3;
            
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

let brick = {
    row : 3,
    column : 9,
    width : 155,
    height : 25,
    offSetLeft : 10,
    offSetTop : 10,
    //row: 10,
    // row:11,
    // column:11,
    // offSetLeft:5,
    // offSetTop:5,
    // width:127,
    // height:30,
    marginTop : 60,
    fillColor : "#56fca2",
    strokeColor : "#56fca2"
}

let displayAssets = {
    life: true,
    expand: 1,
    coins: 2,
    bomb: 2,
    cactus: 2,
    shrink: 1
}

let bricks = [];
let assets=[];

function createBricks(){
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = { x: 0, y: 0, status : true };
            let randNum = Math.floor(Math.random() * 11)
            if (randNum == 1 && displayAssets.coins>0) {
                bricks[r][c].assets = 1;
                bricks[r][c].got = false;
            } else if (randNum == 2 && displayAssets.bomb>0) {
                bricks[r][c].assets = 2;
                bricks[r][c].got = false;
            } else if (randNum == 3 && displayAssets.life && LEVEL>3) {
                bricks[r][c].assets = 3;
                bricks[r][c].got = false;
            } else if (randNum == 4 && displayAssets.expand>0 && LEVEL>1) {
                bricks[r][c].assets = 4;
                bricks[r][c].got = false;
            } else if (randNum == 5 && displayAssets.cactus>0 && LEVEL>2) {
                bricks[r][c].assets = 5;
                bricks[r][c].got = false;
            } else if (randNum == 6 && displayAssets.shrink>0 && LEVEL>1) {
                bricks[r][c].assets = 6;
                bricks[r][c].got = false;
            }
        }
    }
}

createBricks();

function drawBricks(){
    if(LEVEL==1 || LEVEL==2){
        for(let r = 0; r < brick.row; r++){
            for(let c = 0; c < brick.column; c++){
                let brickX = c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft;
                let brickY = r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop;
                let b = bricks[r][c];
                if(b.status){
                    if(LEVEL==1){
                        b.x = brickX;
                        b.y =brickY;
                        ctx.fillStyle = "#56fca2";
                        ctx.fillRect(b.x, b.y, brick.width, brick.height);
                    }
                    if(LEVEL==2){
                        if((r==0 && c%2==0) || ((r==6 && c%2==0))){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#ae35d4";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        if((r==1 && c%2!=0) || ((r==5 && c%2!=0))){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#1E90FF";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        if((r==2 && c%2==0 || ((r==4 && c%2==0)))){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#ecddab";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        if(r==3 && c%2!=0){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#56fca2";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                    }
                }
            }
        }
    }
    if(LEVEL==3){
        let n = brick.row;
        let m = brick.column;
        for(let r = 1; r <n; r++){
            for(let c = 0; c < m; c++){
                let brickX = c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft;
                let brickY = r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop;
                let b = bricks[r][c];
                if(b.status && c<r-1){
                    b.x = brickX;
                    b.y =brickY;
                    ctx.fillStyle = "#59ffef";
                    ctx.fillRect(b.x, b.y, brick.width, brick.height);
                }
                if(b.status && c>r){
                    b.x = brickX;
                    b.y =brickY;
                    ctx.fillStyle = "#ff32ac";
                    ctx.fillRect(b.x, b.y, brick.width, brick.height);
                }
            }
        }
    }
    if(LEVEL==4){
        let n=brick.row;
        for(let r = 0; r < n; r++){
            for(let c = 0; c < n; c++){
                let brickX = c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft;
                let brickY = r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop;
                let b = bricks[r][c];
                if(b.status){
                    if(r%2==0 && c%2==0){
                        if(r==0||r==n-1||c==n-1){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#f2ffc7";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(r==2 && c<n-2){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#f2ffc7";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(c==0 && r>1 && r<n-1){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#f2ffc7";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(c==n-3 && r>2 && r<n-2){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#f2ffc7";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(r==n-3 && c<n-3 && c>1){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#f2ffc7";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(c==2 && r>3 && r<n-2){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#f2ffc7";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(r==4 && c>2 && c<n-4){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#f2ffc7";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(c==6 && r>4 && r<n-4){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#f2ffc7";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(r==6 && c>3 && c<n-5){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#f2ffc7";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                    }
                    else{
                        if(r==0||r==n-1||c==n-1){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#d2ff3e";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(r==2 && c<n-2){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#d2ff3e";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(c==0 && r>1 && r<n-1){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#d2ff3e";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(c==n-3 && r>2 && r<n-2){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#d2ff3e";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(r==n-3 && c<n-3 && c>1){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#d2ff3e";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(c==2 && r>3 && r<n-2){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#d2ff3e";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(r==4 && c>2 && c<n-4){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#d2ff3e";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(c==6 && r>4 && r<n-4){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#d2ff3e";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        else if(r==6 && c>3 && c<n-5){
                            b.x = brickX;
                            b.y =brickY;
                            ctx.fillStyle = "#d2ff3e";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        // else{
                        //     b.x = brickX;
                        //     b.y =brickY;
                        //     ctx.fillStyle = "#ffbee5";
                        //     ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        // }
                    }
                }
            }
        }

    }
}

function ballBrickCollision(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    BRICK_HIT.play();
                    ball.dy = - ball.dy;
                    b.status = false; 
                    if (bricks[r][c].assets) {
                        assets.push(bricks[r][c])
                    }
                    SCORE += scoreUnit;
                }
            }
        }
    }
}

function drawAssets() {
    for (item of assets) {
        if (!item.got) {
            if (item.assets == 1 && !item.got && displayAssets.coins>0) {
                ctx.drawImage(SCORE_UP, item.x, item.y, 45, 45);
            } else if (item.assets == 2 && !item.got && displayAssets.bomb>0) {
                ctx.drawImage(BOMB_IMG, item.x, item.y, 45, 45);
            } else if (item.assets == 3 && !item.got &&  displayAssets.life) {
                ctx.drawImage(LIFE_IMG, item.x, item.y, 45, 45);
            } else if (item.assets == 4 && !item.got && displayAssets.expand>0) {
                ctx.drawImage(EXPAND_IMG, item.x, item.y, 50, 50);
            } else if (item.assets == 5 && !item.got && displayAssets.cactus>0) {
                ctx.drawImage(CACTUS_IMG, item.x, item.y, 45, 45);
            } else if (item.assets == 6 && !item.got && displayAssets.shrink>0) {
                ctx.drawImage(SHRINK, item.x, item.y, 45, 45);
            }
        }
    }
}

function resetAssests(){
    displayAssets.coins = 2;
    displayAssets.bomb = 2;
    displayAssets.life = true;
    displayAssets.expand = 1;
    displayAssets.cactus = 2;
    displayAssets.shrink = 1;
}

function showGameStats(text, textX, textY, img, imgX, imgY){
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);
    ctx.drawImage(img, imgX, imgY, width = 55, height = 55);
}

function draw(){
    drawPaddle();
    drawBall();
    drawBricks();
    drawAssets();
    showGameStats(SCORE, 69, 53, SCORE_IMG, 5, 5);
    showGameStats(LIFE, canvas.width - 95, 48, LIFE_IMG, canvas.width-75, 5);
    showGameStats(LEVEL, canvas.width/2, 50, LEVEL_IMG, canvas.width/2 + 19, 5);
}

function gameOver(){
    if(LIFE <= 0){
        showYouLose();
        GAME_OVER = true;
    }
}


function levelUp(){
    let isLevelDone = true;
    
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }
    
    if(isLevelDone){
        WIN.play();
        
        if(LEVEL >= maxLevel){
            showYouWin();
            GAME_OVER = true;
            return;
        }
        LEVEL++;
        if(LEVEL==2){
            brick.row+=4;
            createBricks();
            ball.speed+=1;
            paddle.dx+=1;
            resetBall();
            resetAssests();
        }
        if(LEVEL==3){
            brick.row+=7;
            createBricks();
            ball.speed+=3;
            paddle.dx+=3;
            resetBall();
            resetAssests();
        }
        if(LEVEL==4){
            brick.row+=12;
            brick.column+=2;
            brick.offSetLeft-=2;
            brick.offSetTop-=2;
            brick.width-=15;
            brick.height-=5;
            createBricks();
            ball.speed+=5;
            paddle.dx+=4;
            resetBall();
            resetAssests();
        }
    }
}

function update(){
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();

    for (i in assets) {
        if (assets[i].y <= paddle.y) {
            assets[i].y += canvas.height/260;
        } else if (paddle.y < assets[i].y && assets[i].y < (paddle.y + paddle.height)) {
            if (paddle.x < assets[i].x && assets[i].x < (paddle.x + paddle.width)) {
                if (assets[i].assets == 1 && !assets[i].got && displayAssets.coins>0) {
                    REWARD.play();
                    SCORE += 50;
                    assets[i].got = true;
                    displayAssets.coins-=1;
                } else if (assets[i].assets == 2 && !assets[i].got && displayAssets.bomb>0) {
                    BOMB.play();
                    SCORE -= 30;
                    assets[i].got = true;
                    displayAssets.bomb-=1;
                } else if (assets[i].assets == 3 && !assets[i].got && displayAssets.life) {
                    POWER_UP.play();
                    LIFE+=1;
                    assets[i].got = true;
                    displayAssets.life=false;
                } else if (assets[i].assets == 4 && !assets[i].got && displayAssets.expand>0) {
                    EXPAND.play();
                    paddle.width += 30; 
                    setTimeout(function(){ 
                    paddle.width -= 30;  }, 10000);
                    assets[i].got = true;
                    displayAssets.expand=0;
                } else if (assets[i].assets == 5 && !assets[i].got && displayAssets.cactus>0) {
                    CACTUS.play();
                    LIFE-=1;
                    assets[i].got = true;
                    displayAssets.cactus-=1;
                } else if (assets[i].assets == 6 && !assets[i].got && displayAssets.shrink>0) {
                    BOMB.play();
                    paddle.width -= 20; 
                    setTimeout(function(){ 
                    paddle.width += 20;  }, 10000);
                    assets[i].got = true;
                    displayAssets.shrink=0;
                }
            }
            assets[i].y += canvas.height/260;
        }
    }
    assets = assets.filter((item) => {
        if (item.y >= (paddle.y + paddle.height)) {
            return false
        } else {
            return true
        }
    });
    
    gameOver();
    
    levelUp();
}

function loop(){
    if(LEVEL==1){
        const BG_IMG = new Image();
        BG_IMG.src = "img/bg.jpg";
        ctx.drawImage(BG_IMG, 0, 0, 1500, 800);
    }
    if(LEVEL==2){
        const BG_IMG = new Image();
        BG_IMG.src = "img/level2.jpg";
        ctx.drawImage(BG_IMG, 0, 0, 1500, 800);
    }
    if(LEVEL==3){
        const BG_IMG = new Image();
        BG_IMG.src = "img/level3.jpg";
        ctx.drawImage(BG_IMG, 0, 0, 1500, 800);
    }
    if(LEVEL==4){
        const BG_IMG = new Image();
        BG_IMG.src = "img/level4.jpg";
        ctx.drawImage(BG_IMG, 0, 0, 1500, 800);
    }
    
    draw();
    
    update();
    
    if(! GAME_OVER){
        requestAnimationFrame(loop);
    }
}
loop();

const soundElement  = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager(){
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == "img/SOUND_OFF.png" ? "img/SOUND_ON.png" : "img/SOUND_OFF.png";
    
    soundElement.setAttribute("src", SOUND_IMG);
    
    WALL_HIT.muted = WALL_HIT.muted ? false : true;
    PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
    BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
    WIN.muted = WIN.muted ? false : true;
    LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
    REWARD.muted = REWARD.muted ? false : true;
    BOMB.muted = BOMB.muted ? false : true;
    EXPAND_IMG.muted = EXPAND.muted ? false : true;
    CACTUS.muted = CACTUS.muted ? false : true;
}

const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

restart.addEventListener("click", function(){
    location.reload(); 
})

function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
}

function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}