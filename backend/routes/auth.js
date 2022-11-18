const express = require('express');
const User = require('../models/User');
const router = express.Router(); 
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser')
const JWT_SECRET='Ashuisagood$boy';
// Route 2 Create a User using: POST "/api/auth/createuser". Doesn't require Auth
router.post('/createuser',[
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res)=>{ 
    let success=false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
try {
        
   
    let user=await User.findOne({email : req.body.email});
    if(user){
        return res.status(400).json({success,error:"sorry a user with this eamil exists"})
    }

    //hashing password
    const salt=await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt);
    //create new user
    user=await User.create({
        name: req.body.name,
        email:req.body.email,
        password: secPass,
      })
    const data={
        user:{
            id:user.id
        }
    }
    const authToken=jwt.sign(data,JWT_SECRET);

    // res.json(user)
    success=true
    res.json({success,authToken});
} catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
}
} )

// Route 2 Aythenticate a User using: POST "/api/auth/login".
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
], async (req, res)=>{ 
    let success=false
    //If there exist error return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body;
    try {
        let user=await User.findOne({email});
        if(!user){
            success=false
            return res.status(400).json({error:"Please login with correct credentials"});
        }
        const passwordComapare=await bcrypt.compare(password,user.password);
        if(!passwordComapare){
            success=false
            return res.status(400).json({success,error:"Please login with correct credentials"});
        }

        const data={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(data,JWT_SECRET);
        success=true
        res.json({success,authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// Route 3 Get logged in user detail: POST "/api/auth/getuser". login required
router.post('/getuser',fetchuser, async (req, res)=>{ 
try {
    userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    res.send(user);
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
}
})
module.exports = router