class AppointmentFactory{
    Build(simpleAppointment){

        var day = simpleAppointment.date.getDate() + 1;
        var month = simpleAppointment.date.getMonth();
        var year = simpleAppointment.date.getFullYear();

        var hour = Number.parseInt(simpleAppointment.time.split(':')[0]);
        var minutes = Number.parseInt(simpleAppointment.time.split(':')[1]);

        var startDate = new Date(year, month, day, hour, minutes, 0, 0);
        
        // Convert time to Brazil --> startDate.setHours(startDate.getHours - 3);

        var appo = {
            id: simpleAppointment._id,
            title: simpleAppointment.name + ' ' + simpleAppointment.cpf,
            start: startDate,
            end: startDate
        }

        return appo;
    }
}

module.exports = new AppointmentFactory();