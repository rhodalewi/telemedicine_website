import { useContext, useRef } from 'react'
import { AuthPatientContext } from '../../Context/createContext'
import api from '../../Services/api'
import { LuUser, LuCamera } from 'react-icons/lu'
import { useState } from 'react'
import ProfileForm from './ProfileForm'

const Profile = () => {
  const { dashboardOverview, showSuccess, showError, fetchPatientData } = useContext(AuthPatientContext);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const openImagePicker = () => fileInputRef.current.click();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const render = new FileReader();
    render.onloadend = () => {
      setPreview(render.result)
    };
    render.readAsDataURL(file);

    const uploadPicture = new FormData();
    uploadPicture.append('profile_picture', file);

    try {
      const response = await api.put('user/profile/image', uploadPicture, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showSuccess(response.data.message);
      fetchPatientData();
    } catch (error) {
      showError(error.response?.data?.message)
    }
  };

  return (
    <div className='p-6 lg:p-10 space-y-6'>
      <div className='space-y-1'>
        <h2 className='text-body md:text-h3 font-heading font-semibold'>Personal Information</h2>
        <p className='text-text-secondary text-caption md:text-small'>Manage your personal information</p>
      </div>

      <div className='flex items-center gap-3'>
        <div className='lg:h-24 lg:w-24 rounded-full relative'>
          {/* image upload container */}
          <div className='border border-gray-300 relative h-24 w-24 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden'>
            {dashboardOverview.patientData?.profile_picture && dashboardOverview.patientData?.profile_picture.length > 0 ? (
              <img
                src={preview || `http://localhost:8080/uploads/patient/${dashboardOverview.patientData?.profile_picture}`} alt="profile"
                className='w-full h-auto object-contain' />
            ) : (
                <LuUser className='text-accent text-h1' />
            )}
          </div>

          <div>
            <button
              type='button'
              onClick={openImagePicker}
              className='absolute bottom-0 right-0 p-1.5 rounded-full bg-accent hover:bg-accent-hover text-white'
            >
              <LuCamera />
            </button>
            <input
              type="file"
              accept='image/*'
              ref={fileInputRef}
              onChange={handleImageChange}
              className='hidden'
            />
          </div>
        </div>

        <div className='space-y-1'>
          <p className='font-medium font-heading'> {dashboardOverview.patientData?.first_name} {dashboardOverview.patientData?.last_name} </p>
          <p className='text-small truncate'> {dashboardOverview.patientData?.email} </p>
        </div>
      </div>
     
      <ProfileForm />
    </div>
  )
}
export default Profile;