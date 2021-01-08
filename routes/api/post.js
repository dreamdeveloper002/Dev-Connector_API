const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const { restart } = require('nodemon');



//@route POST api/posts
//@desc  Create a post
//@access Private(token required)
router.post('/', [ auth,[ 
    check('text', 'Text is required')
    .not()
    .isEmpty(),
]], async (req, res) => {

    console.log(req.body)
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };
    

    try {

     const user = await User.findById(req.user.id)

     const newPost = new Post({
         text: req.body.text,
         name: user.name,
         avatar: user.avatar,
         user: req.user.id
     })

     const post = await newPost.save();

     res.json(post);
        
    } catch (err) {
        console.error(err.message); 
        return res.status(500).send({ message: "Server error"});  
        
    }
});




//@route GET api/posts
//@desc  Get all posts
//@access Private(token required)

router.get('/', auth, async (req, res) => {
    try {
        
        const post = await Post.find().sort({ date: -1 })
        restart.json(post);

    } catch (err) {

        console.error(err.message); 
        return res.status(500).send({ message: "Server error"}); 
        
    }
});
 

module.exports = router