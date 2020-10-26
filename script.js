        const LEVEL_IMG = new Image();
        LEVEL_IMG.src = "img/level.png";

        const LIFE_IMG = new Image();
        LIFE_IMG.src = "img/life.png";

        const SCORE_IMG = new Image();
        SCORE_IMG.src = "img/score.png";

        const cvs = document.getElementById("breakout");
        const ctx = cvs.getContext("2d");

        ctx.lineWidth = 3;

        const PADDLE_WIDTH = 170;
        const PADDLE_MARGIN_BOTTOM = 50;
        const PADDLE_HEIGHT = 20;
        const BALL_RADIUS = 13;
        let LIFE = 3; 
        let SCORE = 0;
        const SCORE_UNIT = 10;
        let LEVEL = 1;
        const MAX_LEVEL = 3;
        let GAME_OVER = false;
        let leftArrow = false;
        let rightArrow = false;

        const paddle = {
            x : cvs.width/2 - PADDLE_WIDTH/2,
            y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
            width : PADDLE_WIDTH,
            height : PADDLE_HEIGHT,
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

        function movePaddle(){
            if(rightArrow && paddle.x + paddle.width < cvs.width){
                paddle.x += paddle.dx;
            }else if(leftArrow && paddle.x > 0){
                paddle.x -= paddle.dx;
            }
        }

        const ball = {
            x : cvs.width/2,
            y : paddle.y - BALL_RADIUS,
            radius : BALL_RADIUS,
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
            if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0){
                ball.dx = - ball.dx;
                (new Audio('./sounds/paddle_hit')).play();
            }
            
            if(ball.y - ball.radius < 0){
                ball.dy = -ball.dy;
                (new Audio('./sounds/paddle_hit')).play();
            }
            
            if(ball.y + ball.radius > cvs.height){
                LIFE--; 
                (new Audio('./sounds/life_lost')).play();
                resetBall();
            }
        }

        function resetBall(){
            ball.x = cvs.width/2;
            ball.y = paddle.y - BALL_RADIUS;
            ball.dx = 8 * (Math.random() * 2 - 1);
            ball.dy = -8;
        }

        function ballPaddleCollision(){
            if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){
                
                (new Audio('./sounds/paddle_hit')).play();
                
                let collidePoint = ball.x - (paddle.x + paddle.width/2);
                
                collidePoint = collidePoint / (paddle.width/2);
                
                let angle = collidePoint * Math.PI/3;
                    
                    
                ball.dx = ball.speed * Math.sin(angle);
                ball.dy = - ball.speed * Math.cos(angle);
            }
        }

        const brick = {
            row : 3,
            column : 9,
            width : 145,
            height : 25,
            offSetLeft : 20,
            offSetTop : 20,
            marginTop : 60,
            fillColor : "#56fca2",
            strokeColor : "#56fca2"
        }

        let bricks = [];

        function createBricks(){
            for(let r = 0; r < brick.row; r++){
                bricks[r] = [];
                for(let c = 0; c < brick.column; c++){
                    bricks[r][c] = {
                        x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                        y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                        status : true
                    }
                }
            }
        }

        createBricks();

        function drawBricks(){
            for(let r = 0; r < brick.row; r++){
                for(let c = 0; c < brick.column; c++){
                    let b = bricks[r][c];
                    if(b.status){
                        if(LEVEL==1){
                            ctx.fillStyle = "#56fca2";
                            ctx.fillRect(b.x, b.y, brick.width, brick.height);
                        }
                        if(LEVEL==2 || LEVEL==3){
                            if(r==0){
                                ctx.fillStyle = "#ae35d4";
                                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                            }
                            if(r==1){
                                ctx.fillStyle = "#1E90FF";
                                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                            }
                            if(r==2){
                                ctx.fillStyle = "#ecddab";
                                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                            }
                            if(r>2){
                                ctx.fillStyle = "#56fca2";
                                ctx.fillRect(b.x, b.y, brick.width, brick.height);  
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
                            (new Audio('./sounds/brick_hit')).play();
                            ball.dy = - ball.dy;
                            b.status = false; 
                            SCORE += SCORE_UNIT;
                        }
                    }
                }
            }
        }
        
        function isColliding(a, b) {
            return !(
            b.x > a.x + a.width || b.x + b.width < a.x || b.y > a.y + a.height || b.y + b.height < a.y);
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
            
            showGameStats(SCORE, 69, 53, SCORE_IMG, 5, 5);
            
            showGameStats(LIFE, cvs.width - 95, 48, LIFE_IMG, cvs.width-75, 5); 
        
            showGameStats(LEVEL, cvs.width/2, 50, LEVEL_IMG, cvs.width/2 + 19, 5);
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
                (new Audio('./sounds/win')).play();
                
                if(LEVEL >= MAX_LEVEL){
                    showYouWin();
                    GAME_OVER = true;
                    return;
                }
                LEVEL++;
                if(LEVEL==2){
                    brick.row+=2;
                    createBricks();
                    ball.speed += 1;
                    paddle.dx=11;
                    resetBall();
                }
            }
        }

        function update(){
            movePaddle();
            
            moveBall();
            
            ballWallCollision();
            
            ballPaddleCollision();
            
            ballBrickCollision();
            
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

            if(LEVEL==2){
                const BG_IMG = new Image();
                BG_IMG.src = "img/level3.jpg";
                ctx.drawImage(BG_IMG, 0, 0, 1500, 800);
            }
            
            draw();
            
            update();
            
            if(! GAME_OVER){
                requestAnimationFrame(loop);
            }
        }
        loop();

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