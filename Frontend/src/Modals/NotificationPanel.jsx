import { useEffect, useContext } from 'react';
/* import { useState } from 'react'; */
import { LuDelete, LuTrash, LuTrash2, LuX } from 'react-icons/lu';
import api from '../Services/api';
import { AuthPatientContext } from '../Context/createContext';


const NotificationPanel = ({ onClose }) => {
    const { showError, showSuccess, fetchPatientData, notifications, setNotifications } = useContext(AuthPatientContext);
    
// FETCH ALL NOTIFICATIONS
    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notification/patientNotifications');
            setNotifications(response.data)
        } catch (error) {
            console.log(error.response?.data?.message)
        }
    };

// MARK NOTIFICATION AS READ
    const handleMarkAsRead = async (notificationId) => {
        try {
            const response = await api.put(`/notification/markAsRead/${notificationId}/read`);
            showSuccess(response.data.message);
            fetchPatientData();
        } catch (error) {
            showError(error.response?.data?.message)
        }
    };
    
//MARK ALL NOTIFICATION AS READ
    const handleMarkAllRead = async () => {
        try {
            const response = await api.put('/notification/markAllRead');
            showSuccess(response.data.message);
            fetchPatientData()
        } catch (error) {
            showError(error.response?.data?.message);
        };
    };

//DELETE NOTIFICATION
    const handleDelete = async (notificationId) => {
        try {
            const response = await api.delete(`/notification/deleteNotification/${notificationId}`)
            showSuccess(response.data.message);
            fetchNotifications();
            fetchPatientData();
        } catch (error) {
            showError(error.response?.data?.message);
        }
    };
    
    useEffect(() => { 
        fetchNotifications();
    }, []);

  return (
    <div className='fixed top-0 left-0 w-full h-full z-20 md:h-screen flex justify-center items-center bg-text-primary/70 px-6'>
       <div className='max-w-2xl w-full flex flex-col gap-2'>
            <span 
                onClick={() => onClose(false)}
                className='p-2 bg-text-primary rounded-lg hover:bg-accent hover:text-white transition-colors duration-700 ease-in-out self-end'
            >
                <LuX  className='text-h2 text-white ' />
            </span>
            <div className='bg-white p-6 rounded-2xl space-y-6 shadow-soft'>
                <div className='flex items-center justify-between border-b border-gray-300 pb-3'>
                    <h2 className='md:text-lg font-heading font-semibold'>Notifications</h2>
                    <button 
                        onClick={handleMarkAllRead}
                        className='hover:text-error underline text-small md:text-body transition-colors duration-700 ease-in-out '
                    > 
                        {notifications.length > 0 ? 'Mark all read' : ''}
                    </button>
                </div>
                
                <div className='pt-4 overflow-y-auto max-h-120'>
                    {notifications.length === 0 ? (
                        <p className='text-center text-small'>No notifications yet</p>
                      ) : (
                        <div className='space-y-4'>
                            {notifications.map(notification => (
                                <div
                                    key={notification.notification_id}
                                    className={`flex items-center justify-between gap-3 text-wrap p-4  rounded-xl cursor-pointer shadow-soft ${notification.is_read ? 'bg-white border border-gray-300' : 'bg-text-secondary/10'}`}
                                >
                                    <div
                                         onClick={() => handleMarkAsRead(notification.notification_id)}
                                        className='space-y-1.5'
                                    >
                                        <h1 className='font-semibold font-heading text-small'>{notification.title}</h1>
                                        <p className='text-text-secondary text-caption md:text-small'> {notification.message} at {new Date(notification.createdAT).toLocaleString()}  </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(notification.notification_id)}
                                        className='p-1.5 bg-error/15 text-error rounded-xl hover:opacity-80 transition-all duration-500 ease-in-out cursor-pointer'
                                    >
                                        <LuTrash2 />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
       </div>
    </div>
  )
}

export default NotificationPanel;