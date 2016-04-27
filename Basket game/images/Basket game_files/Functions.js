function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
}
function clearCanvas(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	bHoop.draw()
	if (mundo.drawAdviceRectangle) {
		drawAdviceRectangle()
	};
}
function newRandomBall(){
	//Math.floor(Math.random() * (MAX - MIN + 1)) + MIN; --> Numero aleatorio en un rango determinado
	var randX = Math.floor(Math.random() * (800 - 400 + 1)) + 400;
	var randY = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
	randX=1100
	randY=20

	//RANGO Y = (100-300)
	//Rango X = (400-800)
	//console.log("newRandomBall")
	clearCanvas()
	mundo.pelota = new Pelota(randX,randY,10) 
	mouse.drawLineToBall()
	mundo.pelota.draw()
}
function whileMoving(){
	if (mundo.pelota.myVar!=0) {
		return true
	}else{
		return false
	}
}
function checkWallBounce(){

	//Los 12 son para el radio de la pelota
	var arriba = mundo.pelota.y >= (10-12)
	var abajo = mundo.pelota.y <= (110+12)
	var lateral = mundo.pelota.x >= (1175-12)


	if (lateral && arriba && abajo) {
		mundo.pelota.wallBounceVar = true
		return true
	};
}
function checkBHoopBounce(){

	var arriba = mundo.pelota.y >= (80-10)
	var abajo = mundo.pelota.y <= (80+10)
	var lateralI = mundo.pelota.x >= (1125-10)
	var lateralD = mundo.pelota.x <= (1125+10)
	var lateral = lateralD && lateralI

	if (lateral && arriba && abajo) {
		return true
	};
}
function checkBallIn(){
	var lateralI = mundo.pelota.x >= (1135)
	var lateralD = mundo.pelota.x <= (1165)
	var lateral = lateralD && lateralI
	var arriba = mundo.pelota.y >= (80)
	var abajo = mundo.pelota.y <= (85)
	if (lateral && arriba && abajo) {
		return true
	};
}
function drawAdviceRectangle(){
	var string = "Para realizar un tiro correcto el mouse debera estar en el cuadrante verde"
		context.beginPath();
        context.rect(mundo.pelota.x, mundo.pelota.y, -5000, 5000);
        context.fillStyle = "#99FF99"
        context.lineWidth = 1;
        context.fill();
        context.strokeStyle = '#99FF99';
        context.stroke();
        context.closePath();

        context.beginPath();
        context.fillStyle = "#003300"
        context.strokeStyle = '#003300';
        context.font = "15px Arial";
        context.textAlign = 'center';
        context.fillText(string,canvas.width/2, 20)
        context.closePath();
        mundo.pelota.draw()
}
function esMalTiro(mousePos){
	return mousePos.y-mundo.pelota.y<0||mundo.pelota.x-mouse.x<0
}
$(".main").onepage_scroll({
   sectionContainer: "section",     
   easing: "ease",
   animationTime: 1000,             
   pagination: true,                
   updateURL: false,                
   beforeMove: function(index) {},  
   afterMove: function(index) {},   
   loop: false,                     
   keyboard: true,                  
   responsiveFallback: false,    
   direction: "vertical"            
});

function gameMode(value){
	$("#text").fadeIn()

	$("#tries").hide()
	$("#tries2").hide()
	$("#tries3").hide()
	$("#tries4").hide()
	$("#tries5").hide()

	$("#timer").hide()
	$("#timer2").hide()
	$("#timer3").hide()
	$("#timer4").hide()
	$("#timer5").hide()

	$("#"+value).show()
	$("#"+value+"2").show()
	$("#"+value+"3").show()
	$("#"+value+"4").show()
	$("#"+value+"5").show()
}
function openDrop(){
	if ($("#group").hasClass("btn-group open")){
		$("#group").removeClass('btn-group open')
		$("#group").addClass('btn-group')
	}
	else if ($("#group").hasClass("btn-group")) {
		$("#group").addClass('btn-group open')
	}
}
function changeDifficultyTries(value){
	mundo.scoreLabel = value
	mundo.ScoreGameMode = "topScoresTries"

	mundo.timer = null
	mundo.tries = parseInt(value)
	clearCanvas()
	mundo.pelota.draw()
	$(".main").moveDown();
}
function changeDifficultyTimer(value){
	mundo.scoreLabel = value
	mundo.ScoreGameMode = "topScoresTimer"

	mundo.tries = null
	mundo.timer = parseInt(value)
	mundo.timerRunner = setInterval(function(){mundo.addTimer()}, 1000);
	clearCanvas()
	mundo.pelota.draw()
	$(".main").moveDown();
}
function training(){
	$(".main").moveDown();
}

function setDefaultScores(){
	var topScoresTries = JSON.parse(localStorage.getItem("topScoresTries"))
	var topScoresTimer = JSON.parse(localStorage.getItem("topScoresTimer"))

	if (topScoresTries==null) {
		mundo.topScoresTries = {"diez":[{"name":"Anonimo 1","score":5},{"name":"Anonimo 2","score":4},{"name":"Anonimo 3","score":3},{"name":"Anonimo 4","score":2},{"name":"Anonimo 5","score":1}],"veinte":[{"name":"Anonimo 1","score":5},{"name":"Anonimo 2","score":4},{"name":"Anonimo 3","score":3},{"name":"Anonimo 4","score":2},{"name":"Anonimo 5","score":1}],"treinta":[{"name":"Anonimo 1","score":5},{"name":"Anonimo 2","score":4},{"name":"Anonimo 3","score":3},{"name":"Anonimo 4","score":2},{"name":"Anonimo 5","score":1}]}
		localStorage.setItem('topScoresTries', JSON.stringify(mundo.topScoresTries));
	}else{
		mundo.topScoresTries = topScoresTries
	}
	if (topScoresTimer==null) {
		mundo.topScoresTimer = {"treinta":[{"name":"Anonimo 1","score":5},{"name":"Anonimo 2","score":4},{"name":"Anonimo 3","score":3},{"name":"Anonimo 4","score":2},{"name":"Anonimo 5","score":1}],"sesenta":[{"name":"Anonimo 1","score":5},{"name":"Anonimo 2","score":4},{"name":"Anonimo 3","score":3},{"name":"Anonimo 4","score":2},{"name":"Anonimo 5","score":1}],"noventa":[{"name":"Anonimo 1","score":5},{"name":"Anonimo 2","score":4},{"name":"Anonimo 3","score":3},{"name":"Anonimo 4","score":2},{"name":"Anonimo 5","score":1}]}
		localStorage.setItem('topScoresTimer', JSON.stringify(mundo.topScoresTimer));
	}else{
		mundo.topScoresTimer = topScoresTimer
	}
}
function saveScoresTries10(){
	//Recorro los scores
	for (var i = 0; i < mundo.topScoresTries.diez.length; i++) {
		//Si hay un top score:
		if (mundo.topScoresTries.diez[i].score<=mundo.score) {
			var username = $("#Username").val()
			if (!username) {
				username = "Anonymous"
			};
			var newScore = {"name":username,"score":mundo.score}	
			//Guardo el top score en su lugar en la tabla
			mundo.topScoresTries.diez.splice(i, 0, newScore);
			//Elimino le ultimo
			mundo.topScoresTries.diez.pop()
			mundo.newTopScore = true
			mundo.newTopScoreWhere = i
			break
		};
	};
	localStorage.clear();
	localStorage.setItem('topScoresTries', JSON.stringify(mundo.topScoresTries));
}
function saveScoresTries20(){
	//Recorro los scores
	for (var i = 0; i < mundo.topScoresTries.veinte.length; i++) {
		//Si hay un top score:
		if (mundo.topScoresTries.veinte[i].score<=mundo.score) {
			var username = $("#Username").val()
			if (!username) {
				username = "Anonymous"
			};
			var newScore = {"name":username,"score":mundo.score}	
			//Guardo el top score en su lugar en la tabla
			mundo.topScoresTries.veinte.splice(i, 0, newScore);
			//Elimino le ultimo
			mundo.topScoresTries.veinte.pop()
			mundo.newTopScore = true
			mundo.newTopScoreWhere = i
			break
		};
	};
	localStorage.clear();
	localStorage.setItem('topScoresTries', JSON.stringify(mundo.topScoresTries));
}
function saveScoresTries30(){
	//Recorro los scores
	for (var i = 0; i < mundo.topScoresTries.treinta.length; i++) {
		//Si hay un top score:
		if (mundo.topScoresTries.treinta[i].score<=mundo.score) {
			var username = $("#Username").val()
			if (!username) {
				username = "Anonymous"
			};
			var newScore = {"name":username,"score":mundo.score}	
			//Guardo el top score en su lugar en la tabla
			mundo.topScoresTries.treinta.splice(i, 0, newScore);
			//Elimino le ultimo
			mundo.topScoresTries.treinta.pop()
			mundo.newTopScore = true
			mundo.newTopScoreWhere = i
			break
		};
	};
	localStorage.clear();
	localStorage.setItem('topScoresTries', JSON.stringify(mundo.topScoresTries));
}
function saveScoresTimer30(){
	//Recorro los scores
	for (var i = 0; i < mundo.topScoresTimer.treinta.length; i++) {
		//Si hay un top score:
		if (mundo.topScoresTimer.treinta[i].score<=mundo.score) {
			var username = $("#Username").val()
			if (!username) {
				username = "Anonymous"
			};
			var newScore = {"name":username,"score":mundo.score}	
			//Guardo el top score en su lugar en la tabla
			mundo.topScoresTimer.treinta.splice(i, 0, newScore);
			//Elimino le ultimo
			mundo.topScoresTimer.treinta.pop()
			mundo.newTopScore = true
			mundo.newTopScoreWhere = i
			break
		};
	};
	localStorage.clear();
	localStorage.setItem('topScoresTries', JSON.stringify(mundo.topScoresTimer));
}
function saveScoresTimer60(){
	//Recorro los scores
	for (var i = 0; i < mundo.topScoresTimer.sesenta.length; i++) {
		//Si hay un top score:
		if (mundo.topScoresTimer.sesenta[i].score<=mundo.score) {
			var username = $("#Username").val()
			if (!username) {
				username = "Anonymous"
			};
			var newScore = {"name":username,"score":mundo.score}	
			//Guardo el top score en su lugar en la tabla
			mundo.topScoresTimer.sesenta.splice(i, 0, newScore);
			//Elimino le ultimo
			mundo.topScoresTimer.sesenta.pop()
			mundo.newTopScore = true
			mundo.newTopScoreWhere = i
			break
		};
	};
	localStorage.clear();
	localStorage.setItem('topScoresTries', JSON.stringify(mundo.topScoresTimer));
}
function saveScoresTimer90(){
	//Recorro los scores
	for (var i = 0; i < mundo.topScoresTimer.noventa.length; i++) {
		//Si hay un top score:
		if (mundo.topScoresTimer.noventa[i].score<=mundo.score) {
			var username = $("#Username").val()
			if (!username) {
				username = "Anonymous"
			};
			var newScore = {"name":username,"score":mundo.score}	
			//Guardo el top score en su lugar en la tabla
			mundo.topScoresTimer.noventa.splice(i, 0, newScore);
			//Elimino le ultimo
			mundo.topScoresTimer.noventa.pop()
			mundo.newTopScore = true
			mundo.newTopScoreWhere = i
			break
		};
	};
	localStorage.clear();
	localStorage.setItem('topScoresTries', JSON.stringify(mundo.topScoresTimer));
}









