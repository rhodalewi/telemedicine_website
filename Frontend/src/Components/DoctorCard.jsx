import { LuCalendar, LuUser, LuClock } from "react-icons/lu";
import { NavLink } from "react-router-dom";

const DoctorCard = ({ doctor, collapse }) => {
    
  return (
    <div key={doctor.doctor_id} className='p-6 rounded-xl border border-gray-300 shadow-sm bg-white/90 space-y-6' >
        <div className='flex items-start gap-4'>
                {/* doctors profile picture */}
            <div className='h-14 w-14 md:h-18 md:w-18 rounded-full'>
                {doctor.profile_picture && doctor.profile_picture.length > 0 ? (
                    <img src={`/uploads/${doctor.profile_picture}`} alt={doctor.first_name} className='w-full h-auto object-cover rounded-full' />
                ) : (
                    <span className='bg-accent/10 w-full h-full rounded-full flex items-center justify-center'>
                        <LuUser className='text-accent text-h2' />
                    </span>
                )}
            </div>

            {/* doctor informations */}
            <div className='text-text-secondary space-y-1.5'>
                    <h3 className='font-heading font-medium text-text-primary text-small md:text-body'>Dr. {doctor.first_name} {doctor.last_name} </h3>
                    <p className="text-small">{ doctor.email }</p>
                    <p className="text-small"> {doctor.specialization} </p>
                    <p className="text-small"> {doctor.yearsExperience} {doctor.yearsExperience <= 1 ? 'year' : 'years'} of experience </p>
            </div>  
        </div>

        {/* doctor availability */}
        <div className={`flex flex-col lg:items-end justify-between gap-4 transition-all duration-500 ease-in-out ${collapse ? 'lg:flex-row' : 'md:flex-row'}`}>
                <div className='space-y-2 whitesapace-nowrap'>
                  <p className='flex items-center gap-2 text-small'>
                    <LuCalendar />
                    Available Days:
                    <span className="text-accent">Monday - Friday{doctor.available_day}</span>
                  </p>
                  <p className='flex items-center gap-3 text-small'>
                    <LuClock />
                    Available Time:
                    <span className="text-accent">10:00 AM - 05:00 PM{doctor.start_time} {doctor.end_time}</span>
                  </p>
                </div>
                
                <NavLink 
                    to={`/user/book-appointment?doctorId=${doctor.doctor_id}`}
                    onClick={() => doctor.doctor_id}
                    className='border-0 px-3 py-1.5 text-white bg-primary hover:bg-primary-hover hover:shadow-soft rounded-xl text-center text-small transition-all duration-500 ease-in-out md:w-fit md:self-end whitespace-nowrap'
                >
                    Book Appointment
                </NavLink>
        </div>
    </div>
  )
}

export default DoctorCard;