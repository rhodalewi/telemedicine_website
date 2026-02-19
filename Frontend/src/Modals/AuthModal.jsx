
import { GiCancel, GiMedicalPack  } from "react-icons/gi";
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

const AuthModal = ({ openAuth, setOpenAuth, formType, setFormType }) => {
  if (!openAuth) return null;
  
  return (
    <div className="h-full md:h-screen w-full flex justify-center items-center fixed z-30 top-0 bg-text-primary/70 px-3">
      <div className="max-w-4xl w-full"> 
        <button
          className="text-white hidden md:block md:float-right text-h2 md:text-h1 ml-2 cursor-pointer hover:text-primary-hover hover:scale-90 transition duration-700 ease-in-out" onClick={() => setOpenAuth(false)}
        >
          <GiCancel />
        </button>
        <div className="bg-background rounded-2xl flex flex-col md:flex-row" >
                {/* LEFT HANDSIDE */}
              <div className="bg-[url(/img/Wallpaper.png)] bg-center bg-no-repeat bg-cover hidden md:flex flex-col items-center justify-center text-background text-center  rounded-l-2xl rounded-r-4xl md:w-3/6 w-full py-10">
                      {/* LOGO */}
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-background rounded-xl flex items-center justify-center mb-8">
                      <GiMedicalPack className="md:text-3xl text-primary rounded-xl"/>
                  </div>

                  <h2 className="text-h3 md:text-h2 font-semibold mb-4 font-heading">Your Health, <br /> Our Top Priority </h2>
                  <p className="w-4/5 text-caption md:text-small">Connect with top doctors and receive personalized care from the comfort of your home. We provide the best healthcare services.</p>  
              </div>
                
                {/* RIGHT HANDSIDE */}
              <div className='pt-8 md:pt-10 pb-6 px-4 md:px-8 w-full md:w-3/6 bg-transparent relative'>
                  {/* LOGO */} 
                <GiMedicalPack className="text-4xl rounded-2xl text-primary w-full mb-3 md:hidden"/>
                  
                {formType === 'register' ? <RegisterForm setFormType={setFormType} setOpenAuth={setOpenAuth} /> : <LoginForm setFormType={setFormType} setOpenAuth={setOpenAuth} />}
              </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal;