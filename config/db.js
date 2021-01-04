const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');


const connectDB = async () => {
  
  try {

  const conn = await mongoose.connect(db,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useCreateIndex: true,

  });

  console.log(`MongoDB connected: ${conn.connection.host}`)

  } catch (err) {

  console.log(err.message);

  // Exit process with failure
  process.exit(1);
  }

}


module.exports = connectDB;




