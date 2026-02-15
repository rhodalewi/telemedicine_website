import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthPatientContext } from "../Context/createContext";
import { LuX, LuEye, LuEyeClosed} from "react-icons/lu";
import api from "../Services/api";

const ChangePasswordForm = ({ setOpenChangePassword }) => {
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
    const { isSubmitting, setIsSubmitting, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, fetchPatientData, showError, showSuccess } = useContext(AuthPatientContext);

    const matchPassword = watch('newPassword');

    const handleChangePassword = async (data) => {
        setIsSubmitting(true);

        try {
            const response = await api.put('/user/changePassword', data);
            setTimeout(() => {
                showSuccess(response.data.message);
                reset();
                setIsSubmitting(false);
                fetchPatientData();
                setTimeout(() => {
                    setOpenChangePassword(false);
                }, 2500);
            }, 2000)
        } catch (error) {
            setTimeout(() => {
                showError(error.response?.data?.message);
                setIsSubmitting(false);
            }, 2000)
        }
    }

  return (
    <div className='fixed top-0 left-0 w-full h-full z-20 md:h-screen flex justify-center items-center bg-text-primary/70 px-6'>
        <div className='bg-white p-6 md:p-8 rounded-2xl space-y-6 md:space-y-8 max-w-md w-full'>
            <div className='flex items-center justify-between'>
                <h2 className='text-lg font-heading font-semibold'>Change Password</h2>
                <LuX onClick={() => setOpenChangePassword(false)} className='text-h2 p-1 rounded-lg bg-text-secondary/20 hover:bg-accent hover:text-white' />
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit(handleChangePassword)}>
                <div className="flex flex-col gap-1">
                    <label className='text-small font-medium text-text-secondary ' >Current Password <span className="text-error">*</span></label>
                    <div className={`px-2.5 flex items-center rounded-lg border focus-within:outline-none focus-within:ring-1 text-small ${errors.currentPassword ? 'border-error focus-within:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus-within:ring-accent-hover'}`}>
                        <input 
                        type={showPassword ? 'text' : "password" } 
                        placeholder="••••••••" 
                        {...register('currentPassword', {
                            required: 'Input is required',
                            })}
                        className=" w-full py-2 outline-none  placeholder:text-small text-small" 
                        />
                        
                        <span onClick={() => setShowPassword(!showPassword)} className="text-h3 text-text-secondary cursor-pointer">
                            {showPassword ? <LuEyeClosed /> : <LuEye />}
                        </span>
                    </div>
                    
                    {errors.currentPassword && <p className="text-error text-caption"> {errors.currentPassword.message} </p>}
                </div>
                
                <div className="flex flex-col gap-1">
                    <label className='text-small font-medium text-text-secondary' >New Password <span className="text-error">*</span></label>
                    <div className={`px-2.5 flex items-center rounded-lg border focus-within:outline-none focus-within:ring-1 text-small ${errors.newPassword ? 'border-error focus-within:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus-within:ring-accent-hover'}`}>
                        <input 
                        type={showPassword ? 'text' : "password" } 
                        placeholder="••••••••" 
                        {...register('newPassword', {
                            required: 'Input is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters long'
                        }})}
                        className=" w-full py-2 outline-none  placeholder:text-small text-small" 
                        />
                        
                        <span onClick={() => setShowPassword(!showPassword)} className="text-h3 text-text-secondary cursor-pointer">
                        {showPassword ? <LuEyeClosed /> : <LuEye />}
                        </span>
                    </div>
                    
                    {errors.newPassword && <p className="text-error text-caption"> {errors.newPassword.message} </p>}
                </div>
                    
                <div className="flex flex-col gap-1">
                    <label className='text-small font-medium text-text-secondary'>Confirm New Password <span className="text-error">*</span></label>
                    <div className={`flex items-center border px-2.5 rounded-lg focus-within:outline-none focus-within:ring-1 text-small ${errors.confirm_password ? 'border-error focus-within:ring-error hover:border-error' : 'border-gray-400 hover:border-primary-hover focus-within:ring-accent-hover'}`}>
                        <input 
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...register('confirm_password', {required: 'Input required', validate: value => value === matchPassword || 'Password do not match'})}
                        className=" w-full py-2 placeholder:text-small text-small outline-none"
                        />
                
                        <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-h3 text-text-secondary cursor-pointer">
                        {showConfirmPassword ? <LuEyeClosed /> : <LuEye className="text-h3 text-text-secondary" />}
                        </span>
                    </div>
                    
                    {errors.confirm_password && <p className="text-error text-caption"> {errors.confirm_password.message} </p>}
                </div>
                
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="border w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-small cursor-pointer hover:bg-primary-hover mt-1.5 hover:shadow-soft transition-all duration-700 ease-in-out disabled:bg-primary/70 disabled:cursor-not-allowed"
                >
                {isSubmitting ? 'Changing...' : 'Save Changes'}
                </button>
            </form>
        </div>
    </div>
  )
}

export default ChangePasswordForm;