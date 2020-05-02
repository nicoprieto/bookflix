var express = require("express");
var app = express();
var mysql = require("mysql");
var config = require("./configs/config");
var jwt = require("jsonwebtoken");


//setea la llave usada para el JWT
app.set("llave",config.llave);


//para poder hacer peticiones entre localhost
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//para que las peticiones puedan ser formateadas a JSON
app.use(express.urlencoded({ extended: true }));


var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: null,
    database: 'bookflix'
})

connection.connect(function(err){
    if(err){
        console.log(err)
    }
})


app.get('/', (req,res) => (
    res.send('Hola mundo'),
    console.log('GET /')
))

app.get('/usuarios', function(req,res){
    
    var query = "Select * from usuarios";
    console.log('tratando de hacer fetch');
    connection.query(query, function(err,rows,fields){
    if(err){
        res.status(500).send('Hubo un error');
        return;
    }
        res.status(200).send(rows);
    });
})

app.post("/autenticar",(req,res) => {
    
    let query = "SELECT * FROM usuarios WHERE email='"+req.body.email+"' AND password='"+ req.body.password+"'";
    
    connection.query(query, (err,rows,fields) => {

        if(err){
            console.log(err);
            return;
        }

        
        let response = rows;
        

        if(response[0] != undefined){
            
            
            console.log("existe un usuario");
            
            const payload = {
                check: true
            };
    
            const token = jwt.sign(payload,app.get("llave"),{expiresIn: 1440});
            res.json(
                {
                    mensaje: "Autenticacion correcta",
                    token : token
                }
    
            );
                
        } else {
            res.json({mensaje: "Usuario o contraseña incorrecto",
                      token: null });
        }




    });


    
    

})


app.listen(4000, () => (

    console.log('Escuchando peticiones en el puerto 4000')
))

