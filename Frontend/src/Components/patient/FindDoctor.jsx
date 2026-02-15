import { useContext, useState, useEffect } from 'react'
import {  LuChevronDown, LuSearch } from 'react-icons/lu';
import { AuthPatientContext } from '../../Context/createContext';
import DoctorCard from '../DoctorCard';

const FindDoctor = () => {
    const { allDoctors, search, setSearch, selectedSpecialty, setSelectedSpecialty, findDoctors, collapse } = useContext(AuthPatientContext);
    const [dropdown, setDropdown] = useState(false);
    const [availability, setAvailability] = useState(false);

    useEffect(() => {
        findDoctors();
    }, [search, selectedSpecialty])

  return (
    <div className='p-6 lg:p-10 space-y-6'>
        <div className='space-y-1'>
            <h2 className='font-semibold text-body md:text-h3 font-heading'>Find Doctors</h2>
            <p className='text-text-secondary text-caption md:text-small'>Browse our network of healthcare professionals by name, email or specialty.</p>
        </div>
        
          {/* Search section */}
        <div className='bg-white p-4 md:p-6 rounded-xl shadow-sm'>
            <div className='grid lg:grid-cols-3 gap-4 mb-4'>
                <div className='relative md:col-span-2'>
                    
                    <LuSearch className='absolute left-3 -translate-y-1/2 top-1/2 text-h3 text-text-secondary cursor-pointer hover:text-text-primary' />
                 
                    <input 
                        type="text" 
                        placeholder='Search doctor by name, email or specialty...' 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='border border-gray-300 w-full pl-10 p-3 rounded-xl outline-none focus:ring-1 focus:ring-text-primary placeholder:text-small' 
                    />
                </div>
                  {/* specialiazation filter */}   
                <div className='relative'>
                    <div 
                        onClick={() => setDropdown(!dropdown)} 
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className='flex items-center justify-between w-full cursor-pointer border border-gray-300 rounded-xl p-3 focus-within:ring-1 focus-within:ring-text-primary'
                    >
                        <span value={selectedSpecialty} className={`text-small ${selectedSpecialty === 'Select Specialization' ? 'text-text-secondary' : 'text-text-primary'}`}
                        > 
                            {selectedSpecialty.length === 0 ? 'Select Specialization' : selectedSpecialty } 
                        </span>
                        <LuChevronDown 
                            className={`text-h2  hover:bg-text-secondary/10 p-0.5 rounded-sm right-3 transition duration-500 ease-initial ${dropdown ? 'rotate-0' : 'rotate-180'}`} 
                        />
                    </div>
                      {/* Dropdown content */}
                    <div className='absolute z-10 w-full'>
                        {dropdown && (
                            <ul className='shadow-sm border border-gray-300 rounded-xl mt-1 px-1 py-3 space-y-1 bg-background'>
                                <li 
                                    onClick={() => {
                                        setSelectedSpecialty('')
                                        setDropdown(false)
                                    }} 
                                    className='px-4 py-1.5 cursor-pointer hover:bg-accent hover:text-white rounded-md'
                                >
                                    Select Specialization
                                </li>
                                {allDoctors.specializations.map(specialty => (
                                    <li
                                        key={specialty.specialization}
                                        onClick={() => {
                                            setSelectedSpecialty(specialty.specialization),
                                            setDropdown(false)
                                        }}
                                        className='cursor-pointer px-4 py-1.5 block hover:bg-accent hover:text-white rounded-md'
                                    >
                                        {specialty.specialization}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
            
            <label className='flex items-center gap-2 cursor-pointer'>
                <input 
                    type="checkbox" 
                    checked={availability}
                    onChange={(e) => setAvailability(e.target.checked)}
                    className='w-4 h-4 accent-primary cursor-pointer'
                />
                <span className='text-small'>Show only doctors available today</span>
            </label>
        </div>
        
          {/* DOCTOR CARD */}
       {allDoctors.searchDoctors.length === 0 ? (
           <div className='border border-gray-200 rounded-xl bg-white flex flex-col items-center justify-center gap-4 px-2 py-10 shadow-sm'>
                <LuSearch className='text-6xl text-text-secondary/50 ' />
                <p className='text-text-secondary'>No doctors found matching your search</p>
           </div>
       ) : (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {allDoctors.searchDoctors.map(doctors => (
                    <DoctorCard key={doctors.doctor_id} doctor={doctors} collapse={ collapse } />   
                ))}
            </div>
       )}
    </div>
  )
}

export default FindDoctor;