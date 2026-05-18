import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/createContext';

/* ICONS */
import { GiMedicalPack } from 'react-icons/gi';
import { LuLayoutDashboard, LuCalendar, LuClock, LuUsers, LuMapPin, LuCircleUser, LuUser, LuSettings, LuLogOut } from 'react-icons/lu';
import Settings from './Settings';

const patientMenu = [
    { id: 'overview', label: 'Overview', icon: <LuLayoutDashboard />, link: "/patient/dashboard", end: true},
    { id: 'bookAppointment', label: 'Book Appointment', icon: <LuCalendar />, link: '/patient/dashboard/book-appointment'},
    { id: 'appointment', label: 'My Appointments', icon: <LuClock />, link: '/patient/dashboard/appointments'},
    { id: 'doctors', label: 'Find Doctors', icon: <LuUsers />, link: '/patient/dashboard/find-doctor' },
    { id: 'location', label: 'Hospital Locations', icon: <LuMapPin />, link: '/patient/dashboard/hospital-location' },
    { id: 'profile', label: 'Profile', icon: <LuCircleUser />, link: '/patient/dashboard/profile' },
];

const SideBar = () => {
    const { dashboardOverview, collapse, setCollapse, logout, PatientImageUrl } = useContext(AuthContext);
    const [openSettings, setOpenSettings] = useState(false);

    const handleNavLinkClick = () => {
        if (window.innerWidth < 768) {
            setCollapse(false);
        }
    };


    //close sidebar when screen size changes to medium and lower
    useEffect(() => {
        handleNavLinkClick();
    }, []);

    
  return (
    <>
        <div className={`fixed inset-0 bg-text-primary/70 transition-all duration-500 ease-in-out ${collapse ? 'block md:hidden' : 'hidden'}`} />
        <aside
            className={`border-r border-gray-200 h-screen bg-white md:bg-white/50 fixed right-0 left-0 z-10 flex flex-col justify-between transition-all duration-700 ease-in-out md:translate-none  ${collapse ? 'translate-x-0 w-82 md:w-64' : '-translate-x-full md:w-20'}`}
        >
            <div>
                {/* LOGO */}
                <header className='border-b border-gray-200 px-2.5 flex items-center justify-between'>
                    <div className="flex items-center gap-2 py-4 px-2">
                        <GiMedicalPack className="text-3xl rounded-2xl text-primary"/>
                        <p className={`text-body font-semibold font-heading transition-all duration-500 ease-in-out ${collapse ? 'opacity-100' : 'opacity-0'}`}>MediCare</p>
                    </div>
                </header>
            
                {/* NAV LINKS */}
                <nav className='space-y-2 px-2 py-6 relative'>
                    {patientMenu.map(items => (
                        <NavLink
                            to={items.link}
                            key={items.id}
                            end={items.end}
                            onClick={handleNavLinkClick}
                            className={({isActive}) => `flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-500 ease-in-out ${isActive ? 'bg-primary text-white' : 'bg-transparent hover:bg-gray-100 hover:text-text-primary'} ${collapse ? 'md:w-full' : 'md:w-fit '}`}
                        >
                            <span className='text-h3'>{items.icon}</span>
                            <p className={`font-heading text-small text-nowrap transition-all ease-in-out duration-500 ${collapse ? 'md:opacity-100' : 'md:opacity-0 md:absolute -left-40'}`}>{items.label}</p>
                        </NavLink>
                    ))}
                </nav>
            </div>
            
            {/*SIDEBAR FOOTER */}
            <div className='border-t border-gray-200 px-4 py-8 space-y-8 relative'>
                <div className={`flex items-center gap-3 ${collapse ? 'md:flex-row' : 'md:flex-col'}`}>
                    {/* patient profile picture */}
                    <div className='h-12 w-12 rounded-full flex items-center justify-center bg-accent/10 overflow-hidden'>
                        {dashboardOverview.patientData?.profile_picture ? (
                            <img 
                                src={PatientImageUrl(dashboardOverview.patientData?.profile_picture)}
                                /* src={`${PatientImageUrl}${dashboardOverview.patientData.profile_picture}`} */
                                alt={dashboardOverview.patientData?.first_name + ' ' + dashboardOverview.patientData?.last_name} 
                                className='w-full h-auto object-cover' />
                        ) : (
                            <LuUser className='text-accent text-h3' />
                        )}
                    </div>
                    <div className={`transition-opacity ease-in-out duration-500 ${collapse ? 'md:opacity-100 ' : 'md:opacity-0 md:absolute -left-full'}`}>
                        <p className='font-medium font-heading text-small'> {dashboardOverview.patientData?.first_name} {dashboardOverview.patientData?.last_name} </p>   
                        <p className='text-caption truncate'> {dashboardOverview.patientData?.email} </p>
                    </div>
                </div>
                
                <div className={`flex gap-2 ${collapse ? 'md:flex-row' : 'md:flex-col'}`}>
                    <div
                        onClick={() => setOpenSettings(!openSettings)}
                        className= 'flex items-center justify-center rounded-xl px-3 py-2 w-full border border-gray-200  transition-all duration-500 ease-linear focus:bg-primary focus:text-white bg-transparent hover:bg-gray-200 hover:shadow-soft'
                    >
                        <LuSettings />
                    </div>

                    {/* Logout  */}
                    <button 
                        onClick={() => logout()}
                        className='flex items-center justify-center rounded-xl px-3 py-2 w-full bg-transparent border border-gray-200 hover:bg-gray-200 hover:shadow-soft transition-all duration-500 ease-linear focus:bg-primary focus:text-white focus:border-none cursor-pointer'
                    >
                        <LuLogOut />
                    </button>
                </div>  
            </div>
            {openSettings && <Settings />}
        </aside>
    </>
  )
};

export default SideBar;