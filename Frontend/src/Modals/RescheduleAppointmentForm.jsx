import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthPatientContext } from '../Context/createContext';
import api from '../Services/api';
import { LuCalendar, LuClock, LuX } from 'react-icons/lu';


const RescheduleAppointmentForm = ({appointment, closeRescheduleForm}) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { isSubmitting, setIsSubmitting, fetchAllAppointments, fetchPatientData, showError, showSuccess } = useContext(AuthPatientContext)
    const minDate = new Date().toISOString().split('T')[0];

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            const response = await api.put(`/appointment/rescheduleAppointment/${appointment.appointment_id}`, data);
            setTimeout(() => {
                showSuccess(response.data.message) 
                reset();
                setIsSubmitting(false);
                fetchPatientData();
                fetchAllAppointments();
                setTimeout(() => {
                    closeRescheduleForm(false);
                   
                }, 2000)
            }, 2000)
        } catch (error) {
            showError(error.response?.data?.message)
            setIsSubmitting(false)
        }
    };

  return (
    <div className='fixed top-0 left-0 w-full h-full z-20 md:h-screen flex justify-center items-center bg-text-primary/70 p-4 md:px-6 '>
        <div className='bg-white p-6 md:p-8 rounded-2xl space-y-6 max-w-md w-full'>
            <div className='flex items-center justify-between'>
                <h2 className='text-body md:text-lg font-heading font-semibold'>Reschedule Appointment</h2>
                <LuX onClick={() => closeRescheduleForm(false)} className='text-h2 p-1 rounded-lg bg-text-secondary/20 hover:bg-accent hover:text-white' />
            </div>
        
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                {/* Doctors detail */}
                <div className='px-4 py-2 mb-6 rounded-xl bg-accent/5 space-y-1'>
                    <h3 className='font-heading text-small md:text-body'> Dr. {appointment.first_name} {appointment.last_name} </h3>
                    <p className=' text-text-secondary text-small md:text-body'>{ appointment.specialization }</p>
                </div>
                
                {/* NEW APPOINTMENT DATE */}
                <div className='space-y-2'>
                    <label className='flex items-center gap-2 text-small md:text-body text-text-secondary'>
                        <LuCalendar />
                        New Appointment Date
                    </label>
                    <input 
                        type="date"
                        {...register('appointment_date', {required: 'Appointment date is required', min: minDate})}
                        className={` w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${errors.appointment_date ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
                    />
                    {errors.appointment_date && <p className='text-error text-caption'> {errors.appointment_date.message} </p>}
                </div>
                
                {/* NEW APPOINTMENT time */}
                <div className='space-y-2'>
                    <label className='flex items-center gap-2 text-small md:text-body text-text-secondary'>
                        <LuClock />
                        New Appointment Time
                    </label>
                    <input 
                        type="time"
                        {...register('appointment_time', {required: 'Appointment time is required',})}
                        className={` w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${errors.appointment_time ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
                    />
                    {errors.appointment_time && <p className='text-error text-caption'> {errors.appointment_time.message} </p>}
                </div>
                
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className='border-none w-full p-2 rounded-xl bg-primary text-white text-small md:text-body font-semibold cursor-pointer disabled:cursor-not-allowed disabled:bg-primary/70 hover:bg-primary-hover hover:shadow-soft transition-all duration-500 ease-linear '
                >
                    {isSubmitting ? 'Submitting...' : 'Reschedule Appointment'}
                </button>
            </form>
        </div>
    </div>
  )
}

export default RescheduleAppointmentForm