var palabra=seleccionarPalabra();
var aciertos=0;
var fallos=0;
var modificadorAciertos=0;

function teclado(){
	return ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
}
function teclado2(){
	return ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];
}

function iniciar(){


	//Creo los espacios para las letras:
	for (let i = 0; i < palabra.length; i++) {
		let div=document.createElement("div");//Creo un div
		div.setAttribute("class","letras");//Con la clase letras
		div.setAttribute("id","block"+[i])//les asigno un ID distinto a cada uno
		document.getElementById("letras").appendChild(div)//Lo agrego al div con id #letras
	}


	//Creo las teclas:
	var abecedario=teclado2();
	for (var i = 0; i < abecedario.length; i++) {
		var boton=document.createElement("button");
		boton.setAttribute("class","btn btn-warning btn-sm")
		boton.setAttribute("onclick","Click(event)")
		boton.setAttribute("id","Tecla"+abecedario[i])
		boton.innerHTML=abecedario[i];
		document.getElementById("teclado").appendChild(boton);
	}
	//Guardo el tipo de teclado actual
	document.getElementById("tipoTeclado").setAttribute("value","QWERTY")

}

function escribirPalabra(event){

	//desabilito todos los eventos "keydown" para poder escribir en el placeholder
	$(document).off('keydown')

	//Cambio lo que dice el boton despues de hacerlo desaparecer
	$("#modoDeJuego").fadeOut(500,function(){
		$("#PlaceHolder").fadeIn(500)
		boton=document.getElementById("modoDeJuego")
		boton.innerHTML="Un jugador"
		})

	

	//Si ingreso enter (keycode=13) tomo lo que ya esta escrito
	if (event.keyCode == 13) {
		var valorPlaceHolder=$("#PlaceHolder").val()	
		//Todo el contenido del placeHolder a mayusculas y lo guardo en una variable auxiliar (alfa)
		alfa=valorPlaceHolder.toUpperCase()
		//alert(alfa)

		//Validaciones de la palabra:

		//Si alfa no tiene ningun caracter, muestra un error
		if(alfa==""){
			//alert("empty")
			span=document.getElementById("errorMessage")
			span.innerHTML="La palabra no puede estar vacia"
			$("#errorMessage").fadeIn(500)
			
		} else {
			//si tiene mas de un caracter, continua con las validaciones

			//Variables auxiliares
			var myInt=0
			var abecedario=teclado();

			//Comparo todas las letras del abecedario con las de la palabra
			for (var i = 0; i < alfa.length; i++) {					

				for (var j = 0; j < abecedario.length; j++) {

					//alert(alfa[i]+"----"+abecedario[j])

					if (alfa[i]==abecedario[j]) {
						//alert("iguales")
						//Cada vez que una coincide, se le suma 1 a myInt y vuelve al primer bucle for
						myInt++;
						break;
					};

				};
			};

				//Si myInt es igual al largo de la palabra, es porque coincidieron todas las letras con alguna del abecedario
				if (myInt==alfa.length) {
					//alert("Validation OK")
					validationOk();		

				//Si no es igual, es porque un caracter no pertenece al abecedario			
				}else{
					span=document.getElementById("errorMessage")
					span.innerHTML="La palabra no puede contener caracteres especiales, espacios o '&ntilde'"
					$("#errorMessage").fadeIn(500)
				}
			}
	}

		function validationOk(){
			//La nueva palabra es el valor ingresado (todo en mayusculas)
			palabra=valorPlaceHolder.toUpperCase()


			//Escondo el placeholder y el mensaje de error, y muestro el botón para volver al modo un jugador
			$("#errorMessage").fadeOut(500,function(){
				$("#PlaceHolder").fadeOut(500,function (){
					$("#modoDeJuego").fadeIn(500)
				})
			})			

			//Borro el teclado y el espacio para la palabra, para que se creen con la nueva palabra
			$("#letras *").remove();
			$("#teclado *").remove();	
			
			//Habilito nuevamente el evento keydown en todo el documento
			$(document).keydown(keyDown)

			//Inicio de nuevo (crea teclado y espacios de la palabra)
			iniciar();
		}			
	}


function seleccionarPalabra(){

	let diccionario=[
					"HIPOGRIFO",
					"TRIPLICAR",
					"MERODEAR",
					"ESPIROMETRIA",
					"ADMITANCIA",
					"RIBOSOMA",
					"POLIETILENO",
					"REACTANCIA",
					"IMPEDANCIA",
					"GARITA",
					"PEYORATIVO",
					"MISANTROPIA",					
					];

	// un numero entre 0 y 0.99 multiplicado por el largo del array y redondeado para abajo, puede dar cualquier numero entre 0 y el ultimo elemento del array
	return diccionario[Math.floor(Math.random() * diccionario.length)];

}
function Click(event){

	var boton=event.target
	boton.setAttribute("disabled","disabled");	

	$("#modoTeclado").fadeOut(500)

	if (revisarLetra(boton.innerHTML)) {
		//Sumo aciertos en base a la cantidad de aciertos
		aciertos+=modificadorAciertos;
		//alert(aciertos)

		//Las muestro en verde
		var p=document.createElement("p");
		p.innerHTML=boton.innerHTML		
		p.setAttribute("class","text-success")
		document.getElementById("letrasUsadas").appendChild(p)

		if (aciertos==palabra.length) {
			// Timeout fix to finish showing the word.
			setTimeout(function(){

				if(confirm("Ganaste, jugar de nuevo?")){
					location.reload();
				}else{
					close();
				}
			}, 10);
		}

	} else {

		fallos++;

		//Las muestro en rojo
		var p=document.createElement("p");
		p.innerHTML=boton.innerHTML
		p.setAttribute("class","text-danger")
		p.setAttribute("color","danger")
		document.getElementById("letrasUsadas").appendChild(p)

		//$(document.images[fallos]).show();

		for (let i = 1; i <= fallos; i++) {
			$("#dibujo-"+i).removeAttr("hidden")
		}

		if (fallos==5) {
			var abecedario=teclado2();
			//alert(abecedario)

			for (var i = 0; i < palabra.length; i++){
				//Elimino todas las letras para despues poder agregarlas y que no haya mas de una por div
				$( "#block"+[i] ).empty();

				for (var h = 0; h < abecedario.length; h++) {

					//Ahora que ya no hay letras en los divs, puedo agragar todas las letras
					if (palabra[i]==abecedario[h]) {
						var p=document.createElement("p")
						p.innerHTML=abecedario[h]
						document.getElementById("block"+[i]).appendChild(p)
					}
				}
			}

			// Timeout fix to finish showing the word.
			setTimeout(function(){

				if(confirm("Perdiste, jugar de nuevo?")){
					location.reload();
				}else{
					close();
				}
			}, 10);
		}
	}

	/*var p=document.createElement("p");
	p.innerHTML=boton.innerHTML
	p.setAttribute("class","letrasUsadas")
	document.getElementById("letrasUsadas").appendChild(p)*/

}

$(document).keydown(keyDown)

	function keyDown(event){	

	//Valor de la tecla presionada
	var value = String.fromCharCode(event.keyCode);

	//Hago click en el boton con el ID correcto (en boton con el id "#Tecla" + Tecla pulsada)
	document.getElementById("Tecla"+value).click(event);

	};

function revisarLetra(letra){	

	var bool=false;

	//La reinicio para volver a contar correctamente el numero de letras presentes en la palabra
	modificadorAciertos=0;


	for (var i = 0; i < palabra.length; i++) {			

		if (palabra[i]==letra) {

			var p=document.createElement("p")
			p.innerHTML=letra
			//p.setAttribute()
			document.getElementById("block"+[i]).appendChild(p)

			//Si encontro al menos una letra igualo la variable bool a true
			bool=true;

			//Esta variable ayuda a sumar la cantidad de aciertos correctos en caso de encontrar mas de una letra
			modificadorAciertos++;
					

		};			

	};
	
	//Retorno el valor de bool (si encontro: true, si no encontro:false)
		return bool;
	

}
function DosJugadores(event){
	var boton=event.target
	if (boton.innerHTML=="Dos Jugadores") {			

			palabra=escribirPalabra()	
					
	}

	else if (boton.innerHTML=="Un jugador") {

		//recargo la pagina si cambian nuevamente a un jugador
		location.reload();
		
	}
	


}
function CambioTeclado(event){

	//Decido a cual teclado tengo que cambiar
	if(document.getElementById("tipoTeclado").value=="QWERTY"){

		//Si el teclado es QWERTY, lo cambio a ABCDE
		//Remuevo el anterior teclado
		$("#teclado").fadeOut(500,function(){
			$("#teclado").empty()
			//Lo creo de nuevo
			var abecedario=teclado();
			for (var i = 0; i < abecedario.length; i++) {
				var boton=document.createElement("button");
				boton.setAttribute("class","btn btn-warning btn-sm")
				boton.setAttribute("onclick","Click(event)")
				boton.setAttribute("id","Tecla"+abecedario[i])
				boton.innerHTML=abecedario[i];
				document.getElementById("teclado").appendChild(boton);
			};
			//Guardo el tipo de teclado actual
			document.getElementById("tipoTeclado").setAttribute("value","ABCDE")
			$("#teclado").fadeIn(500)

		})


	}


	else{

		//Si el teclado no es QWERTY, lo cambio a QWERTY

		//Remuevo el anterior teclado
		$("#teclado").fadeOut(500, function(){
			$("#teclado").empty()
			//Lo creo de nuevo
			var abecedario=teclado2();
			for (var i = 0; i < abecedario.length; i++) {
				var boton=document.createElement("button");
				boton.setAttribute("class","btn btn-warning btn-sm")
				boton.setAttribute("onclick","Click(event)")
				boton.setAttribute("id","Tecla"+abecedario[i])
				boton.innerHTML=abecedario[i];
				document.getElementById("teclado").appendChild(boton);
			};
			//Guardo el tipo de teclado actual
			document.getElementById("tipoTeclado").setAttribute("value","QWERTY")
			$("#teclado").fadeIn(500)

		})

	
	}



}