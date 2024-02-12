const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const {body, validationResult} = require('express-validator')


router.get('/', (req, res) => {
  res.json({
    result:1,
    endpoint:'/notes'
  })
})

module.exports = router