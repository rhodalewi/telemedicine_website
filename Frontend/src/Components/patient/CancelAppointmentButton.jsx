import { useContext } from 'react';
import { AuthPatientContext } from '../../Context/createContext';
import { LuX } from 'react-icons/lu';
import api from '../../Services/api';

const CancelAppointment = ({ appointment }) => {
  const { showError, showSuccess, fetchAllAppointments, fetchPatientData } = useContext(AuthPatientContext);

  const handleCancel = async (appointmentId) => {
    const confirmCancel = window.confirm(`Are you sure you want to cancel this appointment?`)
    if (!confirmCancel) return;

    try {
      const response = await api.patch(`/appointment/cancelAppointment/${appointmentId}`);
      showSuccess(response.data.message);
      fetchAllAppointments();
      fetchPatientData();
    } catch (error) {
      showError(error.response?.data?.message);
    }
  };

  return (
    <button 
      type="button"
      onClick={() => handleCancel(appointment?.appointment_id)}
      className='border border-error text-error text-caption md:text-small px-3 py-1 md:px-4 md:py-1.75 rounded-xl hover:bg-error/10 flex justify-center items-center gap-2 transition-colors duration-500 ease-in-out'
    >
      <LuX className='text-small md:text-body' />
      Cancel
    </button>
  )
}

export default CancelAppointment;