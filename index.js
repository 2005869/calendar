const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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

});

app.get('/create', (req, res) => {
    res.render('create');
});


app.listen(serverPORT, () => {
    console.log(`Server run in port ${serverPORT}`);
});