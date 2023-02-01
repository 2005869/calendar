var appointment = require('../models/Appointment');
const mongoose = require('mongoose');

const Appointment = mongoose.model('Appointment', appointment);

class AppointmentService{
    async Create(name, email, description, cpf, date, time){
        var Appo = new Apointment({
            name, email, description, cpf, date, time, finished: false
        });
        try{
            await Appo.save();
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    async GetAll(showFinished){
        if (showFinished){
            return await Appointment.find();
        }else{
            return await Appointment.find({finished: false});
        }
    }
}

module.exports = new AppointmentService();