const express = require('express');
const router = express.Router();



//@route GET api/users
//@desc Test route
//@access Public(no token required)
router.get('/', (req, res) => {
    res.send('User route');
})



module.exports = router