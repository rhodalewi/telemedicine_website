const db = require('../config/database');
const bcrypt = require('bcryptjs');

//ADD HOSPITAL 
exports.addHospital = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    try {
        await db.execute('INSERT INTO hospitals (name, address, latitude, longitude) VALUES (?, ?, ?, ?)', [name, address, latitude, longitude]);
        return res.status(200).json({ message: 'Hospital added successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding hospital', error: error.message });
    }
};

/* import { useForm } from 'react-hook-form';
import api from '../../services/api';

const AdminAddHospital = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    await api.post('/admin/hospital', {
      ...data,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude)
    });

    reset();
    alert('Hospital added successfully');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('name')} placeholder="Hospital Name" />
      <input {...register('address')} placeholder="Address" />
      <input {...register('latitude')} placeholder="Latitude" />
      <input {...register('longitude')} placeholder="Longitude" />

      <button type="submit">Add Hospital</button>
    </form>
  );
};

export default AdminAddHospital; */

