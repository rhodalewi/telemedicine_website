import {useContext, useState} from 'react'
import { AuthPatientContext } from '../../Context/createContext';
import { LuPencil } from 'react-icons/lu';
import EditProfileForm from '../../Modals/EditProfileForm';
import ChangePasswordForm from '../../Modals/ChangePasswordForm';

const ProfileForm = () => {
    const { dashboardOverview } = useContext(AuthPatientContext);
    const [openEditForm, setOpenEditForm] = useState(false); 
    const [openChangePassword, setOpenChangePassword] = useState(false);

  return (
    <div className='p-4 md:p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3'>
        <h1 className='md:text-h3 font-medium'>Basic Information</h1>
        
        <div className='space-y-4 md:space-y-6'>
            <div className='grid md:grid-cols-2 gap-4 md:gap-6'>
                <label className='flex flex-col gap-1.5 text-small md:text-body text-text-secondary'>First Name
                    <input 
                        type="text"
                        placeholder={!dashboardOverview.patientData?.first_name ? 'No first name'  : dashboardOverview.patientData?.first_name}
                        disabled
                        className='px-4 py-2 rounded-lg border border-gray-400'
                    />
                </label>
                <label className='flex flex-col gap-1.5 text-small md:text-body text-text-secondary'>Last Name
                    <input 
                        type="text"
                        placeholder={!dashboardOverview.patientData?.last_name ? 'No last name yet' : dashboardOverview.patientData?.last_name}
                        disabled
                        className=' px-4 py-2 rounded-lg border border-gray-400'
                    />
                </label>
            </div>
            
            <div className='grid md:grid-cols-2 gap-4 md:gap-6'>
                <label className='flex flex-col gap-1.5 text-small md:text-body text-text-secondary'>Email Address
                    <input 
                        type="text"
                        placeholder={!dashboardOverview.patientData?.email ? 'Email address not added yet!' : dashboardOverview.patientData?.email}
                        disabled
                        className='px-4 py-2 rounded-lg border border-gray-400'
                    />
                </label>
                <label className='flex flex-col gap-1.5 text-small md:text-body text-text-secondary'>Phone Number
                    <input 
                        type="text"
                        placeholder={!dashboardOverview.patientData?.phone ? 'Phone number not added yet!' : dashboardOverview.patientData?.phone}
                        disabled
                        className='px-4 py-2 rounded-lg border border-gray-400'
                    />
                </label>
            </div>
            
            <div className='grid md:grid-cols-2 gap-4 md:gap-6'>
                <label className='flex flex-col gap-1.5 text-small md:text-body text-text-secondary'>Date of Birth
                    <input 
                        type="text"
                        placeholder={!dashboardOverview.patientData?.date_of_birth ? 'Date of birth missing' : dashboardOverview.patientData?.date_of_birth}
                        disabled
                        className='px-4 py-2 rounded-lg border border-gray-400'
                    />
                </label>
                <label className='flex flex-col gap-1.5 text-small md:text-body text-text-secondary'>Gender
                    <input 
                        type="text"
                        placeholder={!dashboardOverview.patientData?.gender ? 'Gender not chosen yet' : dashboardOverview.patientData?.gender}
                        disabled
                        className='px-4 py-2 rounded-lg border border-gray-400'
                    />
                </label>
            </div>
            
            <div className='grid md:grid-cols-2 gap-4 md:gap-6'>
                <label className='flex flex-col gap-1.5 text-small md:text-body text-text-secondary'>Emergency Contact
                    <input 
                        type="text"
                        placeholder={!dashboardOverview.patientData?.emergency_contact ? 'No emergency contact yet'  :  dashboardOverview.patientData?.emergency_contact}
                        disabled
                        className='px-4 py-2 rounded-lg border border-gray-400'
                    />
                </label>
                <label className='flex flex-col gap-1.5 text-small md:text-body text-text-secondary'>Address
                    <textarea 
                        type="text"
                        rows='3'
                        placeholder={!dashboardOverview.patientData?.address ? 'No address yet'  :  dashboardOverview.patientData?.address}
                        disabled
                        className='p-4 rounded-lg border border-gray-400 resize-none'
                    />
                </label>
            </div>
        </div>
        
          <div className='flex items-center justify-between mt-6'>
            <button 
                type="button"
                onClick={() => setOpenEditForm(true)} 
                className='flex items-center gap-2 py-2 px-4 rounded-xl bg-primary text-white hover:bg-primary-hover text-small transition-all duration-500 ease-in-out'
            >
                <LuPencil /> 
                Edit
            </button>
            <button 
                type="button" 
                onClick={() => setOpenChangePassword(true)}
                className='py-2 px-4 rounded-xl border border-primary focus:ring-1 focus:ring-primary bg-primary-hover/10 text-primary text-small hover:bg-primary-hover/20 transition-all duration-500 ease-in-out'
            >
                Change Password
            </button>
        </div>
        
          {openEditForm && <EditProfileForm setOpenEditForm={setOpenEditForm} />}
          {openChangePassword && <ChangePasswordForm setOpenChangePassword={setOpenChangePassword} />}
    </div>
  )
}

export default ProfileForm