import { useContext, useEffect } from 'react'
import { LuSearch, LuClock, LuCalendar } from 'react-icons/lu';
import { AuthContext } from '../../Context/createContext';
import api from '../../Services/api';


const Appointments = () => {
    const { search, setSearch, filters,  activeFilter, setActiveFilter, doctorDashboardOverview, setDoctorDashboardOverview, PatientImageUrl, formatTime, formatDate, showError, collapse } = useContext(AuthContext);


    //filtered appointments
    const filteredAppointments = doctorDashboardOverview.allDoctorsAppointments?.filter(appointments => {
        if (activeFilter === "all") return true;
        if (activeFilter === 'upcoming') return appointments.status === 'upcoming' || appointments.status === 'rescheduled';
        if (activeFilter === 'pending') return appointments.status === 'pending';
        if (activeFilter === 'completed') return appointments.status === 'completed';
        if (activeFilter === 'cancelled') return appointments.status === 'cancelled';
    });

     //ALL APPOINTMENTS
    const allDoctorAppointments = async () => {
        try {
            const response = await api.get('/doctor/doctorAllAppointments');
            setDoctorDashboardOverview(prev => ({ ...prev, allDoctorsAppointments: response.data }));
        } catch (error) {
            showError(error.response?.data?.message)
        }
    };
    
    useEffect(() => {
        allDoctorAppointments();
    }, []);
    

    return (
        <div className='p-6 lg:p-10 space-y-6'>
            <div className='space-y-1'>
                <h1 className='font-heading font-semibold md:text-h3'>Appointments</h1>
                <p className='text-text-secondary text-caption md:text-small'>View and manage your scheduled appointment</p>
            </div>

            {/* search patient name */}
            <div className='flex items-center gap-3 max-w-xl mx-auto h-12 rounded-2xl px-4 bg-white border border-gray-200 focus-within:ring-1 focus-within:ring-primary shadow-sm transition-all duration-500 ease-initial'>
                <span className='text-lg text-text-secondary'><LuSearch /></span>
                <input
                    type="text"
                    placeholder='Search by patient name...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='text-small w-full  outline-none'
                />
            </div>

            {/* Filter option */}
            <div className='border-b border-gray-200 grid grid-cols-3 gap-y-3 items-center justify-between flex-wrap md:block md:space-x-8'>
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


            {/* Appointment card */}
            <div className='space-y-6'>
                {filteredAppointments === "Today's Appointments" ? doctorDashboardOverview.todayAppointments.map(appointments => (
                   <div
                        key={appointments.appointment_id}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-200  flex items-center justify-between gap-4"
                    >
                        <div className=" flex items-center justify-between gap-2">
                            
                            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full">
                                {appointments.patientpicture && appointments.patientpicture.length > 0 ? (
                                <img
                                    src={PatientImageUrl(appointments.patientpicture)}
                                   /*  src={`${PatientImageUrl}${appointments.patientpicture}`} */
                                    alt={`${appointments.patient_firstname + ' ' + appointments.patient_lastname}`}
                                    className='w-full h-auto object-cover rounded-full border border-gray-400 bg-gray-200'
                                />
                                ) : (
                                <span className="bg-accent/20 w-full h-full rounded-full flex items-center justify-center">
                                    <LuUser className="text-accent text-body md:text-h3" />
                                </span>
                                )}
                            </div>

                            <div className="space-y-1">
                                <p className="font-semibold text-small capitalize"> {appointments.patient_firstname} {appointments.patient_lastname}</p>
                                <p className="flex items-center gap-2 text-small">
                                <LuClock />
                                {formatTime(appointments.appointment_time)}
                                </p>
                            </div>
                        </div>

                        <p className="capitalize px-4 py-0.5 rounded-xl text-caption md:text-small font-medium bg-success/20 text-success"> {appointments.status} </p>
                    </div>
                )) : (
                    <>
                        {filteredAppointments.length === 0 ? (
                            <div className='flex flex-col items-center justify-center gap-4 px-2 py-10 text-text-secondary bg-white rounded-xl shadow-sm border border-gray-200'>
                                <LuCalendar className='text-4xl lg:text-6xl'/>
                                <p className=" text-center text-small md:text-body">
                                    {activeFilter === 'cancelled' && 'No cancelled appointment yet!'}
                                    {activeFilter === 'completed' && 'No completed appointment yet!'}
                                    {activeFilter === 'upcoming' && 'No upcoming appointment yet!'}
                                    {activeFilter === 'all' && 'No appointment yet!'}
                                    {activeFilter === 'pending' && 'No pending appointment yet!'}
                                    {activeFilter === "today's appointment" && 'No appointment for today'}
                                </p>
                            </div>
                        ) : (
                            <div>
                                {filteredAppointments.map(appointments => (
                                    <div
                                        key={appointments.appointment_id}
                                        className={`p-4 md:p-6 bg-white shadow-sm rounded-xl border border-gray-200 flex flex-col justify-between whitespace-nowrap transition-all duration-500 ease-in-out ${collapse ? 'lg:flex-row' : 'md:flex-row'}`}
                                    >
                                        {/* doctors profile picture */}
                                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full">
                                            {appointments.patientPicture && appointments.patientPicture.length > 0 ? (
                                            <img
                                                src={PatientImageUrl(appointments.patientPicture)}
                                                alt={`${appointments.first_name + ' ' + appointments.last_name}`}
                                                className='w-full h-auto object-cover rounded-full border border-gray-400 bg-gray-200'
                                            />
                                            ) : (
                                            <span className="bg-accent/20 w-full h-full rounded-full flex items-center justify-center">
                                                <LuUser className="text-accent text-body md:text-h3" />
                                            </span>
                                            )}
                                    </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
};

export default Appointments;