const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');



//@route POST api/users
//@desc Register user
//@access Public(no token required)

router.post('/', [
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'Email is required')
    .isEmail(),
    check('phone', 'phone number is required')
    .isMobilePhone(),
    check('password', 
    'password must contain 8 characters, with at least one digit, one lower case and one upper case').isLength({ min: 6})
    
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //See if user exists in the database
    const { name, email, phone, password } = req.body

    try {

        let user = await User.findOne({ email });

        if(user) {
           return res.status(400).json({ errors: [{ msg: "User already exists"}] });
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

      user = new User({
          name,
          email,
          phone,
          avatar,
          password
      });
      
      const salt = await bcrypt.genSalt(10);


      user.password = await bcrypt.hash(password, salt)

    
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
                 res.json({ message : "User successfully created", token, user})
             });

    

    } catch (err) {

       console.error(err.message)
       res.status(500).json({ Message : "Server error" })

    }

  
})



module.exports = router