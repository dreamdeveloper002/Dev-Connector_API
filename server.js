const express = require('express');
const connectDB = require('./config/db');
const setHeaders = require('./middleware/headers-middleware');
const morgan = require('morgan');

const AuthRoute = require('./routes/api/auth');
const UsersRoute = require('./routes/api/users');
const ProfileRoute = require('./routes/api/profile');
const PostRoute = require('./routes/api/post');

const app = express();


// Parse Content-Type
const { urlencoded, json } = express;
app.use([urlencoded({ extended: false }), json()]);

app.use(setHeaders);

app.use([
  morgan('combined'),
  morgan('combined', { stream: accessLogStream }),
]);

// Connect Database
connectDB();

// Expose API endpoints
const version = process.env.VERSION || 'v1.0.0';

app.use(`api/${version}/users`, UsersRoute);
app.use(`api/${version}/profile`, ProfileRoute);
app.use(`api/${version}/posts`, PostRoute);
app.use(`api/${version}/auth`, AuthRoute);


const PORT = process.env.PORT || 5000



const server = app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});



//handle unhandled promise rejections
process.on('unhandledRejection', (err, Promise) => {
    console.log(`Error: ${err.message}`);

    //close server & exit process
    server.close(() => process.exit(1));
})