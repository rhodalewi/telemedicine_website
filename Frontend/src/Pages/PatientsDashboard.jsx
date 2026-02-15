import Header from '../Components/patient/Header';
import SideBar from '../Components/patient/SideBar';
import { AuthPatientContext } from '../Context/createContext';
import { useEffect, useContext } from 'react';
import { Outlet } from 'react-router-dom';


const PatientsDashboard = () => {
  const { fetchPatientData, fetchDoctorsData, fetchAllAppointments, collapse, setUserLocation, setLocationError } = useContext(AuthPatientContext)

  useEffect(() => {
    fetchPatientData();
    fetchDoctorsData();
    fetchAllAppointments();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => { setLocationError('Unable to fetch your location'); }
    )
  }, []);
  
  return (
    <div className='flex relative'>
      <SideBar />
      
      <main className={`w-full min-h-screen transition-all duration-700 ease-in-out ${collapse ? 'md:ml-64' : 'md:ml-20'}`}>
        <Header />
        <>
          <Outlet />
        </>
      </main>
    </div>
  )
}

export default PatientsDashboard;