const mongoose = require('mongoose');
const config = require('./config')

mongoose
  .connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log(`Successfully connected to the database ${config.mongoUri}`))
  .catch(error => {
    console.error(`An error ocurred trying to connect to the database ${config.mongoUri}: `, error);
    process.exit(1);
  });