module.exports = (req, res, next) => {
  // passport adds this to the request object
  if ( req.isAuthenticated() ) {
    console.log('authenticated')
    return next();
  } else {
    res.redirect('/signup');
  }
}