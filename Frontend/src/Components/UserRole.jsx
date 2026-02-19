import { useContext } from 'react'
import { AuthPatientContext } from '../Context/createContext';

const UserRole = ({formType}) => {
    const { userRole, selectedRole, setSelectedRole } = useContext(AuthPatientContext);

    const registerRole = userRole.filter(role => role.role !== 'admin');

  return (
    <div className='flex items-center justify-center gap-3 '>
        {formType === 'register' ? registerRole.map(role => (
        
                <button
                    type="button"
                    key={role.id}
                    role={role.role}
                    onClick={() => setSelectedRole(role.role)}
                    className={`font-heading capitalize border px-3.5 rounded-lg py-1.75 text-caption text-medium border-none  cursor-pointer hover:bg-primary-hover hover:text-white ${selectedRole === role.role ? 'bg-primary text-white' : 'bg-text-secondary/20 '}`}
                >
                    {role.role}
                </button>
                
     
        )) : userRole.map(role => (
        
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
  )
}

export default UserRole;