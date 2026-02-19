import { useState, useEffect, useContext } from 'react'
import { LuMoon, LuSun, LuTrash2, LuUser } from 'react-icons/lu';
import { AuthPatientContext } from '../../Context/createContext';
import api from '../../Services/api';

const Settings = () => {
  const { dashboardOverview, showSuccess, showError, navigate,collapse } = useContext(AuthPatientContext);
  const [toggleTheme, setToggleTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'light' : true;
  });

  //CHANGE THEME
  useEffect(() => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', 'dark');  
  }, [toggleTheme]);

  //HANDLE DELETE FUNCTION
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account?')
    if (!confirmDelete) return;
    try {
      const response = await api.delete('/user/delete-account');

      setTimeout(() => {
        showSuccess(response.data.message);

        setTimeout(() => {
          navigate('/');
        }, 2500)
      }, 2000);
    } catch (error) {
      setTimeout(() => {
        showError(error.response?.data?.message);
      }, 2000);
    };
  };
  
  return (
    <div className={`bg-white border border-gray-300 shadow-sm px-3 py-6 fixed left-2 rounded-xl dark:bg-dark-background dark:text-white space-y-2 transition-all duration-500 ease-in-out w-60 ${collapse ? 'bottom-20' : 'bottom-28'}`}>
      <div className='px-3 flex items-center gap-3'>
        <LuUser className='text-lg' />
        <span className='text-small'>{dashboardOverview.patientData?.first_name} { dashboardOverview.patientData?.last_name }</span>
      </div>
      {/* toggle theme */}
      <button
        onClick={() => setToggleTheme(!toggleTheme)}
        className='flex items-center gap-3 text-small border-none cursor-pointer px-3 w-full py-1.5 hover:bg-primary hover:text-white dark:focus:bg-dark-primary dark:focus:text-white rounded-xl'
      >
        {toggleTheme ? (
          <>
            <LuMoon className='text-lg' />
            <span>Dark Mode</span>
          </>
        ) : (
          <>
              <LuSun className='text-lg'/>
              <span>Light Mode</span>
          </>
        )}
      </button>

      {/* Delete Account */}
      <button
        onClick={handleDelete }
        className='flex items-center gap-3 text-small cursor-pointer border-none px-3 w-full py-1.5 rounded-xl hover:bg-primary hover:text-white focus:bg-primary-hover focus:text-white dark:hover:bg-dark-primary dark:hover:text-white dark:focus:bg-dark-primary dark:focus:text-white'
      >
        <LuTrash2 className='text-lg'/>
        Delete Account
      </button>

        <div className='text-center'>
          <p className='text-caption '>Account Created at:</p>
          <span className='text-caption text-accent-hover dark:text-dark-secondary-hover'> {new Date(dashboardOverview.patientData?.createdAT).toDateString()} </span>
        </div>
    </div>
  )
}

export default Settings;