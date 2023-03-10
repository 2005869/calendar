const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const AppointmentService = require('./services/AppointmentService');

const serverPORT = 8080;
const mongoHost = 'localhost';
const mongoPORT = 27017;
const database = 'calendar';
const optionsDatabase = {useNewUrlParser: true, useUnifiedTopology: true};

// Use
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Set
app.set('view engine', 'ejs');

// connect mongodb
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb://${mongoHost}:${mongoPORT}/${database}`, optionsDatabase).then(() => {
    console.log('Database connection successful');
}).catch(() => {
    console.log('Database connection error');
});


// Rotes
app.get('/', (req, res) => {
    res.render('index', {error: false});
});

app.get('/create', (req, res) => {
    res.render('create', {error: false});
});

app.post('/create', async (req, res) => {
    var status = await AppointmentService.Create(
        req.body.name,
        req.body.email,
        req.body.description,
        req.body.cpf,
        req.body.date,
        req.body.time,
    )
    if (status){
        res.redirect('/');
    }else{
        console.log('create error');
        res.render('create', {error: "Something went wrong"});
    }
});

app.get('/getcalendar', async (req, res) => {
    var appointment = await AppointmentService.GetAll(false);
    res.json(appointment);
});

app.get('/event/:id', async (req, res) => {
    var appointmentById = await AppointmentService.GetById(req.params.id);
    res.render('event', {appointmentById, error: false});
});

app.post('/finish', async (req, res) => {
    var result = await AppointmentService.Finish(req.body.id);
    if (result){
        res.redirect('list');
    }else{
        res.render('index', {error: 'Error during appointment remove'});
    }
});

app.get('/list', async (req, res) => {
    var appos = await AppointmentService.GetAll(true);
    res.render('list', {appos});
});

app.post('/list', async (req, res) => {
    try{
        var appos = await AppointmentService.Search(req.body.search);
        res.render('list', {appos});
    }catch(err){
        console.log(err);
        res.render('index', {error: 'cant find appointment'});  
    }
});

app.post('/remove', async (req, res) => {
    try {
        var result = await AppointmentService.RemoveById(req.body.id);
        if (result){
            res.redirect('/list');
        }else{
            res.render('index', {error: 'Something went wrong'});
        }
    } catch (err) {
        console.log(err);
        res.render('index', {error: 'cant remove this appointment'});
    }
});

//poll
var pollTime = 1 * 60 * 60 * 1000; //1h x 60m x 60s x 1000ms verify 

setInterval(async () => {
    await AppointmentService.SendNotification();
}, pollTime);

app.listen(serverPORT, () => {
    console.log(`Server run in port ${serverPORT}`);
});