import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthPatientContext } from "../Context/createContext";
import { LuArrowBigRight, LuEye, LuEyeClosed } from "react-icons/lu";
import api from "../Services/api";

const ForgotPassword = () => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const { isSubmitting, setIsSubmitting, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, showError, showSuccess } = useContext(AuthPatientContext);
  const navigate = useNavigate();
  const matchPassword = watch('newPassword');

  const handleReset = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await api.put(`/user/resetPassword`, data);
      setTimeout(() => {
        showSuccess(response.data.message);
        setIsSubmitting(false);
        reset();

        setTimeout(() => {
          navigate(-1);
        }, 2500)
      }, 2000)
    } catch (error) {
      setTimeout(() => {
        showError(error.response?.data?.message);
        setIsSubmitting(false);
      });
    };
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center border min-h-screen overflow-hidden">
      <button onClick={() => navigate(-1)} className="text-small flex items-center gap-1 font-medium border border-gray-300 shadow-sm bg-text-secondary/5 hover:bg-accent hover:text-white px-2 py-1 rounded-xl cursor-pointer transition-all duration-500 ease-in-out">Go Back <LuArrowBigRight /></button>
      
      <div className="p-6 md:w-md bg-white rounded-2xl shadow-soft border border-gray-300 space-y-6">
        <h1 className="md:text-lg font-semibold font-heading text-center">Forgot Password</h1>

        <form onSubmit={handleSubmit(handleReset)} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-small font-medium text-text-secondary">Email Address <span className="text-error">*</span></label>
            <input
              type="text"
              placeholder="Enter your email address"
              {...register('email', { required: 'Email is required', setValueAs: (value) => value.trim(), })}
              className={`w-full px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1  placeholder:text-small ${errors.email ? 'border-error focus:ring-error hover:border-error' : 'b400order-gray- hover:border-primary-hover focus:ring-accent-hover'}`}
            />
            {errors.email && <p className="text-error text-small">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className='text-small font-medium text-text-secondary'> New Password <span className="text-error">*</span> </label>
            <div className={`px-2.5 flex items-center rounded-lg border focus-within:outline-none focus-within:ring-1  ${errors.newPassword ? 'border-error focus-within:ring-error hover:border-error ' : 'border-gray-400 hover:border-primary-hover focus-within:ring-accent-hover'}`}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                {...register('newPassword', {
                  required: 'Password is required', minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long'
                  }
                })}
                className='w-full py-1.5 outline-none placeholder:text-small text-small'
              />
              <span onClick={() => setShowPassword(!showPassword)} className="text-h3 text-text-secondary cursor-pointer"> {showPassword ? <LuEyeClosed /> : <LuEye />} </span>
            </div>
            {errors.newPassword && <p className="text-error text-small"> {errors.newPassword.message} </p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className='text-small font-medium text-text-secondary'>Confirm New Password <span className="text-error">*</span></label>
            <div className={`flex items-center border px-2.5 rounded-lg focus-within:outline-none focus-within:ring-1 text-small ${errors.confirm_password ? 'border-error focus-within:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus-within:ring-accent-hover'}`}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirm_password', { required: 'Confirm Password is required', validate: value => value === matchPassword || 'Password do not match' })}
                className=" w-full py-2 placeholder:text-small text-small outline-none"
              />
        
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-h3 text-text-secondary cursor-pointer">
                {showConfirmPassword ? <LuEyeClosed /> : <LuEye className="text-h3 text-text-secondary" />}
              </span>
            </div>
            
            {errors.confirm_password && <p className="text-error text-small"> {errors.confirm_password.message} </p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="border w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-small cursor-pointer hover:bg-primary-hover mt-1.5 hover:shadow-soft transition-all duration-700 ease-in-out disabled:bg-primary/70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
};

export default ForgotPassword;