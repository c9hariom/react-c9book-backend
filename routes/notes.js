const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const {body, validationResult} = require('express-validator');
const fetchuser = require('../middleware/fetchuser');


//fetch all the notes login required
router.get('/fetchallnotes',fetchuser, async (req, res) => {
  try {
    const user_id = req.user.id;
    const notes = await Notes.find({user:user_id});
    res.json(notes)
  } catch (error) {
    return res.status(500).json({error})
  }
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
    //console.log(note)
    const saveNote =  await note.save();
    res.json(saveNote);

  } catch (error) {
    //console.log(error)
    res.status(500).json({error:'internal server error'})
  }
})

//update notes - 
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
  try {
    body('title','title should be atleast 3 character long').isLength({min:3}),
  body('description','description should be atleast 5 characters long').isLength({min:5})
  const {title,description,tag} = req.body;
  const newNote = {};
  if(title){newNote.title = title}
  if(description){newNote.description=description}
  if(tag){newNote.tag=tag}

  //find the note to be updated

  let note = await Notes.findById(req.params.id);
  if(!note){
    return res.status(404).send({error:"not found"})
  }
  
  if(note.user.toString()!==req.user.id){
    return res.status(401).send({error:"not allowed"});
  }
  note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
  res.status(200).json({note})
  } catch (error) {
    return res.status(500).json({error})
  }

});


router.delete('/deletenote/:id',fetchuser, async(req,res)=>{
  try {
    let note = await Notes.findById(req.params.id);

  if(!note){
    return res.status(404).json({error:"not found"});
  }

  if(note.user.toString()!== req.user.id){
    return res.status(401).json({error:"not allowed"})
  }

  note = await Notes.findByIdAndDelete(req.params.id);
  res.status(200).json({note})
  
  } catch (error) {
    return res.status(500).json({error})    
  }
  
})


module.exports = router