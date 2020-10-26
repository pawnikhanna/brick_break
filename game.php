<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>2D Breakout Game - JavScript</title>
    <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Germania+One">
    
    <style>
        *{
            font-family: "Germania One";
        }
        .li{
            width: 160px;
            height: 40px;
            float:right;
        }
        .pl {
            position: fixed;
            top: 0;
            left: 30px;
            width: 240px;
            background-color: black;
            color:white;
        }
        body{
            background: black;
        }
        #gameover{
            position: absolute;
            margin-top: 0px;
            margin-left: 170px;
            width : 1500px;
            height: 800px;
            background: rgba(0,0,0,0.5); 
            display: none;
        }
        #youwon{
            width: 400px;
            position: absolute;
            top : 250px;
            left : 550px;
            display: none;
        }
        #youlose{
            width:400px;
            position: absolute;
            top: 170px;
            left : 550px;
            display: none;
        }
        #restart{
            position: absolute;
            top: 420px;
            left : 670px;
            cursor: pointer;
            font-size: 2.15em;
            color : #FFF;
        }
        canvas { 
            display: block; 
            margin-top: 80px;
            margin-left: 170px ;
            border: 1px solid #000;
        }
    </style>
</head>
<body>
    <div class="pl">
        <h1>
       Hi, <?php echo $_POST["name"]; ?>
        </h1>   
    </div>
    
    <div id="gameover">
        <img src="img/youwon.png" alt="" id="youwon">
        <img src="img/gameover.png" max-width= "190%" height= "400px" alt="" id="youlose">
        <div id="restart">Play Again!</div>
    </div>
   
    <canvas id="breakout" width="1500" height="800"></canvas>

    <script src="script.js"></script>
</body>
</html>