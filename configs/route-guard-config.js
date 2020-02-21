module.exports = (req, res, next) => {
  // passport adds this to the request object
  if ( req.isAuthenticated() ) {
    return next();
  }
  res.redirect('/login');
}