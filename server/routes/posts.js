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
    console.log(`[POSTS] GET /byId/${id} - fetching post`);
    const post = await models.Post.findByPk(id);
    res.json(post);
});

router.post("/", async (req, res) => {
    const postData = req.body;
    await models.Post.create(postData);
    res.json(postData);
});

router.put('/:id/like', async (req, res) => {
    const id = req.params.id;
    try {
        const post = await models.Post.findByPk(id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        await post.increment('likes');
        await post.reload();
        res.json({ likes: post.likes });
    } catch (err) {
        console.error('[POSTS] PUT /:id/like error:', err);
        res.status(500).json({ error: 'Failed to like post' });
    }
});

module.exports = router;