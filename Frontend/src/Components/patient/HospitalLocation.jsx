import { useEffect, useState, useContext } from 'react';
import { AuthPatientContext } from '../../Context/createContext';
import api from '../../Services/api';
import LocationMap from '../LocationMap';
import { LuClock, LuMapPin, LuNavigation, LuPhoneCall, LuSearch, LuUser } from "react-icons/lu";
import { NavLink } from 'react-router-dom';


const HospitalLocation = () => {
    const { userLocation, hospitals, setHospitals, showError } = useContext(AuthPatientContext);
    const [selectedHospital, setSelectedHospital] = useState(null)
    const [searchHospital, setSearchHospital] = useState('');
    const [hospitalDoctors, setHospitalDoctors] = useState([]);
    const [toggleViewDoctor, setToggleViewDoctor] = useState(null)
    
    useEffect(() => {
        const fetchHospitals = async () => {
           try {
               const response = await api.get('/hospital/nearbyHospitals');
               setHospitals(response.data)
           } catch (error) {
               showError(error.response?.data?.message);
           }
        };
      
        fetchHospitals();
    }, []);

    //CALCULATE DISTANCE
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    //ATTACH DISTANCE
    const hospitalsWithDistance = hospitals.map(h => ({
        ...h,
        distance: userLocation
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                h.latitude,
                h.longitude
            ).toFixed(1)
            : null
    }));

    const filteredHospital = hospitalsWithDistance.filter(hospital => hospital.name.toLowerCase().includes(searchHospital.toLowerCase()));

    //MAP OUT ALL THE SERVICES OFFERED IN EACH HOSPITALS
    const hospitalService = selectedHospital?.services.split(",");

    //VIEW DOCTORS IN EACH HOSPITALS
     const fetchDoctorsByHospital = async (hospitalId) => {
        try {
            const response = await api.get(`/hospital/${hospitalId}/doctor`);
            setHospitalDoctors(response.data);
        } catch (error) {
            setTimeout(() => {
                showError(error.response?.data?.message)
            }, 1500);
        }
    };

    const handleViewDoctor = (hospitalId) => {
        if (toggleViewDoctor === hospitalId) {
            setToggleViewDoctor(null);
            setHospitalDoctors([]);
        } else {
            setToggleViewDoctor(hospitalId);
            fetchDoctorsByHospital(hospitalId);
        }
    }

  return (
    <div className='p-6 lg:p-10 space-y-6'>
        <div className='space-y-1'>
            <h2 className='text-body md:text-h3 font-heading font-semibold'>Hospital Locations</h2>
            <p className='text-text-secondary text-small'>Locate our health facilities near you.</p>
        </div>
        
        {/* Search Hospital by name */}
       <div className=' flex justify-center'>
            <div className='bg-white/80 border border-gray-300 rounded-xl flex items-center w-2xl md:w-md lg:w-2xl gap-3 px-4 h-11 focus-within:ring-1 ring-accent-hover '>
                <LuSearch className='text-text-secondary text-h3' />
                <input 
                    type="text"
                    placeholder='Search hospital by name...' 
                    className='outline-none h-full w-full placeholder:text-small'
                    value={searchHospital}
                    onChange={(e) => setSearchHospital(e.target.value)} 
                />
            </div>
       </div>
       
        <div className='flex flex-col lg:flex-row md:items-center lg:items-start justify-between gap-6'>
            {/* Hospital Map */}
            <div className='border border-gray-200 shadow-sm rounded-xl overflow-hidden bg-white w-full'>
                <div className='h-120'>
                    <LocationMap selectedHospital={selectedHospital} />
                </div>
                    
                {selectedHospital && (
                    <div className='p-6 space-y-6'>
                        <div className='flex items-start justify-between'>
                            <div className='space-y-3'>
                                <h3 className='text-body md:text-lg font-heading font-medium'> {selectedHospital.name} </h3>
                                <p className='text-small md:text-body'> {selectedHospital.address} </p>
                            </div>
                            <button className='hidden md:flex items-center gap-2 px-4 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-white transition-colors duration-500 ease-in-out border-0 cursor-pointer'>
                                <LuNavigation className='text-h3' />
                                Get Direction
                            </button>
                        </div>
                        
                        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-text-secondary'>
                            <div className='flex items-center  gap-1.5 sm:gap-3'>
                                <LuPhoneCall className='text-body sm:text-h3' />
                                <p className='text-small md:text-body'> +234 { selectedHospital.phone } </p>
                            </div>
                            
                            <div className='flex items-center gap-1.5 sm:gap-3'>
                                <LuClock className='text-body sm:text-h3' />
                                <p className='text-small md:text-body'> { selectedHospital.hours } </p>
                            </div>
                        </div>
                        
                        <div className='space-y-2'>
                            <p className='font-semibold'>Available Services</p>
                            <div className='flex items-center gap-2 flex-wrap'>
                                {hospitalService.map((service, ind) => (
                                    <p key={ind} className='text-small px-3 py-1 bg-accent/10 text-accent rounded-full'>{service}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
            </div>
            
            {/* Hospital List Card */}
            <div 
                className='grid grid-cols-1 gap-3 lg:gap-6 w-full'
            >
                {filteredHospital.length === 0 ? (
                    <p className='text-center flex items-center justify-center h-full'>No hospital found</p>
                ) : (
                    filteredHospital.map(hospital => (
                        <div
                            key={hospital.hospital_id}
                            className={`p-6  border  rounded-xl shadow-sm cursor-pointer  ${selectedHospital?.hospital_id === hospital.hospital_id ? ' ring-1 ring-accent bg-accent/5' : 'bg-white border-gray-200 hover:shadow-soft' }`}
                        >
                            <div onClick={() => setSelectedHospital(hospital)}>
                                <div className='flex items-center justify-between gap-6 mb-4'>
                                    <h3 className='text-body md:text-lg font-medium font-heading text-wrap'>{hospital.name}</h3>
                                    <p className='text-accent-hover text-wrap text-small md:text-body font-medium'>{hospital.distance} km away</p>
                                </div>

                                <div>
                                    <div className='space-y-3  text-text-secondary'>
                                        <div className='flex items-center gap-2'>
                                            <LuMapPin />
                                            <span className='text-small md:text-body'>{hospital.address}</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <LuPhoneCall />
                                            <span className='text-small md:text-body'>+234 {hospital.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col md:flex-row md:items-end justify-between gap-4 mt-3 md:mt-0'>
                                <div className='flex items-center gap-2 text-text-secondary'>
                                    <LuClock />
                                    <span className='text-small md:text-body'>{hospital.hours}</span>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => handleViewDoctor(hospital.hospital_id)}
                                    className='border-none bg-primary text-white text-small font-heading px-3 py-1.5 rounded-xl hover:bg-primary-hover transition duration-500 ease-in-out cursor-pointer'
                                >
                                   {toggleViewDoctor === hospital.hospital_id ? 'Hide Doctors' : 'View Doctors'}
                                </button>
                            </div>

                          {/* VIEW DOCTORS IN A PARTICULAR HOSPITAL */}
                           {toggleViewDoctor === hospital.hospital_id && (
                                <div className=''>
                                    {hospitalDoctors.length === 0 ? (
                                        <p className='mt-4 pt-4 border-t border-gray-200 text-center text-error text-small'>No doctors available</p>
                                    ) : (
                                        
                                        <div className='space-y-6'>
                                            {hospitalDoctors.map(doctor => (
                                                <div key={doctor.doctor_id} className='flex justify-between mt-8 pt-4 border-t border-gray-200 '>
                                                    <div className='flex gap-3'>
                                                          {/* doctors profile picture */}
                                                        <div className='h-10 w-10 rounded-full'>
                                                            {doctor.profile_picture && doctor.profile_picture.length > 0 ? (
                                                                <img src={`/uploads/${doctor.profile_picture}`} alt={doctor.first_name} className='w-full h-auto object-cover rounded-full' />
                                                            ) : (
                                                                <span className='bg-accent/10 w-full h-full rounded-full flex items-center justify-center'>
                                                                    <LuUser className='text-accent text-h2' />
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className='text-text-secondary'>
                                                            <p className='text-small md:text-body font-bold'>
                                                                Dr. {doctor.first_name} {doctor.last_name} 
                                                            </p>
                                                            <p className=' text-small md:text-body'>{ doctor.specialization}</p>
                                                        </div>
                                                    </div>

                                                    {/* Book appointment with a specific doctor */}
                                                    <NavLink
                                                        to={`/user/book-appointment?doctorId=${doctor.doctor_id}`}
                                                        onClick={() => doctor.doctor_id}
                                                        className='px-3 py-1 text-small rounded-xl bg-accent text-white hover:bg-accent-hover transition-all duration-500 shadow-soft ease-in-out self-end cursor-pointer'
                                                    >
                                                        Book Doctor
                                                    </NavLink>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                           )}
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
  )
}

export default HospitalLocation;