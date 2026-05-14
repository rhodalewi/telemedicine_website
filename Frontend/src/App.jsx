import { Routes, Route } from "react-router-dom";

//PATIENT DASHBOARD
import LandingPage from "./Pages/LandingPage";
import PatientsDashboard from "./Pages/PatientsDashboard";
import PatientOverview from "./Components/patient/PatientOverview";
import BookAppointment from "./Components/patient/BookAppointment";
import MyAppointment from "./Components/patient/MyAppointment";
import FindDoctor from "./Components/patient/FindDoctor";
import Profile from "./Components/patient/Profile";
import ForgotPassword from "./Pages/ForgotPassword";
import HospitalLocation from "./Components/patient/HospitalLocation";

//DOCTOR DASHBOARD
import DoctorDashboard from "./Pages/DoctorDashboard";
import DoctorOverview from "./Components/doctor/DoctorOverview";
import Appointments from "./Components/doctor/Appointments";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* PATIENT DASHBOARD */}
      <Route path="/patient/dashboard" element={<PatientsDashboard />}>
        <Route index element={<PatientOverview />} />
        <Route path="book-appointment" element={<BookAppointment />}/>
        <Route path="appointments" element={<MyAppointment />}/>
        <Route path="find-doctor" element={<FindDoctor />} />
        <Route path="hospital-location" element={<HospitalLocation />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* DOCTOR DASHBOARD */}
      <Route path="/doctor/dashboard" element={<DoctorDashboard />}>
        <Route index element={<DoctorOverview />} />
        <Route path="appointments" element={<Appointments />} />
      </Route>


      <Route path="/forgot-paswword" element={<ForgotPassword />} />
    </Routes>
  )
};

export default App;
