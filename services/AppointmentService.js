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

    async GetById(id){
        try{
            var event = await Appointment.findOne({_id: id});
            return event;
        }catch(err){
            console.log(err);
        }
        
    }

    async Finish(id){
        try{
            await Appointment.findByIdAndUpdate(id, {finished: true});
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
        
    }

    async Search(query){
        var appos = await Appointment.find().or([{email: query}, {cpf: query}]);
        return appos;
    }
}

module.exports = new AppointmentService();