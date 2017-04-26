require('../data/Models/taxistas');
require('../data/Models/User');

var usersBoxo = require('mongoose').model('boxotaxistas');
var usuarios    = require('mongoose').model('usuarios');
var fs = require('fs');

var sendMail = require('../config/sendmail');

//Envia los correos notificando que un boxoMensajero ya subio documentos
function enviaCorreos(id,done){
    var correos = [];
    var datos = {};
    datos.subject = "Nuevo registro de Plukii Driver Completado";
    
    usuarios.find({notificacion:true}).select("_id email")
    .exec(function(err, users) {
        if (!users) {
            console.log('Error loading user: ' + err);
            done({data:null,status:false});
        }else{
            for (var i = 0; i < users.length; i++) {
                correos.push(users[i].email);
            }
            usersBoxo.findOne({_id:id}).select("nameUser").exec(function(err,user){
                if(user){
                    datos.html = "<h1>El usuario: "+user.nameUser+",</h1><p align='justify'>Completo exitosamente su registro como Plukii Driver y ya se encuentra listo por revisión y posterior aprobación en la plataforma <a href='http://plukii.boxo.com.co/'>AdminPlukii</a></p>"
                    sendMail.envioCorreos(correos,datos, function(result){
                        done({status:true,info:user.nameUser});
                    });
                }else{
                     done({status:false,data:null});
                }
            });
        };
    });
};

function traeUser(id,done){
    usersBoxo.findOne({ _id: id }).exec(function(err, user) {
        if (err) {
                console.log('Error loading user: ' + err);
                return done({data:null,status:false});
        }else{
            return done({data:user,status:true});
        }
    });
};

function cargaArchivo(file,done){
console.log(file);
      var target_path = './public/Archivos/' + file.name;
       // Comprobamos que el fichero es de tipo imagen
        if (file.tipo !== "application/pdf"){
                    done({status:false,info:'El fichero que deseas subir no es un pdf'});
        } else {
            
           var is = fs.createReadStream(file.tmp_path)
           var os = fs.createWriteStream(target_path)

           is.pipe(os)

           is.on('end', function() {
              //eliminamos el archivo temporal
              fs.unlinkSync(file.tmp_path);
           })
           done({status:true,info:'¡archivo subido!',nameArchive: file.name})
           //res.send('¡archivo subido!')
        }
}

function ActualizaUser(id,data, done){
    usersBoxo.update({_id: id}, data, function (err, user) {
        if(err){
            done({status:false,info:err});
        }else{
            done({status:true,info:"Datos guardados correctamente!"});
        }   
    })
}

module.exports = {
    getBoxoUser: function (req, res, next) {
        if (req.query.id === undefined) {
                res.render('page_404');
        }else {
            traeUser(req.query.id,function(user){
                if(user.data !== null){
                    res.render('registroBoxoMensajeros',{idUser:req.query.id,NomUser:user.data.dbB_nameUsr});
                }else{
                    res.render('page_NoUser',{Error: "No se encontró el registro del usuario, por favor comunicarse con nuestra línea de atención al cliente: 3003103924"});
                }
                
            })
        }
    },
    Uploads : function(req, res) {
        //console.log(req.files);
        var file = {};
        //console.log(req.body);
        switch(req.body.type){
            case '1': 
                file.tmp_path = req.files.LicenciaConduccion.path;
                file.tipo = req.files.LicenciaConduccion.type;
                file.name = req.body.type+"_"+req.body.id+"_"+req.files.LicenciaConduccion.name;
            break;
            /*case '2':
                file.tmp_path = req.files.TarjetaDeOperacion.path;
                file.tipo = req.files.TarjetaDeOperacion.type;
                file.name = req.body.type+"_"+req.body.id+"_"+req.files.TarjetaDeOperacion.name;
            break; */
            case '3': 
                file.tmp_path = req.files.Soat.path;
                file.tipo = req.files.Soat.type;
                file.name = req.body.type+"_"+req.body.id+"_"+req.files.Soat.name;
            break;
            /*case '4':
                file.tmp_path = req.files.Soat.path;
                file.tipo = req.files.Soat.type;
                file.name = req.body.type+"_"+req.body.id+"_"+req.files.Soat.name;
            break;*/
            /*case '5':
                file.tmp_path = req.files.SeguroContractual.path;
                file.tipo = req.files.SeguroContractual.type;
                file.name = req.body.type+"_"+req.body.id+"_"+req.files.SeguroContractual.name;
            break;*/
            case '6':
                file.tmp_path = req.files.Poliza.path;
                file.tipo = req.files.Poliza.type;
                file.name = req.body.type+"_"+req.body.id+"_"+req.files.Poliza.name;
            break;
            case '7':
                file.tmp_path = req.files.fotocopiaCedula.path;
                file.tipo = req.files.fotocopiaCedula.type;
                file.name = req.body.type+"_"+req.body.id+"_"+req.files.fotocopiaCedula.name;
            break;
            case '8':
                file.tmp_path = req.files.tarjetaDePropiedad.path;
                file.tipo = req.files.tarjetaDePropiedad.type;
                file.name = req.body.type+"_"+req.body.id+"_"+req.files.tarjetaDePropiedad.name;
            break;
        }

        cargaArchivo(file,function(response){
            res.json(response);
        });
        
        
    },
    Download : function(req, res){
        res.download("./public/Archivos/"+req.query.id,
            req.query.id, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Listo");
                }
            })
    },
    Update : function(req,res){
        ActualizaUser(req.body.id,req.body.query, function(result){
            if(result.status){
                enviaCorreos(req.body.id,function(response){
                    res.json(response);
                });
            }else{
                res.json(result);
            }
        })
        
    }
};