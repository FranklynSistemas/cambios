$(function()
{

var contenido = $('#info');
var cargando = $("#Cargando");
var numRegistros = $("#numReg");

var pedidos = [],
	resultadoBusca = [];


function traePedidos(){
	cargando.css("display","block");
		$.ajax(
		    {
		      url     : "/getServicios",
		      type    : "POST", 
		      data    : {}, 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(result)
		    { 
		    	if(result.status){
		    		pedidos = result.data;
		    		llenaTablaPedidos(result.data);
		    		cargando.css("display","none");
		    	}else{
		    		sweetAlert("Oops...", "Intente de nuevo", "error");
		    		cargando.css("display","none");
		    	}
		 	});
};traePedidos();

function traePedido(id){
	cargando.css("display","block");
	$.ajax(
		    {
		      url     : "/traePedido",
		      type    : "POST", 
		      data    : JSON.stringify({id:id}), 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(result)
		    { 
		    	if(result.status){
		    		MuestraInfoPedido(result.data);
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
		    		treaeBoxoMensajeros();
		    		$("#myModal").hide();
		    	}else{
		    		sweetAlert("Oops...", "Intente de nuevo, erro: "+result.info, "error");
		    		cargando.css("display","none");
		    	}

	});
}



function MuestraInfoPedido(datos){

	$(".modal-title").html(datos.estadoServicio);
	var FechaCreate = 	datos.fechaSolicitud !== undefined ? "<span style='padding-left: 26px;'> "+datos.fechaSolicitud+"</span>" : "<span style='padding-left: 26px;'> Sin información </span>",
		NombreSolicitante = datos.id_user.nombres !== undefined ? "<span style='padding-left: 80px;'> "+datos.id_user.nombres+"</span>" : "<span style='padding-left: 80px;'> Sin información </span>",
		DireccionOrigen = datos.dirOrigen.direccion !== undefined ? "<span style='padding-left: 38px;'> "+datos.dirOrigen.direccion+"</span>" : "<span style='padding-left: 38px;'> Sin información </span>",
		DireccionDestino = datos.dirDestino.direccion !== undefined ? "<span style='padding-left: 31px;'> "+datos.dirDestino.direccion+"</span>" : "<span style='padding-left: 31px;'> Sin información </span>",
		Distancia = datos.distancia !== "" ? "<span style='padding-left: 90px;'> "+datos.distancia+" km</span>" : "<span style='padding-left: 90px;'> Sin información </span>",
		Valor = datos.valorViaje !== undefined ? "<span style='padding-left: 119px;'> "+datos.valorViaje+" pesos</span>" : "<span style='padding-left: 119px;'> Sin información </span>",
		Comment = datos.novedad !== undefined ? "<span style='padding-left: 74px;'> "+datos.novedad+"</span>" : "<span style='padding-left: 74px;'> Sin Novedad </span>",
		NombMensajero = datos.id_taxista !== null ? "<span style='padding-left: 10px;'> "+datos.id_taxista.nameUser+"</span>" : "<span style='padding-left: 24px;'> Sin información </span>",
		FechayHora = datos.horaFinCarrera !== undefined ? "<span style='padding-left: 33px;'> "+datos.horaFinCarrera+"</span>" : "<span style='padding-left: 37px;'> Sin información </span>";


	var html = "<span><b>Fecha de creación: </b>"+FechaCreate+"</span><br>"+
			   "<span><b>Solicitante: </b>"+NombreSolicitante+"</span><br>"+
			   "<span><b>Dirección origen: </b>"+DireccionOrigen+"</span><br>"+
			   "<span><b>Dirección destino: </b>"+DireccionDestino+"</span><br>"+
			   "<span><b>Distancia: </b>"+Distancia+"</span><br>"+
			   "<span><b>Valor: </b>"+Valor+"</span><br>"+
			   "<span><b>Comentario: </b>"+Comment+"</span><br>";
	
	if(datos.estadoServicio !== "Creado"){
		html+= "<span><b>Nombre Plukii Driver: </b>"+NombMensajero+"</span><br>"+
			   "<span><b>Hora final carrera: </b>"+FechayHora+"</span><br>";
	}
		
	$("#infoPedido").html(html);
	
	//$("#botones").html(btnRechazar+btnAprobar);
	$("#myModal").show();

};

$(".close").click(function(){
	$("#myModal").hide();
});



function llenaTablaPedidos(data){
	  var clase = "",
	  	  nombre = "",
	  	  destino = ""; 
	  var html = '<div class="table-responsive"><table class="table table-striped"><thead style="background-color: #a94442;color: white;"><tr><th>id</th><th>Fecha Creación</th><th>Nombre Plukii Driver</th><th>Dirección Origen</th><th>Dirección Destino</th><th>Valor</th><th>Estado</th><th>Pago</th><th>Ver Más</th></tr></thead><tbody>';
	  for(i in data){

	  	if(data[i].estadoServicio == "Finalizado"){
	  		clase = "table-success"; 
	  	}else if(data[i].estadoServicio == "Creado"){
	  		clase = "table-warning";
	  	}else if(data[i].estadoServicio == "Cancelado"){
	  		clase = "table-info";
	  	}else{
	  		clase = "table-sin"; 
	  	}
	  	nombre =  data[i].id_taxista != null ?  data[i].id_taxista.nameUser :  "Sin Plukii Driver";
	  	destino = data[i].dirDestino.direccion == "" ? "Sin destino" : data[i].dirDestino.direccion;

	  	html += '<tr class="'+clase+'"><td>'+eval(parseInt(i)+1)+'</td><td>'+data[i].fechaSolicitud+'</td><td>'+nombre+'</td><td>'+destino+'</td><td>'+data[i].dirOrigen.direccion+'</td><td>'+data[i].valorViaje+'</td><td>'+data[i].estadoServicio+'</td><td>'+data[i].estadoDePago+'</td><td><a class="ojo" id="'+data[i]._id+'""><i class="fa fa-eye" aria-hidden="true"></i></a></td><tr>';
	  }
	  html += '</tbody></table></div>';  
	  contenido.html(html);

	  $(".ojo").click(function(){
		traePedido($(this).attr("id"));
	  })
}

function imprimeTabla(resultados){
	var clase = "",
	  	nombre = "",
	  	destino = ""; 
	var numReg = 0;
	var html = '<div class="table-responsive"><table class="table table-striped"><thead style="background-color: #a94442;color: white;"><tr><th>id</th><th>Fecha Creación</th><th>Nombre Plukii Driver</th><th>Dirección Origen</th><th>Dirección Destino</th><th>Valor</th><th>Estado</th><th>Pago</th><th>Ver Más</th></tr></thead><tbody>';
	  
	for(var i = 0; i < pedidos.length; i++)
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
			  	if(pedidos[i].estadoServicio == "Finalizado"){
			  		clase = "table-success"; 
			  	}else if(pedidos[i].estadoServicio == "Creado"){
			  		clase = "table-warning";
			  	}else if(pedidos[i].estadoServicio == "Cancelado"){
			  		clase = "table-info";
			  	}else{
			  		clase = "table-sin"; 
			  	}
			  	nombre =  pedidos[i].id_taxista != null ?  pedidos[i].id_taxista.nameUser :  "Sin Plukii Driver";
			  	destino = pedidos[i].dirDestino.direccion == "" ? "Sin destino" : pedidos[i].dirDestino.direccion;
			  	
			  	html += '<tr class="'+clase+'"><td>'+eval(parseInt(i)+1)+'</td><td>'+pedidos[i].fechaSolicitud+'</td><td>'+nombre+'</td><td>'+destino+'</td><td>'+pedidos[i].dirOrigen.direccion+'</td><td>'+pedidos[i].valorViaje+'</td><td>'+pedidos[i].estadoServicio+'</td><td>'+pedidos[i].estadoDePago+'</td><td><a class="ojo" id="'+pedidos[i]._id+'""><i class="fa fa-eye" aria-hidden="true"></i></a></td><tr>';
            }
        }

      html += '</tbody></table></div>';  

      numRegistros.html("<span>Registros encontrados: "+numReg+"</span>");
	  contenido.html(html);

	  $(".ojo").click(function(){
		traePedido($(this).attr("id"));
	  })
}

$("#buscar").keyup( function(event)
    {
        resultadoBusca = []; //Reiniciar el array de resultados de búsqueda...
        var busca = false;
        if($(this).val() !== "")
        {
            for(var i = 0; i < pedidos.length; i++)
            {	
            	if(pedidos[i].id_taxista != null ){
            		 busca = pedidos[i].id_taxista.nameUser.toLowerCase().search($(this).val()) < 0;
            	}else{
            		busca = true;
            	}
                busca = busca && pedidos[i].fechaSolicitud.toLowerCase().search($(this).val()) < 0;
                busca = busca && pedidos[i].dirDestino.direccion.toLowerCase().search($(this).val()) < 0;
                busca = busca && pedidos[i].dirOrigen.direccion.toLowerCase().search($(this).val()) < 0;
                busca = busca && pedidos[i].valorViaje.search($(this).val()) < 0;
                busca = busca && pedidos[i].estadoServicio.toLowerCase().search($(this).val()) < 0;
                busca = busca && pedidos[i].estadoDePago.toLowerCase().search($(this).val()) < 0;
                
                if(busca)
                {
                    resultadoBusca.push(i);
                }
            }
        }
        imprimeTabla(resultadoBusca);
});

$("#Estados").change(function(){
	resultadoBusca = []; //Reiniciar el array de resultados de búsqueda...
        var busca = false;
        if($(this).val() !== "")
        {
            for(var i = 0; i < pedidos.length; i++)
            {
    			busca = pedidos[i].estadoServicio !== undefined ? pedidos[i].estadoServicio.search($(this).val()) < 0 : true;
                if(busca)
                {
                    resultadoBusca.push(i);
                }
            }
        }
        imprimeTabla(resultadoBusca);
});

$("#traePedidos").click(function(){
	traePedidos();
})

});