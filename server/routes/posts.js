const express = require('express');
const router = express.Router();
const models = require("../models");

console.log("Available models:", Object.keys(models));

router.get('/', async (req, res) => {
    const listOfPosts = await models.Post.findAll();
    res.json(listOfPosts);      
});

router.post("/", async (req, res) => {
    const postData = req.body;
    await models.Post.create(postData);
    res.json(postData);
});

module.exports = router;