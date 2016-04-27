canvas.addEventListener('mousemove', function(event) {
	var mousePos = getMousePos(canvas, event);
	if (!esMalTiro(mousePos)) {
		mundo.drawAdviceRectangle=false
	};
	clearCanvas()    
    mouse.x = mousePos.x
    mouse.y = mousePos.y
  	mouse.drawLineToBall()
  	mundo.pelota.draw()
}, false);

canvas.addEventListener('click', function() {
	if (whileMoving()) {return};//No inicio otro lanzamiento si se esta moviendo la pelota

	//midd1 controla si el mouse esta en el radio de la mundo.pelota en el eje X(true si lo esta)
	midd1 = mundo.pelota.x-10 < mouse.x && mundo.pelota.x+10 > mouse.x
	//midd2 controla si el mouse esta en el radio de la mundo.pelota en el eje Y(true si lo esta)    	
	midd2 = mundo.pelota.y-10 < mouse.y && mundo.pelota.y+10 > mouse.y
	//inBall es true si el mosue esta dentro del radio en X y en Y (true en ambos)
	inBall =  midd1 == true && midd2 == true

	if (inBall) {
		console.log("You clicked the ball")	
	};
	var mousePos = getMousePos(canvas,event)//Obtengo la posición del mouse

	if (esMalTiro(mousePos)) {
		mundo.drawAdviceRectangle=true
		drawAdviceRectangle()
		return;
	};

	//Calculo el angulo y lo paso a grados
	var angulo = (Math.atan((mousePos.y-mundo.pelota.y)/(mundo.pelota.x-mouse.x)))* 180 / Math.PI;

	//Calculo la hipotenusa y la multiplico por 0.20 para que entre en un rango de 10 a 50 aprox
	var catetoX=mundo.pelota.x-mouse.x
	var catetoY=mousePos.y-mundo.pelota.y
	var fuerza=Math.sqrt( ((catetoX*catetoX)+(catetoY*catetoY)) )*0.20
	mundo.pelota.myVar = setInterval(function(){ mundo.pelota.move(fuerza,angulo) }, 10);

}, false);












