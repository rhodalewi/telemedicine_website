exports.isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send("Session expired, please login again!")
  }
  next()
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).send('Access denied')
    }
    next()
  }
};
