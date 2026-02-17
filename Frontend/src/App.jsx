import { Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import PatientsDashboard from "./Pages/PatientsDashboard";
import Overview from "./Components/patient/Overview";
import BookAppointment from "./Components/patient/BookAppointment";
import MyAppointment from "./Components/patient/MyAppointment";
import FindDoctor from "./Components/patient/FindDoctor";
import Profile from "./Components/patient/Profile";
import ForgotPassword from "./Pages/ForgotPassword";
import HospitalLocation from "./Components/patient/HospitalLocation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/user" element={<PatientsDashboard />}>
        <Route index element={<Overview />} />
        <Route path="book-appointment" element={<BookAppointment />}/>
        <Route path="appointments" element={<MyAppointment />}/>
        <Route path="find-doctor" element={<FindDoctor />} />
        <Route path="hospital-location" element={<HospitalLocation />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/forgot-paswword" element={<ForgotPassword />} />
    </Routes>
  )
}

export default App;
