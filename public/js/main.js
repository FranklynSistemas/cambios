$(function()
{

var valCorreo = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'i');
var cargando = $("#Cargando");


	function registrar(){
		cargando.css("display","block");
		var correo =  $("#Correo").val()
		
		if (!valCorreo.test(correo)) {
			cargando.css("display","none");
			sweetAlert("Oops...", "Debe ingresar un correo valido", "error");
		}else{
			$.ajax(
		    {
		      url     : "/register",
		      type    : "POST", 
		      data    : JSON.stringify({Usuario: $("#Usuario").val(),email: correo,Pass: $("#Pass").val()}), 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(data)
		    { 
		    	console.log(data);
		    	if(data.status){
		    		cargando.css("display","none");
		    		limpiaCampos();
		    		swal({
					  title: "Bien",
					  text: "Su usuario ha sido registrado correctamente, se le notificara vía correo cuando este quede activo, luego podrá ingresar al Sistema",
					  type: "success",
					  showCancelButton: false,
					  confirmButtonColor: "#eab002",
					  closeOnConfirm: true
					},
					function(){
					  window.location = "/";
					});
		    	}else{
		    		cargando.css("display","none");
		    		sweetAlert("Oops...", "El usuario ya existe", "error");
		    	}

		 	});
		}

		
	};


	function login(){
		cargando.css("display","block");
		$.ajax(
		    {
		      url     : "/login",
		      type    : "POST", 
		      data    : JSON.stringify({username: $("#LoginUsuario").val(),password: $("#LoginPass").val()}), 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(data)
		    { 
		    	console.log(data);
		    	if(data.status){
		    		cargando.css("display","none");
		    		limpiaCampos();
		    		swal({
		    		  title:"",
					  text: data.err,
					  type: "success",
					  showCancelButton: false,
					  confirmButtonColor: "#eab002",
					  closeOnConfirm: true
					},
					function(){
					  window.location = "/";
					});
		    	}else{
		    		cargando.css("display","none");
		    		sweetAlert("Oops...", data.err, "error");
		    	}

		 	});
	};

	function Salir(){
		cargando.css("display","block");
		$.ajax(
		    {
		      url     : "/logout",
		      type    : "GET", 
		      data    : "", 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(data)
		    { 
		    	console.log(data);
		    	if(data.status){
		    		swal({
		    		  title:"",
					  text: "Hasta pronto!",
					  timer: 2000,
					  showConfirmButton: false
					},
					function(){
					  window.location = "/";
					});
		    	}else{
		    		cargando.css("display","none");
		    		sweetAlert("Oops...", data.err, "error");
		    	}

		 	});
	};


	function olvidoPass(correo){
		cargando.css("display","block");
		$.ajax(
		    {
		      url     : "/olvidoPass",
		      type    : "POST", 
		      data    : JSON.stringify({correo:correo}), 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(data)
		    { 
		    	cargando.css("display","none");
		    	console.log(data);
		    	if(data.status){
		    		swal({
		    		  title:"",
					  text: "Se ha enviado un correo con sus datos de ingreso a la plataforma",
					  timer: 2000,
					  showConfirmButton: false
					});
		    	}else{
		    		sweetAlert("Oops...", 'La validación no fue exitosa compruebe su correo', "error");
		    	}

		 	});
	}

	function enviaPass(){
		swal({
		  title: "Olvido la contraseña!",
		  text: "Primero validaremos si está registrado en el sistema, si lo esta le enviaremos un correo con los datos de ingreso, Digite el correo con el que se registro:",
		  type: "input",
		  showCancelButton: true,
		  closeOnConfirm: false,
		  animation: "slide-from-top",
		  inputPlaceholder: "micorreo@correo.com"
		},
		function(inputValue){
		  if (inputValue === false) return false;
		  
		  if (inputValue === "" || !valCorreo.test(inputValue)) {
		    swal.showInputError("Debe ingresar un correo valido!");
		    return false
		  }
		  olvidoPass(inputValue);
		  	//swal("Nice!", "You wrote: " + inputValue, "success");
		});
	}
	

	function limpiaCampos(){
		$("#Usuario").val("");
		$("#Correo").val("");
		$("#Pass").val("")
	}

	$("#Crear").click(function(event)
	{
		if($("#Usuario").val() === "" || $("#Correo").val() === "" || $("#Pass").val() === ""){
			swal("Opps!", "Debe llenar todos los campos!", "error");
		}else{
			registrar();
		}
	    
	});

	$("#Ingresar").click(function(event)
	{
	    login();
	});

	$("#Salir").click(function(event)
	{
	    Salir();
	});

	$("#OtherSalir").click(function(event)
	{
	    Salir();
	});

	$(".reset_pass").click(function(event){
		enviaPass();
	});

	$(".login").keypress(function(e) {
    if(e.which == 13) {
        login();
    }
});
	

});