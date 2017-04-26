$(function()
{

var contenido = $('#info');
var cargando = $("#Cargando");
var numRegistros = $("#numReg");

var listadoBoxoUsers = [],
	resultadoBusca = [];


function traeUsuarios(){
	cargando.css("display","block");
		$.ajax(
		    {
		      url     : "/traeUsuarios",
		      type    : "GET", 
		      data    : "", 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(result)
		    { 
		    	if(result.status){
		    		listadoBoxoUsers = result.data;
		    		llenaTablaUsuarios(result.data);
		    		cargando.css("display","none");
		    	}else{
		    		sweetAlert("Oops...", "Intente de nuevo", "error");
		    		cargando.css("display","none");
		    	}

		 	});
};traeUsuarios();

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

function acciones(id,type){
	cargando.css("display","block");
	var info = {id:id, type:type};
	var msg = "";
	$.ajax(
		    {
		      url     : "/actionsUsuarios",
		      type    : "POST", 
		      data    : JSON.stringify(info), 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(result)
		    { 
		    	if(result.status){
		    		if(type===1){msg = "Estado cambiando correctamente";}else{msg = "Usuario eliminado correctamente";}
		    		sweetAlert("Bien!", msg, "success");
		    		cargando.css("display","none");
		    		traeUsuarios();
		    	}else{
		    		sweetAlert("Oops...", "Intente de nuevo, erro: "+result.info, "error");
		    		cargando.css("display","none");
		    	}

	});
}


function actualizaNotificacion(datos){

	$.ajax(
		    {
		      url     : "/actualizaNotificacion",
		      type    : "POST", 
		      data    : JSON.stringify(datos), 
		      dataType  : "json",
		      contentType: "application/json; charset=utf-8"
		    }).done(function(result)
		    { 
		    	if(result.status){
		    		traeUsuarios();
		    	}else{
		    		sweetAlert("Oops...", "Intente de nuevo, erro: "+result.info, "error");
		    	}

	});
}

$(".close").click(function(){
	$("#myModal").hide();
})


function llenaTablaUsuarios(data){
	  var clase = ""; 

	  var html = '<div class="table-responsive"><table class="table table-striped"><thead style="background-color: #efb50b;color: white;"><tr><th>id</th><th>Usuario</th><th>Correo</th><th>Activo</th><th>Notificaciones</th><th>Activar</th><th>Eliminar</th></tr></thead><tbody>';
	  for(i in data){
	  	
	  	var activo = data[i].activo === true ? "Sí" : "No"; 
	  	var notificacion = data[i].notificacion ? '<label class="switch"><input class="togle" type="checkbox" checked id="'+data[i]._id+'"><div class="slider round"></div></label>' : '<label class="switch"><input class="togle" type="checkbox" id="'+data[i]._id+'"><div class="slider round"></div></label>';
	  	html += '<tr class="'+clase+'"><td>'+eval(parseInt(i)+1)+'</td><td>'+data[i].Usuario+'</td><td>'+data[i].email+'</td><td>'+activo+'</td><td>'+notificacion+'</td><td><a class="check" id="'+data[i]._id+'""><i class="fa fa-check-circle-o" aria-hidden="true"></i></a></td><td><a class="eliminar" id="'+data[i]._id+'""><i class="fa fa-minus-circle" aria-hidden="true"></i></a></td><tr>';
	    
	  }
	  html += '</tbody></table></div>';  
	  contenido.html(html);

	  $(".check").click(function(){
		acciones($(this).attr("id"),1);
	  });

	  $(".eliminar").click(function(){
	  	var id = $(this).attr("id")
	  		swal({
			  title: "Esta seguro?",
			  text: "Eliminará un usuario!",
			  type: "warning",
			  showCancelButton: true,
			  confirmButtonColor: "#DD6B55",
			  confirmButtonText: "Si, eliminar!",
			  cancelButtonText: "No, cancelar!",
			  closeOnConfirm: false,
			  closeOnCancel: true
			},
			function(isConfirm){
			  if (isConfirm) {
			    acciones(id,2);
			  } 
			});
		
	  });

	  $(".togle").change(function(){
	  	var data = {};
	  		data.notificacion = $(this).is(':checked');
	  		data.id = $(this).attr("id");
	  		actualizaNotificacion(data);
	  });
	 	

}

function imprimeTabla(resultados){
	var clase = "";
	var numReg = 0;
	var html = '<div class="table-responsive"><table class="table table-striped"><thead style="background-color: #efb50b;color: white;"><tr><th>id</th><th>Usuario</th><th>Correo</th><th>Activo</th><th>Activar</th><th>Eliminar</th></tr></thead><tbody>';
	 
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
            	var activo = listadoBoxoUsers[i].activo === true ? "Sí" : "No"; 

	  			html += '<tr class="'+clase+'"><td>'+eval(parseInt(i)+1)+'</td><td>'+listadoBoxoUsers[i].Usuario+'</td><td>'+listadoBoxoUsers[i].email+'</td><td>'+activo+'</td><td><a class="check" id="'+listadoBoxoUsers[i]._id+'""><i class="fa fa-check-circle-o" aria-hidden="true"></i></a></td><td><a class="eliminar" id="'+listadoBoxoUsers[i]._id+'""><i class="fa fa-minus-circle" aria-hidden="true"></i></a></td><tr>';
	 
            }
        }

      html += '</tbody></table></div>'; 
      numRegistros.html("<span>Registros encontrados: "+numReg+"</span>");
	  contenido.html(html);

	  $(".check").click(function(){
		activarUser($(this).attr("id"));
	  });
	  $(".eliminar").click(function(){
		eliminarUser($(this).attr("id"));
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
    			
                busca = listadoBoxoUsers[i].Usuario.search($(this).val()) < 0;
                busca = busca && listadoBoxoUsers[i].email.search($(this).val()) < 0;
                if(busca)
                {
                    resultadoBusca.push(i);
                }
            }
        }
        imprimeTabla(resultadoBusca);
    });

$("#traeUsers").click(function(){
	traeUsuarios();
})

});