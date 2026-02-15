import { useState, useContext } from 'react';
import { AuthPatientContext } from '../../Context/createContext';
import RescheduleAppointment from './RescheduleAppointmentButton';
import CancelAppointment from './CancelAppointmentButton';

import { LuCalendar, LuClock, LuUser } from 'react-icons/lu';



const MyAppointment = () => {
    const filters = ['all', 'upcoming', 'completed', 'cancelled']
    const [activeFilter, setActiveFilter] = useState('all');
    const { dashboardOverview, collapse } = useContext(AuthPatientContext);

    const filteredAppointment = dashboardOverview.allAppointments.filter(appointment => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'upcoming') return appointment.status === 'upcoming' || appointment.status === 'rescheduled';
        if (activeFilter === 'completed') return appointment.status === 'completed';
        if (activeFilter === 'cancelled') return appointment.status === 'cancelled';
    });

  return (
    <div className='p-6 lg:p-10 space-y-6'>
        <div className='space-y-1'>
              <h1 className='text-body md:text-h3 font-semibold font-heading'>My Appointment</h1>
              <p className='text-text-secondary text-caption md:text-small'> Manage your scheduled consultations</p>
        </div>
        
          {/* Filter option */}
        <div className='border-b border-gray-200 flex items-center justify-between md:block md:space-x-8'>
              {filters.map(filter => (
                  <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`text-small md:text-body capitalize px-2 py-3 border-0 font-medium cursor-pointer transition-colors duration-500 ease-in-out ${activeFilter === filter ? 'text-accent-hover border-b-2 border-accent-hover' : 'text-text-secondary'}`}
                >
                    {filter}
                </button>
            ))}
        </div>
        
        {/* appointment card */}
        <div className='space-y-6'>
            {filteredAppointment.length === 0 ? (
                <div className='flex flex-col items-center justify-center gap-4 px-2 py-10 text-text-secondary bg-white rounded-xl shadow-sm border border-gray-200'>
                    <LuCalendar className='text-4xl lg:text-6xl'/>
                    <p className=" text-center text-small md:text-body">
                        {activeFilter === 'cancelled' && 'No cancelled appointment yet!'}
                        {activeFilter === 'completed' && 'No completed appointment yet!'}
                        {activeFilter === 'upcoming' && 'No upcoming appointment yet!'}
                        {activeFilter === 'all' && 'No appointment yet!'}
                    </p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {filteredAppointment.map(appointments => (
                        <div key={appointments.appointment_id} className={`p-4 md:p-6 bg-white shadow-sm rounded-xl border border-gray-200 flex flex-col justify-between whitespace-nowrap transition-all duration-500 ease-in-out ${collapse ? 'lg:flex-row' : 'md:flex-row'}`}>
                            <div className='flex items-start gap-2 md:gap-4'>
                                {/* doctors profile picture */}
                                <div className='h-10 w-10 rounded-full'>
                                    {appointments.doctorspicture && appointments.doctorspicture.length > 0 ? (
                                        <img src={`/uploads/${appointments.doctorspicture}`} alt={appointments.first_name} className='w-full h-auto object-cover rounded-full' />
                                    ) : (
                                        <span className='bg-accent/10 w-full h-full rounded-full flex items-center justify-center'>
                                            <LuUser className='text-accent text-body md:text-h3' />
                                        </span>
                                    )}
                                </div>

                                {/* appointment details */}
                                <div>
                                    <div className='flex justify-between gap-4'>
                                        <p className='font-heading text-small md:text-body'>Dr. {appointments.first_name} {appointments.last_name}</p>
                                        <p className={`capitalize text-caption md:text-small text-white px-2.5 md:px-4 py-1 rounded-full ${appointments.status === 'upcoming' || appointments.status === 'rescheduled' ? 'bg-success/90' : 'bg-text-secondary/80'}`}> {appointments.status} </p>
                                    </div>
                                    <p className='text-small text-text-secondary'> {appointments.specialization} </p>

                                    <div className='text-text-secondary flex items-center gap-8 my-3'>
                                        <div className='flex items-center gap-2'>
                                            <LuCalendar />
                                            <p className='text-small'>{new Date(appointments.appointment_date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}</p>
                                        </div>

                                        <div className='flex items-center gap-2'>
                                            <LuClock />
                                            <p className='text-small'>{appointments.appointment_time}</p>
                                        </div>
                                    </div>

                                    <p className='text-text-secondary text-small md:text-body'>Reason: {appointments.reason} </p>
                                </div>
                            </div>
    
                            {(appointments.status === 'upcoming' || appointments.status === 'rescheduled') && (
                                <div className={`flex lg:flex-col justify-center gap-3 mt-6 lg:mt-4 transition-all duration-500 ease-in-out ${collapse ? 'lg:flex-col' : 'md:flex-col'}`}>
                                    <RescheduleAppointment appointment={appointments} />
                                    <CancelAppointment appointment={appointments} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  )
}

export default MyAppointment;