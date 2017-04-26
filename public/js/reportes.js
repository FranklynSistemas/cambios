$(function(){
    // Dadas la division que contiene todas las pestañas y la de la pestaña que se 
// quiere mostrar, la funcion oculta todas las pestañas a excepcion de esa.
var cargando = $("#Cargando"),
    titulo = $("#titulo");

var pestanas = ["pestana1","pestana2","pestana3","pestana4"],
    cpestanas = ["cpestana1","cpestana2","cpestana3","cpestana4"];

var datosHistorial = [];

function init(){
    ocultaPestanas();
    $("#cpestana1").css('display','block');
    $("#pestana2").parents('li').css("background-color", "#efb50b");
    $("#pestana2").parents('li').css("border-color", "#efb50b");
    $("#pestana3").parents('li').css("background-color", "#a94442");
    $("#pestana3").parents('li').css("border-color", "#a94442");
    $("#pestana4").parents('li').css("background-color", "#337ab7");
    $("#pestana4").parents('li').css("border-color", "#337ab7");
};init();

$(".pestana").click(function(){
    var id = $(this).attr("id");
    cambiarPestana(id);
})

function cambiarPestana(idPestana){
    var pos = buscaPestana(idPestana);
    ocultaPestanas();

    if(pos === 0){
        traePedidosDelDia(1);
    }else{
        traePedidosDelDia(2);
    }
    $("#"+cpestanas[pos]).css('display','block');
}

function buscaPestana(idPestana){
    for (var i = 0; i < pestanas.length; i++) {
        if(pestanas[i] === idPestana){
            idPestana === "pestana2" ? $("#contenidopestanas").css("border-color", "#efb50b") : idPestana === "pestana3" ? $("#contenidopestanas").css("border-color", "#a94442") : idPestana === "pestana4" ? $("#contenidopestanas").css("border-color", "#337ab7") : $("#contenidopestanas").css("border-color", "#3c763d"); 
            return i;
        };
    }
}

function ocultaPestanas(){
    for (var i = 0; i < cpestanas.length; i++) {
        $("#"+cpestanas[i]).css('display','none');
    }
}

function traePedidosDelDia(type){
    cargando.css("display","block");
    var data = type === 1 ? {fecha:"2/12/2016"} : {fecha:""};
        $.ajax(
            {
              url     : "/getPedidosDia",
              type    : "POST", 
              data    : JSON.stringify(data), 
              dataType  : "json",
              contentType: "application/json; charset=utf-8"
            }).done(function(result)
            { 
                if(result.status){
                    llenaGrafica(type,result.data);
                    cargando.css("display","none");
                }else{
                    sweetAlert("Oops...", "Intente de nuevo", "error");
                    cargando.css("display","none");
                }

            });
}; traePedidosDelDia(1);


function traeNomUserBoxoMsg(){
    cargando.css("display","block");
        $.ajax(
            {
              url     : "/getNomBoxoMsg",
              type    : "GET", 
              data    : "", 
              dataType  : "json",
              contentType: "application/json; charset=utf-8"
            }).done(function(result)
            { 
                if(result.status){
                    llenaSelect(result.data);
                    cargando.css("display","none");
                }else{
                    sweetAlert("Oops...", "Intente de nuevo", "error");
                    cargando.css("display","none");
                }

            });
}; traeNomUserBoxoMsg();

function getPedidosPorFecha(fecha1,fecha2,type){
    cargando.css("display","block");
    var data = {fecha1: fecha1, fecha2: fecha2,type:type};
        $.ajax(
            {
              url     : "/getPedidosxFechas",
              type    : "POST", 
              data    : JSON.stringify(data), 
              dataType  : "json",
              contentType: "application/json; charset=utf-8"
            }).done(function(result)
            { 
                if(result.status){
                    cargando.css("display","none");
                    if(type===1){
                        llenaGrafica(3,result.data);
                    }else{
                        generarExcel(result.data);
                    }
                }else{
                    sweetAlert("Oops...", "Intente de nuevo", "error");
                    cargando.css("display","none");
                }

            });
}

function traeHistorialBoxoMs(id){
    var consulta = {};
        consulta.id = id;
        consulta.estado = "Finalizado",
        consulta.type = 2;

    $.ajax(
            {
              url     : "/getPedidosXUsuario",
              type    : "POST", 
              data    : JSON.stringify(consulta), 
              dataType  : "json",
              contentType: "application/json; charset=utf-8"
            }).done(function(result)
            { 
                if(result.status){
                    cargando.css("display","none");
                    datosHistorial = result.data;
                    llenarTablaPagos(result.data);
                }else{
                    sweetAlert("Oops...", "Intente de nuevo, erro: "+result.info, "error");
                    cargando.css("display","none");
                }

    });
};
var TotalValor = 0;
var TotalDistancia = 0;

function llenarTablaPagos(data){
    TotalValor = 0;
    TotalDistancia = 0;
    

    var selecAll = '<input class="selectAll" type="checkbox" value="checked">';

    var html = '<div class="table-responsive" ><table id="tableHistorial" class="table table-striped scroll"><thead style="background-color: #337ab7; color: white;" class="fixedHeader"><tr><th width="2%"">id</th><th width="20%"">Nombre</th><th width="32%">Fecha</th><th width="16%">Distancia</th><th width="12%">Valor</th><th width="20%">Tipo de Pago</th><th width="20%">Estado de pago</th><th width="10%">Pagar '+selecAll+'</th></tr></thead><tbody class="scrollContent">';
      for(i in data){

        var checkbox =  data[i].estadoDePago === "Pagado" ? '<td  class="center"><input class="CheckPagar" type="checkbox" value="checked" disabled></td>' : '<td  class="center"><input class="CheckPagar" type="checkbox" value="checked" ></td>';
            
        html += '<tr><td id="'+data[i]._id+'">'+eval(parseInt(i)+1)+'</td><td width="20%">'+data[i].id_taxista.nameUser+'</td><td width="25%">'+data[i].fechaSolicitud+'</td><td width="15%">'+data[i].distancia+' km</td><td width="15%">'+data[i].valorViaje+' pesos</td><td width="15%">'+data[i].tipoDePago+'</td><td width="20%">'+data[i].estadoDePago+'</td>'+checkbox+'<tr>';     
        
        TotalValor += parseFloat(data[i].valorViaje);
        TotalDistancia += parseFloat(data[i].distancia);
      }
    
    html += '</tbody></table></div>';  
    
    $("#TablaPagos").html(html);
    $("#Totales").html('<span><b>Valor Total:</b> '+format(TotalValor)+' pesos</span> - <span><b>Distancia Total:</b> '+TotalDistancia.toFixed(2)+' km</span>');
    
    $(".scrollContent").css("height","385px");

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
}

$("#pestana4").click(function(){
    traeHistorialBoxoMs("");
});


$("#buscarPagos").click(function(){
    traeHistorialBoxoMs($("#NomBoxoMsgPagos").val());
})

function imprimeNewTabla(resultados){
    var numReg = 0;
    var clase = ""; 
    TotalValor = 0;
    TotalDistancia = 0;
    var selecAll = '<input class="selectAll" type="checkbox" value="checked">';

    var html = '<div class="table-responsive"><table id="tableHistorial" class="table table-striped scroll"><thead style="background-color: #337ab7; color: white;" class="fixedHeader"><tr><th width="2%"">id</th><th width="20%"">Nombre</th><th width="32%">Fecha</th><th width="16%">Distancia</th><th width="12%">Valor</th><th width="20%">Tipo de Pago</th><th width="20%">Estado de pago</th><th width="10%">Pagar '+selecAll+'</th></tr></thead><tbody class="scrollContent">';
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
                
                var checkbox =  datosHistorial[i].estadoServicio === "Pagado" ? '<td  class="center"><input class="CheckPagar" type="checkbox" value="checked" disabled></td>' : '<td  class="center"><input class="CheckPagar" type="checkbox" value="checked" ></td>';

                html += '<tr><td id="'+datosHistorial[i]._id+'">'+eval(parseInt(i)+1)+'</td><td width="20%">'+datosHistorial[i].id_taxista.nameUser+'</td><td width="25%">'+datosHistorial[i].fechaSolicitud+'</td><td width="15%">'+datosHistorial[i].distancia+' km</td><td width="15%">'+datosHistorial[i].valorViaje+' pesos</td><td width="15%">'+datosHistorial[i].tipoDePago+'</td><td width="20%">'+datosHistorial[i].estadoDePago+'</td>'+checkbox+'<tr>';     
        
                TotalValor += parseFloat(datosHistorial[i].valorViaje);
                TotalDistancia += parseFloat(datosHistorial[i].distancia);
            }
        }

      html += '</tbody></table></div>';  
    
      $("#TablaPagos").html(html);
      $("#Totales").html('<span><b>Valor Total:</b> '+format(TotalValor)+' pesos</span> - <span><b>Distancia Total:</b> '+TotalDistancia.toFixed(2)+' km</span>');
      
      $(".scrollContent").css("height","385px");
      $("#NumRegistros").html("<span>Registros encontrados: "+numReg+"</span>");

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

$("#EstadosPago").change(function(){
    filtro(1,$(this).val());
});

$("#inputDia").change(function(){
    filtro(4,$(this).val());
});

$("#inputMes").change(function(){
    console.log($(this).val());
    filtro(4,$(this).val());
});

function validaFiltros(){
    return $("#EstadosPago").val() !== "";
}

function llenaSelect(datos){
    var html = "";
    for (var i = 0; i < datos.length; i++) {
        html+= "<option value="+datos[i]._id+">"+datos[i].nameUser+"</option>";
    }

    $("#NomBoxoMsg").html(html);
    $("#intro select").zelect({ placeholder:'Nombre taxista...' });

    $("#NomBoxoMsgPagos").html(html);
    $("#PagosIntro select").zelect({ placeholder:'Nombre taxista...' });
}



var myDoughnutg;

function llenaGrafica(type,datos){
    var data = [0,0,0,0];
    var labels = ["Cancelado","Creado","Finalizado","En Proceso"];
    for (var c = 0; c < labels.length; c++) {
        for (var i = 0; i < datos.length; i++) {
            if(datos[i].estadoServicio === labels[c]){
                data[c]=data[c]+1;
            }
        }
        
    }

var grafica = {
    labels: labels,
    datasets: [
        {
            data: data,
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                'rgba(75, 192, 192, 0.2)'
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                'rgba(75, 192, 192, 0.2)'
            ]
        }]
};

if(type===1) {
    var ctx = $("#grafica1");
    var myDoughnutChart = new Chart(ctx, {
        type: 'pie',
        data: grafica,
        options: {
                    responsive: true,
                    maintainAspectRatio: true
                }
    });
}else if(type===2){
   titulo.html("<h3>Histórico</h3><p aling='center'>Seleccione el rango de fechas de la que quiera obtener el reporte !<p>");
   if(myDoughnutg!==undefined){
        myDoughnutg.destroy(); // Limpia la grafica
    }
   var ctx2 = $("#grafica2");
   myDoughnutg = new Chart(ctx2, {
        type: 'pie',
        data: grafica,
        options: {
                    responsive: true,
                    maintainAspectRatio: true
                }
    });
}else{
   titulo.html("<h3>Histórico</h3><p aling='center'>Seleccione el rango de fechas de la que quiera obtener el reporte !<p>");
   if(myDoughnutg!==undefined){
        myDoughnutg.destroy(); // Limpia la grafica
    }
   var ctx2 = $("#grafica2");
   myDoughnutg = new Chart(ctx2, {
        type: 'pie',
        data: grafica,
        options: {
                    responsive: true,
                    maintainAspectRatio: true
                }
    });
}

 
};

$("#buscarPedidos").click(function(){
    var consulta = {};
        consulta.estado =  $('#Estados').val();
        consulta.id = $('#NomBoxoMsg').val();
        consulta.type = 1;
    trearPedidosxBoxoMensajero(consulta);
});

function trearPedidosxBoxoMensajero(data){
    cargando.css("display","block");
        $.ajax(
            {
              url     : "/getPedidosXUsuario",
              type    : "POST", 
              data    : JSON.stringify(data), 
              dataType  : "json",
              contentType: "application/json; charset=utf-8"
            }).done(function(result)
            { 
                if(result.status && result.data.length > 0){
                    llenaGraficaPxB(result.data);
                    cargando.css("display","none");
                }else if(!result.data.length > 0){
                    sweetAlert("Oops...", "No se encontro información intente de nuevo", "error");
                    cargando.css("display","none");
                }else{
                    sweetAlert("Oops...", "Ocurrio un error, intente de nuevo", "error");
                    cargando.css("display","none");
                }

            });
}

function buscaInArray(array,busca){
    for (var i = 0; i < array.length; i++) {
        if(array[i] === busca){
            return true;
        }
    }

    return false;
}

function creaData(labels, datos){
    var data = [];
    for (var i = 0; i < labels.length; i++) {
        data.push(0);
    }

    for (var c = 0; c < labels.length; c++) {
        for (var j = 0; j < datos.length; j++) {
            if(datos[j].fechaSolicitud.split("T")[0] === labels[c]){
                data[c]=data[c]+1;
            }
        }
    }

    return data;
}
var myChart;

function llenaGraficaPxB(datos){
var labels = [];
var colores = [];
for (var i = 0; i < datos.length; i++) {
   var fecha =  datos[i].fechaSolicitud.split("T");
   if(labels.length > 0){
        if(!buscaInArray(labels,fecha[0])){
            labels.push(fecha[0]);
        } 
   }else{
    labels.push(fecha[0]);
   }
}



var data = creaData(labels, datos);

labels.unshift('');
data.unshift(0);

colores = creaColores(labels.length);

var ctx = $("#grafica3");

if(myChart!==undefined){
    myChart.destroy();
}

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '# Número de servicios realizados',
                data: data,
                backgroundColor: colores,
                borderColor: colores,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:false
                    }
                }]
            }
        }
    });   
};


$("#buscarHistorico").click(function(){
    var fecha1 = $('#fecha1').val(),
        fecha2 = $("#fecha2").val();
    if(fecha1 === '' ||  fecha2 === ''){
        sweetAlert("Oops...", "Debe seleccionar las 2 fechas", "error");
    }else{
        getPedidosPorFecha(convierteFecha(fecha1),convierteFecha(fecha2),1);
    }

    

    
});


function convierteFecha(fecha){
    var tempFecha = fecha.split('-');
    return tempFecha[2]+"/"+tempFecha[1]+"/"+tempFecha[0];
}

function generarExcel(data){
    var html = '<thead style="background-color: #00f; color: #fff;"><tr><th>id</th><th>Fecha Creacion</th><th>Nombre taxista</th><th>Distancia</th><th>Valor</th><th>Estado</th></thead><tbody>';
      for(i in data){
        var nombre = data[i].id_taxista != null ? data[i].id_taxista.nameUser : "Sin taxista";
        html += '<tr><td>'+eval(parseInt(i)+1)+'</td><td>'+data[i].fechaSolicitud+'</td><td>'+nombre+'</td><td>'+data[i].distancia+'</td><td>'+data[i].valorViaje+'</td><td>'+data[i].estadoServicio+'</td></tr>';
      }
      html += '</tbody>';  
      tableToExcel(html,"Servicios por taxista");
}

$("#generarExcel").click(function(){
    var fecha1 = $('#fecha1').val(),
        fecha2 = $("#fecha2").val();
    if(fecha1 === '' ||  fecha2 === ''){
        sweetAlert("Oops...", "Debe seleccionar las 2 fechas", "error");
    }else{
        getPedidosPorFecha(convierteFecha(fecha1),convierteFecha(fecha2),2);
    }
});


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


function creaColores(limit){
    var colores = [];
    for (var i = 0; i < limit; i++) {
        colores.push(randomColor()); 
    }
    return colores;
}

function randomColor(){
   return 'rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',0.60)';
}

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


$("#Exportar").click(function(){
    generarExcelPagos();
});

function generarExcelPagos(){
    var vacio = true;
    var html = '<thead style="background-color: #228ce6;color: white;"><tr><th width="5%"">id</th><th width="5%"">Nombre Boxo Taxista</th><th width="30%">Fecha</th><th width="16%">Distancia</th><th width="12%">Valor</th><th width="18%">Tipo de Pago</th><th width="20%">Estado de pago</th><th>N Documento</th></tr></thead><tbody>'; 
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
               // html += "<tr>"+campos+"<td>"+datosHistorial[id-1].id_taxista.cedula+"</td><td>"+datosHistorial[id-1].dbB_userBringPackage.dbB_NomBanco+"</td>"+"<td>"+datosHistorial[id-1].dbB_userBringPackage.dbB_NumCtaAhorros+"</td></tr>";
               html += "<tr>"+campos+"<td>"+datosHistorial[id-1].id_taxista.cedula+"</td></tr>";
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



function PagarPedidos(ids){
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
                    traeHistorialBoxoMs("");
                }else{
                    sweetAlert("Oops...", "Intente de nuevo, erro: "+result.info, "error");
                    cargando.css("display","none");
                }
    });
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
                vacio = false;
                numTr++;
                total += parseInt($($(this).children("td")[$(this).children("td").length-4]).html().split(" ")[0]);
                ids.push($($(this).children("td")[0]).attr("id"));
                console.log($($(this).children("td")[6]).html());
                if($($(this).children("td")[6]).html() !== "NoPagado"){
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
          cancelButtonText: "No, Pagar!",
          closeOnConfirm: false,
          closeOnCancel: true
        },
        function(isConfirm){
          if (isConfirm) {
            if(type === -1){
                swal("Error!", "Debe seleccionar solo un tipo de estado, o bien Pagar o Recaudar", "error");
            }else{
                PagarPedidos(ids);
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

});

