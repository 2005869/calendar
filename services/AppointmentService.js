const nodemailer = require('nodemailer');
const {transport, credentials} = require('./secrets');
const appointment = require('../models/Appointment');
const mongoose = require('mongoose');
const AppointmentFactory = require('../factories/AppointmentFactory');
const Appointment = mongoose.model('Appointment', appointment);


class AppointmentService{
    async Create(name, email, description, cpf, date, time){
        var Appo = new Appointment({
            name, email, description, cpf, date, time, finished: false, notified: false
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

    async Notified(id){
        try{
            await Appointment.findByIdAndUpdate(id, {notified: true});
            return true;
        }catch(err){
            console.log(err);
            return false;
        };
    }

    async Search(query){
        var appos = await Appointment.find().or([{email: query}, {cpf: query}]);
        return appos;
    }

    async SendNotification(){
            var appos = await this.GetAll(false);
            appos.forEach(async element => {
                var dateAppo = element.start.getTime();

                //24h * 60m * 60s * 1000ms; send an email 24hs before appointment
                var hour = 24 * 60 * 60 * 1000; 
                
                
                var gap = dateAppo - Date.now();
                
                const appoById = await this.GetById(element.id);
                
                if (gap >= 0 && gap <= hour && appoById.notified == false){           
                    transport.sendMail({
                        from: credentials.host,
                        to: appoById.email,
                        subject: "Remember about your appointment in" + element.start,
                        text: 'Hello you have an appointment in ' + element.start
                    }).then(async (message) => {
                        await this.Notified(appoById.id);
                        console.log(message);
                    }).catch(err => {
                        console.log(err);
                    });
                }
            });
    }
}

module.exports = new AppointmentService();