import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { useNavigate } from "react-router-dom"; 
import api from '../Services/api';
import { AuthPatientContext } from "../Context/createContext";
import { LuEye, LuEyeClosed, LuCircleX } from "react-icons/lu";


const RegisterForm = ({ setFormType, setOpenAuth}) => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const { userRole, selectedRole, setSelectedRole, registerEndpoint, showSuccess, showError, fetchPatientData, isSubmitting, setIsSubmitting, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword } = useContext(AuthPatientContext);
 
 

  const navigate = useNavigate();
  const matchPassword = watch('password_hash');
  const registerRole = userRole.filter(role => role.role !== 'admin' )

  async function onSubmit(data) {
    setIsSubmitting(true);

    try {
      const payLoad = selectedRole === 'doctor' ? {
        specialization: data.specialization, yearsExperience: data.yearsExperience, ...data
      } : { ...data };

      const res = await api.post(registerEndpoint, payLoad);
      await fetchPatientData();

      setTimeout(() => {
        showSuccess(res.data.message || 'Registration successful');
        reset();
        setIsSubmitting(false);

        setTimeout(() => {
          navigate('/user');
        }, 1500);
      }, 2000)

    } catch (err) {
      console.log(err);

    setTimeout(() => {
        showError(err.response?.data?.message || 'Registration failed');
        setIsSubmitting(false);
      }, 2000);
    }
  }
  
  return (
    <>
      <button
        className="text-text-primary md:hidden absolute top-4 right-4" onClick={() => setOpenAuth(false)}
      >
        <LuCircleX className='font-bold text-h1' />
      </button>
      
      <h2 className="text-h3 font-bold text-center font-heading">Create Your Account</h2>
      <p className="text-caption md:text-small text-center mb-4 md:mb-5 text-text-secondary">Start your healthcare journey with us</p>
      
      <form className="px-1 space-y-3" onSubmit={handleSubmit(onSubmit)}>
        {/* user role */}
        <div className='flex items-center justify-center gap-6 mb-6'>
          { registerRole.map(role => (
            <button
              type="button"
              key={role.id}
              onClick={() => setSelectedRole(role.role)}
              className={`font-heading capitalize border px-3.5 rounded-lg py-1.75 text-caption text-medium border-none  cursor-pointer hover:bg-primary-hover hover:text-white ${selectedRole === role.role ? 'bg-primary text-white' : 'bg-text-secondary/20 '}`}
            >
              {role.role}
            </button>
          ))}
        </div>

        <input type="hidden" value={selectedRole} className='border border-gray-400 disabled:bg-text-secondary/30' disabled />
        
        {/* first and last name inputs */}
        <div className=" flex gap-6">
          <div className="flex flex-col gap-1">
            <label className='text-small font-medium text-text-secondary' >First Name <span className="text-error">*</span></label>
            <input 
              type="text" 
              {...register("first_name", {required: 'Input is required', setValueAs: (value) => value.trim()})}
              placeholder="John"
              className={`w-full px-2.5 py-1 rounded-lg border focus:outline-none focus:ring-1 placeholder:text-small ${errors.first_name ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
            />
            {errors.first_name && <p className="text-error text-caption"> {errors.first_name.message} </p>}
          </div>
          
          <div className="flex flex-col gap-1">
            <label className='text-small font-medium text-text-secondary' >Last Name <span className="text-error">*</span></label>
            <input 
              type="text"  
              placeholder="Doe" 
              {...register('last_name', {required: 'Input is required', setValueAs: (value) => value.trim()})}
              className={`w-full px-2.5 py-1 rounded-lg border focus:outline-none focus:ring-1 placeholder:text-small ${errors.last_name ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
            />
            {errors.last_name && <p className="text-error text-caption"> {errors.last_name.message} </p>}
          </div>
        </div>
        
          {/* email and phone inputs */}
        <div className=" flex gap-4">
          <div className="flex flex-col gap-1">
            <label className='text-small font-medium text-text-secondary' >Email Address <span className="text-error">*</span></label>
            <input 
              type="email"  
              placeholder="you@example.com" 
              {...register('email', {required: 'Input is required', setValueAs: (value) => value.trim(), pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }})}
              className={`w-full px-2.5 py-1 rounded-lg border focus:outline-none focus:ring-1 placeholder:text-small ${errors.email ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
            />
            {errors.email && <p className="text-error text-caption"> {errors.email.message} </p>}
          </div>
      
          <div className="flex flex-col gap-1">
            <label className='text-small font-medium text-text-secondary' >Phone <span className="text-error">*</span></label>
            <input 
              type="tel"  
              placeholder="+1 234 567 8900" 
              {...register('phone', {
                required: 'Input is required', setValueAs: (value) => value.trim(), pattern: {
                  value: /^(\+?\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{9,20}$/,
                  message: 'Phone number not correct'}
              })}
              className={` w-full px-2.5 py-1 rounded-lg border focus:outline-none focus:ring-1 placeholder:text-small text-small ${errors.phone ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`} 
            />
            {errors.phone && <p className="text-error text-caption"> {errors.phone.message} </p>}
          </div>
        </div>
        
        {/* password and confirm password inputs */}
        <div className=" flex gap-4">
          <div className="flex flex-col gap-1">
            <label className='text-small font-medium text-text-secondary' >Password <span className="text-error">*</span></label>
            <div className={`px-2.5 flex items-center rounded-lg border focus-within:outline-none focus-within:ring-1 text-small ${errors.password_hash ? 'border-error focus-within:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus-within:ring-accent-hover'}`}>
              <input 
                type={showPassword ? 'text' : "password" } 
                placeholder="••••••••" 
                  {...register('password_hash', {
                    required: 'Input is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long'
                }})}
                className=" w-full py-1 outline-none  placeholder:text-small text-small" 
              />
              
              <span onClick={() => setShowPassword(!showPassword)} className="text-h3 text-text-secondary cursor-pointer">
                {showPassword ? <LuEyeClosed /> : <LuEye />}
              </span>
            </div>
            
            {errors.password_hash && <p className="text-error text-caption"> {errors.password_hash.message} </p>}
          </div>
          
          <div className="flex flex-col gap-1">
            <label className='text-small font-medium text-text-secondary' >Confirm Password <span className="text-error">*</span></label>
            <div className={`flex items-center border px-2.5 rounded-lg focus-within:outline-none focus-within:ring-1 text-small ${errors.confirm_password ? 'border-error focus-within:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus-within:ring-accent-hover'}`}>
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirm_password', {required: 'Input required', validate: value => value === matchPassword || 'Password do not match'})}
                className=" w-full h-8 placeholder:text-small text-small outline-none"
              />
        
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-h3 text-text-secondary cursor-pointer">
                {showConfirmPassword ? <LuEyeClosed /> : <LuEye />}
              </span>
            </div>
           
            {errors.confirm_password && <p className="text-error text-caption"> {errors.confirm_password.message} </p>}
          </div>
        </div>
        
        {selectedRole === 'patient' ? (
          <>
            {/* dob and gender inputs */}
            <div className=" flex gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label className='text-small font-medium text-text-secondary' >Date of Birth  <span className="text-error">*</span></label>
                <input 
                  type="date" 
                  placeholder="DOB " 
                  {...register('date_of_birth', {required: 'Input is required'})}
                  className={` w-full px-2 py-1 rounded-lg border focus:outline-none focus:ring-1 text-small ${errors.date_of_birth ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
                />
                {errors.date_of_birth && <p className="text-error text-caption"> {errors.date_of_birth.message} </p>}
              </div>
              
              <div className="flex flex-col gap-1 w-full">
                <label className='text-small font-medium text-text-secondary' >Gender  <span className="text-error">*</span></label>
                <select  
                  {...register('gender', {required: 'Choose your gender'})}
                  className={` w-full px-2 py-1 rounded-lg border focus:outline-none focus:ring-1 bg-text-secondary/10 ${errors.gender ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}>
                  <option>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </select>
                {errors.gender && <p className="text-error text-caption"> {errors.gender.message} </p>}
              </div>
            </div>
          </>
        ) : (
            <>
              {/* specialization and years of experience inputs */}
              <div className=" flex gap-4">
                <div className="flex flex-col gap-1 w-full">
                  <label className='text-small font-medium text-text-secondary' >Specialization  <span className="text-error">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Cardiology" 
                    {...register('specialization', {required: 'Input is required', setValueAs: (value) => value.trim()})}
                    className={` w-full px-2 py-1 rounded-lg border focus:outline-none focus:ring-1 text-small ${errors.specialization ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
                  />
                  {errors.specialization && <p className="text-error text-caption"> {errors.specialization.message} </p>}
                </div>
                
                <div className="flex flex-col gap-1 w-full">
                  <label className='text-small font-medium text-text-secondary' >Years of Experience  <span className="text-error">*</span></label>
                  <input
                    type="text"
                    {...register('yearsExperience', { required: 'Input is required', setValueAs: (value) => value.trim() })}
                    placeholder="e.g. 5 years"
                    className={` w-full px-2 py-1 rounded-lg border focus:outline-none focus:ring-1 text-small ${errors.yearsExperience ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
                  />
                  {errors.yearsExperience && <p className="text-error text-caption"> {errors.yearsExperience.message} </p>}
                </div>
              </div>
            </>
        ) }
           
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="border w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-small cursor-pointer hover:bg-primary-hover mt-1.5 hover:shadow-soft transition-all duration-700 ease-in-out disabled:bg-primary/70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Registering...' : 'Create Account'}
        </button>
        
        <p className="text-caption text-right mb-5">Already have an account?
          <a
            onClick={() => setFormType('login')}
            className="text-accent-hover pl-1 hover:text-accent hover:underline cursor-pointer text-small"
          >Sign in here</a>
        </p>
        <p className="text-caption text-center">By joining, you agree to the <a className="text-accent-hover hover:text-accent hover:underline cursor-pointer">Terms of Service</a> and <a className="text-accent hover:text-accent-hover cursor-pointer hover:underline">Privacy Policy</a> </p>
      </form>
    </>
  )
}

export default RegisterForm;