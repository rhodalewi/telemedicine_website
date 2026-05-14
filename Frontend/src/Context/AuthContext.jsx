import { AuthContext } from "./createContext";
import toast from 'react-hot-toast';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";

export const AuthProvider = ({ children }) => {
     const userRole = [
      { id: 1, role: 'patient' },
      { id: 2, role: 'doctor' },
      { id: 3, role: 'admin' }
    ];

    const [collapse, setCollapse] = useState('false');
    const filters = ["today's appointment", "all", "upcoming", "pending", "completed", "cancelled"]
    const [activeFilter, setActiveFilter] = useState(filters[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('patient');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [search, setSearch] = useState('');
    const [userLocation, setUserLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [hospitals, setHospitals] = useState([]);
    const [notifications, setNotifications] = useState({
        showAllNotifications: [],
        showNotificationCount: 0
    });
    const [openNotification, setOpenNotification] = useState(false);
    const [allDoctors, setAllDoctors] = useState({
        fetchDoctors: [],
        specializations: [],
        searchDoctors: []
    });
  
    const [dashboardOverview, setDashboardOverview] = useState({
        patientData: null,
        totalAppointment: 0,
        upcomingAppointment: 0,
        doctorsConsulted: 0,
        lastVisit: null,
        appointmentHistory: [],
        allAppointments: []
    });
    

    const navigate = useNavigate();

    //FORMAT DATE
    const formatDate = (date) => {
        if (!date) return 'First Visit';

        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    };

    //format time to hour, minute and am/pm
    const formatTime = (time) => {
        const [hour, minute] = time.split(':');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`
    };
    
    const showSuccess = (msg) => {
        toast.success(msg, { duration: 2000, position: 'top-center', className: 'text-caption md:text-body'  });
    };

    const showError = (msg) => {
        toast.error(msg, { duration: 2000, position: 'top-center', className: 'text-caption md:text-body' });
    };

    //endpoint for login
    let loginEndpoint = '';
    if (selectedRole === 'patient') loginEndpoint = '/patient/login';
    if (selectedRole === 'doctor') loginEndpoint = '/doctor/login';
    /* if (selectedRole === 'admin') loginEndpoint = '/admin/login'; */

    //endpont for registration
    let registerEndpoint =''
    if (selectedRole === 'patient') registerEndpoint = '/patient/register';
    if (selectedRole === 'doctor') registerEndpoint = '/doctor/register';
    /* if (selectedRole === 'admin') endpoint = '/admin/login'; */
  
    let dashboardEndpoint = '';
    if (selectedRole === 'patient') dashboardEndpoint = '/patient/dashboard';
    if (selectedRole === 'doctor') dashboardEndpoint = '/doctor/dashboard';

    //IMAGE URL FOR PATENTS
    const PatientImageUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/uploads/patient/` : 'http://localhost:8080/uploads/patient/';

    //IMAGE URL FOR DOCTORS
    const DoctorImageUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/uploads/doctor/` : 'http://localhost:8080/uploads/doctor/';

      //DASHBOARD OVERVIEW ENDPOINT
    const fetchPatientData = async () => {
        try {
            const response = await api.get(dashboardEndpoint);
            setDashboardOverview(prev => ({
                ...prev,
                patientData: response.data.patientResult,
                upcomingAppointment: response.data.upcomingAppointmentCount,
                totalAppointment: response.data.totalAppointmentCount,
                doctorsConsulted: response.data.doctorsConsulted,
                lastVisit: response.data.lastVisit,
                appointmentHistory: response.data.appointmentHistory

            }));
            
        } catch (error) {
            showError(error.response?.data?.message);
            setDashboardOverview(prev => ({ ...prev, lastVisit: error.response?.data?.message }));
        }
    };

    //FETCH DOCTORS
    const fetchDoctorsData = async () => {
        try {
            const response = await api.get('/doctor/getAlldoctors');
            setAllDoctors(prev => ({
                ...prev,
                fetchDoctors: response.data,
                specializations: response.data
            }))
        } catch (error) {
            showError(error.response?.data?.message);
        }
    };

    //search and filter doctor
    const findDoctors = async () => {
        try {
            const response = await api.get(`/doctor/findDoctors`, {
                params: { search: search, filter: selectedSpecialty }
            })
            setAllDoctors(prev => ({
                ...prev,
                searchDoctors: response.data,
            }))
        } catch (error) {
            console.error(error);
            showError(error.response?.data?.message)
        }
    };

    //FETCH ALL APPOINTMENTS FOR PATIENT
    const fetchAllAppointments = async () => {
        try {
            const response = await api.get('/appointment/allAppointment');
            setDashboardOverview(prev => ({ ...prev, allAppointments: response.data }));
        } catch (error) {
            console.error(error)
            showError(error.response?.data?.message);
        }
    };

    //LOGOUT ENDPOINT FOR ALL ROLES
    const logout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?')
    if (!confirmLogout) return;

    try {
        const response = await api.get('/user/logout')

        setTimeout(() => {
            showSuccess(response.data.message || 'Logged out successfully!');
            setDashboardOverview(prev => ({ ...prev, patientData: null }))

            setTimeout(() => {
                navigate('/')
            }, 1500)
        }, 2000)
    } catch (error) {
        showError(error.response?.data?.message || 'Logout failed. Try again!');
    }
    };
    
    //DOCTOR AUTH
    const [doctorDashboardOverview, setDoctorDashboardOverview] = useState({
        doctorData: null,
        todayAppointmentCount: 0,
        upcomingAppointmentCount: 0,
        totalPatientsCount: 0,
        totalAppointmentsCount: 0,
        lastVisit: null,
        todayAppointments: [],
        recentNotifications: [],
        allDoctorsAppointments: []
    });

    const fetchDoctorDashboard = async () => {
        try {
            const response = await api.get('/doctor/dashboard');
            setDoctorDashboardOverview(prev => ({
                ...prev,
                doctorData: response.data.doctorResult,
                todayAppointmentCount: response.data.todayAppointment,
                upcomingAppointmentCount: response.data.upcomingAppointment,
                totalPatientsCount: response.data.totalPatients,
                totalAppointmentsCount: response.data.totalAppointments,
                lastVisit: response.data.lastVisit,
                recentNotifications: response.data.recentNotifications
            }));
        } catch (error) {
            showError(error.response?.data?.message); 
        };
    };


// FETCH ALL NOTIFICATIONS
    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notification/getNotifications');
            setNotifications({
                showAllNotifications: response.data.allNotifications,
                showNotificationCount: response.data.notificationCount,
                recentNotifications: response.data.recentNotifications
            })
        } catch (error) {
            showError(error.response?.data?.message);
        }
    };

//ADD INTERCEPTOR
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            response => response,
            error => {
                if (error.response && error.response.status === 401) {
                    showError('Session expired, please login again!');
                    navigate('/');
                };
                return Promise.reject(error);
            }
        )
        return () => {
            api.interceptors.response.eject(interceptor)
        }
    }, [navigate])
    

    return (
        <AuthContext
            value={{
                fetchPatientData,
                fetchDoctorsData,
                fetchAllAppointments,
                allDoctors,
                userRole,
                loginEndpoint,
                registerEndpoint,
                findDoctors,
                dashboardOverview, setDashboardOverview,
                selectedRole, setSelectedRole,
                selectedSpecialty,  setSelectedSpecialty,
                search, setSearch,
                showSuccess, showError,
                collapse, setCollapse,
                isSubmitting, setIsSubmitting,
                showPassword,  setShowPassword,
                showConfirmPassword, setShowConfirmPassword,
                userLocation, setUserLocation,
                locationError, setLocationError,
                hospitals, setHospitals,
                PatientImageUrl,
                
                /* ALL */
                logout,
                formatDate,
                formatTime,
                notifications, setNotifications,
                fetchNotifications,
                openNotification, setOpenNotification,
                filters,
                activeFilter, setActiveFilter,


                //DOCTOR AUTH
                doctorDashboardOverview, setDoctorDashboardOverview,
                fetchDoctorDashboard,
                navigate,
                DoctorImageUrl
            }}
        >
            {children}
        </AuthContext>
    )
};

