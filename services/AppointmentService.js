var appointment = require('../models/Appointment');
const mongoose = require('mongoose');

const Apointment = mongoose.model('Appointment', appointment);

class AppointmentService{
    async Create(name, email, description, cpf, date, time){
        var newAppo = new Apointment({
            name, email, description, cpf, date, time, finished: false
        });
        try{
            await newAppo.save();
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
        
    }
}

module.exports = new AppointmentService();