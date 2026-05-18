import { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../Context/createContext';

//ICONS
import { GiMedicalPack } from 'react-icons/gi';
import { LuLayoutDashboard, LuCalendar, LuClock, LuUsers, LuCircleUser, LuUser, LuSettings, LuLogOut } from 'react-icons/lu';


const doctorMenu = [
        { id: 'overview', label: 'Overview', icon: <LuLayoutDashboard />, link: "/doctor/dashboard", end: true},
        { id: 'appointments', label: 'Appointments', icon: <LuCalendar />, link: '/doctor/dashboard/appointments'},
        { id: 'myPatients', label: 'My Patients', icon: <LuUsers />, link: '/doctor/dashboard/patients' },
        { id: 'schedule', label: 'Schedule', icon: <LuClock />, link: '/doctor/dashboard/schedule' },
        { id: 'profile', label: 'Profile', icon: <LuCircleUser />, link: '/doctor/dashboard/profile' },
        { id: 'settings', label: 'Settings', icon: <LuSettings />, link: '/doctor/dashboard/settings' },
];

const Sidebar = () => {
    const {doctorDashboardOverview, collapse, setCollapse, logout, DoctorImageUrl } = useContext(AuthContext);

    const handleNavLinkClick = () => {
        if (window.innerWidth < 768) {
            setCollapse(false);
        }
    };

    useEffect(() => {
        handleNavLinkClick();
    }, []);

  return (
    <>
        <div className={`fixed inset-0 bg-text-primary/70 transition-all duration-500 ease-in-out ${collapse ? 'block md:hidden' : 'hidden'}`}/>
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
                    {doctorMenu.map(menu => (
                        <NavLink
                            key={menu.id}
                            to={menu.link}
                            end={menu.end}
                            onClick={handleNavLinkClick}
                            className={({isActive}) => `flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-500 ease-in-out ${isActive ? 'bg-primary text-white' : 'bg-transparent hover:bg-gray-100 hover:text-text-primary'} ${collapse ? 'md:w-full' : 'md:w-fit '}`}
                        >
                            <span className='text-h3'> {menu.icon} </span>
                            <p className={`font-heading text-small text-nowrap transition-all ease-in-out duration-500 ${collapse ? 'md:opacity-100' : 'md:opacity-0 md:absolute -left-40'}`}> {menu.label} </p>
                        </NavLink>
                    ))}
                    
                </nav>
            </div>
            
            {/* SIDEBAR FOOTER */}
            <div className='border-t border-gray-200 px-4 py-8 space-y-8'>
                <div className={`flex items-center gap-3 ${collapse ? 'md:flex-row' : 'md:flex-col'}`}>
                    {/* doctors profile picture */}
                    <div className='h-12 w-12 rounded-full flex items-center justify-center bg-accent/10 overflow-hidden'>
                        {doctorDashboardOverview.doctorData?.profile_picture && doctorDashboardOverview.doctorData?.profile_picture.length > 0 ? (
                            <img 
                                src={DoctorImageUrl(doctorDashboardOverview.doctorData?.profile_picture)}
                                /* src={`${DoctorImageUrl}${doctorDashboardOverview.doctorData.profile_picture}`} */
                                alt={`${doctorDashboardOverview.doctorData?.first_name + ' ' + doctorDashboardOverview.doctorData?.last_name}`} 
                                className='w-full h-auto object-cover rounded-full border border-gray-400 bg-gray-200' />
                        ) : (
                            <LuUser className='text-accent text-h3' />
                        )}
                    </div>
                    <div className={`transition-opacity ease-in-out duration-500 ${collapse ? 'md:opacity-100 ' : 'md:opacity-0 md:absolute -left-full'}`}>
                        <p className='font-medium font-heading text-small'> {doctorDashboardOverview.doctorData?.first_name} {doctorDashboardOverview.doctorData?.last_name} </p>   
                        <p className='text-caption truncate'> {doctorDashboardOverview.doctorData?.email} </p>
                    </div>
                </div>
                
                  {/* logout */}
                <button 
                    onClick={() => logout()}
                    className='flex items-center justify-center rounded-xl px-3 py-2 w-full bg-transparent border border-gray-200 hover:bg-gray-200 hover:shadow-soft transition-all duration-500 ease-linear focus:bg-primary focus:text-white focus:border-none cursor-pointer'
                >
                    <div className={`flex items-center gap-3 ${collapse ? 'flex-row' : 'flex-col'}`}>
                        <LuLogOut />
                        <p className={`text-small font-heading ${collapse ? 'block' : 'hidden'}`}>Logout</p>
                    </div>
                </button>
            </div>
        </aside>
    </>

  )
}

export default Sidebar;