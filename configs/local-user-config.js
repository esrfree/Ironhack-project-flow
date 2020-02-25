/* Your User object is now available through "request.user" in an express app
 route callback after the user has been authenticated by passport.
*/

module.exports = (req, res, next) => {
  res.locals.user = req.user;
  next();
};