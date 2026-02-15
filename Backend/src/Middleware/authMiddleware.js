//PATIENT MIDDLEWARE
exports.patientSessionAuth = (req, res, next) => {
    if (!req.session.patientId) {
        return res.status(401).json({ message: 'Session expired, please login again!' });
    }
    next();
};

exports.isPatient = (req, res, next) => {
  if (req.session.role !== "patient") {
    return res.status(400).json({
      message: "Access denied"
    });
  }
  next();
};

//DOCTOR MIDDLEWARE
exports.doctorSessionAuth = (req, res, next) => {
  if (!req.session.doctorId) {
    return res.status(401).jsonO({ message: 'Session expired, please login again!' });
  };
  next();
};

exports.isDoctor = (req, res, next) => {
  if (req.session.role !== 'doctor') {
    return res.status(400).json({ message: 'Access denied' });
  };
  next();
}

//ADMIN MIDDLEWARE
exports.adminSessionAuth = (req, res, next) => {
  if (!req.session.adminId) {
    return res.status(401).json({ message: 'Session expired, please login again!' });
  }
}
exports.isAdmin =(req, res, next) => {
  if (req.session.role !== 'admin') {
    return res.status(400).json({ message: 'Access denied' });
  };
  next();
}