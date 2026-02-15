const db = require('../config/database');
const { validationResult } = require('express-validator');
const { createNotifications } = require('../utils/notification');

//format time
const formatTime = (time) => time.slice(0, 5); 

//BOOK APPOINTMENT
exports.bookAppointment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array(), message: errors.array()[0].msg });
    };

    const patientId = req.session.patientId;
    const { doctor_id, appointment_date, appointment_time, reason } = req.body;

    try {
         // Get day of week (Mon, Tue...)
        const dayOfWeek = new Date(appointment_date).toLocaleDateString('en-US', { weekday: 'short' });

        const [doctorAvailability] = await db.execute(`SELECT * FROM doctors WHERE doctor_id = ? AND available_day = ? AND ? BETWEEN start_time AND end_time`, [doctor_id, dayOfWeek, appointment_time]);

        if (doctorAvailability.length === 0) {
            return res.status(400).json({ message: 'Doctor is not available on this date and time' });
        };

        //Check double booking
        const [existingBooking] = await db.execute(`SELECT appointment_id FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status IN ('booked', 'confirmed')`, [doctor_id, appointment_date, appointment_time]);

        if (existingBooking.length > 0) {
            return res.status(400).json({ message: 'Doctor already booked. Pick another date and time!' });
        };
     
        //Book appointment
        await db.execute(`INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES (?, ?, ?, ?, ?, 'booked')`,
            [patientId, doctor_id, appointment_date, appointment_time, reason]
        );

        //INSERT NOTIFICATION
        await createNotifications(
            patientId,
            'Appointment Booked Successfully',
            `Your appointment with Dr. ${doctorAvailability[0].first_name} ${doctorAvailability[0].last_name} has been booked for ${appointment_date} at ${formatTime(appointment_time)}`,
            'success'
        );
       
        return res.status(200).json({ message: 'Appointment booked successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Booking failed!', error: error.message })

        //INSERT NOTIFICATION
        await createNotifications(
            patientId,
            'Appointment Booking failed',
            'An error occured while booking your appointment. Please try again later!',
            'error'
        )
    };
};

//ALL APPOINTMENT
exports.allAppointment = async (req, res) => {
    const patientId = req.session.patientId;
    if (!patientId) return res.status(400).json({ message: 'Unauthorized, please log in!' });

    try {
        const [appointments] = await db.execute(`
            SELECT 
                a.appointment_id,
                a.appointment_date,
                a.appointment_time,
                CASE WHEN a.status = 'booked' OR a.status = 'rescheduled' THEN 'upcoming' ELSE a.status END AS status,
                a.reason,
                d.first_name,
                d.last_name,
                d.specialization,
                d.profile_picture AS doctorspicture
            FROM
                appointments a
            JOIN
                doctors d
            ON
                a.doctor_id = d.doctor_id
            WHERE
                a.patient_id = ?
            ORDER BY
                a.appointment_date
            ASC
            `, [patientId]);

        return res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching appointment', error: error.message })
    }
};

//RESCHEDULE APPOINTMENT
exports.rescheduleAppointment = async (req, res) => {
    const patientId = req.session.patientId;
    const { appointmentId } = req.params;
    const { appointment_date, appointment_time } = req.body;

    try {
        //fetch appointment
        const [appointment] = await db.execute(`SELECT doctor_id, status, appointment_date, appointment_time FROM appointments WHERE appointment_id = ? AND patient_id = ?`, [appointmentId, patientId]);
        if (appointment[0].length === 0) {
             return res.status(400).json({ message: 'Appointment not found!' });
        };

        //fetch doctor information
        const [doctor] = await db.execute('SELECT first_name, last_name FROM doctors WHERE doctor_id = ?', [appointment[0].doctor_id]);

        //Reject for same time and date
        if (appointment[0].appointment_date === appointment_date && formatTime(appointment[0].appointment_time) === formatTime(appointment_time)) {
            return res.status(400).json({ message: 'Please choose a different date or time' });
        };

        //check if the appointment is completed or cancelled
        if (appointment[0].status === 'completed' || appointment[0].status === 'cancelled') {
            return res.status(400).json({ message: 'Appointment cannot be cancelled' });
        };

        //prevent double booking
        const [doubleBooking] = await db.execute(`SELECT appointment_id FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status IN ('booked', 'rescheduled') AND appointment_id != ?`, [appointment[0].doctor_id, appointment_date, appointment_time, appointmentId]);

        if (doubleBooking.length > 0) return res.status(400).json({ message: 'Doctor already booked at this time' });
        

        //update information
        await db.execute(`UPDATE appointments SET appointment_date = ?, appointment_time = ?, status = 'rescheduled' WHERE appointment_id = ? `, [appointment_date, appointment_time, appointmentId]);

        //INSERT NOTIFICATION
        await createNotifications(
            patientId,
            'Appointment Rescheduled Successfully',
            `Your appointment with Dr. ${doctor[0].first_name} ${doctor[0].last_name} has been rescheduled to ${appointment_date} at ${formatTime(appointment_time)}`,
            'success'
        );

        return res.status(200).json({ message: 'Appointment rescheduled successfully' })

    } catch (error) {
        console.error(error);

        //INSERT NOTIFICATION
        await createNotifications(
            patientId,
            'Apppointment Rescheduling failed',
            'An error occured while rescheduling your appointment. Please try again later!',
            'error'
        )

        return res.status(500).json({ message: 'Error rescheduling appointment!', error: error.message });        
    }
};

//CANCEL APPOINTMENT
exports.cancelAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const patientId = req.session.patientId;

    try {
        const [appointment] = await db.execute(`SELECT appointment_id, doctor_id, appointment_date, appointment_time, status FROM appointments WHERE appointment_id = ? AND patient_id = ?`, [appointmentId, patientId]);
        if (appointment[0] === 0) {
            return res.status(400).json({message: 'Appointment not found!'})
        };

        //check if appointment is completed or canceled
        if (appointment[0].status === 'completed' || appointment[0].status === 'cancelled') {
            return res.status(400).json({ message: 'Appointment cannot be cancelled' });
        }

        //check if appointment time and date is passed
        const checkdateTime = new Date(`${appointment[0].appointment_date} ${appointment[0].appointment_time}`);
        if (checkdateTime < new Date()) {
            return res.status(400).json({message: 'Past appointments cannot be cancelled!'})
        };

        //CANCEL THE APPOINTMENT
        await db.execute(`UPDATE appointments SET status = 'cancelled' WHERE appointment_id = ? AND patient_id = ?`, [appointmentId, patientId]);

        
         //fetch doctor information
        const [doctor] = await db.execute('SELECT first_name, last_name FROM doctors WHERE doctor_id = ?', [appointment[0].doctor_id]);

        //INSERT NOTIFICATION
        await createNotifications(
            patientId,
            'Appointment Cancelled Successfully',
            `Your appointment scheduled with Dr. ${doctor[0].first_name} ${doctor[0].last_name} on ${appointment[0].appointment_date} at ${formatTime(appointment[0].appointment_time)} has been cancelled successfully`,
            'success'
        );

        return res.status(200).json({message: 'Appointments cancelled successfully'})
    } catch (error) {
        console.error(error);

        //INSERT NOTIFICATION
        await createNotifications(
            patientId,
            'Appointment cancelling failed',
            'An error occured while cancelling your appointment, Please try again later!',
            'error'
        );

        return res.status(500).json({message: 'Error canceling appointment!', error: error.message})
    }

};