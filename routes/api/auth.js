const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');


const User = require('../../models/User');


//@route GET api/auth
//@desc Test route
//@access Private(token required)
router.get('/', auth, async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
        
    } catch (err) {
        
        console.error(err.message);
        res.status(500).json({ message: 'server error'})
    }
    
});




//@route POST api/auth
//@desc Authenticate user & get token
//@access Public(no token required)

router.post('/',
[
    check('email', 'Email is required')
    .isEmail(),
    check('password', 
    'password is required').exists()  
], 
async (req, res) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //See if user exists in the database
    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email }).select('+password');


        if(!user) {
           return res.status(400).json({ errors: [{ msg: "Invalid Credentials"}] });
        }

     const isMatch = await bcrypt.compare(password, user.password);

     if(!isMatch) {
        return res.status(400).json({ errors: [{ msg: "Invalid Credentials"}] });
     }

    
    const payload = {
        user : {
            id: user.id
        }
    }

    jwt.sign(payload, config.get('jwtSecret'),
             { expiresIn: 360000 }, async (err, token) =>{
                 if(err) throw err;
                 user.tokens = user.tokens.concat({ token })
                 await user.save()
                 res.json({ message : "User successfully login", token, user })
             });

    

    } catch (err) {

       console.log(err)
       res.status(500).json({ Message : "Server error" });

    }

});


module.exports = router