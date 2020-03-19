const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri: process.env.MONGODB_URI || 'mongodb://heroku_48mjcgj8:9gfd8700vpn5t0n0sboc1gi37n@ds151018.mlab.com:51018/heroku_48mjcgj8'
  
}

module.exports = config;