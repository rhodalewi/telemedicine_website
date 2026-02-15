import { useContext } from 'react';
import { AuthPatientContext } from '../Context/createContext';
import { LuX } from 'react-icons/lu';
import { useForm } from 'react-hook-form';
import api from '../Services/api';
import { useEffect } from 'react';

const EditProfileForm = ({ setOpenEditForm }) => {
  const { showSuccess, showError, fetchPatientData, isSubmitting, setIsSubmitting } = useContext(AuthPatientContext);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const response = await api.get('/user/updateProfile');
    reset(response.data)
  }

  const submitForm = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await api.put('/user/updateProfile', data);

      setTimeout(() => {
        showSuccess(response.data.message)
        setIsSubmitting(false);
        fetchPatientData(); 
        fetchProfile();

        setTimeout(() => {
          setOpenEditForm(false);
        }, 1500)
      }, 2000)
    } catch (error) {
      setTimeout(() => {
        showError(error.response?.data?.message)
        setIsSubmitting(false);
      }, 2000)
    }

  }
  return (
    <div className='fixed top-0 left-0 w-full h-full z-20 md:h-screen flex justify-center items-center bg-text-primary/70 px-6'>
      <div className='bg-white p-6 md:p-8 rounded-2xl space-y-6 max-w-xl w-full'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-heading font-semibold'>Edit Your Profile</h2>
          <LuX onClick={() => setOpenEditForm(false)} className='text-h2 p-1 rounded-lg bg-text-secondary/20 hover:bg-accent hover:text-white' />
        </div>

        <form className='space-y-3' onSubmit={handleSubmit(submitForm)}>
          {/* first and last name inputs */}
          <div className=" grid md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className='block text-small font-medium text-text-secondary' >First Name <span className="text-error">*</span></label>
              <input 
                type="text" 
                {...register("first_name", {required: 'Input is required', setValueAs: (value) => value.trim()})}
                className={`w-full px-2.5 py-1 rounded-lg border focus:outline-none focus:ring-1 placeholder:text-small ${errors.first_name ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
              />
              {errors.first_name && <p className="text-error text-caption"> {errors.first_name.message} </p>}
            </div>
            
            <div className="flex flex-col gap-1">
              <label className='block text-small font-medium text-text-secondary' >Last Name <span className="text-error">*</span></label>
              <input 
                type="text"  
                {...register('last_name', {required: 'Input is required', setValueAs: (value) => value.trim()})}
                className={`w-full px-2.5 py-1 rounded-lg border focus:outline-none focus:ring-1 placeholder:text-small ${errors.last_name ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
              />
              {errors.last_name && <p className="text-error text-caption"> {errors.last_name.message} </p>}
            </div>
          </div>
                  
          {/* email and phone inputs */}
          <div className=" grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className='block text-small font-medium text-text-secondary' >Email Address <span className="text-error">*</span></label>
              <input 
                type="email"
                disabled
                {...register('email')}
                className='w-full px-2.5 py-2 rounded-lg text-text-secondary bg-text-secondary/5 border border-gray-400 outline-none cursor-not-allowed'
              />
            </div>
        
            <div className="flex flex-col gap-1">
              <label className='block text-small font-medium text-text-secondary' >Phone <span className="text-error">*</span></label>
              <input 
                type="tel"  
                {...register('phone', {
                  required: 'Input is required', setValueAs: (value) => value.trim(), pattern: {
                    value: /^(\+?\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{9,20}$/,
                    message: 'Phone number not correct'}
                })}
                className={` w-full px-2.5 py-2 rounded-lg border focus:outline-none focus:ring-1 placeholder:text-small text-small ${errors.phone ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`} 
              />
              {errors.phone && <p className="text-error text-caption"> {errors.phone.message} </p>}
            </div>
          </div>
                  
           {/* dob and gender inputs */}
          <div className=" flex gap-3">
            <div className="flex flex-col gap-1 w-full">
              <label className='block text-small font-medium text-text-secondary' >Date of Birth  <span className="text-error">*</span></label>
              <input 
                type="date" 
                {...register('date_of_birth', {required: 'Input is required'})}
                className={` w-full px-2 py-2 rounded-lg border focus:outline-none focus:ring-1 text-small ${errors.date_of_birth ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
              />
              {errors.date_of_birth && <p className="text-error text-caption"> {errors.date_of_birth.message} </p>}
            </div>
              
            <div className="flex flex-col gap-1 w-full">
              <label className='block text-small font-medium text-text-secondary' >Gender  <span className="text-error">*</span></label>
              <select  
                {...register('gender', {required: 'Choose your gender'})}
                className={` w-full px-2 py-2 rounded-lg border focus:outline-none focus:ring-1 bg-text-secondary/5 ${errors.gender ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}>
                <option>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
              {errors.gender && <p className="text-error text-caption"> {errors.gender.message} </p>}
            </div>
          </div>

          {/* emergency number and address */}
          <div className="space-y-3">
            <div className="flex flex-col gap-1 w-full">
              <label className='block text-small font-medium text-text-secondary' >Emergency Contact  <span className="text-error">*</span></label>
              <input 
                type="tel" 
                placeholder="+1 234 567 8900" 
                {...register('emergency_contact', {required: 'Input is required'})}
                className={` w-full px-2 py-2 rounded-lg border focus:outline-none focus:ring-1 text-small ${errors.emergency_contact ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
              />
              {errors.emergency_contact && <p className="text-error text-caption"> {errors.emergency_contact.message} </p>}
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className='block text-small font-medium text-text-secondary' >Address  <span className="text-error">*</span></label>
              <textarea 
                type="tel" 
                placeholder="Your Address" 
                {...register('address', {required: 'Input is required'})}
                className={` w-full px-2 py-2 rounded-lg border focus:outline-none focus:ring-1 text-small resize-none ${errors.address ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
              />
              {errors.address && <p className="text-error text-caption"> {errors.address.message} </p>}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="border w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-small cursor-pointer hover:bg-primary-hover mt-1.5 hover:shadow-soft transition-all duration-700 ease-in-out disabled:bg-primary/70 disabled:cursor-not-allowed"
          >
          {isSubmitting ? 'Registering...' : 'Save Changes'}
        </button>
        </form>
      </div>
    </div>
  )
}

export default EditProfileForm;