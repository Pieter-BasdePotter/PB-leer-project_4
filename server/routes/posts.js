const express = require('express');
const router = express.Router();
const models = require("../models");

console.log("Available models:", Object.keys(models));

router.get('/', async (req, res) => {
    const listOfPosts = await models.Post.findAll();
    res.json(listOfPosts);      
});

router.get('/byId/:id', async (req, res) => {
    const id = req.params.id
    const post = await models.Post.findByPk(id);
    res.json(post);
});

router.post("/", async (req, res) => {
    const postData = req.body;
    await models.Post.create(postData);
    res.json(postData);
});

module.exports = router;