import { useState } from "react";
import { LuSquarePen } from "react-icons/lu";
import RescheduleAppointmentForm from "../../Modals/RescheduleAppointmentForm";

const RescheduleAppointment = ({appointment}) => {
  const [openRescheduleForm, setOpenRescheduleForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpenRescheduleForm(true)}
        className="border border-warning text-warning text-caption md:text-small px-3 md:px-4 py-1 md:py-1.75 rounded-xl hover:bg-warning/10 flex items-center justify-center gap-2 transition-colors ease-in-out duration-500"
      >
          <LuSquarePen className="text-small md:text-body" />
          Reschedule
      </button>

      {openRescheduleForm && <RescheduleAppointmentForm closeRescheduleForm={setOpenRescheduleForm} appointment={appointment} />}
    </>
  )
}

export default RescheduleAppointment;