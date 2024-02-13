const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'hithereiam6969@boys'

//create a user using post /api/auth/createuser/
router.post(
  '/createuser/',
  [
    body('name', 'enter valid name').isLength({ min: 3 }),
    body('email', 'enter valid email').isEmail(),
    body('password', 'enter valid password').isLength({ min: 5 })
  ],
  async (req, res) => {
    //if errors return bad request of the errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    //check if there is any existing entry in the database
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      return res
        .status(400)
        .json({
          error: 'sorry ' + user.name + ' with this email exists already'
        })
    }

    //generated and added salt and then hash
    const salt = await bcrypt.genSalt(10)
    secPass = await bcrypt.hash(req.body.password, salt)

    //create user
    try {
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
      })

      const data = {
        user: {
          id: user.id
        }
      }

      let authToken = jwt.sign(data, JWT_SECRET)

      res.json({ authToken })
    } catch (error) {
      res.json(error)
    }
  }
)

//Authenticate a user no login requires /api/auth/login
router.post(
  '/login/',
  [
    body('email', 'enter valid email').isEmail(),
    body('password', 'password can not be blank').exists()
  ],
  async (req, res) => {
    //if errors return bad request of the errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      //check if there is any existing entry in the database
      let user = await User.findOne({ email: req.body.email })

      if (!user) {
        return res
          .status(400)
          .json({ error: 'please try to login with correct credentials' })
      }

      const passwordCompare = await bcrypt.compare(password, user.password)

      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: 'please try to login with correct credentials' })
      }

      const data = {
        user: {
          id: user.id
        }
      }

      const authToken = jwt.sign(data, JWT_SECRET)
      res.json({ authToken })
    } catch (error) {
      res.status(500).json({ error:'Internal server error' })
    }
})

//fetch user data with token /api/auth/fetchuser

router.get('/getuser',fetchuser,async (req,res)=>{       
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json({user});
    } catch(error){
        res.status(500).send({error:"internal server error"});
    }
})

module.exports = router
