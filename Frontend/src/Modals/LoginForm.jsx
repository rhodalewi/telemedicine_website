import { useContext} from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../Services/api';
import { AuthPatientContext } from '../Context/createContext';
import { LuEye, LuEyeClosed, LuCircleX } from "react-icons/lu";


const LoginForm = ({ setFormType, setOpenAuth }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { userRole,  selectedRole, setSelectedRole, loginEndpoint, showSuccess, showError, fetchPatientData, isSubmitting, setIsSubmitting, showPassword, setShowPassword} = useContext(AuthPatientContext);
  const navigate = useNavigate();
  

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const payLoad =
        selectedRole === 'admin' ? { username: data.username, password: data.password_hash } : { email: data.email, password: data.password_hash };

      const res = await api.post(loginEndpoint, payLoad)
      await fetchPatientData();

      setTimeout(() => {
        showSuccess(res.data.message || 'Login successful. Redirecting...');
        setIsSubmitting(false);
        reset();

        setTimeout(() => {
          navigate('/user')
        }, 1500)
      }, 2000)

    } catch (err) {
      console.log(err);
      
      setTimeout(() => {
        showError(err.response?.data?.message || 'Login failed. Try again!');
        setIsSubmitting(false);
      }, 2000);
      
    }
  };

  return (
    <>
      <button
        className="text-text-primary md:hidden absolute top-4 right-4" onClick={() => setOpenAuth(false)}
      >
        <LuCircleX className='font-bold text-h1' />
      </button>

      <h2 className="text-h3 font-bold text-center font-heading mb-1">Welcome Back! </h2>
      <p className="text-caption md:text-small text-center mb-5 text-text-secondary">Select your role to log in to your account</p>

      <form className='px-8 md:px-12 space-y-3' onSubmit={handleSubmit(onSubmit)}>
        {/* User Role */}
        <div className='flex items-center justify-evenly gap-4 mb-6 w-full'>
          {userRole.map(role => (
            <button
              type="button"
              key={role.id}
              role={role.role}
              onClick={() => setSelectedRole(role.role)}
              className={`font-heading capitalize border px-3.5 rounded-lg py-1.75 text-caption text-medium border-none  cursor-pointer hover:bg-primary-hover hover:text-white ${selectedRole === role.role ? 'bg-primary text-white' : 'bg-text-secondary/20 '}`}
            >
              {role.role}
            </button>
          ))}
        </div>

        <input type="hidden" className='border border-gray-400 disabled:bg-text-secondary/30' disabled value={selectedRole} />
        
        {/* ALL INPUTS */}
        {selectedRole === 'admin' ? (
          <div className='flex flex-col gap-1'>
            <label className='text-small font-medium text-text-secondary' >Username <span className="text-error">*</span></label>
            <input
              type="text"
              placeholder='johndoe'
              {...register('username', { required: 'Username is required', setValueAs: (value) => value.trim() })}
              className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1  placeholder:text-small ${errors.username ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
            />
            {errors.username && <p className="text-error text-caption"> {errors.username.message} </p>}
          </div>
        ) : (
          //Email address input  
          <div className='flex flex-col gap-1'>
            <label className='text-small font-medium text-text-secondary' >Email Address <span className="text-error">*</span></label>
            <input
              type="email"
              placeholder='you@example.com'
              {...register('email', {
                required: 'Email is required',
                setValueAs: (value) => value.trim(),
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
              className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1  placeholder:text-small ${errors.email ? 'border-error focus:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus:ring-accent-hover'}`}
            />
            {errors.email && <p className="text-error text-caption"> {errors.email.message} </p>}
          </div>
        )}
        
        {/* Password Input */}
        <div className='flex flex-col gap-1'>
          <label className='text-small font-medium text-text-secondary' >Password <span className="text-error">*</span></label>
          <div className={`px-2.5 flex items-center rounded-lg border focus-within:outline-none focus-within:ring-1  ${errors.password_hash ? 'border-error focus-within:ring-error hover:border-error ' : 'border-gray-400 hover:border-primary-hover focus-within:ring-accent-hover'}`}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              {...register('password_hash', {
                required: 'Password is required', minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long'
                }
              })}
              className=' w-full py-1.5 outline-none placeholder:text-small text-small'
            />
            <span onClick={() => setShowPassword(!showPassword)} className="text-h3 text-text-secondary cursor-pointer">
              {showPassword ? <LuEyeClosed  /> : <LuEye />}
            </span>
          </div>
          {errors.password_hash && <p className="text-error text-caption"> {errors.password_hash.message} </p>}
        </div>

        <p onClick={() => navigate('/forgot-paswword')} className='text-right text-small hover:text-accent cursor-pointer'>Forgot Password?</p>

        <button
          type='submit'
          disabled={isSubmitting}
          className="border-none w-full py-2 rounded-xl bg-primary text-white font-semibold text-body cursor-pointer hover:bg-primary-hover mt-1.5 hover:shadow-soft transition-all duration-700 ease-in-out disabled:bg-primary/70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-caption md:text-small text-right mt-4">Don't have an account?
          <a
            onClick={() => setFormType('register')}
            className="text-accent pl-2 hover:text-accent-hover hover:underline cursor-pointer"
          >Create one</a>
        </p>
      </form>
    </>
  )
};

export default LoginForm;