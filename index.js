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
    res.send('Home')
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


app.listen(serverPORT, () => {
    console.log(`Server run in port ${serverPORT}`);
});