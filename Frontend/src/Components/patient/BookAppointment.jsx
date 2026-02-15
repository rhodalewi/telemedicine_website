import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { AuthPatientContext } from '../../Context/createContext';
import { LuCalendar, LuClock, LuFileText, LuUser } from 'react-icons/lu';
import api from '../../Services/api';

const BookAppointment = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const {allDoctors, fetchPatientData, showSuccess, showError, isSubmitting, setIsSubmitting} = useContext(AuthPatientContext)
  const minDate = new Date().toISOString().split('T')[0];
  const doctorId = new URLSearchParams(location.search).get('doctorId');
 
//submit appointment
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await api.post('/appointment/bookAppointment', data)

      setTimeout(() => {
        setIsSubmitting(false);
        fetchPatientData();
        reset();

        setTimeout(() => {
          showSuccess(response.data.message || 'Appointment booked successfully');
          setIsSubmitting(false);
        }, 2000)
      }, 1000)
    } catch (error) {
      console.log(error);

      setTimeout(() => {
        showError(error.response?.data?.message || 'Booking failed');
        setIsSubmitting(false);
      })
    }
  };

  return (
    <div className='p-6 lg:p-10 space-y-8'>
      <div className='space-y-1'>
        <h2 className='font-semibold text-body md:text-h3 font-heading'>Book an Appointment</h2>
        <p className='text-text-secondary text-caption md:text-small'>Fill out the appointment form below to schedule a consultation with one of our healthcare professionals.</p>
      </div>

      <div className='flex justify-center'>
        <form onSubmit={handleSubmit(onSubmit)} className='bg-white p-10 rounded-xl shadow-sm border border-gray-200 space-y-6 max-w-3xl w-full'>
          {/* Select Doctor */}
          <div className='space-y-2'>
            <label className='flex items-center gap-2 text-small md:text-body text-text-secondary'>
              <LuUser />
              Select Doctor
            </label>

            <select
              value={doctorId || allDoctors.fetchDoctors.doctor_id}
              /* value={doctorId.length === 0 ? allDoctors.fetchDoctors.doctor_id : doctorId} */
              {...register('doctor_id', {required: 'Kindly select a doctor'})}
              className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-0 focus:ring-1 focus:ring-accent-hover'>
              <option value="">Choose a doctor...</option>
              {allDoctors.fetchDoctors.map(doctor => (
                <option key={doctor.doctor_id} value={doctor.doctor_id} className='hover:bg-primary'>
                Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>
            
          {/* Appointment Date */}
          <div className='space-y-1'>
            <label className='flex items-center gap-2 text-small md:text-body text-text-secondary'>
              <LuCalendar />
              Appointment Date
            </label>
            <input
              type="date"
              {...register('appointment_date', {required: 'Appointment date is required', min: minDate})}
              className={` w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${errors.appointment_date ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
            />
            {errors.appointment_date && <p className='text-error text-caption'> {errors.appointment_date.message} </p>}
          </div>

          {/* Appointment Time */}
          <div className='space-y-1'>
            <label className='flex items-center gap-2 text-small md:text-body text-text-secondary'>
              < LuClock />
              Appointment Time
            </label>
            <input
              type="time"
              {...register('appointment_time', {required: 'Appointment time is required',})}
              className={` w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${errors.appointment_time ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
            />
            {errors.appointment_time && <p className='text-error text-caption'> {errors.appointment_time.message} </p>}
          </div>

          {/* Reason */}
          <div className='space-y-1'>
            <label className='flex items-center gap-2 text-small md:text-body text-text-secondary'>
              < LuFileText />
              Reason for Visit
            </label>
            <input
              type="text"
              placeholder='e.g. General checkup, follow-up visit'
              {...register('reason', {required: 'Reason Input is required',})}
              className={` w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-1 ${errors.reason ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
            />
            {errors.reason && <p className='text-error text-caption'> {errors.reason.message} </p>}
          </div>
        
          <button
            type='submit'
            disabled={isSubmitting}
            className='text-small md:text-body border-none w-full py-2.5 rounded-xl bg-primary text-white font-semibold cursor-pointer disabled:cursor-not-allowed disabled:bg-primary/70 hover:bg-primary-hover hover:shadow-soft transition-all duration-500 ease-linear'>
              {isSubmitting ? 'Submitting...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default BookAppointment;