const express = require('express');
const router = express.Router();
const axios = require("axios");


router.get('/api/home', (req, res) => {
  res.json({ message: 'This is a sample API route.' });
  console.log("This is a sample API route.");
});



module.exports = router;