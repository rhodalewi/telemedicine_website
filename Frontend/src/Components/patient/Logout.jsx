import { useContext } from "react";
import { AuthPatientContext } from "../../Context/createContext";
import { LuLogOut } from "react-icons/lu";

const Logout = () => {
    const { logout } = useContext(AuthPatientContext);

  return (
    <button 
      onClick={() => logout()}
      className='flex items-center justify-center rounded-xl px-3 py-2 w-full bg-transparent border border-gray-200 hover:bg-gray-200 hover:shadow-soft transition-all duration-500 ease-linear focus:bg-primary focus:text-white focus:border-none cursor-pointer'
    >
        <LuLogOut />
    </button>
  )
}

export default Logout;