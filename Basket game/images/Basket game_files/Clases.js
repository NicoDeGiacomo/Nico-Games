function Pelota(x,y,radius,startAngle,endAngle,anticlockwise,color){
    this.x=x; //Vertice superior izquierdo
    this.y=y;
    this.radius=radius;
    this.startAngle=startAngle || 0 ;
    this.endAngle=endAngle || 2*Math.PI ;
    this.anticlockwise=anticlockwise || false ;
    this.color=color || "orange";    
    this.tiempo=0.1
    this.iniX=this.x
    this.iniY=this.y
    this.myVar=0
    this.bouncing = false
    this.wallBounceVar = false
    this.doubleBounce = false
    this.goalFlag = false
    this.winVar=false

    this.get = function(variable){
        switch(variable)
        {
            case "x":
                return this.x;
            case "y":
                return this.y;
            case "radius":
                return this.radius;
            case "startAngle":
                return this.startAngle;
            case "endAngle":
                return this.endAngle;
            case "anticlockwise":
                return this.anticlockwise;
            case "color":
            	return this.color;
        }
    };
    this.draw = function(){
		context.beginPath();
	    context.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise);
	    context.fillStyle = this.color
	    context.fill();
	    context.lineWidth = 2;
	    context.strokeStyle = '#003300';
	    context.stroke();
	    context.closePath(); 
    };
    this.move = function(velocidad,angle){
        var angulo = angle
        if (this.bouncing) {
            angulo=180+this.vx/angulo
        };
        var radianes=(angulo / 180) * Math.PI;
        this.vx=velocidad*Math.cos(radianes);
        //El - del principio se debe a que la Y debe decrecer para ir hacia arriba
        this.vy=-velocidad*Math.sin(radianes)//*(this.bouncing);

        if (this.bouncing) {
            this.vx=this.vx/3
            this.vy=this.vy/3
        };
        if (this.doubleBounce) {
            this.vy=this.vy/3
            this.vx=this.vx/3
        };
        if (this.winVar) {
            this.vx=0
            this.vy = this.vy/3

        };

        this.tiempo+=0.1;

        this.x=this.iniX+this.vx*this.tiempo//+0.1*this.tiempo*this.tiempo --> 0.1 de viento
        this.y=this.iniY+this.vy*this.tiempo+this.tiempo*this.tiempo
        clearCanvas()
        if (this.y>=(canvas.height+15)||this.x>=(canvas.width+15)) {//los 15 de mas son para que salga toda la pelota (el radio)
            //console.log("Stop moving")
            clearInterval(this.myVar);
            if(!this.winVar&&mundo.tries!=null)mundo.addTries()
            newRandomBall()
        };
        if (checkWallBounce()) {
            //console.log("Bounce")
            this.bouncing = true
            this.iniX = this.x
            this.iniY = this.y
            this.tiempo=0.1
        }else if (checkBHoopBounce()) {
            //console.log("Bounce")
            this.bouncing = true
            if (this.wallBounceVar) {
                this.bouncing = false
                this.doubleBounce = true//Avisa que ya había chocado previamente en la pared
            };
            this.iniX = this.x
            this.iniY = this.y
            this.tiempo=0.1
        };
        if (checkBallIn()&&!this.winVar&&this.goalFlag) {
            //console.log("In")
            this.tiempo=0.1
            this.winVar = true
            this.iniX = 1150
            this.iniY = this.y
            mundo.addScore()
        };
        if (this.y<65) {
            this.goalFlag = true
        };
        this.draw()
        bHoop.draw()
    }
}

function Mouse (){
	this.x
	this.y
	this.distance

	this.get = function (variable){
		switch(variable){
			case "x":
				return this.x
			case "y":
				return this.y
			case "distance":
				return this.distance
		}
	}
	this.drawLineToBall = function(){
        if (whileMoving()) {return};//No dibujo la linea si se esta moviendo la pelota
		context.beginPath();
		context.moveTo(mundo.pelota.x,mundo.pelota.y)
		context.lineTo(this.x,this.y)
		context.lineWidth = 1;
	    context.strokeStyle = 'black';
	    context.stroke();
		context.closePath();
	}
}

function Mundo(){
    this.score = 0
    this.timer = null
    this.tries = null
    this.drawScore = function(){
        context.beginPath();
        context.fillStyle = "gray"
        context.font = "30px Arial";
        context.textAlign = 'left';
        context.fillText("Score: "+this.score,50,50)
        context.closePath();
        this.drawTries();
        this.drawTimer()
    }
    this.addScore = function(){
        this.score = this.score + 1
        this.drawScore()
        //console.log("addScore")
    }

    this.drawTimer = function(){
        var timer = this.timer || 0
        context.beginPath();
        context.fillStyle = "gray"
        context.font = "30px Arial";
        context.textAlign = 'left';
        context.fillText("Timer: "+timer,50,110)
        context.closePath();
    }
    this.addTimer = function(){
        if (this.timer==0) {
            mundo.gameOver()
        };
        this.timer = this.timer - 1
        clearCanvas();
        mouse.drawLineToBall();
        mundo.pelota.draw();
        this.drawTimer()
    }
    
    this.drawTries = function(){
        var tries = this.tries || 0
        context.beginPath();
        context.font = "30px Arial";
        context.textAlign = 'left';
        context.fillText("Tries: "+tries,50,80)
        context.closePath();
    }
    this.addTries = function(){
        if (this.tries==1) {
            mundo.gameOver()
        };
        this.tries = this.tries - 1
        this.drawTries()
        //console.log("addTries")
    }
    this.gameOver = function(){
        alert("Game Over")
        
        clearInterval(mundo.timerRunner);



        if (mundo.ScoreGameMode == "topScoresTries") {

            switch (mundo.scoreLabel){
                case "10":
                    return saveScoresTries10();
                case "20":
                    return saveScoresTries20();
                case "30":
                    return saveScoresTries30();
            }

        };
        if (mundo.ScoreGameMode = "topScoresTimer") {
            
            switch (mundo.scoreLabel){
                case "30":
                    return saveScoresTimer30();
                case "60":
                    return saveScoresTimer60();
                case "90":
                    return saveScoresTimer90();
            }

        };
    }
}

function BHoop(){

    this.draw = function(){

        context.beginPath();
        var startingX = 1135, startingY = 85;
        var startingPoints = [[ startingX, startingY ], [ startingX + 29, startingY - 3 ], [ startingX + 1, startingY - 1 ], [ startingX + 8, startingY - 1 ], [ startingX + 21, startingY + 2 ], [ startingX + 3, startingY + 20 ], [ startingX - 3, startingY + 22 ], [ startingX - 1, startingY + 26 ], [ startingX - 3, startingY + 13 ]], bezierPoints = [[ startingX - 12, startingY - 15, startingX + 11, startingY + 10, startingX - 1, startingY + 23 ], [ startingX + 17, startingY + 7, startingX + 33, startingY + 33, startingX + 26, startingY + 21 ], [ startingX - 2, startingY + 3, startingX + 23, startingY + 27, startingX + 28, startingY + 23 ], [ startingX + 7, startingY - 1, startingX + 29, startingY + 26, startingX + 28, startingY + 19 ], [ startingX + 4, startingY - 17, startingX + 26, startingY + 10, startingX + 25, startingY + 3 ], [ startingX - 8, startingY - 1, startingX + 22, startingY + 39, startingX + 27, startingY + 24 ], [ startingX + 24, startingY + 18, startingX + 23, startingY + 3, startingX + 27, startingY ], [ startingX + 19, startingY + 19, startingX + 23, startingY + 25, startingX + 25, startingY + 9 ], [ startingX + 17, startingY + 6, startingX + 19, startingY + 5, startingX + 23, startingY - 4 ]], length = 9;
        for( var i = 0; i < length; i++ ) {
            context.moveTo( startingPoints[i][0], startingPoints[i][1] );
            context.bezierCurveTo( bezierPoints[i][0], bezierPoints[i][1], bezierPoints[i][2], bezierPoints[i][3], bezierPoints[i][4], bezierPoints[i][5] );
        }
        context.lineWidth = 1;
        context.strokeStyle = 'gray';
        context.stroke()
        context.closePath()

        context.beginPath();
        /*context.moveTo(1175,80)
        context.lineTo(1120,80)
        context.lineWidth = 10;
        context.strokeStyle = 'orange';
        context.stroke()*/    
        context.moveTo(1150, 80 - 3.5);
        context.bezierCurveTo(1150 + (0.5522847498307936 * 23.5), 80 - 3.5,  1150 + 23.5, 80 - (0.5522847498307936 * 3.5), 1150 + 23.5, 80);
        context.bezierCurveTo(1150 + 23.5, 80 + (0.5522847498307936 * 3.5), 1150 + (0.5522847498307936 * 23.5), 80 + 3.5, 1150, 80 + 3.5);
        context.bezierCurveTo(1150 - (0.5522847498307936 * 23.5), 80 + 3.5, 1150 - 23.5, 80 + (0.5522847498307936 * 3.5), 1150 - 23.5, 80);
        context.bezierCurveTo(1150 - 23.5, 80 - (0.5522847498307936 * 3.5), 1150 - (0.5522847498307936 * 23.5), 80 - 3.5, 1150, 80 - 3.5);
        context.lineWidth = 4;
        context.strokeStyle = '#E93E2C';
        context.stroke()
        context.closePath()


        context.beginPath();
        context.rect(1175, 10, 50, 100);
        context.fillStyle = "gray"
        context.lineWidth = 1;
        context.fill();
        context.strokeStyle = 'black';
        context.stroke();
        context.closePath();
        /*
        context.beginPath();
        context.rect(1165, 80, 10, 10);
        context.fillStyle = "gray"
        context.lineWidth = 1;
        context.fill();
        context.strokeStyle = 'black';
        context.stroke();
        context.closePath();
        */
        mundo.drawScore()
    }
}










