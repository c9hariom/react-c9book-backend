const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const {body, validationResult} = require('express-validator');
const fetchuser = require('../middleware/fetchuser');


//fetch all the notes login required
router.get('/fetchallnotes',fetchuser, (req, res) => {
  const user_id = req.user.id;
  res.json({ok:'ok'})
})

//add the notes login required
router.post('/addnote',fetchuser, [
  body('title','eneter a vlid title').isLength({min:3}),
  body('description','enter a vlid description').isLength({min:5})
],async (req, res) => {
  try {
    const userId =  req.user.id;
    const {title,description,tag} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }
    const note = new Notes({
      user:userId,title:title,description:description,tag:tag?tag:"general"
    });
    console.log(note)
    const saveNote =  await note.save();
    res.json(saveNote);

  } catch (error) {
    console.log(error)
    res.status(500).json({error:'internal server error'})
  }
})

module.exports = router