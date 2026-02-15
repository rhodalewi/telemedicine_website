import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthPatientContext } from '../../Context/createContext';
import { LuCalendar, LuFileText, LuUsers, LuClock, LuChevronRight, LuUser } from 'react-icons/lu';
import LocationMap from '../LocationMap';



const quickAction = [
    { id: 1, text: 'Book New Appointment', link:'/user/book-appointment', style: 'bg-accent text-white'},
    { id: 2, text: 'Find Doctors Near You', link: '/user/find-doctor'},
    { id: 3, text: 'View Medical records'}
]

const Overview = () => {
    const { dashboardOverview, userLocation, locationError, collapse } = useContext(AuthPatientContext);
    const formatDate = (date) => {
        if (!date) return 'First Visit';

        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    };

    const stats = [
        { id: 1, label: 'Upcoming Appointments', value: dashboardOverview.upcomingAppointment, icon: <LuCalendar />, style: 'bg-blue-500' },
        { id: 2, label: 'Total Appointments', value: dashboardOverview.totalAppointment, icon: <LuFileText />, style: 'bg-green-500' },
        { id: 3, label: 'Doctors Consulted', value: dashboardOverview.doctorsConsulted, icon: <LuUsers />, style: 'bg-purple-500' },
        { id: 4, label: 'Last Visit', value: formatDate(dashboardOverview.lastVisit), icon: <LuClock />, style: 'bg-orange-500' },
    ];

  return (
    <div className='p-6 lg:p-10 space-y-6'>
        {/* Welcome note */}
        <div className='space-y-1'>
              <h2 className='font-semibold text-body md:text-h3 font-heading'>Welcome, <span className='capitalize'>{dashboardOverview.patientData?.first_name}</span>!</h2>
              <p className='text-text-secondary text-caption md:text-small'>Your Health, Your Schedule. Manage everything with ease.</p>
        </div>
        
          {/* Cards */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6'>
            {stats.map(stat => (
                <div key={stat.id} className='bg-white/80 p-6 md:pb-10 rounded-xl shadow-sm border border-gray-200'>
                    <span className={`${stat.style} w-10 h-10 flex items-center justify-center rounded-full text-white text-h3 mb-4`}> {stat.icon} </span>
                    <p className='mb-2 font-medium text-small font-heading text-text-secondary'> {stat.label} </p>
                    <p className='font-semibold lg:text-lg'> {stat.value} </p>
                </div>
            ))}
        </div>
        
          {/* Appointment History */}
        <div className='bg-white/80 p-6 rounded-xl shadow-sm border border-gray-300'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-6 md:pb-8 border-b border-gray-200 '>
                <h1 className='font-semibold font-heading'>Appointments History</h1>
                <NavLink 
                    to={'/user/appointments'}
                    className='text-small md:text-body flex items-center gap-2 px-2 py-0.5 rounded-lg bg-accent/10 border border-gray-300 hover:shadow-soft'
                >
                    View all 
                    <LuChevronRight /> 
                </NavLink>
            </div>
            
             {/*  Appointment card */}
            <div className='mt-6 lg:mt-10 space-y-6'>
                {dashboardOverview.appointmentHistory.length === 0 ? (
                    <p className="text-sm text-center text-error dark:text-dark-error"> No appointment history yet!</p>
                  ) : (
                    <>
                        {dashboardOverview.appointmentHistory.map(item => (
                            <div key={item.appointment_id} className='p-4 md:p-6 border border-gray-200 shadow-sm rounded-lg flex items-start md:items-center justify-between gap-3 hover:bg-text-secondary/10 bg-accent/5 '>
                                <div className={`flex flex-col items-start gap-4 transition-all duration-500 ease-in-out ${collapse ? 'lg:flex-row' : 'md:flex-row'}`}>
                                    {/* doctor profile picture */}
                                    <div className='h-10 w-10 md:h-12 md:w-12 rounded-full'>
                                        {item.doctorspicture && item.doctorspicture.length > 0 ? (
                                            <img src={`/uploads/${item.doctorspicture}`} alt={item.first_name} className='w-full h-auto object-cover rounded-full' />
                                        ) : (
                                            <span className='bg-accent/20 w-full h-full rounded-full flex items-center justify-center'>
                                                <LuUser className='text-accent text-body md:text-h3' />
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* doctor and appointment details */}
                                    <div>
                                        <p className='font-heading text-small lg:text-body'> Dr. {item.doctor_firstname} {item.doctor_lastname} </p>
                                        <p className='text-text-secondary text-small'>{item.doctor_specialization}</p>
                                        
                                        <div className={'text-text-secondary flex flex-col md:flex-row items-start md:items-center gap-3 mt-3 md:mt-4'}>
                                            <div className='flex items-center gap-1.5'>
                                                <LuCalendar />
                                                <p className='text-small font-normal md:font-medium'>{new Date(item.appointment_date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}</p>
                                            </div>
                                            <div className='flex items-center gap-1.5'>
                                                <LuClock />
                                                <p className='text-small font-normal md:font-medium'> { item.appointment_time}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <p className={`px-4 py-1.5 rounded-xl text-caption md:text-small font-medium capitalize ${item.status === 'completed' ? 'bg-success/30 text-success' : 'bg-error/15 text-error'}`}> {item.status} </p>  
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
        
          {/* Map and Quick Actions */}
       <div className='space-y-2'>
             <h1 className='font-semibold font-heading text-body md:text-lg'>Your Current Location</h1>
            <div className='grid lg:grid-cols-2 items-center gap-6'>
                <div className='h-full'>
                {/* User location */}
                    <div className='h-full border border-gray-200 overflow-hidden shadow-sm bg-white text-center rounded-xl'>
                        {userLocation ? (
                            <div className='h-64 lg:h-full'>
                                <LocationMap   />
                                <p className="text-sm text-gray-600">
                                    Latitude: {userLocation.latitude}, Longitude: {userLocation.longitude}
                                </p>
                            </div>
                        ) : (
                            <p className='h-full flex items-center justify-center text-error dark:text-dark-error'>
                                    { locationError }
                            </p>
                        )}    
                    </div>
                </div>
                
                {/* Quick Actions */}
                <div className='p-6 rounded-xl shadow-sm border border-gray-300 bg-white/80'>
                    <h1 className='font-semibold font-heading mb-4 pb-6 border-b border-gray-200 md:text-center text-body lg:text-h3'>Quick Actions</h1>
                    
                    <div className='flex flex-col items-center gap-3'>
                        {quickAction.map(action => (
                            <NavLink 
                                to={action.link}
                                key={action.id}
                                className={`text-small border border-gray-300 w-3xs text-center py-2 rounded-xl font-medium text-text-secondary hover:bg-accent-hover/10 hover:text-text-primary cursor-pointer transition-all duration-700 ease-in-out ${action.style}`}
                            >
                                {action.text}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
       </div>
    </div>
  )
}

export default Overview;