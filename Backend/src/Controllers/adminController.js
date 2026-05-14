const db = require('../config/database');
const bcrypt = require('bcryptjs');

//ADD HOSPITAL 
exports.addHospital = async (req, res) => {
  /* const adminId = req.session.user.id; */
  const { name, address, latitude, longitude } = req.body;

  try {
      await db.execute('INSERT INTO hospitals (name, address, latitude, longitude) VALUES (?, ?, ?, ?)', [name, address, latitude, longitude]);
      return res.status(200).json({ message: 'Hospital added successfully' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error adding hospital', error: error.message });
  }
};

