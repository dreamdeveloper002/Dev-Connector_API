const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');



//@route GET api/profile/me
//@desc  Get current user's profile 
//@access Private(token required)
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
            'name', 'avatar'
        ]);

        if(!profile) {
           return res.status(400).send({ message: "No profile setup by this user"});
        }


        res.json(profile);
    } catch (err) {

        console.error(err.message); 
        return res.status(500).send({ message: "Server error"});
        
    }
})



//@route POST api/profile
//@desc  Create or update user's profile 
//@access Private(token required)


router.post('/', [auth, [
    check('status', 'Status is required')
    .not()
    .isEmpty(),
    check('skills', 'Skills is required')
    .not()
    .isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const {

      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      availabilityStatus,
      availabilityMsg,
      showAvailabilityMsg,
      linkedin

    } = req.body;


    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(showAvailabilityMsg) profileFields.showAvailabilityMsg = showAvailabilityMsg;
    if(availabilityMsg) profileFields.availabilityMsg = availabilityMsg;
    if(availabilityStatus) profileFields.availabilityStatus = availabilityStatus;
    if(githubusername) profileFields.githubusername = githubusername;


    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    
    profileFields.socials = {};

    if(youtube) profileFields.socials.youtube = youtube;
    if(linkedin) profileFields.socials.linkedin = linkedin;
    if(facebook) profileFields.socials.facebook = facebook;
    if(twitter) profileFields.socials.twitter = twitter;
    if(instagram) profileFields.socials.instagram = instagram;


    try {
        
        let profile = await Profile.findOne({ user: req.user.id });

        if(profile) {
            
          profile = await Profile.findOneAndUpdate({ user: req.user.id}, { $set: profileFields }, { new : true});

          res.json(profile);
          
         }
 
        profile = new Profile(profileFields);

        await profile.save();
        
    } catch (error) {

        console.error(err.message); 
        return res.status(500).send({ message: "Server error"});
        
    }

   
})

module.exports = router










