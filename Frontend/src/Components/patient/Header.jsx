import { useContext } from 'react';
import { AuthPatientContext } from '../../Context/createContext';
import {LuPanelLeft, LuSearch, LuBell} from 'react-icons/lu';
import { useState } from 'react';
import NotificationPanel from '../../Modals/NotificationPanel';

const Header = () => {
  const { collapse, setCollapse, dashboardOverview } = useContext(AuthPatientContext);
  const [openNotification, setOpenNotification] = useState(false);


  return (
    <div className='sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 py-3.25 w-full shadow-2xs'>
        <span 
            onClick={() => setCollapse(!collapse)}
            className='w-7 h-7 rounded-md flex items-center justify-center hover:bg-primary hover:text-white' 
        >
            <LuPanelLeft />
        </span>
        
          {/* search input */}
        <div className='flex items-center gap-2 px-3  rounded-full border border-gray-400 w-52 md:w-68 lg:w-96'>
            <LuSearch className='text-text-secondary cursor-pointer' />
            <input type="text" placeholder='Search...' className='placeholder:text-caption text-small outline-0 py-1.25' />
        </div>
        
          {/* notification */}
      <div
        onClick={() => setOpenNotification(!openNotification)}
        className='relative p-2 cursor-pointer'
      >
         <LuBell className='text-h3' />
        {dashboardOverview.notifyCount > 0 && (
          <span className='w-4 h-4 rounded-full absolute top-1 left-6 bg-error text-white flex items-center justify-center text-caption'> { dashboardOverview.notifyCount }</span>
        )}
      </div>
      {openNotification && <NotificationPanel onClose={setOpenNotification} />}
    </div>
  )
}

export default Header;