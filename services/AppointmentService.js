const appointment = require('../models/Appointment');
const mongoose = require('mongoose');
const AppointmentFactory = require('../factories/AppointmentFactory');

const Appointment = mongoose.model('Appointment', appointment);

class AppointmentService{
    async Create(name, email, description, cpf, date, time){
        var Appo = new Appointment({
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
            var appos = await Appointment.find({finished: false});
            var appointments = [];
            appos.forEach(element => {

                if (element.date != undefined){
                    appointments.push(AppointmentFactory.Build(element));
                }
                
            });

            return appointments;
        }
    }
}

module.exports = new AppointmentService();