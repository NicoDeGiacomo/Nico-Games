//TODO agregar super comida (aparece cada tanto y da 2 x puntos)


$(document).ready(function (){

	updateScores()

	//Canvas stufffo
	var canvas=document.getElementById('canvas');
	var context=canvas.getContext("2d");
	//Variables globales
	var snake=[];
	var direction;
	var food;
	var score;
	//Variable para comprobar que pase por paintCell (pintando el snake) antes de cambiar de dirección
	var boolDobleTecla;
	//Variable para la pausa
	var pausa;
	//Variable para el nivel de dificultad (easy=60 medium=40 hard=20)
	var dificultad;
	var anteriorDificultad;


	function inicio(){
		direction="right"//La direcion es right por default

		dificultad="easy";//Por default
		anteriorDificultad=dificultad;

		score=0;

		boolDobleTecla=false;

		pausa=true;

		createSnake();

		createFood();

		//Cada 60ms se ejecuta la funcion move
		if(typeof gameLoop != "undefined") clearInterval(gameLoop);
		gameLoop = setInterval(move, 60);

		//Función para la comida especial:
		//if(typeof secondGameLoop != "undefined") clearInterval(gameLoop);
		//secondGameLoop = setInterval(specialFood, 6000);

	}

	function createFood(){
		food = {
			x: Math.floor(Math.random()*44)*10,
			y: Math.floor(Math.random()*44)*10,
		};
		//alert(food.x+"--------"+food.y)
	}



	inicio();



	function createSnake(){
		//Le paso un mapa a el array snake, x e y son las coordenadas en las 
		// cuales los respectivos rectangulos van a empezar
		snake.push({x:40,y:0});
		snake.push({x:30,y:0});
		snake.push({x:20,y:0});
		snake.push({x:10,y:0});
		snake.push({x:0,y:0});
	}



	
	//La funcion move mueve el snake un paso (para eso tiene que redibujar de blanco todo el canvas para evitar 
	//que se vea el camino) y ademas tiene los game over clauses
	function move(){
		//difucultad es la dificultad actual
		dificultad=$("#dificultad").val()

		//Si anterior dificultad es distinto de dificultad es porque hubo un cambio y tengo que cambiar la 
		// velocidad dependiendo de el valor de la actual dificultad
		if (dificultad!=anteriorDificultad) {

			clearInterval(gameLoop);			
			document.getElementById("difSpan").innerHTML="Dificultad cambiada a "+dificultad
			//document.getElementById("difSpan").style.display = "inline"
			$("#difSpan").fadeIn()
			//alert("Dificultad cambiada a "+dificultad)
			if (dificultad=="easy") {gameLoop = setInterval(move, 60);};
			if (dificultad=="medium") {gameLoop = setInterval(move, 40);};
			if (dificultad=="hard") {gameLoop = setInterval(move, 20);};
			if (dificultad=="insane") {gameLoop = setInterval(move, 8);};

			//Lo igualo para detectar el proximo cambio
			anteriorDificultad=dificultad
		};


		if (pausa==false) {

			//Si alguna vez empezó el juego desabilito el cambio de dificultad
			$("#difSpan").fadeOut()
			$("#cambioDeDificultad").fadeOut();


			//Pinto todo el cavas de blanco con marco negro
			context.fillStyle = "gray";
			context.strokeStyle="black";
			context.fillRect(0,0,450,450);
			context.strokeRect(0,0,450,450);
			

			//La idea es sacar el ultimo elemento y ponerlo como el primero 
			// para crear la sensación de movimiento 

			//XFirstElement es la coordenada X de el primer elemento
			var XFirstElement=snake[0].x;
			//YFirstElement es la coordenada Y de el primer elemento
			var YFirstElement=snake[0].y;

			//Transformo las coordenadas del primer elemento en las del futuro primer elemento
			// dependiendo de la dirección del snake
			// notese que para ir hacia arriba se deben restar casillas en Y, esto se debe a como es el mapa del canvas,
			// ya que ambos ejes empiezan en (0;0), que es la esquina superior izquierda.
			// El eje X aumenta para su derecha y el Y aumenta para abajo
			if(direction=="right"){ XFirstElement+=10; }
			else if (direction=="left") { XFirstElement-=10 }
			else if (direction=="down") { YFirstElement+=10 }
			else if (direction=="up") { YFirstElement-=10 };


			//Antes de mover el snake compruebo que no haya chocado:

			//Body collision
			var bodyCollision = checkCollision(XFirstElement, YFirstElement, snake)
			//var bodyCollision=false;


			//X(0) es la casilla extrema izquierda y X(450) la derecha
			if( XFirstElement<0 || XFirstElement>440 || YFirstElement<0 || YFirstElement>440 || bodyCollision ) {
				XFirstElement = 50
				YFirstElement = 0
				bodyCollision = false
				//context.clearRect(0, 0, canvas.width, canvas.height);
				context.fillStyle = "gray";
				context.strokeStyle="black";
				context.fillRect(0,0,450,450);
				context.strokeRect(0,0,450,450);		

				snake = []

				if(confirm("Perdiste, jugar de nuevo?")){
					var topScores = JSON.parse(localStorage.getItem("topScores"))
					if (topScores==null) {
						//Si es la primera vez debo guardar los scores default
						var newTopScores = {"saves":[{"name":"Anonimo 1","score":5},{"name":"Anonimo 2","score":4},{"name":"Anonimo 3","score":3},{"name":"Anonimo 4","score":2},{"name":"Anonimo 5","score":1}]}
						// Put the object into storage
						localStorage.setItem('topScores', JSON.stringify(newTopScores));
						// Retrieve the object from storage
						topScoresString = localStorage.getItem('topScores');
						topScores = JSON.parse(topScoresString)
					};
					var newTopScore = false
					var newTopScoreWhere = false

					//Recorro los scores
					for (var i = 0; i < topScores.saves.length; i++) {
						//Si hay un top score:
						if (topScores.saves[i].score<=score) {

							var username = $("#Username").val()
							if (!username) {
								username = "Anonymous"
							};
							newScore = {"name":username,"score":score}	
							//Guardo el top score en su lugar en la tabla
							topScores.saves.splice(i, 0, newScore);
							//Elimino le ultimo
							topScores.saves.pop()

							newScore = true
							newTopScoreWhere = i
							break
						};
					};
					//Reemplazo la anterior tabla de scores		
					localStorage.clear();
					localStorage.setItem('topScores', JSON.stringify(topScores));
					//console.log(JSON.parse(localStorage.getItem('topScores')))
					updateScores()
					//clearInterval(secondGameLoop)
					inicio();
				}else{
					close();
				}

			}

			//Si esta pisando la comida:
			if (XFirstElement==food.x && YFirstElement==food.y){
				//alert("iguales")
				if (dificultad=="easy") {score+=1};
				if (dificultad=="medium") {score+=3};
				if (dificultad=="hard") {score+=9};
				if (dificultad=="insane") {score+=27};
				//Si coinciden las futuras coordenadas del primer elemento con las de la comida,
				// en vez de quitar la cola y agragarla al principio, simplemente agrego un elemento
				// con las futuras coordenadas del primer elemento
				var lastElement={ x: XFirstElement, y: YFirstElement };
				//Vuelvo a crear otra comida
				createFood();


			}else {
				//LasElement es el ultimo elemento (que a la vez lo saco de array)
				var lastElement=snake.pop();

				//Reemplazo las coordenadas del ex-ultimo elemento con las del futuro primer elemento
				lastElement.x=XFirstElement;
				lastElement.y=YFirstElement;
			}





			//Muevo el snake:



			//Agrego como primer elemento el ex-ultimo elemento
			snake.unshift(lastElement);

			//Pinto el snake		
			for (var i = 0; i < snake.length; i++) {
				//Pinto una celula por cada elemento del snake
				paintCell(snake[i].x,snake[i].y);
			};

			//Pinto la comida
			paintCell(food.x,food.y);

			var scoreText="Score: "+score;
			context.fillText(scoreText,5,445)
		}
	}


	function paintCell(x,y){

		//Dibujo un rectangulo de 10x10 empezando en las coordenadas de cada elemento del array snake
		context.fillStyle = "black";
		context.strokeStyle="gray";
		context.fillRect(x,y,10,10);
		context.strokeRect(x,y,10,10);

		//Seteo boolDobleTecla en false para que imprima el movimiento la proxima vez que pase por el keydown
		boolDobleTecla=false;


	}

	function checkCollision(x, y, array){
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++){
			if(array[i].x == x && array[i].y == y){
			 return true;
			}
		}
		return false;
	}

	function updateScores(){
		//alert("name")
		var topScores = JSON.parse(localStorage.getItem("topScores"))
		if (topScores==null) {
			//Si es la primera vez debo guardar los scores default
			var newTopScores = {"saves":[{"name":"Anonimo 1","score":5},{"name":"Anonimo 2","score":4},{"name":"Anonimo 3","score":3},{"name":"Anonimo 4","score":2},{"name":"Anonimo 5","score":1}]}
			// Put the object into storage
			localStorage.setItem('topScores', JSON.stringify(newTopScores));
			// Retrieve the object from storage
			topScoresString = localStorage.getItem('topScores');
			topScores = JSON.parse(topScoresString)
		};
		for (var i = 0; i < topScores.saves.length; i++) {
			$('#name'+i).text(topScores.saves[i].name)
		};
				for (var i = 0; i < topScores.saves.length; i++) {
			$('#score'+i).text(topScores.saves[i].score)
		};
		return
	}

	/*function specialFood(){
		if (pausa==false) {
			alert("special")
		};
		
	}*/



	//Control de la dirección con el teclado:
	$(document).keydown(function(event){

		//Si boolDobleTecla es true, es porque no pinto el movimiento, por lo que no cambiará de dirección
		if (boolDobleTecla==false) {
			var key = event.which

			if (key=="80") {
				if (pausa==false) {pausa=true}
				else {pausa=false};				
				//alert("El juego esta pausado, presione aceptar para continuar")
			};

			if (pausa==false) {
				if (key=="37" && direction != "right" ) { direction = "left"; }
				else if (key=="38" && direction != "down" ) { direction = "up"; }
				else if (key=="39" && direction != "left" ) { direction = "right"; }
				else if (key=="40" && direction != "up") { direction = "down"; };
				//Seteo boolDobleTecla en true para que tenga que pasar por paintCell (pintar el movimiento)
				// antes de cambiar de dirección
				//Si no pasa por paintCell boolDobleTecla queda true y no va a cambiar la dirección
				boolDobleTecla=true;
			}
		};
	})
})
















