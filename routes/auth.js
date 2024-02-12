const express = require('express');
const router = express.Router();
const User = require('../models/User')
const {body, validationResult} = require('express-validator')

router.post('/createuser/',[
    body('name','enter valid name').isLength({min:3}),
    body('email','enter valid email').isEmail(),
    body('password','enter valid password').isLength({min:5})
],async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({error:'sorry '+user.name+' with this email exists already'});
    }

    user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    }).then((response)=>{
        console.log("success\n "+response);
    }).catch((error)=>{
        console.log("error creating user "+error);
    });
    res.json(req.body)
})

module.exports = router