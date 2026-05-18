import { useContext, useEffect } from "react";
import { AuthContext } from "../../Context/createContext";
import { LuCalendar, LuFileText, LuUsers, LuClock, LuUser, LuSettings } from 'react-icons/lu';
import api from "../../Services/api";
import { NavLink } from "react-router-dom";

const quickAction = [
  { id: 1, text: 'View Patients', description: 'Access your patients record', link: '/doctor/dashboard/patients', icon: <LuUsers/>,  style: 'bg-accent-hover hover:bg-accent' },
  { id: 2, text: 'Manage Schedule', description: 'Set your availabilty', link: '/doctor/dashboard/schedule', icon: <LuCalendar />, style: 'bg-success hover:bg-green-500' },
  { id: 3, text: 'Settings', description: 'Update your preference', link: '/doctor/dashboard/settings', icon: <LuSettings />, style: 'bg-purple-600 hover:bg-purple-500' }
];

const DoctorOverview = () => {
  const { doctorDashboardOverview, setDoctorDashboardOverview, formatDate, showError, PatientImageUrl, formatTime } = useContext(AuthContext);

  //make the createdAT be in hours long like 2 hours ago or 3 hours ago
  const calculateTimeAgo = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffinSeconds = Math.floor((now - createdDate) / 1000);

    if (diffinSeconds < 60) return `${diffinSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffinSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const stats = [
    { id: 1, label: "Today's Appointments", value: doctorDashboardOverview.todayAppointmentCount, icon: <LuCalendar />, style: 'bg-blue-500' },
    { id: 2, label: 'Total Patients', value: doctorDashboardOverview.totalPatientsCount, icon: <LuUsers />, style: 'bg-green-500' },
    { id: 3, label: 'Upcoming Appointments', value: doctorDashboardOverview.upcomingAppointmentCount, icon: <LuFileText />, style: 'bg-purple-500' },
    { id: 4, label: 'Total Appointments', value: doctorDashboardOverview.totalAppointmentsCount, icon: <LuFileText />, style: 'bg-purple-500' },
    { id: 5, label: 'Last Visit', value: formatDate(doctorDashboardOverview.lastVisit), icon: <LuClock />, style: 'bg-orange-500' },
  ];

  //show date for today's schedule
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  //FUNCTION TO GET TODAY'S APPONTMENTS
  const todayAppointments = async () => {
    try {
      const response = await api.get('/doctor/doctorTodaySchedule');
      const appointmentsData = Array.isArray(response.data) ? response.data : [];
      setDoctorDashboardOverview(prev => ({
        ...prev,
        todayAppointments: appointmentsData.length > 3 ? appointmentsData.slice(0, 3) : appointmentsData
      }));
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to fetch today appointments, Please try again!')
    }
  };

  //CALL FUNCTION TO GET TODAY'S APOINTMENTS
  useEffect(() => {
    todayAppointments();
  }, []);
  
  return (
    <div className='p-6 lg:p-10 space-y-6'>
      {/* welcome note */}
      <div>
        <h2 className='font-semibold text-body md:text-h3 font-heading'>Welcome, Dr. <span className='capitalize'>{doctorDashboardOverview.doctorData?.first_name}</span>!</h2>
        <p className='text-text-secondary text-caption md:text-small'> Here you can manage your appointments and view patient information </p>
      </div>

      {/* cards */}
      <div className='grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6'>
        {stats.map(stat => (
          <div key={stat.id} className='bg-white/80 p-6 md:pb-10 rounded-xl shadow-sm border border-gray-200'>
            <span className={`${stat.style} w-10 h-10 flex items-center justify-center rounded-full text-white text-h3 mb-4`}> {stat.icon} </span>
            <p className='mb-3 font-medium text-small font-heading text-text-secondary'> {stat.label} </p>
            <p className='font-semibold lg:text-lg'> {stat.value} </p>
          </div>
        ))}
      </div>

      {/* todays schedule & recent activities */}
      <div className="grid lg:grid-cols-2 gap-6 items-center">
        {/* Today's Schedule */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 space-y-5">
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-gray-200">
            <h1 className="font-medium font-heading lg:text-lg">Today's Schedule</h1>
            <p className="text-accent text-small"> {today} </p>
          </div>

          {/* today's appointment card */}
          <div className="space-y-6">
            {doctorDashboardOverview.todayAppointments.length === 0 ? (
              <p className="text-text-secondary text-center mt-4 text-small"> No appointments scheduled for today! </p>
            ) : (
                <div>
                  {doctorDashboardOverview.todayAppointments.map(appointments => (
                    <div
                      key={appointments.appointment_id}
                      className="bg-gray-50 p-4 rounded-xl border border-gray-200  flex items-center justify-between gap-4"
                    >
                      <div className=" flex items-center justify-between gap-2">
                          {/* patient picture */}
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full">
                          {appointments.patientpicture && appointments.patientpicture.length > 0 ? (
                            <img
                              src={PatientImageUrl(appointments.patientpicture)}
                              /* src={`${PatientImageUrl}${appointments.patientpicture}`} */
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
                  ))}
                </div>
            ) }
          </div>

          <NavLink
            to='/doctor/appointments'
            className="border border-accent-hovert text-accent hover:bg-accent/20 px-4 py-1.5 rounded-xl text-caption md:text-small font-medium flex items-center justify-center transition-colors duration-500 ease-in-out"
          >
            View All Appointments
          </NavLink>
        </div>

        {/* Recent Activities */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-medium text-lg font-heading mb-6 pb-4 border-b border-gray-200">Recent Activity</h2>
          
          <div>
            {doctorDashboardOverview.recentNotifications.map(recent => (
              <div key={recent.notification_id} className=" border-b border-gray-200 last:border-0 py-4">
                <p>{recent.message} Completed appointment with Robert Taylor</p>
                <p className="text-small text-text-secondary">{ calculateTimeAgo(recent.createdAT)} 2 hours ago</p>
              </div>
            ))}

            <p>Completed appointment with Robert Taylor</p>
            <p>2 hours ago</p>
          </div>
        </div>
      </div>

      {/* quick links */}
      <div className="space-y-6">
        <h2 className="text-center font-heading font-medium lg:text-h3 py-4 border-b border-gray-300">Quick links</h2>
        
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-15 ">
          {quickAction.map(actions => (
            <NavLink
              key={actions.id}
              to={actions.link}
              className={`${actions.style} text-white px-6 py-4 rounded-xl shadow-sm cursor-pointer transition-colors duration-500 ease-in-out`}
            >
              <span className="text-h1">{actions.icon}</span>
              <h3 className="font-medium font-heading mt-4 mb-1.5"> {actions.text} </h3>
              <p className="text-small"> {actions.description} </p>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
};

export default DoctorOverview;