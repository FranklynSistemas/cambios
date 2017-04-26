$(function()
{

var numArchivos = 5;
var cargando = $("#Cargando");


var campos = ["NumCtaAhorrox","NomBanco","linkLicencia","linkSoat","linkfotocopiaCedula","linktarjetaDePropiedad","linkPoliza"];

(function modalOpen(){
	$("#myModal").modal("show");
})();


function cargarArchivo(formdata, done){
	cargando.css("display","block");
	$.ajax({
                url: "/upload",
                type: "post",
                dataType: "html",
                data: formdata,
                cache: false,
                contentType: false,
                processData: false
            }).done(function(datos){
              var result = JSON.parse(datos);
              cargando.css("display","none");
              done(result);
        });
}

	function validaCampos(){
		var datos = [];
		reiniciaColor();
		for (var i = 0; i < campos.length; i++) {
			if($("#"+campos[i]).val() === ""){
				return {status:false, pos: i};
			}else{
				datos.push($("#"+campos[i]).val());
			}
		}

		return {status:true,data:datos};
	}

	function reiniciaColor(){
		for (var i = 0; i < campos.length; i++) {
			$("#"+campos[i]).css("border-color","#aaa");
		}
	}

	function eviarDatos(id,data){
		cargando.css("display","block");
		var datos = {
						
						cuenta: 	data[0],
						banco: 		data[1],
						documentos: {
							lincenciaConducion: data[2],
							soat: 			data[3],
							fotocopiaCedula: 	data[4],
							tarjetaPropiedad: 	data[5],
							poliza: 	data[6]
						}
 					};
 		
 		$.ajax({
		      url     : "/ActualizarDatos",
		      type    : "POST", 
		      data    : JSON.stringify({id: id, query:datos}), 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(result){
              //var result = JSON.parse(response);
              if(result.status){
              	cargando.css("display","none");
              	swal("Buen trabajo!",result.info+", Verificaremos su información y le avisaremos vía correo cuando su solicitud sea aprobada" , "success");
				swal({
				  title: "Buen trabajo!",
				  text: result.info+", Verificaremos su información y le avisaremos vía correo cuando su solicitud sea aprobada",
				  type: "success",
				  closeOnConfirm: true				 
				},
				function(){
				  window.location.assign("http://boxo.com.co/");
				});
              }else{
              	cargando.css("display","none");
              	swal("Oops!", "Ocurrio un error en el proceso"+result.info+" ", "error");
              }
                
        });
	}

	$("#btnLicencia").click(function(e){
		e.preventDefault();
		var btn = $(this);
        var formData = new FormData(document.getElementById("Licencia"));
        if(formData.getAll("LicenciaConduccion")[0].name === ""){
        	console.log("debe selecionar o arrastrar un archivo");
        	swal("Oops!", "Debe seleccionar un archivo PDF", "error");
        }else{
        	cargarArchivo(formData, function(result){
	        	if(result.status){
	        		numArchivos--;
	        		$("#linkLicencia").val(result.nameArchive);
	        		swal("Buen trabajo!", "Archivo cargado con exito! Faltan "+numArchivos+" ", "success");
	        		btn.css("color","green");

	        	}else{
	        		swal("Oops!", "Hubo un error en el proceso: "+result.info+" intente nuevamente", "error");
	        		btn.css("color","red");
	        	}
        	});
        }
	});

	$("#btnTarjeta").click(function(e){
		e.preventDefault();
		var btn = $(this);
        var formData = new FormData(document.getElementById("TarjetaDeOperacion"));
        if(formData.getAll("TarjetaDeOperacion")[0].name === ""){
        	console.log("debe selecionar o arrastrar un archivo");
        	swal("Oops!", "Debe seleccionar un archivo PDF", "error");
        }else{
        	cargarArchivo(formData, function(result){
	        	if(result.status){
	        		numArchivos--;
	        		$("#linkTarjetaDeOperacion").val(result.nameArchive);
	        		swal("Buen trabajo!", "Archivo cargado con exito! Faltan "+numArchivos+" ", "success");
	        		btn.css("color","green");
	        	}else{
	        		swal("Oops!", "Hubo un error en el proceso: "+result.info+" intente nuevamente", "error");
	        		btn.css("color","red");
	        	}
        	});
        }
	});

	$("#btnTarjeton").click(function(e){
		e.preventDefault();
		var btn = $(this);
        var formData = new FormData(document.getElementById("Tarjeton"));
        if(formData.getAll("Tarjeton")[0].name === ""){
        	console.log("debe selecionar o arrastrar un archivo");
        	swal("Oops!", "Debe seleccionar un archivo PDF", "error");
        }else{
        	cargarArchivo(formData, function(result){
	        	if(result.status){
	        		numArchivos--;
	        		$("#linkTarjeton").val(result.nameArchive);
	        		swal("Buen trabajo!", "Archivo cargado con exito! Faltan "+numArchivos+" ", "success");
	        		btn.css("color","green");
	        	}else{
	        		swal("Oops!", "Hubo un error en el proceso: "+result.info+" intente nuevamente", "error");
	        		btn.css("color","red");
	        	}
        	});
        }
	});

	$("#btnSoat").click(function(e){
		e.preventDefault();
		var btn = $(this);
        var formData = new FormData(document.getElementById("Soat"));
        if(formData.getAll("Soat")[0].name === ""){
        	console.log("debe selecionar o arrastrar un archivo");
        	swal("Oops!", "Debe seleccionar un archivo PDF", "error");
        }else{
        	cargarArchivo(formData, function(result){
	        	if(result.status){
	        		numArchivos--;
	        		$("#linkSoat").val(result.nameArchive);
	        		swal("Buen trabajo!", "Archivo cargado con exito! Faltan "+numArchivos+" ", "success");
	        		btn.css("color","green");
	        	}else{
	        		swal("Oops!", "Hubo un error en el proceso: "+result.info+" intente nuevamente", "error");
	        		btn.css("color","red");
	        	}
        	});
        }
	});

	$("#btnSeguroContractual").click(function(e){
		e.preventDefault();
		var btn = $(this);
        var formData = new FormData(document.getElementById("SeguroContractual"));
        if(formData.getAll("SeguroContractual")[0].name === ""){
        	console.log("debe selecionar o arrastrar un archivo");
        	swal("Oops!", "Debe seleccionar un archivo PDF", "error");
        }else{
        	cargarArchivo(formData, function(result){
	        	if(result.status){
	        		numArchivos--;
	        		$("#linkSeguroContractual").val(result.nameArchive);
	        		swal("Buen trabajo!", "Archivo cargado con exito! Faltan "+numArchivos+" ", "success");
	        		btn.css("color","green");
	        	}else{
	        		swal("Oops!", "Hubo un error en el proceso: "+result.info+" intente nuevamente", "error");
	        		btn.css("color","red");
	        	}
        	});
        }
	});

	$("#btnPoliza").click(function(e){
		e.preventDefault();
		var btn = $(this);
        var formData = new FormData(document.getElementById("Poliza"));
        if(formData.getAll("Poliza")[0].name === ""){
        	console.log("debe selecionar o arrastrar un archivo");
        	swal("Oops!", "Debe seleccionar un archivo PDF", "error");
        }else{
        	cargarArchivo(formData, function(result){
	        	if(result.status){
	        		numArchivos--;
	        		$("#linkPoliza").val(result.nameArchive);
	        		swal("Buen trabajo!", "Archivo cargado con exito! Faltan "+numArchivos+" ", "success");
	        		btn.css("color","green");
	        	}else{
	        		swal("Oops!", "Hubo un error en el proceso: "+result.info+" intente nuevamente", "error");
	        		btn.css("color","red");
	        	}
        	});
        }
	});

	$("#btnfotocopiaCedula").click(function(e){
		e.preventDefault();
		var btn = $(this);
        var formData = new FormData(document.getElementById("fotocopiaCedula"));
        if(formData.getAll("fotocopiaCedula")[0].name === ""){
        	console.log("debe selecionar o arrastrar un archivo");
        	swal("Oops!", "Debe seleccionar un archivo PDF", "error");
        }else{
        	cargarArchivo(formData, function(result){
	        	if(result.status){
	        		numArchivos--;
	        		$("#linkfotocopiaCedula").val(result.nameArchive);
	        		swal("Buen trabajo!", "Archivo cargado con exito! Faltan "+numArchivos+" ", "success");
	        		btn.css("color","green");
	        	}else{
	        		swal("Oops!", "Hubo un error en el proceso: "+result.info+" intente nuevamente", "error");
	        		btn.css("color","red");
	        	}
        	});
        }
	});

	$("#btntarjetaDePropiedad").click(function(e){
		e.preventDefault();
		var btn = $(this);
        var formData = new FormData(document.getElementById("tarjetaDePropiedad"));
        if(formData.getAll("tarjetaDePropiedad")[0].name === ""){
        	console.log("debe selecionar o arrastrar un archivo");
        	swal("Oops!", "Debe seleccionar un archivo PDF", "error");
        }else{
        	cargarArchivo(formData, function(result){
	        	if(result.status){
	        		numArchivos--;
	        		$("#linktarjetaDePropiedad").val(result.nameArchive);
	        		swal("Buen trabajo!", "Archivo cargado con exito! Faltan "+numArchivos+" ", "success");
	        		btn.css("color","green");
	        	}else{
	        		swal("Oops!", "Hubo un error en el proceso: "+result.info+" intente nuevamente", "error");
	        		btn.css("color","red");
	        	}
        	});
        }
	});

	$("#contact-submit").click(function(e){
		var id = $("#idUser").html();
		var result = validaCampos();
		if(result.status){
			eviarDatos(id,result.data);
		}else{
			swal("Oops!", "Debe llenar todos los campos y subir todos los archivos", "error");
			$("#"+campos[result.pos]).css("border-color"," #f30808");
		}
	});



});