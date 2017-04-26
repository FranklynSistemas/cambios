$(function()
{

var contenido = $('#info');
var cargando = $("#Cargando");
var numRegistros = $("#numReg");
var modal = $("#Historial");

var listadoBoxoUsers = [],
	resultadoBusca = [],
	datosHistorial = [];

var Pendientes = 0;


function treaeBoxoMensajeros(){
	cargando.css("display","block");
		$.ajax(
		    {
		      url     : "/traeBoxoMensajeros",
		      type    : "GET", 
		      data    : "", 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(result)
		    { 
		    	if(result.status){
		    		listadoBoxoUsers = result.data;
		    		llenaTablaBoxoMs(result.data);
		    		cargando.css("display","none");
		    	}else{
		    		sweetAlert("Oops...", "Intente de nuevo", "error");
		    		cargando.css("display","none");
		    	}

		 	});
};treaeBoxoMensajeros();

function trearBoxoMensajero(id){
	cargando.css("display","block");
	$.ajax(
		    {
		      url     : "/traeBoxoMensajero",
		      type    : "POST", 
		      data    : JSON.stringify({id:id}), 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(result)
		    { 
		    	if(result.status){
		    		MuestraInfoUser(result.data);
		    		cargando.css("display","none");
		    	}else{
		    		cargando.css("display","none");
		    		sweetAlert("Oops...", "Intente de nuevo", "error");
		    	}

		 	});


}

function acciones(id,type,coment){

	var info = {id:id, type:type,coment: coment};

	$.ajax(
		    {
		      url     : "/actionsBoxoMensajero",
		      type    : "POST", 
		      data    : JSON.stringify(info), 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(result)
		    { 
		    	if(result.status){
		    		sweetAlert("Bien!", "Estado cambiando correctamente", "success");
		    		cargando.css("display","none");
		    		Pendientes--;
		    		treaeBoxoMensajeros();
		    		$("#myModal").hide();
		    	}else{
		    		sweetAlert("Oops...", "Intente de nuevo, erro: "+result.info, "error");
		    		cargando.css("display","none");
		    	}

	});
}


function traeHistorialBoxoMs(id){
	var consulta = {};
		consulta.id_taxista = id;
		consulta.estadoServicio = "Finalizado";
		consulta.tipoDePago = "TC";

	$.ajax(
		    {
		      url     : "/getServicios",
		      type    : "POST", 
		      data    : JSON.stringify(consulta), 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(result)
		    { 
		    	if(result.status){
		    		cargando.css("display","none");
		    		datosHistorial = result.data;
		    		console.log(datosHistorial);
		    		llenaModal(result.data);
		    		$("#idUser").html(id);
		    	}else{
		    		sweetAlert("Oops...", "Intente de nuevo, erro: "+result.info, "error");
		    		cargando.css("display","none");
		    	}

	});
};

function PagarPedidos(id,ids){
	$.ajax(
		    {
		      url     : "/payServicios",
		      type    : "POST", 
		      data    : JSON.stringify({ids:ids}), 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(result)
		    { 
		    	if(result.status){
		    		cargando.css("display","none");
		    		traeHistorialBoxoMs(id);
		    	}else{
		    		sweetAlert("Oops...", "Intente de nuevo, erro: "+result.info, "error");
		    		cargando.css("display","none");
		    	}
	});
};


//Modal Historial 
var TotalValor = 0,
	TotalDistancia = 0;

function llenaModal(data){
	TotalValor = 0;
	TotalDistancia = 0;
	
	$("#tituloHistorial").html('Historial de Servicios');
	var selecAll = '<input class="selectAll" type="checkbox" value="checked">';

	var html = '<div class="table-responsive" ><table id="tableHistorial" class="table table-striped scroll"><thead style="background-color: #228ce6;color: white;" class="fixedHeader"><tr><th width="5%"">id</th><th width="30%">Fecha</th><th width="16%">Distancia</th><th width="12%">Valor</th><th width="18%">Tipo de Pago</th><th width="20%">Estado de pago</th><th width="10%">Pagar '+selecAll+'</th></tr></thead><tbody class="scrollContent">';
	  for(i in data){
	  	var checkbox =  data[i].estadoDePago === "Pagado"  ? '<td  class="center"><input class="CheckPagar" type="checkbox" value="checked" disabled></td>' : '<td  class="center"><input class="CheckPagar" type="checkbox" value="checked" ></td>';
	  		
	  	html += '<tr><td id="'+data[i]._id+'">'+eval(parseInt(i)+1)+'</td><td width="30%">'+data[i].fechaSolicitud+'</td><td width="15%">'+data[i].distancia+' km</td><td width="15%">'+data[i].valorViaje+' pesos</td><td width="20%">'+data[i].tipoDePago+'</td><td width="30%">'+data[i].estadoDePago+'</td>'+checkbox+'<tr>';     
	  	
	  	TotalValor += parseFloat(data[i].valorViaje);
	  	TotalDistancia += parseFloat(data[i].distancia);
	  
	  }
	
	html += '</tbody></table></div>';  
	
	$("#infoHistorial").html(html);
	$("#Totales").html('<span><b>Valor Total:</b> '+format(TotalValor)+' pesos</span> - <span><b>Distancia Total:</b> '+TotalDistancia.toFixed(4)+' km</span>');
	
	modal.show();
	var checked = false;
	$(".selectAll").change(function(){
		checked = !checked;
		$('.CheckPagar').each(function (index) 
        { 
        	if(!$(this).prop('disabled')){
        		$(this).prop('checked', checked);
        	}
        });
	});

	$(".CheckPagar").change(function () {
	    if ($(".CheckPagar:checked").length == $(".CheckPagar").length) {
	        $('.selectAll').prop('checked', 'checked');
	    } else {
	        $('.selectAll').prop('checked', false);
	    }
	});

};

function MuestraInfoUser(data){
	$(".modal-title").html(data.nameUser);
	
	var taxi = data.placa !== undefined ? "<span style='padding-left: 58px;'> "+data.placa+"</span>" : "<span style='padding-left: 58px;'> Sin información </span>",
		modelo = data.modelo !== undefined ? "<span style='padding-left: 35px;'> "+data.modelo+"</span>" : "<span style='padding-left: 35px;'> Sin información </span>",
		tipo = data.tipo !== undefined ? "<span style='padding-left: 55px;'> "+data.tipo+"</span>" : "<span style='padding-left: 55px;'> Sin información </span>",
		marca = data.marca !== undefined ? "<span style='padding-left: 43px;'> "+data.marca+"</span>" : "<span style='padding-left: 43px;'> Sin información </span>",
		nomRefPerson = data.personaEmerg !== undefined ? "<span style='padding-left: 4px;'> "+data.personaEmerg+"</span>" : "<span style='padding-left: 4px;'> Sin información </span>",
		numRefPerson = data.telefonoEmerg !== undefined ? "<span style='padding-left: 10px;'> "+data.telefonoEmerg+"</span>" : "<span style='padding-left: 10px;'> Sin información </span>",
		cedula = data.documentos.fotocopiaCedula != "" ? "<a class='view' style='padding-left: 8px;' id="+data.documentos.fotocopiaCedula+"><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a> <a class='dowload' style='padding-left: 8px;' href='/download?id="+data.documentos.fotocopiaCedula+"'><i class='fa fa-download' aria-hidden='true'></i></a>" : "<span style='padding-left: 8px;'>Sin Archivo</span>",
		tarjetaPropiedad = data.documentos.tarjetaPropiedad != "" ? "<a class='view' style='padding-left: 8px;' id="+data.documentos.tarjetaPropiedad+"><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a> <a class='dowload' style='padding-left: 8px;' href='/download?id="+data.documentos.tarjetaPropiedad+"'><i class='fa fa-download' aria-hidden='true'></i></a>" : "<span style='padding-left: 8px;'>Sin Archivo</span>",
		soat =  data.documentos.soat != "" ? "<a class='view' style='padding-left: 8px;' id="+data.documentos.soat+"><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a> <a class='dowload' style='padding-left: 6px;' href='/download?id="+data.documentos.soat+"'><i class='fa fa-download' aria-hidden='true'></i></a>" : "<span style='padding-left: 6px;'>Sin Archivo</span>",
		lincenciaConducion = data.documentos.lincenciaConducion != "" ? "<a class='view' style='padding-left: 8px;' id="+data.documentos.lincenciaConducion+"><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a> <a class='dowload' style='padding-left: 6px;' href='/download?id="+data.documentos.lincenciaConducion+"'><i class='fa fa-download' aria-hidden='true'></i></a>" : "<span style='padding-left: 6px;'>Sin Archivo</span>";
		poliza = data.documentos.poliza != "" ? "<a class='view' style='padding-left: 8px;' id="+data.documentos.poliza+"><i class='fa fa-file-pdf-o' aria-hidden='true'></i></a> <a class='dowload' style='padding-left: 6px;' href='/download?id="+data.documentos.poliza+"'><i class='fa fa-download' aria-hidden='true'></i></a>" : "<span style='padding-left: 6px;'>Sin Archivo</span>";

	var html = "<div id='foto'><img src='"+data.fotoPerfil+"' ></div>"+
			   "<span><b>Taxi: </b>"+taxi+"</span><br>"+
			   "<span><b>Modelo: </b>"+modelo+"</span><br>"+
			   "<span><b>Tipo: </b>"+tipo+"</span><br>"+
			   "<span><b>Marca: </b>"+marca+"</span><br>"+
			   "<span><b>Nombre referencia personal: </b>"+nomRefPerson+"</span><br>"+
			   "<span><b>Celular referencia personal: </b>"+numRefPerson+"</span><br>"+
			   "<span><b>Fotocopia de la cédula: </b>"+cedula+"</span><br>"+
			   "<span><b>Fotocopia de la tarjeta de propiedad: </b>"+tarjetaPropiedad+"</span><br>"+
			   "<span><b>Soat: </b>"+soat+"</span><br>"+
			   "<span><b>Fotocopia de la lincencia de condución: </b>"+lincenciaConducion+"</span><br>"+
			   "<span><b>Póliza de responsabilidad social extracontractual: </b>"+poliza+"</span>";

	 var btnAprobar = data.estado ==  false ? '<button type="button" class="btn btn-default btnAprobar" id="'+data._id+'" data-dismiss="modal" >Aprobar</button>' : '<button type="button" class="btn btn-default" id="btnAprobar" data-dismiss="modal" disabled>Aprobar</button>',
	 	 btnRechazar = '<button type="button" class="btn btn-default btnRechazar" id="'+data._id+'" data-dismiss="modal" >Rechazar</button>',
	 	 btnCargarArchivos = data.estado ==  false ? '<button type="button" class="btn btn-default btnCargar" id="'+data._id+'" data-dismiss="modal" >Cargar Archivos</button>' : '<button type="button" class="btn btn-default" id="btnAprobar" data-dismiss="modal" disabled>Cargar Archivos</button>';

	$("#Userinfo").html(html);
	$("#botones").html(btnRechazar+btnAprobar+btnCargarArchivos);
	$("#myModal").show();

	$(".btnAprobar").click(function(){
		cargando.css("display","block");
		acciones($(this).attr("id"),1,"");
	});

	$(".btnRechazar").click(function(){
		var id = $(this).attr("id");
		swal({
			  title: "Escribe el motivo por el que se rechaza el registro:",
			  text: "",
			  type: "input",
			  showCancelButton: true,
			  closeOnConfirm: true,
			  animation: "slide-from-top",
			  inputPlaceholder: "Motivo"
			},
			function(inputValue){
			  if (inputValue === false) return false;
			  
			  if (inputValue === "") {
			    swal.showInputError("Necesitas escribir algo!");
			    return false
			  }else{
			  	cargando.css("display","block");
			  	acciones(id,2,inputValue);
			  }			  
		});	
	});

	$(".btnCargar").click(function(){
		var id = $(this).attr("id");
		//window.location.assign("/documentosTaxista?id="+id);
		window.open("/documentosTaxista?id="+id,'_blank');
	});

	$(".view").click(function(){
		var id = $(this).attr("id");
		$("#Archivo").html(typeArchive(parseInt(id.split("_")[0])));
		$("#viewFrame").html("<iframe src = '/ViewerJS/#../Archivos/"+id+"' width='400' height='300' allowfullscreen webkitallowfullscreen></iframe>")
		$("#viewPDF").show();
	});

}
	$(".closeView").click(function(){
		$("#viewPDF").hide();
	});


	$(".close").click(function(){
		$("#myModal").hide();
		modal.hide();
	});

	function typeArchive(type){
		switch(type){
			case 1:
				return "Licencia de condución"; 
			break;
			case 2:
				return "Tarjeta de operación";  
			break;
			case 3:
				return "Tarjeton"; 
			break;
			case 4:
				return "Soat"; 
			break;
			case 5: 
				return "Seguro contractual";
			break;
			case 6:
				return "Seguro extra contractual"; 
			break;
			case 7:
				return "Fotocopia de la cédula"; 
			break;
			case 8:
				return "Tarjeta de propiedad"; 
			break;
		};
	};

function llenaTablaBoxoMs(data){
	  var clase = ""; 

	  var html = '<div class="table-responsive"><table class="table table-striped"><thead  style="background-color: #228ce6;color: white;"><tr><th>id</th><th>Nombre</th><th>Ciudad</th><th>Correo</th><th>Fecha Registro</th><th>Cédula</th><th>Teléfono</th><th>Estado</th><th>Ver Más</th><th>Historial</th></tr></thead><tbody>';
	  for(i in data){
	  	var cedula = data[i].cedula !== undefined ? data[i].cedula : "Sin información",
	  		telefono = data[i].telefono !== undefined ? data[i].telefono : "Sin información",
	  		estado =  data[i].estado ? "Usuario Activo" :  "Registro Incompleto",
	  		historial = data[i].estado === true ? '<a class="ojoHistorial" id="'+data[i]._id+'""><i class="fa fa-eye" aria-hidden="true"></i></a>' : "";

	  	if(data[i].estado !== undefined && data[i].estado === true){
	  		clase = "table-success"; 
	  	}else if(data[i].estado !== undefined && data[i].estado === false && data[i].documentos.lincenciaConducion != "" ){
	  		clase = "table-info"; 
	  		Pendientes++;
	  	}else if(data[i].estado !== undefined && data[i].estado === false){
			clase = "table-danger"; 
	  	}else{
	  		clase = "table-sin"; 
	  	}

	  	html += '<tr class="'+clase+'"><td>'+eval(parseInt(i)+1)+'</td><td>'+data[i].nameUser+'</td><td>'+data[i].ciudad+'</td><td>'+data[i].email+'</td><td>'+data[i].fechaInicial+'</td><td>'+cedula+'</td><td>'+telefono+'</td><td>'+estado+'</td><td><a class="ojo" id="'+data[i]._id+'""><i class="fa fa-eye" aria-hidden="true"></i></a></td><td>'+historial+'</td><tr>';
	  }
	  html += '</tbody></table></div>';  
	  contenido.html(html);

	  $(".ojo").click(function(){
		trearBoxoMensajero($(this).attr("id"));
	  });

	  $(".ojoHistorial").click(function(){
	  	traeHistorialBoxoMs($(this).attr("id"));
	  });

	  $("#Pendientes").html("# Pendientes: "+Pendientes);
}

function imprimeTabla(resultados){
	var numReg = 0;
	var clase = ""; 
	var html = '<div class="table-responsive"><table class="table table-striped"><thead  style="background-color: #228ce6;color: white;"><tr><th>id</th><th>Nombre</th><th>Ciudad</th><th>Correo</th><th>Fecha Registro</th><th>Cédula</th><th>Teléfono</th><th>Estado</th><th>Ver Más</th><th>Historial</th></tr></thead><tbody>';
	 
	for(var i = 0; i < listadoBoxoUsers.length; i++)
        {
            muestra = true;
            for(var c in resultadoBusca)
            {
                if(resultadoBusca[c] === i)
                {
                    muestra = false;
                }
            }
            if(muestra)
            {
            	numReg++;
            	var cedula = listadoBoxoUsers[i].cedula !== undefined ? listadoBoxoUsers[i].cedula : "Sin información",
			  		telefono = listadoBoxoUsers[i].telefono !== undefined ? listadoBoxoUsers[i].telefono : "Sin información",
			  		estado =  listadoBoxoUsers[i].estado ? "Usuario Activo" : "Registro Incompleto"
			  		historial = listadoBoxoUsers[i].estado === true ? '<a class="ojoHistorial" id="'+listadoBoxoUsers[i]._id+'""><i class="fa fa-eye" aria-hidden="true"></i></a>' : "";

			  	if(listadoBoxoUsers[i].estado !== undefined && listadoBoxoUsers[i].estado === true){
			  		clase = "table-success"; 
			  	}else if(listadoBoxoUsers[i].estado !== undefined && listadoBoxoUsers[i].estado === false && listadoBoxoUsers[i].documentos.lincenciaConducion != "" ){
			  		clase = "table-info"; 
			  	}else if(listadoBoxoUsers[i].estado !== undefined && listadoBoxoUsers[i].estado === false){
					clase = "table-danger"; 
			  	}else{
			  		clase = "table-sin"; 
			  	}
			  	
			  	html += '<tr class="'+clase+'"><td>'+eval(parseInt(i)+1)+'</td><td>'+listadoBoxoUsers[i].nameUser+'</td><td>'+listadoBoxoUsers[i].ciudad+'</td><td>'+listadoBoxoUsers[i].email+'</td><td>'+listadoBoxoUsers[i].fechaInicial+'</td><td>'+cedula+'</td><td>'+telefono+'</td><td>'+estado+'</td><td><a class="ojo" id="'+listadoBoxoUsers[i]._id+'""><i class="fa fa-eye" aria-hidden="true"></i></a></td><td>'+historial+'</td><tr>';
	    
            }
        }

      html += '</tbody></table></div>';
      numRegistros.html("<span>Registros encontrados: "+numReg+"</span>");
	  contenido.html(html);

	  $(".ojo").click(function(){
		trearBoxoMensajero($(this).attr("id"));
	  });

	  $(".ojoHistorial").click(function(){
	  	traeHistorialBoxoMs($(this).attr("id"));
	  });
}


function imprimeNewTabla(resultados){
	var numReg = 0;
	var clase = ""; 
	TotalValor = 0;
	TotalDistancia = 0;
	var selecAll = '<input class="selectAll" type="checkbox" value="checked">';

	var html = '<div class="table-responsive" ><table id="tableHistorial" class="table table-striped scroll"><thead style="background-color: #228ce6;color: white;" class="fixedHeader"><tr><th width="5%"">id</th><th width="30%">Fecha</th><th width="16%">Distancia</th><th width="12%">Valor</th><th width="18%">Tipo de Pago</th><th width="20%">Estado de pago</th><th width="10%">Pagar '+selecAll+'</th></tr></thead><tbody class="scrollContent">'; 
	for(var i = 0; i < datosHistorial.length; i++)
        {
            muestra = true;
            for(var c in resultadoBusca)
            {
                if(resultadoBusca[c] === i)
                {
                    muestra = false;
                }
            }
            if(muestra)
            {
            	numReg++;
            	
            	var checkbox =  datosHistorial[i].dbB_statusPayment === "Pagado"  ? '<td  class="center"><input class="CheckPagar" type="checkbox" value="checked" disabled></td>' : '<td  class="center"><input class="CheckPagar" type="checkbox" value="checked" ></td>';

			  	html += '<tr><td id="'+datosHistorial[i]._id+'">'+eval(parseInt(i)+1)+'</td><td width="30%">'+datosHistorial[i].fechaSolicitud+'</td><td width="15%">'+datosHistorial[i].distancia+' km</td><td width="15%">'+datosHistorial[i].valorViaje+' pesos</td><td width="20%">'+datosHistorial[i].tipoDePago+'</td><td width="30%">'+datosHistorial[i].estadoDePago+'</td>'+checkbox+'<tr>';     
	  	
			  	TotalValor += parseFloat(datosHistorial[i].valorViaje);
			  	TotalDistancia += parseFloat(datosHistorial[i].distancia);
            }
        }

      html += '</tbody></table></div>';  
	
	  $("#infoHistorial").html(html);
	  $("#Totales").html('<span><b>Valor Total:</b> '+format(TotalValor)+' pesos</span> - <span><b>Distancia Total:</b> '+TotalDistancia.toFixed(4)+' km</span>');
	
      $("#NumRegistrosModal").html("<span>Registros encontrados: "+numReg+"</span>");

    var checked = false;
	$(".selectAll").change(function(){
		checked = !checked;
		$('.CheckPagar').each(function (index) 
        { 
        	console.log($(this).prop('disabled'));
        	if(!$(this).prop('disabled')){
        		$(this).prop('checked', checked);
        	}
        });
	});

	$(".CheckPagar").change(function () {
	    if ($(".CheckPagar:checked").length == $(".CheckPagar").length) {
	        $('.selectAll').prop('checked', 'checked');
	    } else {
	        $('.selectAll').prop('checked', false);
	    }
	});
	  
}


$("#buscar").keyup( function(event)
    {
        resultadoBusca = []; //Reiniciar el array de resultados de búsqueda...
        var busca = false;
        if($(this).val() !== "")
        {
            for(var i = 0; i < listadoBoxoUsers.length; i++)
            {
    			busca = listadoBoxoUsers[i].nameUser.search($(this).val()) < 0;
                busca = listadoBoxoUsers[i].cedula!== undefined ? busca && listadoBoxoUsers[i].cedula.toString().search($(this).val()) < 0 : busca;
                busca = busca && listadoBoxoUsers[i].email.search($(this).val()) < 0;
                busca = listadoBoxoUsers[i].ciudad !== undefined ? busca && listadoBoxoUsers[i].ciudad.search($(this).val()) < 0 : busca;
                busca = listadoBoxoUsers[i].fechaInicial !== undefined ? busca && listadoBoxoUsers[i].fechaInicial.search($(this).val()) < 0 : busca;
                if(busca)
                {
                    resultadoBusca.push(i);
                }
            }
        }
        imprimeTabla(resultadoBusca);
    });

$("#traeUsers").click(function(){
	treaeBoxoMensajeros();
});

$("#Estados").change(function(){
	resultadoBusca = []; //Reiniciar el array de resultados de búsqueda...
        var busca = false;
        if($(this).val() !== "")
        {
            for(var i = 0; i < listadoBoxoUsers.length; i++)
            {
    			busca = listadoBoxoUsers[i].estado !== undefined ? listadoBoxoUsers[i].estado.toString().search($(this).val()) < 0 : true;
                if(busca)
                {
                    resultadoBusca.push(i);
                }
            }
        }
        imprimeTabla(resultadoBusca);
});

$("#Aprobar").change(function(){
	resultadoBusca = []; //Reiniciar el array de resultados de búsqueda...
        var busca = false;
        if($(this)[0].checked)
        {
            for(var i = 0; i < listadoBoxoUsers.length; i++)
            {
    			busca = listadoBoxoUsers[i].documentos.lincenciaConducion == "" && !listadoBoxoUsers[i].estado || listadoBoxoUsers[i].documentos.lincenciaConducion != "" && listadoBoxoUsers[i].estado; 
                if(busca)
                {
                    resultadoBusca.push(i);
                }
            }
        }
        imprimeTabla(resultadoBusca);
});

$("#typePago").change(function(){
	filtro(2,$(this).val());
});

$("#typeEstado").change(function(){
	filtro(1,$(this).val());
});

$("#inputDia").change(function(){
	filtro(4,$(this).val());
});

$("#inputMes").change(function(){
	console.log($(this).val());
	filtro(4,$(this).val());
});

function filtro(type,value){
	resultadoBusca = [];
	var busca = false;
        if(value !== "")
        {
            for(var i = 0; i < datosHistorial.length; i++)
            {
    				if(type===1){
    					busca = datosHistorial[i].estadoDePago !== undefined ? datosHistorial[i].estadoDePago !== value : true;
	    			}else if(type===2){
	    				busca = datosHistorial[i].tipoDePago !== undefined ? datosHistorial[i].tipoDePago.search(value) < 0 : true;
	    			}else if(type===4){
	    				if(validaFiltros()){
	    					busca = datosHistorial[i].fechaSolicitud !== undefined ? datosHistorial[i].fechaSolicitud.search(value) < 0 : true;
	    					if($("#typeEstado").val() !== ""){
	    						busca = datosHistorial[i].estadoDePago !== undefined ? busca || datosHistorial[i].estadoDePago.search($("#typeEstado").val()) < 0 : true;
	    					}else if($("#typePago").val() !== ""){
	    						busca = datosHistorial[i].tipoDePago !== undefined ? busca || datosHistorial[i].tipoDePago.search($("#typePago").val()) < 0 : true;
	    					}
	    				}else{
	    					busca = datosHistorial[i].fechaSolicitud !== undefined ? datosHistorial[i].fechaSolicitud.search(value) < 0 : true;
	    				}
	    				
	    			}
    			
                if(busca)
                {
                    resultadoBusca.push(i);
                }
            }
        }
        imprimeNewTabla(resultadoBusca);
}

function validaFiltros(){
	return $("#typePago").val() !== "" ||  $("#typeEstado").val() !== "";
}


var tableToExcel = (function() {
  var uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
  return function(table, name) {
    //if (!table.nodeType) table = document.getElementById(table)
    var ctx = {worksheet: name || 'Worksheet', table: table}
    window.location.href = uri + base64(format(template, ctx))
  }
})();

$("#Exportar").click(function(){
	generarExcel();
});

function generarExcel(){
	var vacio = true;
	var selecAll = '<input class="selectAll" type="checkbox" value="checked">';
	var html = '<thead style="background-color: #228ce6;color: white;" class="fixedHeader"><tr><th width="5%"">id</th><th width="30%">Fecha</th><th width="16%">Distancia</th><th width="12%">Valor</th><th width="18%">Tipo de Pago</th><th width="20%">Estado de pago</th><th width="30%">Nombre Boxo Taxista</th><th>N Documento</th></tr></thead><tbody class="scrollContent">'; 
	var campos = "";

	$("#tableHistorial tbody tr").each(function (index){
		if($(this).children("td").length > 0){
			if($($(this).children("td")[$(this).children("td").length-1]).children("input").prop('checked')){
				vacio = false;
				var id = parseInt($($(this).children("td")[0]).html());
				var tds = $($(this).children("td")).length;
				campos = "";
                for (var i = 0; i < tds-1; i++) {
                    campos += "<td>"+$($(this).children("td")[i]).html()+"</td>";
                }
				html += "<tr>"+campos+"<td>"+datosHistorial[id-1].id_taxista.nameUser+"</td><td>"+datosHistorial[id-1].id_taxista.cedula+"</td></td></tr>";
			}
		}
	});

	html += '</tbody>';
	if(vacio){
		sweetAlert("Oops...", "Debe seleccionar los servicios a pagar", "error");
	}else{
	  	tableToExcel(html,"Pagos pendientes");
	}	
};

function calculaTotalPago(){
	var vacio = true;
	var total = 0;
	var ids = [];
	var type = 1,
		numTr = 0,
		numStatusPRecaudo = 0,
		numStatusNoPagado = 0;
	$("#tableHistorial tbody tr").each(function (index){
		if($(this).children("td").length > 0){
			if($($(this).children("td")[$(this).children("td").length-1]).children("input").prop('checked')){
				numTr++;
				vacio = false;
				total += parseInt($($(this).children("td")[$(this).children("td").length-4]).html().split(" ")[0]);
				ids.push($($(this).children("td")[0]).attr("id"));
				console.log(ids);
				if($($(this).children("td")[5]).html() !== "NoPagado"){
					numStatusPRecaudo++;	
				}else{
					numStatusNoPagado++;
				}
			}
		}
	});

	if(vacio){
		sweetAlert("Oops...", "Debe seleccionar los servicios a pagar", "error");
	}else{

		if(numTr === numStatusPRecaudo){
			type = 2;
		}else if(numTr === numStatusNoPagado){
			type = 1;
		}else{
			type = -1;
		}

		swal({
		  title: "Esta seguro?",
		  text: "El valor total a pagar es de: "+format(total),
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Si, Pagar!",
		  cancelButtonText:  "No, Pagar!",
		  closeOnConfirm: false,
		  closeOnCancel: true
		},
		function(isConfirm){
		  if (isConfirm) {
		  	if(type === -1){
		  		swal("Error!", "Debe seleccionar solo un tipo de estado, o bien Pagar o Recaudar", "error");
		  	}else{
		  		PagarPedidos($("#idUser").html(),ids,type);
		    	swal("Pagado!", "Los servicios fueron pagados correctamente", "success");
		  	}
		  } else {
		    //swal("Cancelled", "Your imaginary file is safe :)", "error");
		  }
		});
	}
	
}

$("#Pagar").click(function(){
	calculaTotalPago();
});

function format(input)
{
	var num = input.toString().replace(/\./g,'');
	if(!isNaN(num)){
		num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
		num = num.split('').reverse().join('').replace(/^[\.]/,'');
		return num
	}else{ 
		console.log('Solo se permiten numeros');
		//input.value = input.value.replace(/[^\d\.]*/g,'');
	}
}

});