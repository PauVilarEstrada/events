var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const sqlite3 = require('sqlite3').verbose();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

new sqlite3.Database('eventos_modf.db');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var db = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: 'eventos_modf.db'
    }
});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
const requireRole = (role) => (req, res, next) => {
    const {dni} = req.query;
    db.get('SELECT rol FROM Usuarios WHERE dni = ?', dni, (err, row) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else if (!row) {
            res.sendStatus(401);
        } else if (row.rol !== role) {
            res.sendStatus(403);
        } else {
            next();
        }
    });
};

app.get('/admin', requireRole('Administrador'), (req, res) => {
    res.send('Admin Page');
});


app.get('/buyer', requireRole('Comprador'), (req, res) => {
    res.send('Buyer Page');
});


app.get('/api/', function (req, res) {
    data = 'OK';
    res.send(data)
});
app.get('/api/eventos/', function (req, res) {
    db.select('e.id', 'e.nombreEvento', 'e.fecha', 'e.hora', 'e.descripcion',
        'e.precio', 'e.foto', 'e.nombreDelRecinto')
        .from('Eventos as e')
        .then(function (data) {
            data = {'eventos': data};
            console.log(data);
            res.json(data);
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.get('/api/recinto/', function (req, res) {
    db.select('r.idRecinto', 'r.nombre', 'r.direccion', 'r.superficie', 'r.foto')
        .from('Recintos  as r')
        .then(function (data) {
            data = {'recintos': data};
            res.json(data);
        }).catch(function (error) {
        console.log(error)
    });
});

app.get('/api/reservas/', function (req, res) {
    db.select('reserv.idReserva', 'reserv.datosCliente', 'reserv.datosEvento', 'reserv.fechaReserva', 'reserv.entradas')
        .from('Reservas as reserv')
        .then(function (data) {
            data = {'reservas': data};
            res.json(data);
        }).catch(function (error) {
        console.log(error)
    });
});

app.get('/api/opiniones/', function (req, res) {
    db.select('op.idOpinion', 'op.dniUsuario', 'op.nombreEvento', 'op.opinion', 'op.puntuacion')
        .from('Opiniones as op')
        .then(function (data) {
            data = {'opiniones': data};
            res.json(data);
        }).catch(function (error) {
        console.log(error)
    });
});

//buscar por id
app.get('/api/eventos/:id', function (req, res) {
    let id = parseInt(req.params.id);
    db.select('ev.id', 'ev.nombreEvento', 'ev.fecha', 'ev.hora', 'ev.descripcion', 'ev.precio',
        'ev.foto', 'ev.nombreDelRecinto')
        .from('Evento  as ev')
        .where('ev.id', id)
        .then(function (data) {
            data = {'evento': data};
            res.json(data);
        }).catch(function (error) {
        console.log(error)
    });
});

app.get('/api/recinto/:id', function (req, res) {
    let idRecinto = parseInt(req.params.id);
    db.select('r.idRecinto', 'r.nombre', 'r.direccion', 'r.superficie', 'r.foto')
        .from('Recintos  as r')
        .where('r.idRecinto', idRecinto)
        .then(function (data) {
            data = {'recinto': data};
            res.json(data);
        }).catch(function (error) {
        console.log(error)
    });
});

app.get('/api/reservas/:id', function (req, res) {
    let idReserva = parseInt(req.params.id);
    db.select('reserv.idReserva', 'reserv.datosCliente', 'reserv.datosEvento', 'reserv.fechaReserva', 'reserv.entradas')
        .from('Reservas as reserv')
        .where('reserv.idReserva', idReserva)
        .then(function (data) {
            data = {'reservas': data};
            res.json(data);
        }).catch(function (error) {
        console.log(error)
    });
});

app.get('/api/opiniones/:id', function (req, res) {
    let idOpinion = parseInt(req.params.id);
    db.select('op.idOpinion', 'op.dniUsuario', 'op.nombreEvento', 'op.opinion', 'op.puntuacion')
        .from('Opiniones as op')
        .where('op.idOpinion', idOpinion)
        .then(function (data) {
            data = {'opiniones': data};
            res.json(data);
        }).catch(function (error) {
        console.log(error)
    });
});

//insert de tablas

app.post('/api/eventos', function (req, res) {

    let params = req.body;

    db.insert(params)
        .into('Eventos')
        .then(function (data) {

            res.json(data);
        }).catch(function (error) {
        console.log(error)

    });
});

app.post('/api/opiniones', function (req, res) {
    let opinion = req.body;

    db.insert(opinion)
        .into('Opiniones')
        .then(function (data) {
            res.json(data);
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.get('/api/opiniones', (req, res) => {
    const { ordenar } = req.query;

    if (ordenar === 'id') {
        opiniones.sort((a, b) => a.id - b.id);
    } else if (ordenar === 'puntuacion') {
        opiniones.sort((a, b) => b.puntuacion - a.puntuacion);
    }

    res.json({ opiniones });
});


//eliminacion de tablas
app.delete('/api/eventos/:id', function (req, res) {

    let id = parseInt(req.params.id);
    console.log('SE ELIMINARÁ EL EVENTO CON ID'+ id)

    db.delete()
        .from('Eventos')
        .where('id',id)
        .then(function (data) {
            res.json(data);
        }).catch(function (error) {
        console.log(error)
    });

});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
