import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/doctor/Sidebar";
import { AuthContext } from "../Context/createContext";
import Header from "../Components/Header";

const DoctorDashboard = () => {
  const { fetchDoctorDashboard, collapse } = useContext(AuthContext);

  useEffect(() => {
    fetchDoctorDashboard();
  }, []);

  return (
    <div className='flex relative'>
      <Sidebar />
        
      <main className={`w-full min-h-screen transition-all duration-700 ease-in-out ${collapse ? 'md:ml-64' : 'md:ml-20'}`}>
        <Header />
        <>
          <Outlet />
        </>
      </main>
    </div>
  )
};

export default DoctorDashboard;