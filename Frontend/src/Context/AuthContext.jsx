import { AuthPatientContext } from "./createContext";
import toast from 'react-hot-toast';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";

export const AuthMessageProvider = ({ children }) => {
    const [collapse, setCollapse] = useState('false');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('patient');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [search, setSearch] = useState('');
    const [userLocation, setUserLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [hospitals, setHospitals] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [allDoctors, setAllDoctors] = useState({
        fetchDoctors: [],
        specializations: [],
        searchDoctors: []
    });
  
    const [dashboardOverview, setDashboardOverview] = useState({
        patientData: null,
        notifyCount: 0,
        totalAppointment: 0,
        upcomingAppointment: 0,
        doctorsConsulted: 0,
        lastVisit: null,
        appointmentHistory: [],
        allAppointments: []
    });
    

    const navigate = useNavigate();

    const userRole = [
      { id: 1, role: 'patient' },
      { id: 2, role: 'doctor' },
      { id: 3, role: 'admin' }
    ];

    //endpoint for login
    let loginEndpoint = '';
    if (selectedRole === 'patient') loginEndpoint = '/user/login';
    /* if (selectedRole === 'doctor') loginEndpoint = '/doctor/login';
    if (selectedRole === 'admin') loginEndpoint = '/admin/login'; */

    //endpont for registration
    let registerEndpoint =''
    if (selectedRole === 'patient') registerEndpoint = '/user/register';
    if (selectedRole === 'doctor') registerEndpoint = '/doctor/register';
    /* if (selectedRole === 'admin') endpoint = '/admin/login'; */
  

    const showSuccess = (msg) => {
        toast.success(msg, { duration: 2000, position: 'top-center', className: 'text-caption md:text-body'  });
    };

    const showError = (msg) => {
        toast.error(msg, { duration: 2000, position: 'top-center', className: 'text-caption md:text-body' });
    };

      //DASHBOARD OVERVIEW ENDPOINT
    const fetchPatientData = async () => {
        try {
            const response = await api.get('/user/dashboard');
            setDashboardOverview(prev => ({
                ...prev, 
                patientData: response.data.patientResult,
                notifyCount: response.data.notificationCount,
                upcomingAppointment: response.data.upcomingAppointmentCount,
                totalAppointment: response.data.totalAppointmentCount,
                doctorsConsulted: response.data.doctorsConsulted,
                lastVisit: response.data.lastVisit,
                appointmentHistory: response.data.appointmentHistory

            }))
            
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
            setDashboardOverview(prev => ({...prev, allAppointments: response.data}))
        } catch (error) {
            console.error(error)
            showError(error.response?.data?.message);
        }
    };

    //LOGOUT ENDPOINT
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
        <AuthPatientContext
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
                notifications, setNotifications,
                logout,
                navigate
            }}
        >
            {children}
        </AuthPatientContext>
    )
};

